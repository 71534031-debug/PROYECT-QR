import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DropZone.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function DropZone({ id, label, currentPreview, onUpload, onDelete, uploading, uploadProgress }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(currentPreview || null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef(null);
  const wasUploading = useRef(false);

  useEffect(() => {
    if (uploading) wasUploading.current = true;
    if (!uploading && wasUploading.current && uploadProgress >= 100) {
      setSuccess('Imagen subida exitosamente');
      wasUploading.current = false;
      const t = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(t);
    }
  }, [uploading, uploadProgress]);

  useEffect(() => {
    setPreview(currentPreview || null);
  }, [currentPreview]);

  const validateFile = useCallback((file) => {
    if (!file) return 'No se seleccionó ningún archivo';
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
      return 'Formato no válido. Usa JPG, JPEG, PNG, WEBP o SVG';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `El archivo excede el tamaño máximo de ${MAX_SIZE_MB}MB`;
    }
    return '';
  }, []);

  const processFile = useCallback((file) => {
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setError('');
    setSuccess('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      if (onUpload) onUpload(file);
    };
    reader.readAsDataURL(file);
  }, [validateFile, onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => { setDragOver(false); }, []);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleReplace = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleDelete = useCallback(() => {
    setPreview(null);
    setError('');
    setSuccess('');
    if (onDelete) onDelete();
  }, [onDelete]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="dropzone-wrapper">
      <label className="dropzone-label">{label}</label>

      <div
        className={`dropzone-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!preview ? handleClick : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (!preview && (e.key === 'Enter' || e.key === ' ')) handleClick(); }}
        aria-label={`${label} - Arrastra una imagen o haz clic para seleccionar`}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          className="dropzone-input"
          aria-hidden="true"
          tabIndex={-1}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div className="dropzone-preview" key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <img src={preview} alt={`Vista previa de ${label}`} className="dropzone-preview-img" />
            </motion.div>
          ) : (
            <motion.div className="dropzone-placeholder" key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropzone-icon" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="dropzone-text">Arrastra una imagen aquí</p>
              <p className="dropzone-hint">o haz clic para seleccionar</p>
              <p className="dropzone-formats">JPG, JPEG, PNG, WEBP, SVG — Max {MAX_SIZE_MB}MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {uploading && (
        <div className="dropzone-progress-bar" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}>
          <div className="dropzone-progress-fill" style={{ width: `${uploadProgress}%` }} />
          <span className="dropzone-progress-text">{uploadProgress}%</span>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p className="dropzone-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p className="dropzone-success" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} role="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            {success}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview && (
          <motion.div className="dropzone-actions" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
            <button type="button" className="btn btn-sm btn-secondary" onClick={handleReplace} aria-label={`Reemplazar ${label}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
              Reemplazar
            </button>
            <button type="button" className="btn btn-sm btn-danger" onClick={handleDelete} aria-label={`Eliminar ${label}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              Eliminar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
