const express = require('express');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middlewares/authenticate');
const { requireRoles } = require('../middlewares/requireRoles');
const { validatePlantillaContenido } = require('../utils/plantillaValidators');

const plantillaImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads', 'images'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `plantilla_${uuidv4()}${ext}`);
  }
});

const uploadPlantillaImage = multer({
  storage: plantillaImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Formato no permitido. Use una imagen válida'));
  }
});

const REQUIRED_CAMPOS = [
  '{{NOMBRE_COMPLETO}}', '{{DOCUMENTO}}', '{{ACTIVIDAD_NOMBRE}}', '{{FECHA_EMISION}}',
  '{{CODIGO_UNICO}}', '{{QR}}', '{{LOGO_INSTITUCION}}', '{{NOMBRE_AUTORIDAD}}', '{{CARGO_AUTORIDAD}}', '{{FIRMA_AUTORIDAD}}'
];

function createPlantillasRouter() {
  const router = express.Router();
  router.use(authenticate);
  router.use(requireRoles('ADMIN', 'ADMINISTRATIVO'));

  router.post('/', async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!pool) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      const { nombre, contenido } = req.body || {};
      if (!nombre || !nombre.trim()) return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });
      if (contenido) {
        const v = validatePlantillaContenido(contenido);
        if (!v.ok) return res.status(400).json({ success: false, message: v.message });
      }
      const insertNombre = nombre.trim();
      const insertContenido = contenido || null;
      const [r] = await pool.query('INSERT INTO plantillas (nombre, contenido, activa) VALUES (?, ?, 1)', [insertNombre, insertContenido]);
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent) VALUES (?, 'PLANTILLA_CREADA', 'plantilla', ?, ?, ?)`,
        [req.user.id || null, r.insertId, req.ip || '', req.get('user-agent') || '']
      );
      return res.status(201).json({ success: true, data: { id: r.insertId } });
    } catch (dbErr) {
      console.error('Error creando plantilla:', dbErr);
      const msg = dbErr?.message || 'Error interno al crear plantilla';
      return res.status(500).json({ success: false, message: msg });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!pool) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      const [rows] = await pool.query('SELECT id, nombre, activa, created_at FROM plantillas ORDER BY id DESC');
      return res.json({ success: true, data: rows });
    } catch (dbErr) {
      console.error('Error listando plantillas:', dbErr);
      return res.status(500).json({ success: false, message: dbErr?.message || 'Error al obtener plantillas' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!pool) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      const id = Number(req.params.id);
      const [rows] = await pool.query('SELECT id, nombre, imagen_fondo, activa, created_at, contenido FROM plantillas WHERE id = ?', [id]);
      if (!rows[0]) return res.status(404).json({ success: false, message: 'Plantilla no encontrada' });
      const [campos] = await pool.query('SELECT id, placeholder, x, y, font_size, alignment, color, width, height, orden FROM plantilla_campos WHERE plantilla_id = ? ORDER BY orden ASC', [id]);
      return res.json({ success: true, data: { ...rows[0], campos } });
    } catch (dbErr) {
      console.error('Error obteniendo plantilla:', dbErr);
      return res.status(500).json({ success: false, message: dbErr?.message || 'Error al obtener plantilla' });
    }
  });

  router.get('/:id/campos', async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!pool) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      const id = Number(req.params.id);
      const [campos] = await pool.query('SELECT id, placeholder, x, y, font_size, alignment, color, width, height, orden FROM plantilla_campos WHERE plantilla_id = ? ORDER BY orden ASC', [id]);
      return res.json({ success: true, data: campos });
    } catch (dbErr) {
      console.error('Error obteniendo campos:', dbErr);
      return res.status(500).json({ success: false, message: dbErr?.message || 'Error al obtener campos' });
    }
  });

  router.put('/:id/campos', async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!pool) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      const id = Number(req.params.id);
      const { campos } = req.body || {};
      if (!Array.isArray(campos) || campos.length === 0) {
        return res.status(400).json({ success: false, message: 'Se requiere un array de campos' });
      }
      const [exist] = await pool.query('SELECT id FROM plantillas WHERE id = ?', [id]);
      if (!exist[0]) return res.status(404).json({ success: false, message: 'Plantilla no encontrada' });
      const placeholders = new Set(campos.map((c) => c.placeholder));
      const missing = REQUIRED_CAMPOS.filter((p) => !placeholders.has(p));
      if (missing.length > 0) {
        return res.status(400).json({ success: false, message: `Faltan placeholders: ${missing.join(', ')}` });
      }
      await pool.query('DELETE FROM plantilla_campos WHERE plantilla_id = ?', [id]);
      for (let i = 0; i < campos.length; i++) {
        const c = campos[i];
        await pool.query(
          'INSERT INTO plantilla_campos (plantilla_id, placeholder, x, y, font_size, alignment, color, width, height, orden) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, c.placeholder, c.x ?? 50, c.y ?? 50, c.font_size ?? 16, c.alignment || 'center', c.color || '#1a1a2e', c.width ?? 200, c.height ?? 30, i]
        );
      }
      const [saved] = await pool.query('SELECT id, placeholder, x, y, font_size, alignment, color, width, height, orden FROM plantilla_campos WHERE plantilla_id = ? ORDER BY orden ASC', [id]);
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent) VALUES (?, 'PLANTILLA_CAMPOS_ACTUALIZADOS', 'plantilla', ?, ?, ?)`,
        [req.user.id, id, req.ip || '', req.get('user-agent') || '']
      );
      return res.json({ success: true, data: { campos: saved } });
    } catch (dbErr) {
      console.error('Error guardando campos:', dbErr);
      return res.status(500).json({ success: false, message: dbErr?.message || 'Error al guardar posiciones' });
    }
  });

  router.post('/:id/imagen', uploadPlantillaImage.single('imagen_fondo'), async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!pool) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      const id = Number(req.params.id);
      if (!req.file) return res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
      const relPath = path.join('uploads', 'images', req.file.filename).replace(/\\/g, '/');
      await pool.query('UPDATE plantillas SET imagen_fondo = ? WHERE id = ?', [relPath, id]);
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent) VALUES (?, 'PLANTILLA_IMAGEN_SUBIDA', 'plantilla', ?, ?, ?)`,
        [req.user.id, id, req.ip || '', req.get('user-agent') || '']
      );
      return res.json({ success: true, url: relPath });
    } catch (dbErr) {
      console.error('Error subiendo imagen:', dbErr);
      return res.status(500).json({ success: false, message: dbErr?.message || 'Error al subir la imagen' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!pool) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
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
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent) VALUES (?, 'PLANTILLA_EDITADA', 'plantilla', ?, ?, ?)`,
        [req.user.id, id, req.ip || '', req.get('user-agent') || '']
      );
      return res.json({ success: true });
    } catch (dbErr) {
      console.error('Error actualizando plantilla:', dbErr);
      return res.status(500).json({ success: false, message: dbErr?.message || 'Error al actualizar plantilla' });
    }
  });

  router.delete('/:id', requireRoles('ADMIN'), async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!pool) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      const id = Number(req.params.id);
      await pool.query('DELETE FROM plantillas WHERE id = ?', [id]);
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent) VALUES (?, 'PLANTILLA_ELIMINADA', 'plantilla', ?, ?, ?)`,
        [req.user.id, id, req.ip || '', req.get('user-agent') || '']
      );
      return res.json({ success: true });
    } catch (dbErr) {
      console.error('Error eliminando plantilla:', dbErr);
      return res.status(500).json({ success: false, message: dbErr?.message || 'Error al eliminar plantilla' });
    }
  });

  return router;
}

module.exports = { createPlantillasRouter };
