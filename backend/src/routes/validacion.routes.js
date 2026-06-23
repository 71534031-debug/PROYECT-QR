const express = require('express');
const path = require('path');

async function validarPorCodigo(pool, codigo, req) {
  if (!codigo) return { status: 400, body: { valido: false, message: 'Código inválido' } };
  const [rows] = await pool.query(
    `SELECT c.id, c.estado, c.fecha_emision, c.ruta_pdf,
            p.nombres, p.apellidos, p.tipo_documento, p.numero_documento,
            a.nombre AS actividad, a.tipo AS actividad_tipo,
            ci.nombre_institucion, ci.logo_url, ci.cargo_autoridad, ci.nombre_autoridad
     FROM certificados c
     JOIN participantes p ON p.id = c.participante_id
     JOIN actividades a ON a.id = c.actividad_id
     LEFT JOIN configuracion_institucional ci ON ci.id = 1
     WHERE c.codigo_unico = ? LIMIT 1`,
    [codigo]
  );
  const row = rows[0];
  const detalle = JSON.stringify({ codigo });
  await pool.query(
    `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
     VALUES (NULL, 'VALIDACION_PUBLICA', 'certificado', ?, ?, ?, ?)`,
    [row ? row.id : null, detalle, req.ip || '', req.get('user-agent') || '']
  );
  if (!row) return { status: 404, body: { valido: false, message: 'No encontrado' } };
  const pdfUrl = row.ruta_pdf ? `/api/entrega/descargar?t=${require('jsonwebtoken').sign({ typ: 'cert_download', certificado_id: row.id }, process.env.JWT_DOWNLOAD_SECRET || process.env.JWT_SECRET || 'dev_secret', { expiresIn: '48h' })}` : null;
  if (row.estado !== 'EMITIDO') {
    return {
      status: 200,
      body: {
        valido: false,
        estado: row.estado,
        success: false,
        message: 'El certificado no está vigente',
        data: {
          codigo_unico: codigo,
          participante_nombres: row.nombres,
          participante_apellidos: row.apellidos,
          actividad_nombre: row.actividad,
          fecha_emision: row.fecha_emision,
          institucion: row.nombre_institucion,
          logo_url: row.logo_url,
          cargo_autoridad: row.cargo_autoridad,
          nombre_autoridad: row.nombre_autoridad
        }
      }
    };
  }
  return {
    status: 200,
    body: {
      valido: true,
      success: true,
      data: {
        codigo_unico: codigo,
        participante_nombres: row.nombres,
        participante_apellidos: row.apellidos,
        tipo_documento: row.tipo_documento,
        numero_documento: row.numero_documento,
        actividad_nombre: row.actividad,
        actividad_tipo: row.actividad_tipo,
        fecha_emision: row.fecha_emision,
        estado: row.estado,
        pdf_url: pdfUrl,
        institucion: row.nombre_institucion || 'Institución',
        logo_url: row.logo_url,
        cargo_autoridad: row.cargo_autoridad,
        nombre_autoridad: row.nombre_autoridad
      }
    }
  };
}

function createValidacionRouter() {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const codigo = String(req.query.codigo_unico || '').trim();
    const out = await validarPorCodigo(pool, codigo, req);
    return res.status(out.status).json(out.body);
  });

  router.get('/qr/:codigo', async (req, res) => {
    const pool = req.app.locals.pool;
    const out = await validarPorCodigo(pool, String(req.params.codigo || '').trim(), req);
    return res.status(out.status).json(out.body);
  });

  return router;
}

module.exports = { createValidacionRouter };
