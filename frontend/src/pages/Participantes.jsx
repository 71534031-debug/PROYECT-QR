import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api.js';
import './Participantes.css';

const ITEMS_PER_PAGE = 8;

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

const emptyForm = () => ({ nombres: '', apellidos: '', tipo_documento: 'DNI', numero_documento: '', email: '' });

export default function Participantes() {
  const queryClient = useQueryClient();
  const [actividadId, setActividadId] = useState('');
  const [form, setForm] = useState(emptyForm());
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('apellidos');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [filterEstado, setFilterEstado] = useState('');

  const { data: actividades = [] } = useQuery({
    queryKey: ['actividades'],
    queryFn: async () => { const { data } = await api.get('/api/actividades'); return data.data || []; },
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['participantes', actividadId],
    queryFn: async () => {
      if (!actividadId) return [];
      const { data } = await api.get('/api/participantes', { params: { actividad_id: actividadId } });
      return data.data || [];
    },
    enabled: !!actividadId,
  });

  const createMutation = useMutation({
    mutationFn: (formData) => api.post('/api/participantes', formData),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['participantes', actividadId] }); setForm(emptyForm()); setErrorMsg(''); },
    onError: (err) => setErrorMsg(err.response?.data?.message || 'Error al guardar'),
  });

  const aptoMutation = useMutation({
    mutationFn: (participanteId) => api.post(`/api/participantes/${participanteId}/validar-apto`, { actividad_id: Number(actividadId) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['participantes', actividadId] }),
    onError: (err) => setErrorMsg(err.response?.data?.message || 'No se pudo validar'),
  });

  function toggleSort(column) {
    if (sortBy === column) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortDir('asc'); }
  }

  const filtered = useMemo(() => {
    let result = [...items];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((p) =>
        p.nombres?.toLowerCase().includes(q) || p.apellidos?.toLowerCase().includes(q) ||
        p.numero_documento?.includes(q) || p.email?.toLowerCase().includes(q)
      );
    }
    if (filterEstado) result = result.filter((p) => (p.estado_validacion || 'Pendiente') === filterEstado);
    result.sort((a, b) => {
      let va = (a[sortBy] || '').toLowerCase();
      let vb = (b[sortBy] || '').toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [items, debouncedSearch, filterEstado, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [debouncedSearch, filterEstado]);

  const handleCreate = useCallback((e) => {
    e.preventDefault();
    if (!actividadId) { setErrorMsg('Seleccione una actividad'); return; }
    setErrorMsg('');
    createMutation.mutate({ ...form, actividad_id: Number(actividadId) });
  }, [form, actividadId, createMutation]);

  const SortIcon = ({ column }) => <span className={`sort-icon ${sortBy === column ? 'active ' + sortDir : ''}`}>{sortBy === column ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>;

  const estadoBadge = (estado) => {
    const map = { APTO: 'badge-success', NO_APTO: 'badge-danger', REGISTRADO: 'badge-info', PENDIENTE_VALIDACION: 'badge-warning', CON_OBSERVACION: 'badge-warning' };
    const label = { APTO: 'APTO', NO_APTO: 'NO APTO', REGISTRADO: 'Registrado', PENDIENTE_VALIDACION: 'Pendiente Validación', CON_OBSERVACION: 'Con Observación' };
    return <span className={`badge ${map[estado] || 'badge-warning'}`}>{label[estado] || estado || 'Pendiente'}</span>;
  };

  return (
    <div className="participantes-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Participantes</h1>
          <p className="page-subtitle">Registra y gestiona participantes de tus actividades</p>
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

      <div className="participantes-content">
        <motion.div className="participantes-form-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="participantes-form-title">Nuevo Participante</h2>
          <div className="participante-select-actividad">
            <label className="form-label" htmlFor="actividad">Seleccionar Actividad <span className="required">*</span></label>
            <select id="actividad" data-testid="participantes-actividad" className="form-select" value={actividadId} onChange={(e) => setActividadId(e.target.value)} aria-required="true">
              <option value="">Seleccione una actividad</option>
              {actividades.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
          <form className="participantes-form" data-testid="participante-form" onSubmit={handleCreate} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="nombres">Nombres <span className="required">*</span></label>
              <input id="nombres" data-testid="participante-nombres" type="text" className="form-input" placeholder="Nombres" value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} required aria-required="true" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="apellidos">Apellidos <span className="required">*</span></label>
              <input id="apellidos" data-testid="participante-apellidos" type="text" className="form-input" placeholder="Apellidos" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required aria-required="true" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tipo_documento">Tipo documento</label>
              <select id="tipo_documento" data-testid="participante-tipo-doc" className="form-select" value={form.tipo_documento} onChange={(e) => setForm({ ...form, tipo_documento: e.target.value })}>
                <option value="DNI">DNI</option>
                <option value="CE">Carné de Extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="numero_documento">Número de documento <span className="required">*</span></label>
              <input id="numero_documento" data-testid="participante-numero-doc" type="text" className="form-input" placeholder="Número de documento" value={form.numero_documento} onChange={(e) => setForm({ ...form, numero_documento: e.target.value })} required aria-required="true" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo electrónico <span className="required">*</span></label>
              <input id="email" data-testid="participante-email" type="email" className="form-input" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required aria-required="true" />
            </div>
            <button data-testid="participante-submit" type="submit" className="btn btn-primary participantes-submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? <span className="spinner"></span> : 'Registrar Participante'}
            </button>
          </form>
        </motion.div>

        <motion.div className="participantes-list-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="participantes-list-header">
            <h2 className="participantes-list-title">Lista de Participantes</h2>
            <span className="participantes-count">{filtered.length} participantes</span>
          </div>

          <div className="table-toolbar">
            <div className="table-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="search" placeholder="Buscar participantes..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Buscar participantes" disabled={!actividadId} />
            </div>
            <select className="form-select table-filter" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} aria-label="Filtrar por estado" disabled={!actividadId}>
              <option value="">Todos los estados</option>
              <option value="APTO">APTO</option>
              <option value="NO_APTO">NO APTO</option>
              <option value="REGISTRADO">Registrado</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>

          {!actividadId ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              <p>Selecciona una actividad para ver los participantes</p>
            </div>
          ) : isLoading ? (
            <div className="table-skeleton">
              {[1,2,3,4].map((i) => <div key={i} className="table-skeleton-row"><div className="skeleton" style={{flex:1,height:16}}/><div className="skeleton" style={{flex:1,height:16}}/><div className="skeleton" style={{flex:1,height:16}}/><div className="skeleton" style={{flex:1.5,height:16}}/><div className="skeleton" style={{flex:0.8,height:16}}/><div className="skeleton" style={{flex:0.8,height:16}}/></div>)}
            </div>
          ) : paged.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              <p>{debouncedSearch ? 'No se encontraron participantes' : 'No hay participantes registrados'}</p>
            </div>
          ) : (
            <>
              <table className="table participantes-table">
                <thead>
                  <tr>
                    <th onClick={() => toggleSort('nombres')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('nombres')}>Nombres <SortIcon column="nombres" /></th>
                    <th onClick={() => toggleSort('apellidos')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('apellidos')}>Apellidos <SortIcon column="apellidos" /></th>
                    <th>Documento</th>
                    <th>Email</th>
                    <th onClick={() => toggleSort('estado_validacion')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleSort('estado_validacion')}>Estado <SortIcon column="estado_validacion" /></th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody data-testid="participantes-list">
                  {paged.map((p) => (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td>{p.nombres}</td>
                      <td>{p.apellidos}</td>
                      <td className="participante-doc">{p.tipo_documento} {p.numero_documento}</td>
                      <td className="participante-email">{p.email}</td>
                      <td>{estadoBadge(p.estado_validacion)}</td>
                      <td>
                        <button
                          type="button"
                          data-testid={`participante-apto-${p.id}`}
                          className={`participante-btn validate${p.estado_validacion === 'PENDIENTE_VALIDACION' ? ' pending' : ''}`}
                          onClick={() => aptoMutation.mutate(p.id)}
                          disabled={p.estado_validacion === 'APTO' || aptoMutation.isPending}
                        >
                          {aptoMutation.isPending ? <span className="spinner" style={{width:14,height:14}}></span> : 'Marcar APTO'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
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
