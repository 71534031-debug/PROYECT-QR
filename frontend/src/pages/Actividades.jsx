import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api.js';
import './Actividades.css';

const TIPO_OPTIONS = ['Curso', 'Taller', 'Seminario', 'Simposio', 'Conferencia', 'Diplomado'];
const ITEMS_PER_PAGE = 8;

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

function TableSkeleton() {
  return (
    <div className="table-skeleton">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="table-skeleton-row">
          <div className="skeleton" style={{ width: '30%', height: 16 }} />
          <div className="skeleton" style={{ width: '20%', height: 16 }} />
          <div className="skeleton" style={{ width: '25%', height: 16 }} />
          <div className="skeleton" style={{ width: '15%', height: 16 }} />
        </div>
      ))}
    </div>
  );
}

export default function Actividades() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ nombre: '', tipo: 'Curso', descripcion: '', fecha_inicio: '', fecha_fin: '', responsable: '' });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('fecha_inicio');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [filterTipo, setFilterTipo] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['actividades'],
    queryFn: async () => {
      const { data } = await api.get('/api/actividades');
      return data.data || [];
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => api.post('/api/actividades', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actividades'] });
      setForm({ nombre: '', tipo: 'Curso', descripcion: '', fecha_inicio: '', fecha_fin: '', responsable: '' });
      setErrorMsg('');
    },
    onError: (err) => setErrorMsg(err.response?.data?.message || 'Error al guardar'),
  });

  const [errorMsg, setErrorMsg] = useState('');

  function toggleSort(column) {
    if (sortBy === column) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortDir('asc'); }
  }

  const filtered = useMemo(() => {
    let result = [...items];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((a) => a.nombre?.toLowerCase().includes(q) || a.responsable?.toLowerCase().includes(q));
    }
    if (filterTipo) result = result.filter((a) => a.tipo === filterTipo);
    result.sort((a, b) => {
      let va = a[sortBy] || '';
      let vb = b[sortBy] || '';
      if (sortBy === 'fecha_inicio' || sortBy === 'fecha_fin') {
        va = a[sortBy] || '';
        vb = b[sortBy] || '';
      }
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [items, debouncedSearch, filterTipo, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [debouncedSearch, filterTipo]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setErrorMsg('');
    mutation.mutate(form);
  }, [form, mutation]);

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <span className="sort-icon">↕</span>;
    return <span className={`sort-icon active ${sortDir}`}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="actividades-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Actividades</h1>
          <p className="page-subtitle">Gestiona los eventos y cursos del sistema</p>
        </div>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div className="alert alert-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert">
            {errorMsg}
            <button className="alert-close" onClick={() => setErrorMsg('')} aria-label="Cerrar">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="actividades-content">
        <motion.div className="actividades-form-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 80 }}>
          <h2 className="actividades-form-title">Nueva Actividad</h2>
          <form className="actividades-form" data-testid="actividad-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre <span className="required">*</span></label>
              <input id="nombre" data-testid="actividad-nombre" type="text" className="form-input" placeholder="Nombre de la actividad" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required aria-required="true" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tipo">Tipo</label>
              <select id="tipo" className="form-select" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>{TIPO_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}</select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" className="form-textarea" placeholder="Descripción opcional" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={2} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="fecha_inicio">Fecha inicio <span className="required">*</span></label>
                <input id="fecha_inicio" data-testid="actividad-fecha-inicio" type="date" className="form-input" value={form.fecha_inicio} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required aria-required="true" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fecha_fin">Fecha fin <span className="required">*</span></label>
                <input id="fecha_fin" data-testid="actividad-fecha-fin" type="date" className="form-input" value={form.fecha_fin} onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required aria-required="true" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="responsable">Responsable <span className="required">*</span></label>
              <input id="responsable" data-testid="actividad-responsable" type="text" className="form-input" placeholder="Nombre del responsable" value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} required aria-required="true" />
            </div>
            <button data-testid="actividad-submit" type="submit" className="btn btn-primary actividades-submit" disabled={mutation.isPending}>
              {mutation.isPending ? <span className="spinner"></span> : 'Guardar Actividad'}
            </button>
          </form>
        </motion.div>

        <motion.div className="actividades-list-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}>
          <div className="actividades-list-header">
            <h2 className="actividades-list-title">Lista de Actividades</h2>
            <span className="actividades-count">{filtered.length} actividades</span>
          </div>

          <div className="table-toolbar">
            <div className="table-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="search" placeholder="Buscar actividades..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Buscar actividades" />
            </div>
            <select className="form-select table-filter" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} aria-label="Filtrar por tipo">
              <option value="">Todos los tipos</option>
              {TIPO_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {isLoading ? <TableSkeleton /> : paged.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <p>{debouncedSearch ? 'No se encontraron actividades' : 'No hay actividades registradas'}</p>
            </div>
          ) : (
            <>
              <div className="actividades-table-wrapper">
              <table className="table actividades-table">
                <thead>
                  <tr>
                    <th onClick={() => toggleSort('nombre')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('nombre')} aria-sort={sortBy === 'nombre' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>Nombre <SortIcon column="nombre" /></th>
                    <th onClick={() => toggleSort('tipo')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('tipo')}>Tipo <SortIcon column="tipo" /></th>
                    <th onClick={() => toggleSort('fecha_inicio')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('fecha_inicio')}>Fechas <SortIcon column="fecha_inicio" /></th>
                    <th onClick={() => toggleSort('responsable')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('responsable')}>Responsable <SortIcon column="responsable" /></th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody data-testid="actividades-list">
                  <AnimatePresence>
                    {paged.map((a, i) => (
                      <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                        <td><strong>{a.nombre}</strong></td>
                        <td><span className={`badge badge-primary`}>{a.tipo}</span></td>
                        <td className="actividad-fecha">{new Date(a.fecha_inicio).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })} — {new Date(a.fecha_fin).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                        <td>{a.responsable}</td>
                        <td><span className="badge badge-success">{a.estado || 'Activo'}</span></td>
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
        </motion.div>
      </div>
    </div>
  );
}
