import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api.js';
import { REQUIRED_PLACEHOLDERS } from '../shared/requiredPlaceholders.js';
import './Plantillas.css';

const DEFAULT_HTML = `<div style="text-align: center; padding: 40px;">
  <img src="{{LOGO_INSTITUCION}}" alt="Logo" style="max-width: 120px;" />
  <h1>CERTIFICADO</h1>
  <p>Otorgado a:</p>
  <h2>{{NOMBRE_COMPLETO}}</h2>
  <p>Con documento {{DOCUMENTO}}</p>
  <p>Por su participación en: <strong>{{ACTIVIDAD_NOMBRE}}</strong></p>
  <p>Código único: {{CODIGO_UNICO}}</p>
  <p>Fecha de emisión: {{FECHA_EMISION}}</p>
  <div>{{QR}}</div>
  <p>{{NOMBRE_AUTORIDAD}}</p>
  <p>{{CARGO_AUTORIDAD}}</p>
  <img src="{{FIRMA_AUTORIDAD}}" alt="Firma" style="max-width: 150px;" />
</div>`;

export default function Plantillas() {
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState('Plantilla base');
  const [contenido, setContenido] = useState(DEFAULT_HTML);
  const [preview, setPreview] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['plantillas'],
    queryFn: async () => { const { data } = await api.get('/api/plantillas'); return data.data || []; },
  });

  const mutation = useMutation({
    mutationFn: (formData) => api.post('/api/plantillas', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantillas'] });
      setNombre('Plantilla base');
      setContenido(DEFAULT_HTML);
    },
  });

  const handleSubmit = useCallback((e) => { e.preventDefault(); mutation.mutate({ nombre, contenido }); }, [nombre, contenido, mutation]);
  const handlePreview = useCallback(() => setPreview((p) => !p), []);

  return (
    <div className="plantillas-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Plantillas</h1>
          <p className="page-subtitle">Diseña las plantillas HTML para tus certificados</p>
        </div>
      </div>

      <div className="plantillas-content">
        <motion.div className="plantillas-form-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="plantillas-form-title">Nueva Plantilla</h2>
          <form className="plantillas-form" data-testid="plantilla-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre de la plantilla <span className="required">*</span></label>
              <input id="nombre" data-testid="plantilla-nombre" type="text" className="form-input" placeholder="Nombre descriptivo" value={nombre} onChange={(e) => setNombre(e.target.value)} required aria-required="true" />
              <span className="form-hint">Usa un nombre que identifique fácilmente esta plantilla</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contenido">Contenido HTML <span className="required">*</span></label>
              <textarea id="contenido" data-testid="plantilla-contenido" className="form-textarea" placeholder="Contenido HTML con placeholders" value={contenido} onChange={(e) => setContenido(e.target.value)} required aria-required="true" rows={10} />
              <span className="form-hint">Placeholders disponibles: {REQUIRED_PLACEHOLDERS.join(', ')}</span>
            </div>
            <div className="plantillas-help">
              <div className="plantillas-help-title">Placeholders requeridos</div>
              <ul className="plantillas-help-list">
                {REQUIRED_PLACEHOLDERS.map((p) => <li key={p}><code>{p}</code></li>)}
              </ul>
            </div>
            <div className="plantillas-btns">
              <button data-testid="plantilla-submit" type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                {mutation.isPending ? <span className="spinner"></span> : 'Guardar Plantilla'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handlePreview}>{preview ? 'Ocultar' : 'Vista Previa'}</button>
            </div>
          </form>
        </motion.div>

        {preview && (
          <motion.div className="plantillas-preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="plantillas-preview-title">Vista previa</h3>
            <div className="plantillas-preview-content" dangerouslySetInnerHTML={{ __html: contenido }} />
          </motion.div>
        )}

        <motion.div className="plantillas-list-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="plantillas-list-header">
            <h2 className="plantillas-list-title">Plantillas Guardadas</h2>
            <span className="plantillas-count">{items.length} plantillas</span>
          </div>
          {isLoading ? (
            <div className="table-skeleton">{[1,2,3].map((i) => <div key={i} className="table-skeleton-row"><div className="skeleton" style={{flex:1,height:16}}/><div className="skeleton" style={{flex:1,height:16}}/><div className="skeleton" style={{flex:0.6,height:16}}/></div>)}</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              <p>No hay plantillas guardadas</p>
            </div>
          ) : (
            <table className="table plantillas-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Activa</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody data-testid="plantillas-list">
                {items.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <td><span className="plantilla-name">{p.nombre}</span></td>
                    <td><span className={`badge ${p.activa ? 'badge-success' : 'badge-warning'}`}>{p.activa ? 'Sí' : 'No'}</span></td>
                    <td className="plantilla-fecha">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </div>
  );
}
