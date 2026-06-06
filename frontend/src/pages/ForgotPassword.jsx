import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/api/auth/forgot-password', { email });
      setMessage(data.message || 'Si el correo existe, recibirá instrucciones.');
    } catch {
      setError('No se pudo procesar la solicitud. Intente más tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', fontFamily: 'system-ui' }}>
      <h1>Recuperar contraseña</h1>
      <p>Ingrese el correo asociado a su cuenta.</p>
      <form data-testid="forgot-form" onSubmit={onSubmit}>
        <label htmlFor="forgot-email">Email</label>
        <input
          id="forgot-email"
          data-testid="forgot-email"
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <button data-testid="forgot-submit" type="submit" disabled={loading}>
          {loading ? 'Enviando…' : 'Enviar enlace'}
        </button>
      </form>
      {message && (
        <p data-testid="forgot-message" style={{ marginTop: 12 }}>
          {message}
        </p>
      )}
      {error && (
        <p data-testid="forgot-error" style={{ color: 'crimson', marginTop: 12 }}>
          {error}
        </p>
      )}
      <p style={{ marginTop: 24 }}>
        <Link to="/login">Volver al inicio de sesión</Link>
      </p>
    </div>
  );
}
