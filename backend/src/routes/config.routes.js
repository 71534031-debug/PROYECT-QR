const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { requireRoles } = require('../middlewares/requireRoles');

function createConfigRouter() {
  const router = express.Router();
  router.use(authenticate);
  router.use(requireRoles('ADMIN', 'ADMINISTRATIVO'));

  router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const [rows] = await pool.query('SELECT * FROM configuracion_institucional WHERE id = 1 LIMIT 1');
    return res.json({ success: true, data: rows[0] || null });
  });

  router.put('/', requireRoles('ADMIN'), async (req, res) => {
    const pool = req.app.locals.pool;
    const { nombre_institucion, logo_url, firma_url, cargo_autoridad, nombre_autoridad } = req.body || {};
    if (!nombre_institucion || !cargo_autoridad || !nombre_autoridad) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }
    await pool.query(
      `INSERT INTO configuracion_institucional (id, nombre_institucion, logo_url, firma_url, cargo_autoridad, nombre_autoridad)
       VALUES (1, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE nombre_institucion=VALUES(nombre_institucion), logo_url=VALUES(logo_url),
       firma_url=VALUES(firma_url), cargo_autoridad=VALUES(cargo_autoridad), nombre_autoridad=VALUES(nombre_autoridad)`,
      [nombre_institucion, logo_url || null, firma_url || null, cargo_autoridad, nombre_autoridad]
    );
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
       VALUES (?, 'CONFIG_ACTUALIZADA', 'configuracion', 1, ?, ?)`,
      [req.user.id, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true });
  });

  return router;
}

module.exports = { createConfigRouter };
