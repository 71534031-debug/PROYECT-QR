import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { api, loadSession } from '../services/api.js';
import './Dashboard.css';

const COLORS = ['#b91c1c', '#059669', '#d97706', '#2563eb', '#7c3aed', '#0891b2'];
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

function StatCard({ icon, label, value, color, delay, trend }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 80 }}
      whileHover={{ y: -3, boxShadow: 'var(--shadow-lg)' }}
    >
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trend !== undefined && (
          <div className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" aria-hidden="true">
              {trend >= 0 ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
            </svg>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)' }} />
      <div className="stat-content">
        <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: '40%', height: 28 }} />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="dashboard-chart-card">
      <div className="skeleton" style={{ width: '50%', height: 18, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: '100%', height: 200 }} />
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

      const pieData = [
        { name: 'Generados', value: certs.length },
        { name: 'Entregados', value: validados },
        { name: 'Pendientes', value: Math.max(0, certs.length - validados) },
      ];

      const monthlyCerts = MONTHS.map((m, i) => {
        const count = certs.filter((c) => {
          if (!c.created_at) return false;
          const d = new Date(c.created_at);
          return d.getMonth() === i;
        }).length;
        return { month: m, certificados: count };
      });

      const monthlyParts = MONTHS.map((m, i) => {
        const count = parts.filter((p) => {
          if (!p.created_at) return false;
          const d = new Date(p.created_at);
          return d.getMonth() === i;
        }).length;
        return { month: m, participantes: count };
      });

      const topActividades = [...acts]
        .sort((a, b) => (b.participantes_count || 0) - (a.participantes_count || 0))
        .slice(0, 5)
        .map((a) => ({ name: a.nombre.length > 25 ? a.nombre.slice(0, 25) + '…' : a.nombre, participantes: a.participantes_count || 0 }));

      const certificadosPorEstado = certs.reduce((acc, c) => {
        const est = c.estado || 'DESCONOCIDO';
        acc[est] = (acc[est] || 0) + 1;
        return acc;
      }, {});
      const pieEstadoData = Object.entries(certificadosPorEstado).map(([name, value]) => ({ name, value }));

      const combinedMonthly = MONTHS.map((m, i) => ({
        month: m,
        certificados: certs.filter((c) => { if (!c.created_at) return false; const d = new Date(c.created_at); return d.getMonth() === i; }).length,
        participantes: parts.filter((p) => { if (!p.created_at) return false; const d = new Date(p.created_at); return d.getMonth() === i; }).length,
      }));

      return {
        totalActividades: acts.length,
        totalParticipantes: parts.length,
        totalCertificados: certs.length,
        totalPlantillas: plants.length,
        activas,
        aptos,
        validados,
        chartData,
        pieData: pieEstadoData.length > 0 ? pieEstadoData : pieData,
        monthlyCerts,
        monthlyParts,
        combinedMonthly,
        topActividades,
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
    },
    {
      to: '/participantes',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
      title: 'Registrar Participantes',
      desc: 'Agrega participantes a tus actividades',
    },
    {
      to: '/certificados',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
      title: 'Generar Certificados',
      desc: 'Crea certificados masivos para participantes',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <motion.div className="dashboard-page" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        className="dashboard-welcome"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
      >
        <h1>Hola, {user?.nombre || 'Usuario'}</h1>
        <p>Aquí está el resumen de tu actividad en el sistema</p>
        <div className="dashboard-welcome-badges">
          <span className="user-role">{user?.rol || 'Staff'}</span>
        </div>
      </motion.div>

      <div className="dashboard-stats">
        {isLoading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : (
          <>
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} label="Actividades" value={stats?.totalActividades || 0} color="primary" delay={0.1} trend={12} />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>} label="Participantes" value={stats?.totalParticipantes || 0} color="success" delay={0.15} trend={8} />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>} label="Certificados" value={stats?.totalCertificados || 0} color="info" delay={0.2} trend={15} />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>} label="Plantillas" value={stats?.totalPlantillas || 0} color="warning" delay={0.25} />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Actividades Activas" value={stats?.activas || 0} color="success" delay={0.3} />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>} label="Participantes APTO" value={stats?.aptos || 0} color="primary" delay={0.35} />
          </>
        )}
      </div>

      <div className="dashboard-charts dashboard-charts-grid">
        <motion.div className="dashboard-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="dashboard-chart-title">Actividades por Tipo</h3>
          {stats?.chartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(185, 28, 28, 0.04)' }} />
                <Bar dataKey="value" fill="#b91c1c" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {stats.chartData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>Sin datos</p></div>
          )}
        </motion.div>

        <motion.div className="dashboard-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h3 className="dashboard-chart-title">Estado de Certificados</h3>
          {stats?.pieData?.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {stats.pieData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>Sin certificados</p></div>
          )}
        </motion.div>

        <motion.div className="dashboard-chart-card dashboard-chart-wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="dashboard-chart-title">Tendencia Mensual de Certificados</h3>
          {stats?.monthlyCerts?.some((d) => d.certificados > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.monthlyCerts} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="certificados" stroke="#b91c1c" strokeWidth={2} dot={{ r: 3, fill: '#b91c1c' }} activeDot={{ r: 5, stroke: '#b91c1c', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>Sin datos mensuales</p></div>
          )}
        </motion.div>

        <motion.div className="dashboard-chart-card dashboard-chart-wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <h3 className="dashboard-chart-title">Actividades más Exitosas</h3>
          {stats?.topActividades?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.topActividades} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} width={120} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(5, 150, 105, 0.04)' }} />
                <Bar dataKey="participantes" fill="#059669" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>Sin datos de actividades</p></div>
          )}
        </motion.div>

        <motion.div className="dashboard-chart-card dashboard-chart-wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h3 className="dashboard-chart-title">Tendencia Mensual de Participantes</h3>
          {stats?.monthlyParts?.some((d) => d.participantes > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.monthlyParts} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="partGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="participantes" stroke="#059669" strokeWidth={2} fill="url(#partGrad)" dot={{ r: 3, fill: '#059669' }} activeDot={{ r: 5, stroke: '#059669', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>Sin datos mensuales</p></div>
          )}
        </motion.div>

        <motion.div className="dashboard-chart-card dashboard-chart-wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <h3 className="dashboard-chart-title">Comparativa Mensual</h3>
          {stats?.combinedMonthly?.some((d) => d.certificados > 0 || d.participantes > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.combinedMonthly} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="certificados" stroke="#b91c1c" strokeWidth={2} dot={{ r: 3, fill: '#b91c1c' }} activeDot={{ r: 5, stroke: '#b91c1c', strokeWidth: 2 }} name="Certificados" />
                <Line type="monotone" dataKey="participantes" stroke="#059669" strokeWidth={2} dot={{ r: 3, fill: '#059669' }} activeDot={{ r: 5, stroke: '#059669', strokeWidth: 2 }} name="Participantes" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>Sin datos suficientes</p></div>
          )}
        </motion.div>
      </div>

      <div className="dashboard-actions">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.to}
            className="action-card"
            onClick={() => navigate(action.to)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(action.to)}
            aria-label={action.title}
          >
            <div className="action-card-icon">{action.icon}</div>
            <div className="action-card-content">
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
