import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';
import './Participantes.css';

const emptyForm = () => ({
  nombres: '',
  apellidos: '',
  tipo_documento: 'DNI',
  numero_documento: '',
  email: ''
});

export default function Participantes() {
  const [actividades, setActividades] = useState([]);
  const [actividadId, setActividadId] = useState('');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState('');

  async function loadActividades() {
    const { data } = await api.get('/api/actividades');
    setActividades(data.data || []);
  }

  const loadParticipantes = useCallback(async () => {
    if (!actividadId) return;
    const { data } = await api.get('/api/participantes', { params: { actividad_id: actividadId } });
    setItems(data.data || []);
  }, [actividadId]);

  useEffect(() => {
    loadActividades();
  }, []);

  useEffect(() => {
    loadParticipantes();
  }, [loadParticipantes]);

  async function crearParticipante(e) {
    e.preventDefault();
    setError('');
    if (!actividadId) {
      setError('Seleccione una actividad');
      return;
    }
    try {
      await api.post('/api/participantes', { ...form, actividad_id: Number(actividadId) });
      setForm(emptyForm());
      await loadParticipantes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  }

  async function validarApto(participanteId) {
    setError('');
    if (!actividadId) return;
    try {
      await api.post(`/api/participantes/${participanteId}/validar-apto`, {
        actividad_id: Number(actividadId)
      });
      await loadParticipantes();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo validar');
    }
  }

  return (
    <div className="participantes-page">
      <div className="participantes-header">
        <div>
          <h1 className="participantes-title">Participantes</h1>
          <p className="participantes-subtitle">Registra y gestiona participantes de tus actividades</p>
        </div>
      </div>

      {error && <div className="participantes-error" data-testid="participantes-error">{error}</div>}

      <div className="participantes-content">
        <div className="participantes-form-card">
          <h2 className="participantes-form-title">Nuevo Participante</h2>
          <div className="participante-select-actividad">
            <label className="form-label" htmlFor="actividad">Seleccionar Actividad</label>
            <select
              id="actividad"
              data-testid="participantes-actividad"
              className="form-select"
              value={actividadId}
              onChange={(e) => setActividadId(e.target.value)}
            >
              <option value="">Seleccione una actividad</option>
              {actividades.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
          <form className="participantes-form" data-testid="participante-form" onSubmit={crearParticipante}>
            <div className="form-group">
              <label className="form-label" htmlFor="nombres">Nombres</label>
              <input
                id="nombres"
                data-testid="participante-nombres"
                type="text"
                className="form-input"
                placeholder="Nombres del participante"
                value={form.nombres}
                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="apellidos">Apellidos</label>
              <input
                id="apellidos"
                data-testid="participante-apellidos"
                type="text"
                className="form-input"
                placeholder="Apellidos del participante"
                value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tipo_documento">Tipo documento</label>
              <select
                id="tipo_documento"
                data-testid="participante-tipo-doc"
                className="form-select"
                value={form.tipo_documento}
                onChange={(e) => setForm({ ...form, tipo_documento: e.target.value })}
              >
                <option value="DNI">DNI</option>
                <option value="CE">Carné de Extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="numero_documento">Número de documento</label>
              <input
                id="numero_documento"
                data-testid="participante-numero-doc"
                type="text"
                className="form-input"
                placeholder="Número de documento"
                value={form.numero_documento}
                onChange={(e) => setForm({ ...form, numero_documento: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                data-testid="participante-email"
                type="email"
                className="form-input"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <button data-testid="participante-submit" type="submit" className="btn btn-primary participantes-submit">
              Registrar Participante
            </button>
          </form>
        </div>

        <div className="participantes-list-card">
          <div className="participantes-list-header">
            <h2 className="participantes-list-title">Lista de Participantes</h2>
            <span className="participantes-count">{items.length} participantes</span>
          </div>
          {items.length === 0 ? (
            <div className="participantes-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p>Selecciona una actividad para ver los participantes</p>
            </div>
          ) : (
            <table className="table participantes-table">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Documento</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody data-testid="participantes-list">
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombres}</td>
                    <td>{p.apellidos}</td>
                    <td className="participante-doc">{p.tipo_documento} {p.numero_documento}</td>
                    <td className="participante-email">{p.email}</td>
                    <td>
                      <span className={`participante-badge ${p.estado_validacion === 'APTO' ? 'apto' : p.estado_validacion === 'NO_APTO' ? 'no-apto' : 'pendiente'}`}>
                        {p.estado_validacion || 'Pendiente'}
                      </span>
                    </td>
                    <td>
                      <div className="participante-actions">
                        <button
                          type="button"
                          data-testid={`participante-apto-${p.id}`}
                          className="participante-btn validate"
                          onClick={() => validarApto(p.id)}
                          disabled={p.estado_validacion === 'APTO'}
                        >
                          Marcar APTO
                        </button>
                      </div>
                    </td>
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
