const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { getEnv } = require('../config/env');
const { authenticate } = require('../middlewares/authenticate');

const forgotBuckets = new Map();

function createAuthRouter() {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    const pool = req.app.locals.pool;
    if (!pool) return res.status(500).json({ success: false, message: 'Base de datos no configurada' });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: 'Datos inválidos' });
    const [rows] = await pool.query(
      'SELECT id, email, password_hash, nombre, rol, activo FROM usuarios WHERE email = ? LIMIT 1',
      [String(email).trim().toLowerCase()]
    );
    const user = rows[0];
    if (!user || !user.activo) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const env = getEnv();
    const accessToken = jwt.sign(
      { sub: user.id, rol: user.rol, typ: 'access' },
      env.JWT_SECRET,
      { expiresIn: '30m' }
    );
    const rawRefresh = crypto.randomBytes(48).toString('hex');
    const refreshHash = crypto.createHash('sha256').update(rawRefresh).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      `INSERT INTO refresh_tokens (usuario_id, token_hash, expires_at, user_agent, ip)
       VALUES (?, ?, ?, ?, ?)`,
      [user.id, refreshHash, expiresAt, req.get('user-agent') || '', req.ip || '']
    );

    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
       VALUES (?, 'LOGIN_OK', 'usuario', ?, NULL, ?, ?)`,
      [user.id, user.id, req.ip || '', req.get('user-agent') || '']
    );

    return res.json({
      success: true,
      token: accessToken,
      refreshToken: rawRefresh,
      user: { id: user.id, nombre: user.nombre, rol: user.rol }
    });
  });

  router.post('/refresh', async (req, res) => {
    const pool = req.app.locals.pool;
    if (!pool) return res.status(500).json({ success: false });
    const raw = req.body?.refreshToken;
    if (!raw) return res.status(400).json({ success: false });
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    const [rows] = await pool.query(
      `SELECT rt.id as rt_id, rt.usuario_id, u.rol, u.activo, u.nombre
       FROM refresh_tokens rt
       JOIN usuarios u ON u.id = rt.usuario_id
       WHERE rt.token_hash = ? AND rt.revoked_at IS NULL AND rt.expires_at > NOW() LIMIT 1`,
      [hash]
    );
    const row = rows[0];
    if (!row || !row.activo) return res.status(401).json({ success: false });
    const env = getEnv();
    const accessToken = jwt.sign(
      { sub: row.usuario_id, rol: row.rol, typ: 'access' },
      env.JWT_SECRET,
      { expiresIn: '30m' }
    );
    return res.json({ success: true, token: accessToken, user: { id: row.usuario_id, nombre: row.nombre, rol: row.rol } });
  });

  router.post('/logout', authenticate, async (req, res) => {
    const pool = req.app.locals.pool;
    const raw = req.body?.refreshToken;
    if (raw) {
      const hash = crypto.createHash('sha256').update(raw).digest('hex');
      await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?', [hash]);
    }
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
       VALUES (?, 'LOGOUT', 'usuario', ?, NULL, ?, ?)`,
      [req.user.id, req.user.id, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true });
  });

  router.post('/forgot-password', async (req, res) => {
    const pool = req.app.locals.pool;
    const email = String(req.body?.email || '').trim().toLowerCase();
    const ip = req.ip || '';
    const key = `${ip}:${email}`;
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const entry = forgotBuckets.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }
    entry.count += 1;
    forgotBuckets.set(key, entry);
    if (entry.count > 5) {
      return res.status(200).json({ success: true, message: 'Si el correo existe, recibirá instrucciones.' });
    }

    const [rows] = await pool.query('SELECT id, activo FROM usuarios WHERE email = ? LIMIT 1', [email]);
    const u = rows[0];
    if (u && u.activo) {
      const plain = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(plain).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await pool.query(
        'INSERT INTO password_reset_tokens (usuario_id, token_hash, expires_at, ip) VALUES (?, ?, ?, ?)',
        [u.id, tokenHash, expiresAt, ip]
      );
      const env = getEnv();
      const link = `${env.FRONTEND_PUBLIC_URL}/restablecer-contrasena?token=${plain}`;
      if (env.EMAIL_USER && env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(env.SMTP_PORT || 587),
            secure: false,
            auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS }
          });
          await transporter.sendMail({
            from: env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Acceda al enlace (válido 60 min): ${link}`
          });
        } catch {
          /* fallo SMTP: token ya persistido; no revelar error al cliente */
        }
      }
      await pool.query(
        `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
         VALUES (?, 'PASSWORD_RESET_REQUEST', 'usuario', ?, NULL, ?, ?)`,
        [u.id, u.id, ip, req.get('user-agent') || '']
      );
    }
    return res.status(200).json({ success: true, message: 'Si el correo existe, recibirá instrucciones.' });
  });

  router.post('/reset-password', async (req, res) => {
    const pool = req.app.locals.pool;
    const { token, new_password: newPassword } = req.body || {};
    if (!token || !newPassword) return res.status(400).json({ success: false, message: 'Datos inválidos' });
    if (newPassword.length < 10 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return res.status(422).json({ success: false, message: 'Política de contraseña no cumplida' });
    }
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const [rows] = await pool.query(
      `SELECT id, usuario_id FROM password_reset_tokens
       WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1`,
      [tokenHash]
    );
    const row = rows[0];
    if (!row) return res.status(400).json({ success: false, message: 'Enlace inválido o expirado' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE usuarios SET password_hash = ? WHERE id = ?', [hash, row.usuario_id]);
    await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?', [row.id]);
    await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE usuario_id = ? AND revoked_at IS NULL', [
      row.usuario_id
    ]);
    await pool.query(
      `INSERT INTO auditoria_eventos (usuario_id, accion, entidad_tipo, entidad_id, detalle_json, ip, user_agent)
       VALUES (?, 'PASSWORD_RESET_OK', 'usuario', ?, NULL, ?, ?)`,
      [row.usuario_id, row.usuario_id, req.ip || '', req.get('user-agent') || '']
    );
    return res.json({ success: true });
  });

  return router;
}

module.exports = { createAuthRouter };
