import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validate = useCallback((val) => {
    if (!val.trim()) return 'El correo es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Ingrese un correo válido';
    return '';
  }, []);

  useEffect(() => {
    if (!email) { setEmailError(''); return; }
    const err = validate(email);
    setEmailError(err);
  }, [email, validate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const err = validate(email);
    if (err) { setEmailError(err); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/forgot-password', { email: email.trim() });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo de recuperación');
    } finally { setLoading(false); }
  }, [email, validate]);

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
          <h1 className="forgot-title">Recuperar Contraseña</h1>
          <p className="forgot-subtitle">Ingresa tu correo electrónico y te enviaremos las instrucciones</p>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <h2 className="forgot-success-title">Correo enviado</h2>
            <p className="forgot-success-text">Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.</p>
            <Link to="/login" className="btn btn-primary forgot-success-btn">Volver al inicio de sesión</Link>
          </motion.div>
        ) : (
          <form className="forgot-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo electrónico</label>
              <div className="forgot-input-wrapper">
                <svg className="forgot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <input id="email" type="email" className={`form-input ${emailError ? 'error' : ''}`} placeholder="admin@cip.local" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!emailError} aria-describedby={emailError ? 'email-error' : undefined} autoComplete="email" required />
              </div>
              {emailError && <p className="form-error" id="email-error" role="alert">{emailError}</p>}
            </div>
            <button type="submit" className="btn btn-primary forgot-submit" disabled={loading || !!emailError}>
              {loading ? <span className="spinner"></span> : 'Enviar Instrucciones'}
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
