import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const debouncedSearch = useDebounce(search);
  const [filterEstado, setFilterEstado] = useState('');

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
    mutationFn: () => api.post('/api/certificados/generar', { actividad_id: Number(actividadId) }),
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
        c.participante_nombres?.toLowerCase().includes(q) ||
        c.participante_apellidos?.toLowerCase().includes(q)
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

  useEffect(() => {
    if (statusMessage.text) { const t = setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000); return () => clearTimeout(t); }
  }, [statusMessage]);

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
    Documento: c.participante_documento || '',
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
      doc.write('<table><thead><tr><th>Código</th><th>Participante</th><th>Documento</th><th>Estado</th><th>Emisión</th></tr></thead><tbody>');
      for (const c of filtered) {
        doc.write(`<tr><td>${c.codigo_unico || ''}</td><td>${c.participante_apellidos ? `${c.participante_apellidos}, ${c.participante_nombres}` : ''}</td><td>${c.participante_documento || ''}</td><td>${c.estado || ''}</td><td>${c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</td></tr>`);
      }
      doc.write('</tbody></table>');
    });
    toast.success('PDF generado para impresión');
  }, [filtered, actividadId, toast]);

  const SortIcon = ({ column }) => <span className={`sort-icon ${sortBy === column ? 'active ' + sortDir : ''}`}>{sortBy === column ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>;

  const statusBadge = (estado) => {
    const map = { GENERADO: 'badge-success', VIGENTE: 'badge-success', CANCELADO: 'badge-danger', EXPIRADO: 'badge-warning' };
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
          <input type="search" placeholder="Buscar por código, nombre..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Buscar certificados" disabled={!actividadId} />
        </div>
        <select className="form-select table-filter" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} aria-label="Filtrar por estado" disabled={!actividadId}>
          <option value="">Todos los estados</option>
          <option value="GENERADO">Generado</option>
          <option value="VIGENTE">Vigente</option>
          <option value="CANCELADO">Cancelado</option>
          <option value="EXPIRADO">Expirado</option>
        </select>
        <select className="form-select" value={actividadId} onChange={(e) => setActividadId(e.target.value)} aria-label="Seleccionar actividad">
          <option value="">Todas las actividades</option>
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
                  <th onClick={() => toggleSort('participante_nombres')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('participante_nombres')}>Participante <SortIcon column="participante_nombres" /></th>
                  <th>Documento</th>
                  <th onClick={() => toggleSort('estado')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('estado')}>Estado <SortIcon column="estado" /></th>
                  <th onClick={() => toggleSort('created_at')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('created_at')}>Emisión <SortIcon column="created_at" /></th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody data-testid="certificados-list">
                <AnimatePresence>
                  {paged.map((c, i) => (
                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }} className={selected.has(c.id) ? 'selected' : ''}>
                      <td>
                        <input type="checkbox" className="table-checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} aria-label={`Seleccionar certificado ${c.codigo_unico}`} />
                      </td>
                      <td className="certificado-codigo">{c.codigo_unico}</td>
                      <td className="certificado-participante">
                        {c.participante_apellidos && c.participante_nombres
                          ? `${c.participante_apellidos}, ${c.participante_nombres}`
                          : '—'}
                      </td>
                      <td className="certificado-doc">{c.participante_documento || '—'}</td>
                      <td>{statusBadge(c.estado)}</td>
                      <td className="certificado-fecha">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => setPreviewItem(c)}>Ver</button>
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
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewItem(null)}>
            <motion.div className="modal-content certificados-modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Certificado</h3>
                <button className="modal-close" onClick={() => setPreviewItem(null)} aria-label="Cerrar">×</button>
              </div>
              <div className="modal-body">
                <div className="certificados-modal-info">
                  <div className="certificados-modal-field">
                    <span className="certificados-modal-label">Código:</span>
                    <span className="certificados-modal-value">{previewItem.codigo_unico}</span>
                  </div>
                  <div className="certificados-modal-field">
                    <span className="certificados-modal-label">Participante:</span>
                    <span className="certificados-modal-value">{previewItem.participante_apellidos}, {previewItem.participante_nombres}</span>
                  </div>
                  <div className="certificados-modal-field">
                    <span className="certificados-modal-label">Documento:</span>
                    <span className="certificados-modal-value">{previewItem.participante_documento || '—'}</span>
                  </div>
                  <div className="certificados-modal-field">
                    <span className="certificados-modal-label">Estado:</span>
                    <span className="certificados-modal-value">{statusBadge(previewItem.estado)}</span>
                  </div>
                  <div className="certificados-modal-field">
                    <span className="certificados-modal-label">Emisión:</span>
                    <span className="certificados-modal-value">{previewItem.created_at ? new Date(previewItem.created_at).toLocaleString() : '—'}</span>
                  </div>
                  {previewItem.updated_at && (
                    <div className="certificados-modal-field">
                      <span className="certificados-modal-label">Última modificación:</span>
                      <span className="certificados-modal-value">{new Date(previewItem.updated_at).toLocaleString()}</span>
                    </div>
                  )}
                  {previewItem.qr_url && (
                    <div className="certificados-modal-field">
                      <span className="certificados-modal-label">QR:</span>
                      <a href={previewItem.qr_url} target="_blank" rel="noopener noreferrer" className="certificados-modal-link">Descargar QR</a>
                    </div>
                  )}
                  {previewItem.pdf_url && (
                    <div className="certificados-modal-field">
                      <span className="certificados-modal-label">PDF:</span>
                      <a href={previewItem.pdf_url} target="_blank" rel="noopener noreferrer" className="certificados-modal-link">Abrir PDF</a>
                    </div>
                  )}
                </div>
                <div className="certificados-modal-history">
                  <h4 className="certificados-history-title">Historial</h4>
                  <div className="certificados-history-item">
                    <div className="certificados-history-dot" />
                    <div className="certificados-history-content">
                      <span className="certificados-history-action">Creado</span>
                      <span className="certificados-history-date">{previewItem.created_at ? new Date(previewItem.created_at).toLocaleString() : '—'}</span>
                    </div>
                  </div>
                  {previewItem.updated_at && previewItem.updated_at !== previewItem.created_at && (
                    <div className="certificados-history-item">
                      <div className="certificados-history-dot modified" />
                      <div className="certificados-history-content">
                        <span className="certificados-history-action">Modificado</span>
                        <span className="certificados-history-date">{new Date(previewItem.updated_at).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
