import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import './Certificados.css';

export default function Certificados() {
  const [actividades, setActividades] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [actividadId, setActividadId] = useState('');
  const [plantillaId, setPlantillaId] = useState('');
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const [a, p, c] = await Promise.all([
        api.get('/api/actividades'),
        api.get('/api/plantillas'),
        api.get('/api/certificados')
      ]);
      setActividades(a.data.data || []);
      setPlantillas(p.data.data || []);
      setItems(c.data.data || []);
    })();
  }, []);

  async function generar(e) {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/certificados/generar', {
        actividad_id: Number(actividadId),
        plantilla_id: Number(plantillaId)
      });
      setMsg(`Se generaron ${data.generados} certificados exitosamente`);
      const { data: listBody } = await api.get('/api/certificados');
      setItems(listBody.data || []);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error al generar certificados');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="certificados-page">
      <div className="certificados-header">
        <div>
          <h1 className="certificados-title">Certificados</h1>
          <p className="certificados-subtitle">Genera certificados masivos para tus participantes</p>
        </div>
      </div>

      <div className="certificados-content">
        <div className="certificados-form-card">
          <h2 className="certificados-form-title">Generar Certificados</h2>
          <form className="certificados-form" data-testid="cert-generar-form" onSubmit={generar}>
            <div className="form-group">
              <label className="form-label" htmlFor="actividad">Seleccionar Actividad</label>
              <select
                id="actividad"
                data-testid="cert-actividad"
                className="form-select"
                value={actividadId}
                onChange={(e) => setActividadId(e.target.value)}
                required
              >
                <option value="">Seleccione una actividad</option>
                {actividades.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="plantilla">Seleccionar Plantilla</label>
              <select
                id="plantilla"
                data-testid="cert-plantilla"
                className="form-select"
                value={plantillaId}
                onChange={(e) => setPlantillaId(e.target.value)}
                required
              >
                <option value="">Seleccione una plantilla</option>
                {plantillas.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="certificados-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Solo se generarán certificados para participantes marcados como "APTO"
            </div>
            <button data-testid="cert-generar-submit" type="submit" className="btn btn-primary certificados-submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Generar Certificados'}
            </button>
          </form>
        </div>

        <div className="certificados-list-card">
          <div className="certificados-list-header">
            <h2 className="certificados-list-title">Certificados Generados</h2>
            <span className="certificados-count">{items.length} certificados</span>
          </div>
          {msg && (
            <div className={`certificados-msg ${msg.includes('exitosamente') ? 'success' : 'error'}`} data-testid="cert-msg">
              {msg}
            </div>
          )}
          {items.length === 0 ? (
            <div className="certificados-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
              <p>No hay certificados generados</p>
            </div>
          ) : (
            <table className="table certificados-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Participante</th>
                  <th>Actividad</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody data-testid="cert-list">
                {items.map((cert) => (
                  <tr key={cert.id}>
                    <td><span className="certificado-code">{cert.codigo_unico}</span></td>
                    <td>{cert.participante?.nombres} {cert.participante?.apellidos}</td>
                    <td>{cert.actividad?.nombre}</td>
                    <td>
                      <span className={`certificado-badge ${cert.estado?.toLowerCase() || 'generado'}`}>
                        {cert.estado || 'Generado'}
                      </span>
                    </td>
                    <td>{cert.created_at ? new Date(cert.created_at).toLocaleDateString() : '-'}</td>
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
