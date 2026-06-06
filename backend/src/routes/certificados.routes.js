const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middlewares/authenticate');
const { requireRoles } = require('../middlewares/requireRoles');
const { getEnv } = require('../config/env');
const { writeCertificatePdf } = require('../services/certificatePdf');

function createCertificadosRouter() {
  const router = express.Router();

  router.post('/generar', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const pool = req.app.locals.pool;
    const actividad_id = Number(req.body?.actividad_id);
    const plantilla_id = Number(req.body?.plantilla_id);
    if (!actividad_id || !plantilla_id) return res.status(400).json({ success: false, message: 'Datos inválidos' });

    const [[cfg]] = await pool.query('SELECT id FROM configuracion_institucional WHERE id = 1 LIMIT 1');
    if (!cfg) return res.status(422).json({ success: false, message: 'Configuración institucional requerida' });

    const [plRows] = await pool.query('SELECT id, contenido, activa FROM plantillas WHERE id = ? LIMIT 1', [plantilla_id]);
    const plantilla = plRows[0];
    if (!plantilla || !plantilla.activa) return res.status(404).json({ success: false, message: 'Plantilla no encontrada' });

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
          '{{FECHA_EMISION}}': fecha,
          '{{CODIGO_UNICO}}': codigo,
          '{{QR}}': '',
          '{{LOGO_INSTITUCION}}': fullCfg.logo_url || '',
          '{{NOMBRE_AUTORIDAD}}': fullCfg.nombre_autoridad,
          '{{CARGO_AUTORIDAD}}': fullCfg.cargo_autoridad,
          '{{FIRMA_AUTORIDAD}}': fullCfg.firma_url || ''
        };
        await writeCertificatePdf({
          outputPath: rutaAbs,
          templateHtml: plantilla.contenido,
          replacements,
          qrUrl
        });
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
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
       VALUES (?, 'CERTIFICADOS_GENERADOS', 'actividad', ?, JSON_OBJECT('generados', ?), ?, ?)`,
      [req.user.id, actividad_id, generados, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true, generados });
  });

  router.get('/', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const pool = req.app.locals.pool;
    const actividadId = req.query.actividad_id;
    const participanteId = req.query.participante_id;
    let sql = 'SELECT * FROM certificados WHERE 1=1';
    const params = [];
    if (actividadId) {
      sql += ' AND actividad_id = ?';
      params.push(actividadId);
    }
    if (participanteId) {
      sql += ' AND participante_id = ?';
      params.push(participanteId);
    }
    sql += ' ORDER BY id DESC';
    const [rows] = await pool.query(sql, params);
    return res.json({ success: true, data: rows });
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
    const [rows] = await pool.query('SELECT id, codigo_unico, ruta_pdf, estado FROM certificados WHERE id = ? LIMIT 1', [id]);
    const c = rows[0];
    if (!c) return res.status(404).json({ success: false });
    return res.json({ success: true, data: { id: c.id, codigo_unico: c.codigo_unico, url_pdf: c.ruta_pdf } });
  });

  router.get('/:id/descargar', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const pool = req.app.locals.pool;
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT ruta_pdf FROM certificados WHERE id = ? LIMIT 1', [id]);
    const c = rows[0];
    if (!c) return res.status(404).send();
    const abs = path.join(process.cwd(), c.ruta_pdf);
    if (!fs.existsSync(abs)) return res.status(404).send();
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'CERTIFICADO_DESCARGA', 'certificado', ?, ?, ?)`,
      [req.user.id, id, req.ip || '', req.get('user-agent') || '']
    );
    return res.download(abs, `certificado-${id}.pdf`);
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
