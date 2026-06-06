const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'No autorizado' });
  try {
    const env = getEnv();
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (payload.typ !== 'access') return res.status(401).json({ success: false, message: 'No autorizado' });
    req.user = { id: payload.sub, rol: payload.rol };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }
}

module.exports = { authenticate };
