const express = require('express');
const cors = require('cors');
const { createAuthRouter } = require('./routes/auth.routes');
const { createActividadesRouter } = require('./routes/actividades.routes');
const { createParticipantesRouter } = require('./routes/participantes.routes');
const { createPlantillasRouter } = require('./routes/plantillas.routes');
const { createConfigRouter } = require('./routes/config.routes');
const { createCertificadosRouter } = require('./routes/certificados.routes');
const { createValidacionRouter } = require('./routes/validacion.routes');
const { createEntregaRouter } = require('./routes/entrega.routes');

/**
 * @param {{ pool?: import('mysql2/promise').Pool | null }} } [options]
 */
function createApp(options = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.locals.pool = options.pool ?? null;

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use('/api/auth', createAuthRouter());
  app.use('/api/actividades', createActividadesRouter());
  app.use('/api/participantes', createParticipantesRouter());
  app.use('/api/plantillas', createPlantillasRouter());
  app.use('/api/configuracion', createConfigRouter());
  app.use('/api/certificados', createCertificadosRouter());
  app.use('/api/validacion', createValidacionRouter());
  app.use('/api/entrega', createEntregaRouter());

  return app;
}

module.exports = { createApp };
