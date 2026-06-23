import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { api, loadSession } from '../services/api.js';
import './Dashboard.css';

const CIP_RED = '#8B1A1A';
const CIP_GOLD = '#C5954C';
const STAT_COLORS = [CIP_RED, '#059669', '#2563eb', CIP_GOLD, '#7c3aed', '#0891b2'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ backgroundColor: entry.color }} />
          <span className="chart-tooltip-name">{entry.name}:</span>
          <span className="chart-tooltip-value">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 80 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
    >
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="stat-card stat-skeleton">
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
      <div className="stat-content">
        <div className="skeleton" style={{ width: '55%', height: 12, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: '35%', height: 26 }} />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="chart-card">
      <div className="skeleton" style={{ width: '45%', height: 16, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 8 }} />
    </div>
  );
}

function ChartCard({ title, children, delay, wide }) {
  return (
    <motion.div
      className={`chart-card${wide ? ' chart-card-wide' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 60 }}
    >
      <h3 className="chart-card-title">{title}</h3>
      {children}
    </motion.div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="chart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
      </svg>
      <p>{message}</p>
    </div>
  );
}

export default function Dashboard({ onLogout }) {
  const { user } = loadSession();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [actividades, participantes, certificados, plantillas] = await Promise.all([
        api.get('/api/actividades'),
        api.get('/api/participantes'),
        api.get('/api/certificados'),
        api.get('/api/plantillas'),
      ]);
      const acts = actividades.data.data || [];
      const parts = participantes.data.data || [];
      const certs = certificados.data.data || [];
      const plants = plantillas.data.data || [];

      const activas = acts.filter((a) => a.estado === 'Activo' || !a.estado).length;
      const validados = certs.filter((c) => c.estado === 'entregado' || c.estado === 'Entregado' || c.estado === 'VIGENTE' || c.estado === 'GENERADO').length;
      const aptos = parts.filter((p) => p.estado_validacion === 'APTO').length;

      const actCounts = acts.reduce((acc, a) => {
        const tipo = a.tipo || 'Curso';
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {});
      const chartData = Object.entries(actCounts).map(([name, value]) => ({ name, value }));

      const certificadosPorEstado = certs.reduce((acc, c) => {
        const est = c.estado || 'DESCONOCIDO';
        acc[est] = (acc[est] || 0) + 1;
        return acc;
      }, {});
      const pieData = Object.entries(certificadosPorEstado).length > 0
        ? Object.entries(certificadosPorEstado).map(([name, value]) => ({ name, value }))
        : [{ name: 'Generados', value: certs.length }, { name: 'Entregados', value: validados }, { name: 'Pendientes', value: Math.max(0, certs.length - validados) }];

      const monthlyCerts = MONTHS.map((m, i) => ({
        month: m,
        certificados: certs.filter((c) => c.created_at && new Date(c.created_at).getMonth() === i).length,
      }));

      const monthlyParts = MONTHS.map((m, i) => ({
        month: m,
        participantes: parts.filter((p) => p.created_at && new Date(p.created_at).getMonth() === i).length,
      }));

      const topActividades = [...acts]
        .sort((a, b) => (b.participantes_count || 0) - (a.participantes_count || 0))
        .slice(0, 5)
        .map((a) => ({ name: a.nombre.length > 22 ? a.nombre.slice(0, 22) + '…' : a.nombre, participantes: a.participantes_count || 0 }));

      const combinedMonthly = MONTHS.map((m, i) => ({
        month: m,
        certificados: certs.filter((c) => c.created_at && new Date(c.created_at).getMonth() === i).length,
        participantes: parts.filter((p) => p.created_at && new Date(p.created_at).getMonth() === i).length,
      }));

      return {
        totalActividades: acts.length, totalParticipantes: parts.length,
        totalCertificados: certs.length, totalPlantillas: plants.length,
        activas, aptos, validados, chartData, pieData,
        monthlyCerts, monthlyParts, combinedMonthly, topActividades,
      };
    },
    refetchInterval: 30000,
  });

  const quickActions = [
    {
      to: '/actividades',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
      title: 'Gestionar Actividades',
      desc: 'Crea y administra eventos y cursos',
      color: CIP_RED,
    },
    {
      to: '/participantes',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
      title: 'Registrar Participantes',
      desc: 'Agrega participantes a tus actividades',
      color: '#059669',
    },
    {
      to: '/certificados',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
      title: 'Generar Certificados',
      desc: 'Crea certificados masivos para participantes',
      color: CIP_GOLD,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <motion.div className="dashboard-page" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="dashboard-hero" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 80 }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Hola, {user?.nombre || 'Usuario'}</h1>
            <p>Aquí está el resumen de tu actividad en el sistema</p>
          </div>
          <div className="hero-badge">{user?.rol || 'Staff'}</div>
        </div>
      </motion.div>

      <section className="section">
        <div className="section-title-row">
          <h2 className="section-title">Resumen General</h2>
        </div>
        <div className="stats-grid">
          {isLoading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            <>
              <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} label="Actividades" value={stats?.totalActividades || 0} color="primary" delay={0.1} />
              <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>} label="Participantes" value={stats?.totalParticipantes || 0} color="success" delay={0.15} />
              <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>} label="Certificados" value={stats?.totalCertificados || 0} color="info" delay={0.2} />
              <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>} label="Plantillas" value={stats?.totalPlantillas || 0} color="gold" delay={0.25} />
              <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Actividades Activas" value={stats?.activas || 0} color="success" delay={0.3} />
              <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>} label="Participantes APTO" value={stats?.aptos || 0} color="primary" delay={0.35} />
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-title-row">
          <h2 className="section-title">Analítica</h2>
        </div>
        <div className="charts-grid">
          <ChartCard title="Actividades por Tipo" delay={0.4}>
            {stats?.chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.chartData} margin={{ top: 8, right: 8, left: -10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 26, 26, 0.04)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
                    {stats.chartData.map((_, idx) => (
                      <Cell key={idx} fill={STAT_COLORS[idx % STAT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Sin datos de actividades" />}
          </ChartCard>

          <ChartCard title="Estado de Certificados" delay={0.45}>
            {stats?.pieData?.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                  <Pie data={stats.pieData} cx="50%" cy="45%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value"
                    label={({ name, percent, cx, cy, midAngle, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const r = outerRadius + 22;
                      const x = cx + r * Math.cos(-midAngle * RADIAN);
                      const y = cy + r * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fill="#374151" fontWeight={600}>
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }} labelLine={{ stroke: '#d1d5db', strokeWidth: 1 }}>
                    {stats.pieData.map((_, idx) => (
                      <Cell key={idx} fill={STAT_COLORS[idx % STAT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Sin certificados" />}
          </ChartCard>

          <ChartCard title="Tendencia Mensual de Certificados" delay={0.5} wide>
            {stats?.monthlyCerts?.some((d) => d.certificados > 0) ? (
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={stats.monthlyCerts} margin={{ top: 8, right: 8, left: -10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="certificados" stroke={CIP_RED} strokeWidth={2.5} dot={{ r: 3, fill: CIP_RED }} activeDot={{ r: 5, stroke: CIP_RED, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Sin datos mensuales" />}
          </ChartCard>

          <ChartCard title="Actividades más Exitosas" delay={0.55}>
            {stats?.topActividades?.length > 0 ? (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={stats.topActividades} layout="vertical" margin={{ top: 4, right: 12, left: -4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} width={110} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(5, 150, 105, 0.04)' }} />
                  <Bar dataKey="participantes" fill="#059669" radius={[0, 6, 6, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Sin datos de actividades" />}
          </ChartCard>

          <ChartCard title="Tendencia Mensual de Participantes" delay={0.6}>
            {stats?.monthlyParts?.some((d) => d.participantes > 0) ? (
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={stats.monthlyParts} margin={{ top: 8, right: 8, left: -10, bottom: 4 }}>
                  <defs>
                    <linearGradient id="partGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="participantes" stroke="#059669" strokeWidth={2.5} fill="url(#partGrad)" dot={{ r: 3, fill: '#059669' }} activeDot={{ r: 5, stroke: '#059669', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Sin datos mensuales" />}
          </ChartCard>

          <ChartCard title="Comparativa Mensual" delay={0.65} wide>
            {stats?.combinedMonthly?.some((d) => d.certificados > 0 || d.participantes > 0) ? (
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={stats.combinedMonthly} margin={{ top: 8, right: 8, left: -10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="certificados" stroke={CIP_RED} strokeWidth={2.5} dot={{ r: 3, fill: CIP_RED }} activeDot={{ r: 5, stroke: CIP_RED, strokeWidth: 2 }} name="Certificados" />
                  <Line type="monotone" dataKey="participantes" stroke="#059669" strokeWidth={2.5} dot={{ r: 3, fill: '#059669' }} activeDot={{ r: 5, stroke: '#059669', strokeWidth: 2 }} name="Participantes" />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Sin datos suficientes" />}
          </ChartCard>
        </div>
      </section>

      <section className="section">
        <div className="section-title-row">
          <h2 className="section-title">Acciones Rápidas</h2>
        </div>
        <div className="actions-grid">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.to}
              className="action-card"
              onClick={() => navigate(action.to)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 60 }}
              whileHover={{ y: -3, borderColor: action.color, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
              whileTap={{ scale: 0.98 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(action.to)}
              aria-label={action.title}
            >
              <div className="action-card-icon" style={{ color: action.color, backgroundColor: `${action.color}12` }}>
                {action.icon}
              </div>
              <div className="action-card-content">
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
