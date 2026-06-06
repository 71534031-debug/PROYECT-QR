import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { REQUIRED_PLACEHOLDERS } from '../shared/requiredPlaceholders.js';
import './Plantillas.css';

const DEFAULT_HTML = `${REQUIRED_PLACEHOLDERS.join(' ')}`;

export default function Plantillas() {
  const [items, setItems] = useState([]);
  const [nombre, setNombre] = useState('Plantilla base');
  const [contenido, setContenido] = useState(DEFAULT_HTML);

  async function load() {
    const { data } = await api.get('/api/plantillas');
    setItems(data.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function crear(e) {
    e.preventDefault();
    await api.post('/api/plantillas', { nombre, contenido });
    setNombre('Plantilla base');
    setContenido(DEFAULT_HTML);
    await load();
  }

  return (
    <div className="plantillas-page">
      <div className="plantillas-header">
        <div>
          <h1 className="plantillas-title">Plantillas</h1>
          <p className="plantillas-subtitle">Diseña las plantillas para tus certificados</p>
        </div>
      </div>

      <div className="plantillas-content">
        <div className="plantillas-form-card">
          <h2 className="plantillas-form-title">Nueva Plantilla</h2>
          <form className="plantillas-form" data-testid="plantilla-form" onSubmit={crear}>
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre de la plantilla</label>
              <input
                id="nombre"
                data-testid="plantilla-nombre"
                type="text"
                className="form-input"
                placeholder="Nombre descriptivo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contenido">Contenido HTML</label>
              <textarea
                id="contenido"
                data-testid="plantilla-contenido"
                className="form-textarea"
                placeholder="Contenido HTML con placeholders"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
              />
            </div>
            <div className="plantillas-help">
              <div className="plantillas-help-title">Placeholders disponibles:</div>
              <ul className="plantillas-help-list">
                {REQUIRED_PLACEHOLDERS.map(ph => (
                  <li key={ph}>{`{{${ph}}}`}</li>
                ))}
              </ul>
            </div>
            <button type="submit" className="btn btn-primary plantillas-submit">
              Crear Plantilla
            </button>
          </form>
        </div>

        <div className="plantillas-list-card">
          <div className="plantillas-list-header">
            <h2 className="plantillas-list-title">Lista de Plantillas</h2>
            <span className="plantillas-count">{items.length} plantillas</span>
          </div>
          {items.length === 0 ? (
            <div className="plantillas-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p>No hay plantillas creadas</p>
            </div>
          ) : (
            <table className="table plantillas-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Activa</th>
                  <th>Fecha creación</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td className="plantilla-name">{p.nombre}</td>
                    <td>
                      <span className={`plantilla-active-badge ${p.activa ? 'si' : 'no'}`}>
                        {p.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}</td>
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
