const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { requireRoles } = require('../middlewares/requireRoles');

function createActividadesRouter() {
  const router = express.Router();
  router.use(authenticate);
  router.use(requireRoles('ADMIN', 'ADMINISTRATIVO'));

  router.post('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const { nombre, tipo, descripcion, fecha_inicio, fecha_fin, responsable } = req.body || {};
    if (!nombre || !tipo || !fecha_inicio || !fecha_fin || !responsable) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }
    const [dup] = await pool.query(
      'SELECT id FROM actividades WHERE nombre = ? AND fecha_inicio = ? AND fecha_fin = ? LIMIT 1',
      [nombre, fecha_inicio, fecha_fin]
    );
    if (dup.length) return res.status(409).json({ success: false, message: 'Actividad duplicada' });
    const [r] = await pool.query(
      `INSERT INTO actividades (nombre, tipo, descripcion, fecha_inicio, fecha_fin, responsable, creado_por_usuario_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, tipo, descripcion || null, fecha_inicio, fecha_fin, responsable, req.user.id]
    );
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'ACTIVIDAD_CREADA', 'actividad', ?, ?, ?)`,
      [req.user.id, r.insertId, req.ip || '', req.get('user-agent') || '']
    );
    return res.status(201).json({ success: true, data: { id: r.insertId } });
  });

  router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const [rows] = await pool.query('SELECT * FROM actividades ORDER BY id DESC');
    return res.json({ success: true, data: rows });
  });

  router.put('/:id', async (req, res) => {
    const pool = req.app.locals.pool;
    const id = Number(req.params.id);
    const { nombre, tipo, descripcion, fecha_inicio, fecha_fin, responsable } = req.body || {};
    if (!nombre || !tipo || !fecha_inicio || !fecha_fin || !responsable) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }
    const [dup] = await pool.query(
      'SELECT id FROM actividades WHERE nombre = ? AND fecha_inicio = ? AND fecha_fin = ? AND id <> ? LIMIT 1',
      [nombre, fecha_inicio, fecha_fin, id]
    );
    if (dup.length) return res.status(409).json({ success: false, message: 'Actividad duplicada' });
    await pool.query(
      `UPDATE actividades SET nombre=?, tipo=?, descripcion=?, fecha_inicio=?, fecha_fin=?, responsable=?, actualizado_por_usuario_id=?
       WHERE id=?`,
      [nombre, tipo, descripcion || null, fecha_inicio, fecha_fin, responsable, req.user.id, id]
    );
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'ACTIVIDAD_EDITADA', 'actividad', ?, ?, ?)`,
      [req.user.id, id, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true });
  });

  return router;
}

module.exports = { createActividadesRouter };
