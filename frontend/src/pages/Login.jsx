import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { api, saveSession } from '../services/api.js';
import './Login.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email && !email ? 'El correo es obligatorio' : '';
  const passwordError = touched.password && !password ? 'La contraseña es obligatoria' : '';

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      if (!data.success) throw new Error('Login fallido');
      saveSession({ token: data.token, refreshToken: data.refreshToken, user: data.user });
      navigate('/');
    } catch {
      setError('Credenciales incorrectas');
      Swal.fire({ icon: 'error', title: 'Credenciales incorrectas', timer: 2000, showConfirmButton: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <motion.div className="login-container" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="login-card" variants={itemVariants}>
          <motion.div className="login-header" variants={itemVariants}>
            <motion.div
              className="login-logo"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </motion.div>
            <h1 className="login-title">Iniciar sesión</h1>
            <p className="login-subtitle">Sistema de Certificados CIP</p>
          </motion.div>

          {error && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <motion.form className="login-form" onSubmit={onSubmit} variants={itemVariants} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Correo electrónico <span className="required">*</span>
              </label>
              <input
                id="email"
                data-testid="login-email"
                type="email"
                className={`form-input ${emailError ? 'error' : touched.email && email ? 'success' : ''}`}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                placeholder="correo@ejemplo.com"
                required
                aria-describedby={emailError ? 'email-error' : undefined}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <span className="form-error" id="email-error" role="alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {emailError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Contraseña <span className="required">*</span>
              </label>
              <input
                id="password"
                data-testid="login-password"
                type="password"
                className={`form-input ${passwordError ? 'error' : touched.password && password ? 'success' : ''}`}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                placeholder="••••••••"
                required
                aria-describedby={passwordError ? 'password-error' : undefined}
                aria-invalid={!!passwordError}
              />
              {passwordError && (
                <span className="form-error" id="password-error" role="alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {passwordError}
                </span>
              )}
            </div>

            <motion.button
              data-testid="login-submit"
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? <span className="spinner"></span> : 'Iniciar sesión'}
            </motion.button>
          </motion.form>

          <motion.div className="login-footer" variants={itemVariants}>
            <p>
              <Link to="/olvide-contrasena" data-testid="login-forgot-link">
                ¿Olvidó su contraseña?
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
