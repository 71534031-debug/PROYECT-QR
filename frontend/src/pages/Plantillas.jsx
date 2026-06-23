import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../services/api.js';
import './Plantillas.css';

const PLACEHOLDER_LABELS = {
  '{{NOMBRE_COMPLETO}}': 'Nombre Completo',
  '{{DOCUMENTO}}': 'Documento',
  '{{ACTIVIDAD_NOMBRE}}': 'Actividad',
  '{{FECHA_EMISION}}': 'Fecha Emisión',
  '{{CODIGO_UNICO}}': 'Código Único',
  '{{QR}}': 'Código QR',
  '{{LOGO_INSTITUCION}}': 'Logo',
  '{{NOMBRE_AUTORIDAD}}': 'Autoridad',
  '{{CARGO_AUTORIDAD}}': 'Cargo',
  '{{FIRMA_AUTORIDAD}}': 'Firma',
};

const DEFAULT_CAMPOS = Object.entries(PLACEHOLDER_LABELS).map(([placeholder, label], i) => ({
  placeholder, label,
  x: 50, y: 20 + i * 7,
  font_size: placeholder === '{{NOMBRE_COMPLETO}}' ? 28 : placeholder === '{{DOCUMENTO}}' ? 14 : 12,
  alignment: 'center',
  color: '#1a1a2e',
  width: placeholder === '{{QR}}' || placeholder === '{{LOGO_INSTITUCION}}' || placeholder === '{{FIRMA_AUTORIDAD}}' ? 100 : 300,
  height: placeholder === '{{QR}}' ? 100 : 28,
}));

