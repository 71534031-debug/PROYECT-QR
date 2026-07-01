const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middlewares/authenticate');
const { requireRoles } = require('../middlewares/requireRoles');
const { getEnv } = require('../config/env');
const { writeCertificatePdf } = require('../services/certificatePdf');

function formatSpanishDate(dateStr) {
  if (!dateStr) return '';
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return `Huancayo, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function createCertificadosRouter() {
  const router = express.Router();

  router.post('/generar', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const pool = req.app.locals.pool;
    const actividad_id = Number(req.body?.actividad_id);
    const plantilla_id = Number(req.body?.plantilla_id);
    if (!actividad_id || !plantilla_id) return res.status(400).json({ success: false, message: 'Datos inválidos' });

    const [[cfg]] = await pool.query('SELECT id FROM configuracion_institucional WHERE id = 1 LIMIT 1');
    if (!cfg) return res.status(422).json({ success: false, message: 'Configuración institucional requerida' });

    const [plRows] = await pool.query('SELECT id, contenido, imagen_fondo, activa FROM plantillas WHERE id = ? LIMIT 1', [plantilla_id]);
    const plantilla = plRows[0];
    if (!plantilla || !plantilla.activa) return res.status(404).json({ success: false, message: 'Plantilla no encontrada' });

    let campos = [];
    if (plantilla.imagen_fondo) {
      const [camposRows] = await pool.query('SELECT placeholder, x, y, font_size, alignment, color, width, height FROM plantilla_campos WHERE plantilla_id = ? ORDER BY orden ASC', [plantilla_id]);
      campos = camposRows;
      if (campos.length === 0) return res.status(422).json({ success: false, message: 'La plantilla no tiene campos configurados' });
    }

    const [aptos] = await pool.query(
      `SELECT ap.participante_id, p.nombres, p.apellidos, p.tipo_documento, p.numero_documento, p.email, a.nombre AS actividad_nombre
       FROM actividad_participante ap
       JOIN participantes p ON p.id = ap.participante_id
       JOIN actividades a ON a.id = ap.actividad_id
       LEFT JOIN certificados c ON c.participante_id = p.id AND c.actividad_id = ap.actividad_id AND c.estado = 'EMITIDO'
       WHERE ap.actividad_id = ? AND ap.estado_validacion = 'APTO' AND c.id IS NULL`,
      [actividad_id]
    );
    if (!aptos.length) return res.status(422).json({ success: false, message: 'Participantes no válidos' });

    const [[fullCfg]] = await pool.query('SELECT * FROM configuracion_institucional WHERE id = 1 LIMIT 1');
    const env = getEnv();
    let generados = 0;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const row of aptos) {
        const codigo = uuidv4();
        const fecha = new Date().toISOString().slice(0, 10);
        const nombreCompleto = `${row.nombres} ${row.apellidos}`.trim();
        const documento = `${row.tipo_documento} ${row.numero_documento}`;
        const qrUrl = `${env.FRONTEND_PUBLIC_URL}/validar?c=${codigo}`;
        const rutaRel = path.join('uploads', 'certificados', `${codigo}.pdf`);
        const rutaAbs = path.join(process.cwd(), rutaRel);
        const replacements = {
          '{{NOMBRE_COMPLETO}}': nombreCompleto,
          '{{DOCUMENTO}}': documento,
          '{{ACTIVIDAD_NOMBRE}}': row.actividad_nombre,
          '{{FECHA_EMISION}}': formatSpanishDate(fecha),
          '{{FECHA_EMISION_FORMATEADA}}': formatSpanishDate(fecha),
          '{{CODIGO_UNICO}}': codigo,
          '{{QR}}': '',
          '{{LOGO_INSTITUCION}}': fullCfg.logo_url || '',
          '{{NOMBRE_AUTORIDAD}}': fullCfg.nombre_autoridad,
          '{{CARGO_AUTORIDAD}}': fullCfg.cargo_autoridad,
          '{{FIRMA_AUTORIDAD}}': fullCfg.firma_url || ''
        };
        const pdfOpts = {
          outputPath: rutaAbs,
          replacements,
          qrUrl,
          templateHtml: plantilla.contenido,
          backgroundImagePath: plantilla.imagen_fondo ? (plantilla.imagen_fondo.startsWith('http') ? plantilla.imagen_fondo : path.join(process.cwd(), plantilla.imagen_fondo)) : null,
          campos: campos.length > 0 ? campos : null,
        };
        await writeCertificatePdf(pdfOpts);
        await conn.query(
          `INSERT INTO certificados (codigo_unico, actividad_id, participante_id, plantilla_id, estado, ruta_pdf, fecha_emision, emitido_por_usuario_id)
           VALUES (?, ?, ?, ?, 'EMITIDO', ?, NOW(), ?)`,
          [codigo, actividad_id, row.participante_id, plantilla_id, rutaRel, req.user.id]
        );
        generados += 1;
      }
      await conn.commit();
    } catch {
      await conn.rollback();
      return res.status(500).json({ success: false, message: 'Error en generación' });
    } finally {
      conn.release();
    }
    const detalleGen = JSON.stringify({ generados });
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
       VALUES (?, 'CERTIFICADOS_GENERADOS', 'actividad', ?, ?, ?, ?)`,
      [req.user.id, actividad_id, detalleGen, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true, generados });
  });

  router.get('/', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const pool = req.app.locals.pool;
    const actividadId = req.query.actividad_id;
    const participanteId = req.query.participante_id;
    let sql = `SELECT c.*, 
               p.nombres AS participante_nombres,
               p.apellidos AS participante_apellidos,
               p.tipo_documento AS participante_tipo_documento,
               p.numero_documento AS participante_documento,
               a.nombre AS actividad_nombre
               FROM certificados c
               JOIN participantes p ON p.id = c.participante_id
               JOIN actividades a ON a.id = c.actividad_id
               WHERE 1=1`;
    const params = [];
    if (actividadId) {
      sql += ' AND c.actividad_id = ?';
      params.push(actividadId);
    }
    if (participanteId) {
      sql += ' AND c.participante_id = ?';
      params.push(participanteId);
    }
    sql += ' ORDER BY c.id DESC';
    const [rows] = await pool.query(sql, params);
    return res.json({ success: true, data: rows });
  });

  router.get('/:id/ver', async (req, res) => {
    const token = req.query.token || (req.headers.authorization || '').slice(7);
    if (!token) return res.status(401).send();
    try {
      const env = getEnv();
      const payload = jwt.verify(token, env.JWT_SECRET);
      if (payload.typ !== 'access') return res.status(401).send();
    } catch {
      return res.status(401).send();
    }
    const pool = req.app.locals.pool;
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT ruta_pdf FROM certificados WHERE id = ? LIMIT 1', [id]);
    const c = rows[0];
    if (!c) return res.status(404).send();
    const abs = path.join(process.cwd(), c.ruta_pdf);
    if (!fs.existsSync(abs)) return res.status(404).send('PDF no encontrado');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="certificado.pdf"');
    return res.sendFile(abs);
  });

  router.post('/:id/enlace-descarga', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const id = Number(req.params.id);
    const env = getEnv();
    const token = jwt.sign({ typ: 'cert_download', certificado_id: id }, env.JWT_DOWNLOAD_SECRET, {
      expiresIn: '48h'
    });
    const base = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`;
    return res.json({ success: true, token, url: `${base}/api/entrega/descargar?t=${encodeURIComponent(token)}` });
  });

  router.get('/:id', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const pool = req.app.locals.pool;
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      `SELECT c.id, c.codigo_unico, c.ruta_pdf, c.estado,
              p.nombres AS participante_nombres, p.apellidos AS participante_apellidos,
              p.numero_documento AS participante_documento, a.nombre AS actividad_nombre
       FROM certificados c
       JOIN participantes p ON p.id = c.participante_id
       JOIN actividades a ON a.id = c.actividad_id
       WHERE c.id = ? LIMIT 1`,
      [id]
    );
    const c = rows[0];
    if (!c) return res.status(404).json({ success: false });
    return res.json({ success: true, data: { 
      id: c.id, 
      codigo_unico: c.codigo_unico, 
      url_pdf: c.ruta_pdf,
      participante_nombres: c.participante_nombres,
      participante_apellidos: c.participante_apellidos,
      participante_documento: c.participante_documento,
      actividad_nombre: c.actividad_nombre
    } });
  });

  router.get('/:id/descargar', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const pool = req.app.locals.pool;
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      `SELECT c.ruta_pdf, p.nombres, p.apellidos, a.nombre AS actividad_nombre
       FROM certificados c
       JOIN participantes p ON p.id = c.participante_id
       JOIN actividades a ON a.id = c.actividad_id
       WHERE c.id = ? LIMIT 1`,
      [id]
    );
    const c = rows[0];
    if (!c) return res.status(404).send();
    const abs = path.join(process.cwd(), c.ruta_pdf);
    if (!fs.existsSync(abs)) return res.status(404).send();
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'CERTIFICADO_DESCARGA', 'certificado', ?, ?, ?)`,
      [req.user.id, id, req.ip || '', req.get('user-agent') || '']
    );
    const asciiName = (s) => String(s || '').replace(/[^a-zA-Z0-9\s_-]/g, '').trim();
    const fn = `Certificado_${asciiName(c.nombres)}_${asciiName(c.apellidos)}_${asciiName(c.actividad_nombre)}.pdf`;
    const utf8fn = `Certificado_${(c.nombres || '').trim()}_${(c.apellidos || '').trim()}_${(c.actividad_nombre || '').trim()}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${fn}"; filename*=UTF-8''${encodeURIComponent(utf8fn)}`);
    return res.sendFile(abs);
  });

  router.post('/:id/revocar', authenticate, requireRoles('ADMIN'), async (req, res) => {
    const pool = req.app.locals.pool;
    const id = Number(req.params.id);
    await pool.query("UPDATE certificados SET estado = 'REVOCADO' WHERE id = ?", [id]);
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'CERTIFICADO_REVOCADO', 'certificado', ?, ?, ?)`,
      [req.user.id, id, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true });
  });

  return router;
}

module.exports = { createCertificadosRouter };
