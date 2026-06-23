import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/export.js';
import Swal from 'sweetalert2';
import './Certificados.css';

const ITEMS_PER_PAGE = 8;

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

export default function Certificados() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [actividadId, setActividadId] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [previewItem, setPreviewItem] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const debouncedSearch = useDebounce(search);
  const [filterEstado, setFilterEstado] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const modalIframeRef = useRef(null);

  const { data: actividades = [] } = useQuery({
    queryKey: ['actividades'],
    queryFn: async () => { const { data } = await api.get('/api/actividades'); return data.data || []; },
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['certificados', actividadId],
    queryFn: async () => {
      if (!actividadId) return [];
      const { data } = await api.get('/api/certificados', { params: { actividad_id: actividadId } });
      return data.data || [];
    },
    enabled: !!actividadId,
  });

  const generarMutation = useMutation({
    mutationFn: () => api.post('/api/certificados/generar', { actividad_id: Number(actividadId), plantilla_id: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificados', actividadId] });
      toast.success('Certificados generados exitosamente');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al generar certificados'),
  });

  const cancelarMutation = useMutation({
    mutationFn: (ids) => api.post('/api/certificados/cancelar', { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificados', actividadId] });
      setSelected(new Set());
      toast.success('Certificados cancelados');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al cancelar'),
  });

  const toggleSort = useCallback((column) => {
    if (sortBy === column) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortDir('asc'); }
  }, [sortBy]);

  const filtered = useMemo(() => {
    let result = [...items];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((c) =>
        c.codigo_unico?.toLowerCase().includes(q) ||
        `${c.participante_nombres || ''} ${c.participante_apellidos || ''}`.toLowerCase().includes(q) ||
        (c.participante_documento || '').toLowerCase().includes(q) ||
        (c.actividad_nombre || '').toLowerCase().includes(q)
      );
    }
    if (filterEstado) result = result.filter((c) => c.estado === filterEstado);
    result.sort((a, b) => {
      let va = a[sortBy] || '';
      let vb = b[sortBy] || '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [items, debouncedSearch, filterEstado, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  useEffect(() => { setPage(1); }, [debouncedSearch, filterEstado]);

  const selectAll = useCallback((checked) => {
    if (checked) setSelected(new Set(paged.map((c) => c.id)));
    else setSelected(new Set());
  }, [paged]);

  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allSelected = paged.length > 0 && selected.size === paged.length;
  const someSelected = selected.size > 0;

  const handleBulkCancel = useCallback(async () => {
    if (selected.size === 0) return;
    const result = await Swal.fire({
      title: '¿Cancelar certificados?',
      text: `Se cancelarán ${selected.size} certificados. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    });
    if (result.isConfirmed) cancelarMutation.mutate([...selected]);
  }, [selected, cancelarMutation]);

  const getExportData = useCallback(() => filtered.map((c) => ({
    Código: c.codigo_unico,
    Participante: c.participante_apellidos ? `${c.participante_apellidos}, ${c.participante_nombres}` : '',
    DNI: c.participante_documento || '',
    Actividad: c.actividad_nombre || '',
    Estado: c.estado || '',
    Emisión: c.created_at ? new Date(c.created_at).toLocaleDateString() : '',
  })), [filtered]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(getExportData(), `certificados-${actividadId || 'all'}.csv`);
    toast.success('Archivo CSV exportado');
  }, [getExportData, actividadId, toast]);

  const handleExportExcel = useCallback(() => {
    exportToExcel(getExportData(), `certificados-${actividadId || 'all'}.xls`);
    toast.success('Archivo Excel exportado');
  }, [getExportData, actividadId, toast]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(`Certificados-${actividadId}`, (doc) => {
      doc.write('<h1>Lista de Certificados</h1>');
      doc.write('<table><thead><tr><th>Código</th><th>Participante</th><th>DNI</th><th>Actividad</th><th>Estado</th><th>Emisión</th></tr></thead><tbody>');
      for (const c of filtered) {
        doc.write(`<tr><td>${c.codigo_unico || ''}</td><td>${c.participante_apellidos ? `${c.participante_apellidos}, ${c.participante_nombres}` : ''}</td><td>${c.participante_documento || ''}</td><td>${c.actividad_nombre || ''}</td><td>${c.estado || ''}</td><td>${c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</td></tr>`);
      }
      doc.write('</tbody></table>');
    });
    toast.success('PDF generado para impresión');
  }, [filtered, actividadId, toast]);

  const handleViewPdf = useCallback((cert) => {
    const token = localStorage.getItem('access_token');
    if (!token) { toast.error('Sesión no disponible'); return; }
    window.open(`/api/certificados/${cert.id}/ver?token=${encodeURIComponent(token)}`, '_blank');
  }, [toast]);

  const handleDownloadPdf = useCallback(async (cert) => {
    try {
      const response = await api.get(`/api/certificados/${cert.id}/descargar`, { responseType: 'blob' });
      const disposition = response.headers['content-disposition'];
      let filename = `Certificado_${cert.id}.pdf`;
      if (disposition) {
        const match = disposition.match(/filename=(.+)/);
        if (match) filename = match[1].replace(/["']/g, '');
      }
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('PDF descargado');
    } catch (err) {
      toast.error('Error al descargar PDF');
    }
  }, [toast]);

  const handleOpenPreview = useCallback(async (cert) => {
    setPreviewItem(cert);
    setPdfBlobUrl(null);
    setPdfLoading(true);
    try {
      const response = await api.get(`/api/certificados/${cert.id}/descargar`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch {
      toast.error('Error al cargar PDF');
    } finally {
      setPdfLoading(false);
    }
  }, [toast]);

  const handleClosePreview = useCallback(() => {
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setPdfBlobUrl(null);
    setPreviewItem(null);
  }, [pdfBlobUrl]);

  const SortIcon = ({ column }) => <span className={`sort-icon ${sortBy === column ? 'active ' + sortDir : ''}`}>{sortBy === column ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>;

  const statusBadge = (estado) => {
    const map = { GENERADO: 'badge-success', VIGENTE: 'badge-success', EMITIDO: 'badge-success', CANCELADO: 'badge-danger', REVOCADO: 'badge-danger', EXPIRADO: 'badge-warning' };
    return <span className={`badge ${map[estado] || 'badge-info'}`}>{estado || 'PENDIENTE'}</span>;
  };

  return (
    <div className="certificados-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Certificados</h1>
          <p className="page-subtitle">Genera y gestiona los certificados de los participantes</p>
        </div>
      </div>

      <div className="certificados-toolbar">
        <div className="table-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="search" placeholder="Buscar por código, nombre, DNI o actividad..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Buscar certificados" disabled={!actividadId} />
        </div>
        <select className="form-select table-filter" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} aria-label="Filtrar por estado" disabled={!actividadId}>
          <option value="">Todos los estados</option>
          <option value="EMITIDO">Emitido</option>
          <option value="REVOCADO">Revocado</option>
          <option value="CANCELADO">Cancelado</option>
          <option value="EXPIRADO">Expirado</option>
        </select>
        <select className="form-select" value={actividadId} onChange={(e) => setActividadId(e.target.value)} aria-label="Seleccionar actividad">
          <option value="">Seleccionar actividad</option>
          {actividades.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => generarMutation.mutate()} disabled={!actividadId || generarMutation.isPending}>
          {generarMutation.isPending ? <span className="spinner"></span> : 'Generar Certificados'}
        </button>
        <button className="btn btn-secondary" onClick={handleExportCSV} disabled={!actividadId || filtered.length === 0}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          CSV
        </button>
        <button className="btn btn-secondary" onClick={handleExportExcel} disabled={!actividadId || filtered.length === 0}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="16" x2="16" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
          Excel
        </button>
        <button className="btn btn-secondary" onClick={handleExportPDF} disabled={!actividadId || filtered.length === 0}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          PDF
        </button>
      </div>

      <AnimatePresence>
        {someSelected && (
          <motion.div className="table-bulk-bar" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <span className="table-bulk-count">{selected.size} seleccionados</span>
            <button className="btn btn-sm btn-danger" onClick={handleBulkCancel} disabled={cancelarMutation.isPending}>
              {cancelarMutation.isPending ? <span className="spinner"></span> : 'Cancelar seleccionados'}
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => setSelected(new Set())}>Deseleccionar</button>
          </motion.div>
        )}
      </AnimatePresence>

      {!actividadId ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          <p>Selecciona una actividad para ver sus certificados</p>
        </div>
      ) : isLoading ? (
        <div className="table-skeleton">{[1,2,3,4].map((i) => <div key={i} className="table-skeleton-row"><div className="skeleton" style={{flex:0.3,height:16}}/><div className="skeleton" style={{flex:0.5,height:16}}/><div className="skeleton" style={{flex:1,height:16}}/><div className="skeleton" style={{flex:1,height:16}}/><div className="skeleton" style={{flex:0.5,height:16}}/><div className="skeleton" style={{flex:0.8,height:16}}/></div>)}</div>
      ) : paged.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          <p>{debouncedSearch ? 'No se encontraron certificados' : 'No hay certificados para esta actividad'}</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table certificados-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input type="checkbox" className="table-checkbox" checked={allSelected} onChange={(e) => selectAll(e.target.checked)} aria-label="Seleccionar todos" disabled={paged.length === 0} />
                  </th>
                  <th onClick={() => toggleSort('codigo_unico')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('codigo_unico')}>Código <SortIcon column="codigo_unico" /></th>
                  <th onClick={() => toggleSort('participante_apellidos')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('participante_apellidos')}>Participante <SortIcon column="participante_apellidos" /></th>
                  <th>DNI</th>
                  <th onClick={() => toggleSort('actividad_nombre')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('actividad_nombre')}>Actividad <SortIcon column="actividad_nombre" /></th>
                  <th onClick={() => toggleSort('created_at')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('created_at')}>Fecha Emisión <SortIcon column="created_at" /></th>
                  <th onClick={() => toggleSort('estado')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('estado')}>Estado <SortIcon column="estado" /></th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody data-testid="certificados-list">
                <AnimatePresence>
                  {paged.map((c, i) => (
                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }} className={selected.has(c.id) ? 'selected' : ''}>
                      <td>
                        <input type="checkbox" className="table-checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} aria-label={`Seleccionar certificado ${c.codigo_unico}`} />
                      </td>
                      <td className="certificado-codigo">{c.codigo_unico ? c.codigo_unico.slice(0, 8) + '...' : '—'}</td>
                      <td className="certificado-participante">
                        {c.participante_apellidos && c.participante_nombres
                          ? `${c.participante_nombres} ${c.participante_apellidos}`
                          : '—'}
                      </td>
                      <td className="certificado-doc">{c.participante_documento || '—'}</td>
                      <td className="certificado-actividad">{c.actividad_nombre || '—'}</td>
                      <td className="certificado-fecha">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                      <td>{statusBadge(c.estado)}</td>
                      <td>
                        <div className="certificado-acciones">
                          <button className="btn btn-sm btn-secondary" title="Ver PDF" onClick={() => handleViewPdf(c)} disabled={c.estado !== 'EMITIDO'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            Ver PDF
                          </button>
                          <button className="btn btn-sm btn-secondary" title="Descargar PDF" onClick={() => handleDownloadPdf(c)} disabled={c.estado !== 'EMITIDO'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Descargar
                          </button>
                          <button className="btn btn-sm btn-icon" title="Vista previa" onClick={() => handleOpenPreview(c)} disabled={c.estado !== 'EMITIDO'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" /></svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination" role="navigation" aria-label="Paginación">
              <button className="btn btn-sm btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</button>
              <span className="pagination-info">Página {page} de {totalPages}</span>
              <button className="btn btn-sm btn-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {previewItem && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClosePreview}>
            <motion.div className="modal-content certificados-preview-modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  Vista previa — {previewItem.participante_nombres} {previewItem.participante_apellidos}
                </h3>
                <button className="modal-close" onClick={handleClosePreview} aria-label="Cerrar">×</button>
              </div>
              <div className="modal-body certificados-preview-body">
                {pdfLoading ? (
                  <div className="certificados-preview-loading">
                    <span className="spinner"></span>
                    <p>Cargando PDF...</p>
                  </div>
                ) : pdfBlobUrl ? (
                  <iframe
                    ref={modalIframeRef}
                    src={pdfBlobUrl}
                    className="certificados-preview-iframe"
                    title="Vista previa del certificado"
                  />
                ) : (
                  <div className="certificados-preview-loading">
                    <p>No se pudo cargar el PDF</p>
                  </div>
                )}
              </div>
              <div className="modal-footer certificados-preview-footer">
                <div className="certificados-preview-info">
                  <span><strong>Código:</strong> {previewItem.codigo_unico}</span>
                  <span><strong>DNI:</strong> {previewItem.participante_documento || '—'}</span>
                  <span><strong>Actividad:</strong> {previewItem.actividad_nombre || '—'}</span>
                </div>
                <div className="certificados-preview-actions">
                  <button className="btn btn-secondary" onClick={handleClosePreview}>Cerrar</button>
                  <button className="btn btn-primary" onClick={() => { handleClosePreview(); handleViewPdf(previewItem); }}>Abrir en nueva pestaña</button>
                  <button className="btn btn-primary" onClick={() => { handleClosePreview(); handleDownloadPdf(previewItem); }}>Descargar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
