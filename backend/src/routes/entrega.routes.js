const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');

function createEntregaRouter() {
  const router = express.Router();

  router.get('/descargar', async (req, res) => {
    const pool = req.app.locals.pool;
    const token = String(req.query.t || '');
    if (!token) return res.status(404).send('Not found');
    try {
      const env = getEnv();
      const payload = jwt.verify(token, env.JWT_DOWNLOAD_SECRET);
      if (payload.typ !== 'cert_download' || !payload.certificado_id) return res.status(404).send('Not found');
      const [rows] = await pool.query('SELECT ruta_pdf, estado FROM certificados WHERE id = ? LIMIT 1', [
        payload.certificado_id
      ]);
      const c = rows[0];
      if (!c || c.estado !== 'EMITIDO') return res.status(404).send('Not found');
      const abs = path.join(process.cwd(), c.ruta_pdf);
      if (!fs.existsSync(abs)) return res.status(404).send('Not found');
      return res.download(abs, 'certificado.pdf');
    } catch {
      return res.status(404).send('Not found');
    }
  });

  return router;
}

module.exports = { createEntregaRouter };
