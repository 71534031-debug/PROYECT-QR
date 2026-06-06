const express = require('express');

async function validarPorCodigo(pool, codigo, req) {
  if (!codigo) return { status: 400, body: { valido: false, message: 'Código inválido' } };
  const [rows] = await pool.query(
    `SELECT c.id, c.estado, c.fecha_emision, p.nombres, p.apellidos, a.nombre AS actividad
     FROM certificados c
     JOIN participantes p ON p.id = c.participante_id
     JOIN actividades a ON a.id = c.actividad_id
     WHERE c.codigo_unico = ? LIMIT 1`,
    [codigo]
  );
  const row = rows[0];
  await pool.query(
    `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
     VALUES (NULL, 'VALIDACION_PUBLICA', 'certificado', ?, JSON_OBJECT('codigo', ?), ?, ?)`,
    [row ? row.id : null, codigo, req.ip || '', req.get('user-agent') || '']
  );
  if (!row) return { status: 404, body: { valido: false, message: 'No encontrado' } };
  if (row.estado !== 'EMITIDO') {
    return {
      status: 200,
      body: {
        valido: false,
        estado: row.estado,
        data: { nombre: `${row.nombres} ${row.apellidos}`, actividad: row.actividad, fecha: row.fecha_emision }
      }
    };
  }
  return {
    status: 200,
    body: {
      valido: true,
      data: { nombre: `${row.nombres} ${row.apellidos}`, actividad: row.actividad, fecha: row.fecha_emision }
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
