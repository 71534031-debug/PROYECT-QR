import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api, saveSession } from '../services/api.js';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      if (!data.success) throw new Error('Login fallido');
      saveSession({ token: data.token, refreshToken: data.refreshToken, user: data.user });
      navigate('/');
    } catch {
      setError('Credenciales incorrectas');
      await Swal.fire({ icon: 'error', title: 'Credenciales incorrectas' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <h1 className="login-title">Iniciar sesión</h1>
            <p className="login-subtitle">Sistema de Certificados CIP</p>
          </div>
          {error && <div className="login-error">{error}</div>}
          <form className="login-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                data-testid="login-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                id="password"
                data-testid="login-password"
                type="password"
                className="form-input"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button data-testid="login-submit" type="submit" className="btn btn-primary login-submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Iniciar sesión'}
            </button>
          </form>
          <div className="login-footer">
            <p>
              <Link to="/olvide-contrasena" data-testid="login-forgot-link">
                ¿Olvidó su contraseña?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
