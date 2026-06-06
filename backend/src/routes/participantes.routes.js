const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');
const { authenticate } = require('../middlewares/authenticate');
const { requireRoles } = require('../middlewares/requireRoles');
const { validateParticipantePayload } = require('../utils/participanteValidators');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ].includes(file.mimetype);
    cb(null, ok);
  }
});

function createParticipantesRouter() {
  const router = express.Router();
  router.use(authenticate);
  router.use(requireRoles('ADMIN', 'ADMINISTRATIVO'));

  router.post('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const v = validateParticipantePayload(req.body);
    if (!v.ok) return res.status(400).json({ success: false, message: v.message });
    const { nombres, apellidos, tipo_documento, numero_documento, email, actividad_id } = v.normalized;

    const [dupDoc] = await pool.query(
      `SELECT ap.id FROM actividad_participante ap
       JOIN participantes p ON p.id = ap.participante_id
       WHERE ap.actividad_id = ? AND p.tipo_documento = ? AND p.numero_documento = ? LIMIT 1`,
      [actividad_id, tipo_documento, numero_documento]
    );
    if (dupDoc.length) return res.status(409).json({ success: false, message: 'Participante duplicado' });

    const [dupEmail] = await pool.query(
      `SELECT ap.id FROM actividad_participante ap
       JOIN participantes p ON p.id = ap.participante_id
       WHERE ap.actividad_id = ? AND p.email = ? LIMIT 1`,
      [actividad_id, email]
    );
    if (dupEmail.length) return res.status(409).json({ success: false, message: 'Participante duplicado' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [insP] = await conn.query(
        `INSERT INTO participantes (nombres, apellidos, tipo_documento, numero_documento, email, telefono, codigo_cip, institucion, cargo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombres,
          apellidos,
          tipo_documento,
          numero_documento,
          email,
          req.body.telefono || null,
          req.body.codigo_cip || null,
          req.body.institucion || null,
          req.body.cargo || null
        ]
      );
      const pid = insP.insertId;
      await conn.query(
        `INSERT INTO actividad_participante (actividad_id, participante_id, estado_validacion)
         VALUES (?, ?, 'PENDIENTE_VALIDACION')`,
        [actividad_id, pid]
      );
      await conn.commit();
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
         VALUES (?, 'PARTICIPANTE_CREADO', 'participante', ?, ?, ?)`,
        [req.user.id, pid, req.ip || '', req.get('user-agent') || '']
      );
      return res.status(201).json({ success: true, data: { id: pid } });
    } catch {
      await conn.rollback();
      return res.status(500).json({ success: false, message: 'Error al guardar' });
    } finally {
      conn.release();
    }
  });

  router.post('/importar', upload.single('archivo'), async (req, res) => {
    const pool = req.app.locals.pool;
    const actividad_id = Number(req.body.actividad_id);
    if (!req.file || !actividad_id) return res.status(400).json({ success: false, message: 'Datos inválidos' });
    let procesados = 0;
    let errores = 0;
    const rows = [];
    await new Promise((resolve, reject) => {
      Readable.from(req.file.buffer)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    for (const row of rows) {
      const payload = {
        nombres: row.nombres || row.Nombres,
        apellidos: row.apellidos || row.Apellidos,
        tipo_documento: row.tipo_documento || row.TipoDocumento || 'DNI',
        numero_documento: row.numero_documento || row.Documento,
        email: row.email || row.Correo,
        actividad_id
      };
      const v = validateParticipantePayload(payload);
      if (!v.ok) {
        errores += 1;
        continue;
      }
      const { nombres, apellidos, tipo_documento, numero_documento, email } = v.normalized;
      const [dupDoc] = await pool.query(
        `SELECT ap.id FROM actividad_participante ap
         JOIN participantes p ON p.id = ap.participante_id
         WHERE ap.actividad_id = ? AND p.tipo_documento = ? AND p.numero_documento = ? LIMIT 1`,
        [actividad_id, tipo_documento, numero_documento]
      );
      if (dupDoc.length) {
        errores += 1;
        continue;
      }
      const [dupEmail] = await pool.query(
        `SELECT ap.id FROM actividad_participante ap
         JOIN participantes p ON p.id = ap.participante_id
         WHERE ap.actividad_id = ? AND p.email = ? LIMIT 1`,
        [actividad_id, email]
      );
      if (dupEmail.length) {
        errores += 1;
        continue;
      }
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const [insP] = await conn.query(
          `INSERT INTO participantes (nombres, apellidos, tipo_documento, numero_documento, email)
           VALUES (?, ?, ?, ?, ?)`,
          [nombres, apellidos, tipo_documento, numero_documento, email]
        );
        await conn.query(
          `INSERT INTO actividad_participante (actividad_id, participante_id, estado_validacion)
           VALUES (?, ?, 'PENDIENTE_VALIDACION')`,
          [actividad_id, insP.insertId]
        );
        await conn.commit();
        procesados += 1;
      } catch {
        await conn.rollback();
        errores += 1;
      } finally {
        conn.release();
      }
    }
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
       VALUES (?, 'IMPORT_PARTICIPANTES', 'actividad', ?, JSON_OBJECT('procesados', ?, 'errores', ?), ?, ?)`,
      [req.user.id, actividad_id, procesados, errores, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true, procesados, errores });
  });

  router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const actividadId = req.query.actividad_id;
    let sql = `SELECT p.*, ap.estado_validacion, ap.actividad_id FROM participantes p
               JOIN actividad_participante ap ON ap.participante_id = p.id`;
    const params = [];
    if (actividadId) {
      sql += ' WHERE ap.actividad_id = ?';
      params.push(actividadId);
    }
    const [rows] = await pool.query(sql, params);
    return res.json({ success: true, data: rows });
  });

  router.post('/:id/validar-apto', async (req, res) => {
    const pool = req.app.locals.pool;
    const participanteId = Number(req.params.id);
    const actividad_id = Number(req.body?.actividad_id);
    if (!actividad_id) return res.status(400).json({ success: false });
    const [rows] = await pool.query(
      `SELECT ap.id, p.nombres, p.apellidos, p.tipo_documento, p.numero_documento, p.email
       FROM actividad_participante ap
       JOIN participantes p ON p.id = ap.participante_id
       WHERE ap.actividad_id = ? AND ap.participante_id = ? LIMIT 1`,
      [actividad_id, participanteId]
    );
    const row = rows[0];
    if (!row) return res.status(404).json({ success: false });
    const v = validateParticipantePayload({
      nombres: row.nombres,
      apellidos: row.apellidos,
      tipo_documento: row.tipo_documento,
      numero_documento: row.numero_documento,
      email: row.email,
      actividad_id
    });
    if (!v.ok) {
      await pool.query(
        'UPDATE actividad_participante SET estado_validacion = ?, observaciones = ? WHERE id = ?',
        ['CON_OBSERVACION', v.message, row.id]
      );
      return res.status(422).json({ success: false, message: v.message });
    }
    await pool.query('UPDATE actividad_participante SET estado_validacion = ?, observaciones = NULL WHERE id = ?', [
      'APTO',
      row.id
    ]);
    return res.json({ success: true });
  });

  return router;
}

module.exports = { createParticipantesRouter };
