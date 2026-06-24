const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { createAuthRouter } = require('./routes/auth.routes');
const { createActividadesRouter } = require('./routes/actividades.routes');
const { createParticipantesRouter } = require('./routes/participantes.routes');
const { createPlantillasRouter } = require('./routes/plantillas.routes');
const { createConfigRouter } = require('./routes/config.routes');
const { createCertificadosRouter } = require('./routes/certificados.routes');
const { createValidacionRouter } = require('./routes/validacion.routes');
const { createEntregaRouter } = require('./routes/entrega.routes');
const { authenticate } = require('./middlewares/authenticate');
const { requireRoles } = require('./middlewares/requireRoles');
const { getEnv } = require('./config/env');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), getEnv().UPLOAD_DIR, 'images');
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Formato no permitido. Use JPG, PNG, WEBP o SVG'));
  }
});

const multerErrorHandler = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'La imagen excede el tamaño máximo de 5MB' });
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) return res.status(400).json({ success: false, message: err.message });
  next();
};

/**
 * @param {{ pool?: import('mysql2/promise').Pool | null }} } [options]
 */
function createApp(options = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.locals.pool = options.pool ?? null;

  const uploadsDir = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.post('/api/configuracion/logo', authenticate, requireRoles('ADMIN'), uploadImage.single('logo'), async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!req.file) return res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
      const logoRelPath = path.join('uploads', 'images', req.file.filename).replace(/\\/g, '/');
      const [exist] = await pool.query('SELECT id FROM configuracion_institucional WHERE id = 1 LIMIT 1');
      if (exist.length > 0) {
        await pool.query('UPDATE configuracion_institucional SET logo_url = ? WHERE id = 1', [logoRelPath]);
      } else {
        await pool.query('INSERT INTO configuracion_institucional (id, logo_url) VALUES (1, ?)', [logoRelPath]);
      }
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
         VALUES (?, 'LOGO_ACTUALIZADO', 'configuracion', 1, ?, ?)`,
        [req.user.id, req.ip || '', req.get('user-agent') || '']
      );
      return res.json({ success: true, url: logoRelPath });
    } catch (err) {
      console.error('Error subiendo logo:', err);
      return res.status(500).json({ success: false, message: 'Error al subir el logo: ' + err.message });
    }
  });

  app.delete('/api/configuracion/logo', authenticate, requireRoles('ADMIN'), async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      const [rows] = await pool.query('SELECT logo_url FROM configuracion_institucional WHERE id = 1 LIMIT 1');
      if (rows[0]?.logo_url) {
        const oldPath = path.join(process.cwd(), rows[0].logo_url);
        if (require('fs').existsSync(oldPath)) require('fs').unlinkSync(oldPath);
      }
      await pool.query('UPDATE configuracion_institucional SET logo_url = NULL WHERE id = 1');
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
         VALUES (?, 'LOGO_ELIMINADO', 'configuracion', 1, ?, ?)`,
        [req.user.id, req.ip || '', req.get('user-agent') || '']
      );
      return res.json({ success: true });
    } catch (err) {
      console.error('Error eliminando logo:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar el logo: ' + err.message });
    }
  });

  app.post('/api/configuracion/firma', authenticate, requireRoles('ADMIN'), uploadImage.single('firma'), async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      if (!req.file) return res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
      const firmaRelPath = path.join('uploads', 'images', req.file.filename).replace(/\\/g, '/');
      const [existF] = await pool.query('SELECT id FROM configuracion_institucional WHERE id = 1 LIMIT 1');
      if (existF.length > 0) {
        await pool.query('UPDATE configuracion_institucional SET firma_url = ? WHERE id = 1', [firmaRelPath]);
      } else {
        await pool.query('INSERT INTO configuracion_institucional (id, firma_url) VALUES (1, ?)', [firmaRelPath]);
      }
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
         VALUES (?, 'FIRMA_ACTUALIZADA', 'configuracion', 1, ?, ?)`,
        [req.user.id, req.ip || '', req.get('user-agent') || '']
      );
      return res.json({ success: true, url: firmaRelPath });
    } catch (err) {
      console.error('Error subiendo firma:', err);
      return res.status(500).json({ success: false, message: 'Error al subir la firma: ' + err.message });
    }
  });

  app.delete('/api/configuracion/firma', authenticate, requireRoles('ADMIN'), async (req, res) => {
    try {
      const pool = req.app.locals.pool;
      const [rows] = await pool.query('SELECT firma_url FROM configuracion_institucional WHERE id = 1 LIMIT 1');
      if (rows[0]?.firma_url) {
        const oldPath = path.join(process.cwd(), rows[0].firma_url);
        if (require('fs').existsSync(oldPath)) require('fs').unlinkSync(oldPath);
      }
      await pool.query('UPDATE configuracion_institucional SET firma_url = NULL WHERE id = 1');
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, ip, user_agent)
         VALUES (?, 'FIRMA_ELIMINADA', 'configuracion', 1, ?, ?)`,
        [req.user.id, req.ip || '', req.get('user-agent') || '']
      );
      return res.json({ success: true });
    } catch (err) {
      console.error('Error eliminando firma:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar la firma: ' + err.message });
    }
  });

  app.use('/api/auth', createAuthRouter());
  app.use('/api/actividades', createActividadesRouter());
  app.use('/api/participantes', createParticipantesRouter());
  app.use('/api/plantillas', createPlantillasRouter());
  app.use('/api/configuracion', createConfigRouter());
  app.use('/api/certificados', createCertificadosRouter());
  app.use('/api/validacion', createValidacionRouter());
  app.use('/api/entrega', createEntregaRouter());

  app.use(multerErrorHandler);

  return app;
}

module.exports = { createApp };
