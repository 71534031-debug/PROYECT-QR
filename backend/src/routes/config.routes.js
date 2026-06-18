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
    const { nombre_institucion, cargo_autoridad, nombre_autoridad, nombre_app, email_contacto, telefono_contacto, direccion } = req.body || {};
    if (!nombre_institucion || !cargo_autoridad || !nombre_autoridad) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }
    const [existing] = await pool.query('SELECT logo_url, firma_url FROM configuracion_institucional WHERE id = 1 LIMIT 1');
    const logoUrl = existing[0]?.logo_url || null;
    const firmaUrl = existing[0]?.firma_url || null;
    await pool.query(
      `INSERT INTO configuracion_institucional (id, nombre_institucion, logo_url, firma_url, cargo_autoridad, nombre_autoridad, nombre_app, email_contacto, telefono_contacto, direccion)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE nombre_institucion=VALUES(nombre_institucion), logo_url=VALUES(logo_url),
       firma_url=VALUES(firma_url), cargo_autoridad=VALUES(cargo_autoridad), nombre_autoridad=VALUES(nombre_autoridad),
       nombre_app=VALUES(nombre_app), email_contacto=VALUES(email_contacto), telefono_contacto=VALUES(telefono_contacto), direccion=VALUES(direccion)`,
      [nombre_institucion, logoUrl, firmaUrl, cargo_autoridad, nombre_autoridad, nombre_app || null, email_contacto || null, telefono_contacto || null, direccion || null]
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
