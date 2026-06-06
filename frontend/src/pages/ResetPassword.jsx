import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!token) {
      setError('Enlace inválido: falta el token.');
      return;
    }
    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/reset-password', { token, new_password: password });
      if (!data.success) throw new Error('reset');
      setMessage('Contraseña actualizada. Ya puede iniciar sesión.');
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo restablecer la contraseña.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', fontFamily: 'system-ui' }}>
      <h1>Restablecer contraseña</h1>
      {!token && <p data-testid="reset-no-token">El enlace no es válido o ha expirado.</p>}
      <p>Mínimo 10 caracteres, con mayúscula, minúscula y número.</p>
      <form data-testid="reset-form" onSubmit={onSubmit}>
        <label htmlFor="reset-password">Nueva contraseña</label>
        <input
          id="reset-password"
          data-testid="reset-password"
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required
          minLength={10}
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <label htmlFor="reset-password2">Confirmar</label>
        <input
          id="reset-password2"
          data-testid="reset-password2"
          type="password"
          value={password2}
          onChange={(ev) => setPassword2(ev.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <button data-testid="reset-submit" type="submit" disabled={loading || !token}>
          {loading ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
      {message && (
        <p data-testid="reset-message" style={{ marginTop: 12 }}>
          {message}
        </p>
      )}
      {error && (
        <p data-testid="reset-error" style={{ color: 'crimson', marginTop: 12 }}>
          {error}
        </p>
      )}
      <p style={{ marginTop: 24 }}>
        <Link to="/login">Ir al inicio de sesión</Link>
      </p>
    </div>
  );
}
