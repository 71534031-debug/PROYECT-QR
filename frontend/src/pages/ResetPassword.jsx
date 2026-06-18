import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import './ResetPassword.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = useCallback((val) => {
    if (!val) return 'La contraseña es requerida';
    if (val.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(val)) return 'Debe contener una mayúscula';
    if (!/[a-z]/.test(val)) return 'Debe contener una minúscula';
    if (!/[0-9]/.test(val)) return 'Debe contener un número';
    return '';
  }, []);

  useEffect(() => {
    if (!password) { setPasswordError(''); return; }
    setPasswordError(validatePassword(password));
  }, [password, validatePassword]);

  useEffect(() => {
    if (!confirmPassword || !password) { setConfirmError(''); return; }
    setConfirmError(password !== confirmPassword ? 'Las contraseñas no coinciden' : '');
  }, [password, confirmPassword]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const pErr = validatePassword(password);
    if (pErr) { setPasswordError(pErr); return; }
    if (password !== confirmPassword) { setConfirmError('Las contraseñas no coinciden'); return; }
    if (!token) { setError('Token inválido o expirado'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { token, password, password_confirmation: confirmPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    } finally { setLoading(false); }
  }, [password, confirmPassword, token, validatePassword]);

  if (!token) {
    return (
      <motion.div className="forgot-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="forgot-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="forgot-header">
            <h1 className="forgot-title">Enlace inválido</h1>
            <p className="forgot-subtitle">El enlace de restablecimiento no es válido o ha expirado.</p>
          </div>
          <Link to="/forgot-password" className="btn btn-primary forgot-submit" style={{ textAlign: 'center', display: 'block' }}>
            Solicitar nuevo enlace
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div className="forgot-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="forgot-bg" aria-hidden="true">
        <div className="forgot-bg-circle c1" /><div className="forgot-bg-circle c2" />
      </div>
      <motion.div className="forgot-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}>
        <div className="forgot-header">
          <div className="forgot-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          </div>
          <h1 className="forgot-title">Restablecer Contraseña</h1>
          <p className="forgot-subtitle">Ingresa tu nueva contraseña</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div className="forgot-alert alert-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {success ? (
          <motion.div className="forgot-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="forgot-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="forgot-success-title">Contraseña actualizada</h2>
            <p className="forgot-success-text">Tu contraseña se ha restablecido exitosamente.</p>
            <Link to="/login" className="btn btn-primary forgot-success-btn">Iniciar sesión</Link>
          </motion.div>
        ) : (
          <form className="forgot-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Nueva contraseña</label>
              <div className="reset-input-wrapper">
                <svg className="forgot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <input id="password" type={showPassword ? 'text' : 'password'} className={`form-input ${passwordError ? 'error' : ''}`} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!passwordError} aria-describedby={passwordError ? 'password-error' : undefined} autoComplete="new-password" required />
                <button type="button" className="reset-toggle" onClick={() => setShowPassword((s) => !s)} tabIndex={-1} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{showPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}</svg>
                </button>
              </div>
              {passwordError && <p className="form-error" id="password-error" role="alert">{passwordError}</p>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">Confirmar contraseña</label>
              <div className="reset-input-wrapper">
                <svg className="forgot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <input id="confirm-password" type={showPassword ? 'text' : 'password'} className={`form-input ${confirmError ? 'error' : ''}`} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} aria-invalid={!!confirmError} aria-describedby={confirmError ? 'confirm-error' : undefined} autoComplete="new-password" required />
              </div>
              {confirmError && <p className="form-error" id="confirm-error" role="alert">{confirmError}</p>}
            </div>
            <button type="submit" className="btn btn-primary forgot-submit" disabled={loading || !!passwordError || !!confirmError}>
              {loading ? <span className="spinner"></span> : 'Restablecer Contraseña'}
            </button>
            <div className="forgot-footer">
              <Link to="/login" className="forgot-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
