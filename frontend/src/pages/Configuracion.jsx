import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api.js';
import DropZone from '../components/DropZone.jsx';
import { useToast } from '../components/Toast.jsx';
import './Configuracion.css';

const TABS = [
  { id: 'general', label: 'General', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { id: 'logos', label: 'Logo & Firma', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'qr', label: 'QR', icon: 'M12 4V4a8 8 0 018 8v.5M12 20a8 8 0 01-8-8v-.5M4 12a8 8 0 018-8m0 16a8 8 0 01-8-8' },
];

const initialForm = { nombre_institucion: '', cargo_autoridad: '', nombre_autoridad: '', nombre_app: 'Sistema QR', email_contacto: '', telefono_contacto: '', direccion: '' };

export default function Configuracion() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState(initialForm);
  const [logoPreview, setLogoPreview] = useState(null);
  const [firmaPreview, setFirmaPreview] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [firmaUploading, setFirmaUploading] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [firmaProgress, setFirmaProgress] = useState(0);
  const logoFileRef = useRef(null);
  const firmaFileRef = useRef(null);

  const { data: config = {}, isLoading } = useQuery({
    queryKey: ['configuracion'],
    queryFn: async () => {
      try { const { data } = await api.get('/api/configuracion'); return data.data || {}; }
      catch { return {}; }
    },
  });

  const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return `/${url.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    if (config.id) {
      setForm({
        nombre_institucion: config.nombre_institucion || '',
        cargo_autoridad: config.cargo_autoridad || '',
        nombre_autoridad: config.nombre_autoridad || '',
        nombre_app: config.nombre_app || 'Sistema QR',
        email_contacto: config.email_contacto || '',
        telefono_contacto: config.telefono_contacto || '',
        direccion: config.direccion || '',
      });
      setLogoPreview(resolveUrl(config.logo_url));
      setFirmaPreview(resolveUrl(config.firma_url));
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: (formData) => api.put('/api/configuracion', formData),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['configuracion'] }); toast.success('Configuración guardada exitosamente'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al guardar la configuración'),
  });

  const handleChange = useCallback((field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value })), []);
  const handleSave = useCallback((e) => { e.preventDefault(); saveMutation.mutate(form); }, [form, saveMutation]);

  const uploadLogo = useCallback(async (file) => {
    logoFileRef.current = file;
    setLogoUploading(true);
    setLogoProgress(0);
    const fd = new FormData();
    fd.append('logo', file);
    try {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
      const { data } = await api.post('/api/configuracion/logo', fd, {
        onUploadProgress: (e) => { if (e.total) setLogoProgress(Math.round((e.loaded / e.total) * 100)); },
      });
      queryClient.invalidateQueries({ queryKey: ['configuracion'] });
      setLogoProgress(100);
      if (data.url) setLogoPreview(`/${data.url.replace(/^\/+/, '')}`);
      setTimeout(() => { setLogoUploading(false); toast.success('Logo actualizado exitosamente'); }, 300);
    } catch (err) {
      setLogoUploading(false);
      toast.error('Error al subir el logo');
    }
  }, [queryClient, toast]);

  const uploadFirma = useCallback(async (file) => {
    firmaFileRef.current = file;
    setFirmaUploading(true);
    setFirmaProgress(0);
    const fd = new FormData();
    fd.append('firma', file);
    try {
      const reader = new FileReader();
      reader.onload = (ev) => setFirmaPreview(ev.target.result);
      reader.readAsDataURL(file);
      const { data } = await api.post('/api/configuracion/firma', fd, {
        onUploadProgress: (e) => { if (e.total) setFirmaProgress(Math.round((e.loaded / e.total) * 100)); },
      });
      queryClient.invalidateQueries({ queryKey: ['configuracion'] });
      setFirmaProgress(100);
      if (data.url) setFirmaPreview(`/${data.url.replace(/^\/+/, '')}`);
      setTimeout(() => { setFirmaUploading(false); toast.success('Firma actualizada exitosamente'); }, 300);
    } catch (err) {
      setFirmaUploading(false);
      toast.error('Error al subir la firma');
    }
  }, [queryClient, toast]);

  const deleteLogo = useCallback(async () => {
    try {
      await api.delete('/api/configuracion/logo');
      setLogoPreview(null);
      logoFileRef.current = null;
      queryClient.invalidateQueries({ queryKey: ['configuracion'] });
      toast.success('Logo eliminado');
    } catch (err) {
      toast.error('Error al eliminar el logo');
    }
  }, [queryClient, toast]);

  const deleteFirma = useCallback(async () => {
    try {
      await api.delete('/api/configuracion/firma');
      setFirmaPreview(null);
      firmaFileRef.current = null;
      queryClient.invalidateQueries({ queryKey: ['configuracion'] });
      toast.success('Firma eliminada');
    } catch (err) {
      toast.error('Error al eliminar la firma');
    }
  }, [queryClient, toast]);

  const TabIcon = ({ d }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

  return (
    <div className="configuracion-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Configuración</h1>
          <p className="page-subtitle">Personaliza los ajustes del sistema</p>
        </div>
      </div>

      <div className="configuracion-layout">
        <motion.div className="configuracion-tabs" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          {TABS.map((tab) => (
            <button key={tab.id} className={`configuracion-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)} role="tab" aria-selected={activeTab === tab.id} tabIndex={0}>
              <TabIcon d={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        <motion.div className="configuracion-panel" key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {isLoading ? (
            <div className="configuracion-skeleton">
              <div className="skeleton" style={{ width: '40%', height: 20, marginBottom: 16 }} />
              <div className="skeleton" style={{ width: '100%', height: 40, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: '100%', height: 40, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: '60%', height: 40 }} />
            </div>
          ) : activeTab === 'general' ? (
            <form className="configuracion-general-form" onSubmit={handleSave} noValidate>
              <h3 className="configuracion-section-title">Información General</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="nombre_institucion">Nombre de la institución <span className="required">*</span></label>
                <input id="nombre_institucion" type="text" className="form-input" value={form.nombre_institucion} onChange={handleChange('nombre_institucion')} placeholder="Colegio de Ingenieros del Perú" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nombre_autoridad">Nombre de la autoridad <span className="required">*</span></label>
                <input id="nombre_autoridad" type="text" className="form-input" value={form.nombre_autoridad} onChange={handleChange('nombre_autoridad')} placeholder="Ing. Juan Pérez Pérez" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cargo_autoridad">Cargo de la autoridad <span className="required">*</span></label>
                <input id="cargo_autoridad" type="text" className="form-input" value={form.cargo_autoridad} onChange={handleChange('cargo_autoridad')} placeholder="Decano" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nombre_app">Nombre de la aplicación</label>
                <input id="nombre_app" type="text" className="form-input" value={form.nombre_app} onChange={handleChange('nombre_app')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email_contacto">Email de contacto</label>
                <input id="email_contacto" type="email" className="form-input" value={form.email_contacto} onChange={handleChange('email_contacto')} placeholder="admin@cip.local" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="telefono_contacto">Teléfono de contacto</label>
                <input id="telefono_contacto" type="text" className="form-input" value={form.telefono_contacto} onChange={handleChange('telefono_contacto')} placeholder="+51 999 000 000" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="direccion">Dirección</label>
                <input id="direccion" type="text" className="form-input" value={form.direccion} onChange={handleChange('direccion')} placeholder="Av. Principal 123" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <span className="spinner"></span> : 'Guardar Cambios'}
              </button>
            </form>
          ) : activeTab === 'logos' ? (
            <div className="configuracion-logos">
              <div className="configuracion-logo-section">
                <h3 className="configuracion-section-title">Logo Institucional</h3>
                <DropZone
                  id="logo-upload"
                  label="Logo de la institución"
                  currentPreview={logoPreview}
                  onUpload={uploadLogo}
                  onDelete={deleteLogo}
                  uploading={logoUploading}
                  uploadProgress={logoProgress}
                />
              </div>
              <div className="configuracion-logo-section">
                <h3 className="configuracion-section-title">Firma de la Autoridad</h3>
                <DropZone
                  id="firma-upload"
                  label="Firma digital del representante"
                  currentPreview={firmaPreview}
                  onUpload={uploadFirma}
                  onDelete={deleteFirma}
                  uploading={firmaUploading}
                  uploadProgress={firmaProgress}
                />
              </div>
            </div>
          ) : (
            <div className="configuracion-qr-section">
              <h3 className="configuracion-section-title">Configuración de Códigos QR</h3>
              <p className="configuracion-qr-desc">Los certificados se generan con códigos QR únicos para validación. La configuración de tamaño, colores y estilos del QR se gestiona desde las plantillas HTML.</p>
              <div className="configuracion-qr-features">
                <div className="configuracion-qr-feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>QR único por certificado</span>
                </div>
                <div className="configuracion-qr-feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Validación en tiempo real</span>
                </div>
                <div className="configuracion-qr-feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Enlace directo a verificación</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
