import React, { useEffect, useState } from 'react';
import { api, loadSession } from '../services/api.js';
import './Configuracion.css';

export default function Configuracion() {
  const { user } = loadSession();
  const [form, setForm] = useState({
    nombre_institucion: '',
    logo_url: '',
    firma_url: '',
    cargo_autoridad: '',
    nombre_autoridad: ''
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/configuracion');
      if (data.data) setForm({ ...form, ...data.data });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function guardar(e) {
    e.preventDefault();
    if (user?.rol !== 'ADMIN') {
      setMsg('Solo el administrador puede modificar la configuración');
      return;
    }
    setMsg('');
    try {
      await api.put('/api/configuracion', form);
      setMsg('Configuración guardada exitosamente');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error al guardar');
    }
  }

  return (
    <div className="configuracion-page">
      <div className="configuracion-header">
        <h1 className="configuracion-title">Configuración</h1>
        <p className="configuracion-subtitle">Configura los datos institucionales del sistema</p>
      </div>

      <div className="configuracion-card">
        <div className="configuracion-card-header">
          <h2 className="configuracion-card-title">Datos Institucionales</h2>
          <span className={`configuracion-badge ${user?.rol?.toLowerCase()}`}>
            {user?.rol || 'Staff'}
          </span>
        </div>

        {user?.rol !== 'ADMIN' && (
          <div className="configuracion-not-admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Solo el administrador puede modificar la configuración
          </div>
        )}

        <form className="configuracion-form" data-testid="config-form" onSubmit={guardar}>
          <div className="configuracion-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="nombre_institucion">Nombre de la Institución</label>
              <input
                id="nombre_institucion"
                data-testid="config-nombre-institucion"
                type="text"
                className="form-input"
                placeholder="CIP - Capítulo de Ingeniería"
                value={form.nombre_institucion}
                onChange={(e) => setForm({ ...form, nombre_institucion: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cargo_autoridad">Cargo de la Autoridad</label>
              <input
                id="cargo_autoridad"
                data-testid="config-cargo-autoridad"
                type="text"
                className="form-input"
                placeholder="Decano Nacional"
                value={form.cargo_autoridad}
                onChange={(e) => setForm({ ...form, cargo_autoridad: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="nombre_autoridad">Nombre de la Autoridad</label>
              <input
                id="nombre_autoridad"
                data-testid="config-nombre-autoridad"
                type="text"
                className="form-input"
                placeholder="Ing. Nombre Apellido"
                value={form.nombre_autoridad}
                onChange={(e) => setForm({ ...form, nombre_autoridad: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="logo_url">URL del Logo</label>
              <input
                id="logo_url"
                type="url"
                className="form-input"
                placeholder="https://ejemplo.com/logo.png"
                value={form.logo_url || ''}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              />
            </div>
            <div className="form-group configuracion-form-full">
              <label className="form-label" htmlFor="firma_url">URL de la Firma</label>
              <input
                id="firma_url"
                type="url"
                className="form-input"
                placeholder="https://ejemplo.com/firma.png"
                value={form.firma_url || ''}
                onChange={(e) => setForm({ ...form, firma_url: e.target.value })}
              />
            </div>
          </div>

          {msg && (
            <div className={`configuracion-msg ${msg.includes('exitosamente') ? 'success' : 'error'}`} data-testid="config-msg">
              {msg}
            </div>
          )}

          <div className="configuracion-form-actions">
            <button data-testid="config-submit" type="submit" className="btn btn-primary configuracion-submit" disabled={user?.rol !== 'ADMIN'}>
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
