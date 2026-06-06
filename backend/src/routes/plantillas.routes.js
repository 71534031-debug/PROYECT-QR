const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { requireRoles } = require('../middlewares/requireRoles');
const { validatePlantillaContenido } = require('../utils/plantillaValidators');

function createPlantillasRouter() {
  const router = express.Router();
  router.use(authenticate);
  router.use(requireRoles('ADMIN', 'ADMINISTRATIVO'));

  router.post('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const { nombre, contenido } = req.body || {};
    if (!nombre || !contenido) return res.status(400).json({ success: false, message: 'Datos inválidos' });
    const v = validatePlantillaContenido(contenido);
    if (!v.ok) return res.status(400).json({ success: false, message: v.message });
    const [r] = await pool.query('INSERT INTO plantillas (nombre, contenido, activa) VALUES (?, ?, 1)', [nombre, contenido]);
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'PLANTILLA_CREADA', 'plantilla', ?, ?, ?)`,
      [req.user.id, r.insertId, req.ip || '', req.get('user-agent') || '']
    );
    return res.status(201).json({ success: true, data: { id: r.insertId } });
  });

  router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const [rows] = await pool.query('SELECT id, nombre, activa, created_at FROM plantillas ORDER BY id DESC');
    return res.json({ success: true, data: rows });
  });

  router.put('/:id', async (req, res) => {
    const pool = req.app.locals.pool;
    const id = Number(req.params.id);
    const { nombre, contenido, activa } = req.body || {};
    if (contenido) {
      const v = validatePlantillaContenido(contenido);
      if (!v.ok) return res.status(400).json({ success: false, message: v.message });
    }
    await pool.query('UPDATE plantillas SET nombre = COALESCE(?, nombre), contenido = COALESCE(?, contenido), activa = COALESCE(?, activa) WHERE id = ?', [
      nombre || null,
      contenido || null,
      activa === undefined ? null : activa ? 1 : 0,
      id
    ]);
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'PLANTILLA_EDITADA', 'plantilla', ?, ?, ?)`,
      [req.user.id, id, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true });
  });

  router.delete('/:id', requireRoles('ADMIN'), async (req, res) => {
    const pool = req.app.locals.pool;
    const id = Number(req.params.id);
    await pool.query('DELETE FROM plantillas WHERE id = ?', [id]);
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'PLANTILLA_ELIMINADA', 'plantilla', ?, ?, ?)`,
      [req.user.id, id, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true });
  });

  return router;
}

module.exports = { createPlantillasRouter };
