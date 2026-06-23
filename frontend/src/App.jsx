import React, { Suspense, lazy, memo, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { loadSession, clearSession, api } from './services/api.js';
import { ToastProvider } from './components/Toast.jsx';
import './styles/global.css';
import './components/Layout.css';

const Login = lazy(() => import('./pages/Login.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Actividades = lazy(() => import('./pages/Actividades.jsx'));
const Participantes = lazy(() => import('./pages/Participantes.jsx'));
const Plantillas = lazy(() => import('./pages/Plantillas.jsx'));
const Certificados = lazy(() => import('./pages/Certificados.jsx'));
const Configuracion = lazy(() => import('./pages/Configuracion.jsx'));
const Validar = lazy(() => import('./pages/Validar.jsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30000 },
  },
});

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
    </div>
  );
}

const Sidebar = memo(function Sidebar({ user, onLogout, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <div>
              <div className="sidebar-logo-text">CIP</div>
              <div className="sidebar-logo-subtitle">Certificados</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav" aria-label="Navegación principal">
          <div className="sidebar-section-label">Principal</div>
          <NavLink to="/" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </NavLink>
          <div className="sidebar-section-label">Gestión</div>
          <NavLink to="/actividades" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Actividades
          </NavLink>
          <NavLink to="/participantes" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Participantes
          </NavLink>
          <NavLink to="/plantillas" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Plantillas
          </NavLink>
          <NavLink to="/certificados" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            Certificados
          </NavLink>
          <div className="sidebar-section-label">Sistema</div>
          <NavLink to="/configuracion" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Configuración
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.nombre || 'Usuario'}</div>
              <div className="sidebar-user-role">{user?.rol || 'Staff'}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={onLogout} title="Cerrar sesión" aria-label="Cerrar sesión">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Cerrar menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </aside>
    </>
  );
});

function PrivateLayout({ children, onLogout }) {
  const { token, user } = loadSession();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!token) return <Navigate to="/login" replace />;

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={onLogout} isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="main-content">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen((o) => !o)} aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">{sidebarOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}</svg>
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  async function logout() {
    const { refreshToken } = loadSession();
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } catch { /* ignore */ }
    clearSession();
    window.location.href = '/login';
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <Suspense fallback={<PageLoader />}><Login /></Suspense>
        } />
        <Route path="/olvide-contrasena" element={
          <Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>
        } />
        <Route path="/restablecer-contrasena" element={
          <Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>
        } />
        <Route path="/validar" element={
          <Suspense fallback={<PageLoader />}><Validar /></Suspense>
        } />
        <Route path="/" element={
          <PrivateLayout onLogout={logout}>
            <Suspense fallback={<PageLoader />}><Dashboard onLogout={logout} /></Suspense>
          </PrivateLayout>
        } />
        <Route path="/actividades" element={
          <PrivateLayout onLogout={logout}>
            <Suspense fallback={<PageLoader />}><Actividades /></Suspense>
          </PrivateLayout>
        } />
        <Route path="/participantes" element={
          <PrivateLayout onLogout={logout}>
            <Suspense fallback={<PageLoader />}><Participantes /></Suspense>
          </PrivateLayout>
        } />
        <Route path="/plantillas" element={
          <PrivateLayout onLogout={logout}>
            <Suspense fallback={<PageLoader />}><Plantillas /></Suspense>
          </PrivateLayout>
        } />
        <Route path="/certificados" element={
          <PrivateLayout onLogout={logout}>
            <Suspense fallback={<PageLoader />}><Certificados /></Suspense>
          </PrivateLayout>
        } />
        <Route path="/configuracion" element={
          <PrivateLayout onLogout={logout}>
            <Suspense fallback={<PageLoader />}><Configuracion /></Suspense>
          </PrivateLayout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
