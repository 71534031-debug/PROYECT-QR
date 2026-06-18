import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api.js';
import './Validar.css';

export default function Validar() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const [animState, setAnimState] = useState('idle');

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = codigo.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResultado(null);
    setAnimState('loading');
    try {
      const { data } = await api.get(`/api/validacion/qr/${encodeURIComponent(trimmed)}`);
      if (data.success) {
        setResultado(data.data || data);
        setAnimState('success');
      } else {
        setError(data.message || 'Certificado no encontrado');
        setAnimState('error');
      }
    } catch (err) {
      if (err.response?.status === 404) setError('Certificado no encontrado');
      else if (err.response?.status === 400) setError('Código inválido');
      else setError('Error al validar. Intente nuevamente.');
      setAnimState('error');
    } finally { setLoading(false); }
  }, [codigo]);

  const handleClear = useCallback(() => {
    setCodigo('');
    setResultado(null);
    setError('');
    setAnimState('idle');
    inputRef.current?.focus();
  }, []);

  return (
    <div className="validar-page">
      <div className="validar-hero">
        <motion.div className="validar-hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {resultado?.logo_url && (
            <img src={resultado.logo_url} alt="Logo institucional" className="validar-hero-logo" />
          )}
          {!resultado?.logo_url && (
            <div className="validar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
            </div>
          )}
          <div className="validar-institution">{resultado?.institucion || 'Sistema de Validación de Certificados'}</div>
          <h1 className="validar-title">Validar Certificado</h1>
          <p className="validar-subtitle">Ingresa el código único del certificado para verificar su autenticidad</p>
        </motion.div>
      </div>

      <motion.div className="validar-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <form className="validar-form" onSubmit={handleSubmit} noValidate>
          <div className="validar-input-group">
            <label htmlFor="codigo" className="sr-only">Código único del certificado</label>
            <div className="validar-input-wrapper">
              <svg className="validar-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4V4a8 8 0 0 1 8 8v.5M12 20a8 8 0 0 1-8-8v-.5M4 12a8 8 0 0 1 8-8m0 16a8 8 0 0 1-8-8" /></svg>
              <input
                ref={inputRef}
                id="codigo"
                type="text"
                className="validar-input"
                placeholder="Ingrese el código único (ej: CERT-ABC123)"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                autoComplete="off"
                aria-describedby={error ? 'validar-error' : undefined}
                aria-invalid={!!error}
              />
              {codigo && (
                <button type="button" className="validar-input-clear" onClick={() => setCodigo('')} aria-label="Limpiar código">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          </div>
          <div className="validar-actions">
            <button type="submit" className="btn btn-primary validar-btn" disabled={loading || !codigo.trim()}>
              {loading ? <span className="spinner"></span> : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
                  Validar Certificado
                </>
              )}
            </button>
            {resultado && (
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                Nueva Validación
              </button>
            )}
          </div>
        </form>

        <AnimatePresence mode="wait">
          {animState === 'loading' && (
            <motion.div className="validar-loading" key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="validar-loading-spinner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
              <p>Verificando certificado...</p>
            </motion.div>
          )}

          {error && (
            <motion.div className="validar-result error" key="error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} id="validar-error" role="alert">
              <motion.div className="validar-result-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              </motion.div>
              <div className="validar-result-body">
                <h3 className="validar-result-title">Certificado NO Válido</h3>
                <p className="validar-result-message">{error}</p>
              </div>
            </motion.div>
          )}

          {resultado && (
            <motion.div className="validar-result success" key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <motion.div className="validar-result-icon" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
              </motion.div>
              <div className="validar-result-body">
                <h3 className="validar-result-title">Certificado Válido</h3>
                <p className="validar-result-message">El certificado ha sido verificado exitosamente</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {resultado && (
          <motion.div className="validar-details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            {resultado.institucion && (
              <div className="validar-detail-item">
                <span className="validar-detail-label">Institución</span>
                <span className="validar-detail-value">{resultado.institucion}</span>
              </div>
            )}
            <div className="validar-detail-item">
              <span className="validar-detail-label">Código</span>
              <span className="validar-detail-value code">{resultado.codigo_unico || resultado.codigo}</span>
            </div>
            {(resultado.participante_nombres || resultado.nombres) && (
              <div className="validar-detail-item">
                <span className="validar-detail-label">Participante</span>
                <span className="validar-detail-value">{resultado.participante_apellidos ? `${resultado.participante_apellidos}, ${resultado.participante_nombres}` : resultado.nombres}</span>
              </div>
            )}
            {(resultado.actividad_nombre || resultado.actividad) && (
              <div className="validar-detail-item">
                <span className="validar-detail-label">Actividad</span>
                <span className="validar-detail-value">{resultado.actividad_nombre || resultado.actividad}</span>
              </div>
            )}
            {resultado.fecha_emision && (
              <div className="validar-detail-item">
                <span className="validar-detail-label">Fecha de Emisión</span>
                <span className="validar-detail-value">{new Date(resultado.fecha_emision).toLocaleDateString()}</span>
              </div>
            )}
            {resultado.nombre_autoridad && (
              <div className="validar-detail-item">
                <span className="validar-detail-label">Autoridad</span>
                <span className="validar-detail-value">{resultado.nombre_autoridad}{resultado.cargo_autoridad ? ` — ${resultado.cargo_autoridad}` : ''}</span>
              </div>
            )}
            {resultado.estado && (
              <div className="validar-detail-item">
                <span className="validar-detail-label">Estado</span>
                <span className={`badge ${resultado.estado === 'EMITIDO' ? 'badge-success' : 'badge-danger'}`}>{resultado.estado === 'EMITIDO' ? 'VIGENTE' : resultado.estado}</span>
              </div>
            )}
            {(resultado.tipo_documento && resultado.numero_documento) && (
              <div className="validar-detail-item">
                <span className="validar-detail-label">Documento</span>
                <span className="validar-detail-value">{resultado.tipo_documento} {resultado.numero_documento}</span>
              </div>
            )}
          </motion.div>
        )}

        {resultado && animState === 'success' && (
          <motion.div className="validar-authenticity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Documento verificado electrónicamente
          </motion.div>
        )}

        {resultado && resultado.pdf_url && (
          <motion.div className="validar-download" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <a href={resultado.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Descargar PDF
            </a>
          </motion.div>
        )}
      </motion.div>

      {!resultado && !error && animState === 'idle' && (
        <motion.div className="validar-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="validar-info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            <p>El código único se encuentra impreso en el certificado físico o en el archivo PDF</p>
          </div>
          <div className="validar-info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <p>La validación es segura y confirma la autenticidad del documento emitido</p>
          </div>
          <div className="validar-info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <p>Los datos mostrados son verificados contra la base de datos oficial del sistema</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
