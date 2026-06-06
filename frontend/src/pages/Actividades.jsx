import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import './Actividades.css';

const TIPO_OPTIONS = ['Curso', 'Taller', 'Seminario', 'Simposio', 'Conferencia', 'Diplomado'];

export default function Actividades() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    tipo: 'Curso',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    responsable: ''
  });

  async function load() {
    try {
      const { data } = await api.get('/api/actividades');
      setItems(data.data || []);
    } catch {
      setError('Fallo al cargar');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function guardar(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/actividades', form);
      setForm({ nombre: '', tipo: 'Curso', descripcion: '', fecha_inicio: '', fecha_fin: '', responsable: '' });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="actividades-page">
      <div className="actividades-header">
        <div>
          <h1 className="actividades-title">Actividades</h1>
          <p className="actividades-subtitle">Gestiona los eventos y cursos del sistema</p>
        </div>
      </div>

      {error && <div className="actividades-error" data-testid="actividades-error">{error}</div>}

      <div className="actividades-content">
        <div className="actividades-form-card">
          <h2 className="actividades-form-title">Nueva Actividad</h2>
          <form className="actividades-form" data-testid="actividad-form" onSubmit={guardar}>
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                data-testid="actividad-nombre"
                type="text"
                className="form-input"
                placeholder="Nombre de la actividad"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                className="form-select"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                {TIPO_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                className="form-textarea"
                placeholder="Descripción opcional"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="fecha_inicio">Fecha inicio</label>
                <input
                  id="fecha_inicio"
                  data-testid="actividad-fecha-inicio"
                  type="date"
                  className="form-input"
                  value={form.fecha_inicio}
                  onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fecha_fin">Fecha fin</label>
                <input
                  id="fecha_fin"
                  data-testid="actividad-fecha-fin"
                  type="date"
                  className="form-input"
                  value={form.fecha_fin}
                  onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="responsable">Responsable</label>
              <input
                id="responsable"
                data-testid="actividad-responsable"
                type="text"
                className="form-input"
                placeholder="Nombre del responsable"
                value={form.responsable}
                onChange={(e) => setForm({ ...form, responsable: e.target.value })}
                required
              />
            </div>
            <button data-testid="actividad-submit" type="submit" className="btn btn-primary actividades-submit">
              Guardar Actividad
            </button>
          </form>
        </div>

        <div className="actividades-list-card">
          <div className="actividades-list-header">
            <h2 className="actividades-list-title">Lista de Actividades</h2>
            <span className="actividades-count">{items.length} actividades</span>
          </div>
          {items.length === 0 ? (
            <div className="actividades-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p>No hay actividades registradas</p>
            </div>
          ) : (
            <table className="table actividades-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Fechas</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody data-testid="actividades-list">
                {items.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.nombre}</strong></td>
                    <td><span className={`actividad-badge ${a.tipo?.toLowerCase()}`}>{a.tipo}</span></td>
                    <td className="actividad-fecha">{a.fecha_inicio} - {a.fecha_fin}</td>
                    <td>{a.responsable}</td>
                    <td><span className="actividad-badge activo">{a.estado || 'Activo'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