function CampoDrag({ campo, index, selected, onSelect, onMove, onResize, onConfigChange, containerRef }) {
  const dragging = useRef(null);
  const elRef = useRef(null);

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCampo = { x: campo.x, y: campo.y, width: campo.width, height: campo.height };
    dragging.current = { type, startX, startY, startCampo };

    const handleMove = (ev) => {
      if (!dragging.current) return;
      const dx = ev.clientX - dragging.current.startX;
      const dy = ev.clientY - dragging.current.startY;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      if (dragging.current.type === 'move') {
        const pctX = (dx / rect.width) * 100;
        const pctY = (dy / rect.height) * 100;
        onMove(index, {
          x: Math.max(0, Math.min(100, dragging.current.startCampo.x + pctX)),
          y: Math.max(0, Math.min(100, dragging.current.startCampo.y + pctY)),
        });
      } else if (dragging.current.type === 'resize') {
        const pctW = (dx / rect.width) * 100;
        const pctH = (dy / rect.height) * 100;
        onResize(index, {
          width: Math.max(40, dragging.current.startCampo.width + pctW),
          height: Math.max(16, dragging.current.startCampo.height + pctH),
        });
      }
    };

    const handleUp = () => {
      dragging.current = null;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const isImg = campo.placeholder === '{{QR}}' || campo.placeholder === '{{LOGO_INSTITUCION}}' || campo.placeholder === '{{FIRMA_AUTORIDAD}}';

  return (
    <div
      ref={elRef}
      className={`plantilla-campo ${selected ? 'selected' : ''} ${isImg ? 'is-image' : ''}`}
      style={{
        left: `${campo.x}%`,
        top: `${campo.y}%`,
        width: `${campo.width}px`,
        height: `${campo.height}px`,
        fontSize: `${campo.font_size}px`,
        textAlign: campo.alignment,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      onClick={() => onSelect(index)}
    >
      {isImg ? (
        <div className="plantilla-campo-img-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          <span>{campo.label}</span>
        </div>
      ) : (
        <div className="plantilla-campo-label">{campo.label}</div>
      )}
      <div className="plantilla-campo-handle" onMouseDown={(e) => handleMouseDown(e, 'resize')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /></svg>
      </div>
    </div>
  );
}

export default function Plantillas() {
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState('');
  const [selectedPlantilla, setSelectedPlantilla] = useState(null);
  const [campos, setCampos] = useState(DEFAULT_CAMPOS);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imagenFondo, setImagenFondo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['plantillas'],
    queryFn: async () => { const { data } = await api.get('/api/plantillas'); return data.data || []; },
  });

  const createMutation = useMutation({
    mutationFn: (formData) => api.post('/api/plantillas', formData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['plantillas'] });
      const id = res.data?.data?.id;
      if (id && imagenFondo) {
        uploadImageMutation.mutate({ id, file: imagenFondo });
      }
      if (!imagenFondo && campos.length > 0) {
        camposMutation.mutate({ id, campos: campos.map(normalizeCampo) });
      }
      setNombre('');
      setImagenFondo(null);
      setImagenPreview(null);
      setSelectedPlantilla(null);
      setCampos(DEFAULT_CAMPOS);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || 'Error al crear plantilla';
      setError(msg);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ id, file }) => {
      const fd = new FormData();
      fd.append('imagen_fondo', file);
      const { data } = await api.post(`/api/plantillas/${id}/imagen`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (_, vars) => {
      if (campos.length > 0) {
        camposMutation.mutate({ id: vars.id, campos: campos.map(normalizeCampo) });
      }
      queryClient.invalidateQueries({ queryKey: ['plantillas'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || 'Error al subir imagen';
      setError(msg);
    },
  });

  const camposMutation = useMutation({
    mutationFn: ({ id, campos }) => api.put(`/api/plantillas/${id}/campos`, { campos }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantillas'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || 'Error al guardar posiciones';
      setError(msg);
    },
  });

  function normalizeCampo(c) {
    return {
      placeholder: c.placeholder,
      x: Math.round(c.x * 10) / 10,
      y: Math.round(c.y * 10) / 10,
      font_size: c.font_size,
      alignment: c.alignment,
      color: c.color,
      width: Math.round(c.width),
      height: Math.round(c.height),
    };
  }

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');
    if (selectedPlantilla) return;
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return; }
    createMutation.mutate({ nombre: nombre.trim() });
  }, [nombre, createMutation, selectedPlantilla]);

  const updateNameMutation = useMutation({
    mutationFn: ({ id, nombre }) => api.put(`/api/plantillas/${id}`, { nombre }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantillas'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || 'Error al actualizar nombre';
      setError(msg);
    },
  });

  const handleSave = useCallback(() => {
    if (!selectedPlantilla?.id) return;
    setError('');
    const id = selectedPlantilla.id;
    if (nombre.trim() && nombre.trim() !== selectedPlantilla.nombre) {
      updateNameMutation.mutate({ id, nombre: nombre.trim() });
    }
    if (imagenFondo) {
      uploadImageMutation.mutate({ id, file: imagenFondo });
    } else if (campos.length > 0) {
      camposMutation.mutate({ id, campos: campos.map(normalizeCampo) });
    }
  }, [selectedPlantilla, nombre, imagenFondo, campos]);

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar 10 MB');
      return;
    }
    setImagenFondo(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagenPreview(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleSelectPlantilla = useCallback(async (plantilla) => {
    setSelectedPlantilla(plantilla);
    setSelectedIndex(null);
    if (plantilla.imagen_fondo) {
      const baseUrl = '';
      setImagenPreview(`${baseUrl}/${plantilla.imagen_fondo}`);
    } else {
      setImagenPreview(null);
    }
    try {
      const { data } = await api.get(`/api/plantillas/${plantilla.id}`);
      if (data.data?.campos?.length > 0) {
        setCampos(data.data.campos.map((c) => ({ ...c, label: PLACEHOLDER_LABELS[c.placeholder] || c.placeholder })));
      } else {
        setCampos(DEFAULT_CAMPOS);
      }
    } catch {
      setCampos(DEFAULT_CAMPOS);
    }
  }, []);

  const handleNewPlantilla = useCallback(() => {
    setSelectedPlantilla(null);
    setImagenFondo(null);
    setImagenPreview(null);
    setCampos(DEFAULT_CAMPOS);
    setSelectedIndex(null);
    setNombre('');
    setError('');
  }, []);

  const handleMove = useCallback((index, pos) => {
    setCampos((prev) => prev.map((c, i) => i === index ? { ...c, ...pos } : c));
  }, []);

  const handleResize = useCallback((index, size) => {
    setCampos((prev) => prev.map((c, i) => i === index ? { ...c, ...size } : c));
  }, []);

  const handleSelect = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const handleConfigChange = useCallback((index, field, value) => {
    setCampos((prev) => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  }, []);

  const handleSaveCampos = useCallback(() => {
    if (!selectedPlantilla?.id) return;
    camposMutation.mutate({ id: selectedPlantilla.id, campos: campos.map(normalizeCampo) });
  }, [selectedPlantilla, campos, camposMutation]);

  const selectedCampo = selectedIndex !== null ? campos[selectedIndex] : null;

  return (
    <div className="plantillas-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Plantillas</h1>
          <p className="page-subtitle">Diseña la plantilla de tus certificados con imagen de fondo</p>
        </div>
        <div className="plantillas-header-actions">
          <button className="btn btn-secondary" onClick={handleNewPlantilla}>Nueva Plantilla</button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
          <button className="alert-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="plantillas-content">
        <div className="plantillas-sidebar">
          <motion.div className="plantillas-list-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="plantillas-list-header">
              <h2 className="plantillas-list-title">Plantillas</h2>
              <span className="plantillas-count">{items.length}</span>
            </div>
            {isLoading ? (
              <div className="table-skeleton">{[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 40, margin: 8, borderRadius: 6 }} />)}</div>
            ) : items.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem' }}>
                <p>No hay plantillas</p>
              </div>
            ) : (
              <div className="plantillas-list">
                {items.map((p) => (
                  <div
                    key={p.id}
                    className={`plantillas-list-item ${selectedPlantilla?.id === p.id ? 'active' : ''}`}
                    onClick={() => handleSelectPlantilla(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectPlantilla(p)}
                  >
                    <div className="plantillas-list-item-name">{p.nombre}</div>
                    <div className="plantillas-list-item-meta">
                      <span className={`badge ${p.activa ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>{p.activa ? 'Activa' : 'Inactiva'}</span>
                      <span className="plantillas-list-item-date">{p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div className="plantillas-form-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="plantillas-form-title">{selectedPlantilla ? 'Editar' : 'Nueva'} Plantilla</h2>
            <form className="plantillas-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre <span className="required">*</span></label>
                <input id="nombre" type="text" className="form-input" placeholder="Nombre descriptivo" value={nombre || selectedPlantilla?.nombre || ''} onChange={(e) => setNombre(e.target.value)} required aria-required="true" />
              </div>
              <div className="form-group">
                <label className="form-label">Imagen de fondo (PNG o JPG)</label>
                <div className="plantillas-upload-area" onClick={() => fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}>
                  {imagenPreview ? (
                    <img src={imagenPreview} alt="Vista previa" className="plantillas-upload-preview" />
                  ) : (
                    <div className="plantillas-upload-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      <span>Haz clic para seleccionar imagen</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} />
                <span className="form-hint">Recomendado: 800×600 píxeles o mayor. Máximo 10 MB.</span>
              </div>
              {!selectedPlantilla ? (
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={createMutation.isPending}>
                  {createMutation.isPending ? <span className="spinner"></span> : 'Crear Plantilla'}
                </button>
              ) : (
                <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave} disabled={createMutation.isPending}>
                  Guardar Cambios
                </button>
              )}
            </form>
          </motion.div>
        </div>

        <motion.div className="plantillas-editor-area" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          {(selectedPlantilla || imagenPreview) ? (
            <>
              <div className="plantillas-canvas-toolbar">
                <span className="plantillas-canvas-title">
                  {selectedPlantilla?.nombre || 'Nueva plantilla'}
                </span>
                <div className="plantillas-canvas-actions">
                  <button className="btn btn-sm btn-secondary" onClick={handleSaveCampos} disabled={camposMutation.isPending || !selectedPlantilla}>
                    {camposMutation.isPending ? <span className="spinner"></span> : 'Guardar Posiciones'}
                  </button>
                </div>
              </div>
              <div className="plantillas-canvas" ref={canvasRef}>
                {imagenPreview && (
                  <img src={imagenPreview} alt="Fondo" className="plantillas-canvas-bg" draggable={false} />
                )}
                {campos.map((campo, i) => (
                  <CampoDrag
                    key={campo.placeholder}
                    campo={campo}
                    index={i}
                    selected={selectedIndex === i}
                    onSelect={handleSelect}
                    onMove={handleMove}
                    onResize={handleResize}
                    onConfigChange={handleConfigChange}
                    containerRef={canvasRef}
                  />
                ))}
              </div>
              {selectedCampo && (
                <div className="plantillas-campo-config">
                  <span className="plantillas-campo-config-label">{selectedCampo.label}</span>
                  <div className="plantillas-campo-config-row">
                    <label>Tamaño: <input type="number" className="form-input" style={{ width: 60 }} value={selectedCampo.font_size} onChange={(e) => handleConfigChange(selectedIndex, 'font_size', Number(e.target.value))} /></label>
                    <label>Alineación:
                      <select className="form-select" style={{ width: 90 }} value={selectedCampo.alignment} onChange={(e) => handleConfigChange(selectedIndex, 'alignment', e.target.value)}>
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                      </select>
                    </label>
                    <label>Color: <input type="color" className="form-input" style={{ width: 50, padding: 2 }} value={selectedCampo.color} onChange={(e) => handleConfigChange(selectedIndex, 'color', e.target.value)} /></label>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="plantillas-editor-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              <h3>Editor de Plantillas</h3>
              <p>Selecciona una plantilla de la lista o crea una nueva para empezar a diseñar</p>
              <p className="text-tertiary" style={{ fontSize: '0.8rem', marginTop: 0 }}>Arrastra las cajas para posicionar los datos sobre el fondo</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
