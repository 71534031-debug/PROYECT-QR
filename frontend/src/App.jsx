import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Actividades from './pages/Actividades.jsx';
import Participantes from './pages/Participantes.jsx';
import Plantillas from './pages/Plantillas.jsx';
import Certificados from './pages/Certificados.jsx';
import Configuracion from './pages/Configuracion.jsx';
import Validar from './pages/Validar.jsx';
import { loadSession, clearSession, api } from './services/api.js';
import './styles/global.css';
import './components/Layout.css';

function PrivateLayout({ children }) {
  const { token, user } = loadSession();
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <div>
              <div className="sidebar-logo-text">CIP</div>
              <div className="sidebar-logo-subtitle">Certificados</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`} end>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink to="/actividades" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Actividades
          </NavLink>
          <NavLink to="/participantes" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Participantes
          </NavLink>
          <NavLink to="/plantillas" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Plantillas
          </NavLink>
          <NavLink to="/certificados" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            Certificados
          </NavLink>
          <NavLink to="/configuracion" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Configuración
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.nombre || 'Usuario'}</div>
              <div className="sidebar-user-role">{user?.rol || 'Staff'}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={children.props.onLogout} title="Cerrar sesión">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function App() {
  const [, setTick] = useState(0);
  useEffect(() => {
    loadSession();
    setTick((x) => x + 1);
  }, []);

  async function logout() {
    const { refreshToken } = loadSession();
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } catch {
      /* ignore */
    }
    clearSession();
    window.location.href = '/login';
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/olvide-contrasena" element={<ForgotPassword />} />
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />
      <Route path="/validar" element={<Validar />} />
      <Route
        path="/"
        element={
          <PrivateLayout>
            <Dashboard onLogout={logout} />
          </PrivateLayout>
        }
      />
      <Route
        path="/actividades"
        element={
          <PrivateLayout>
            <Actividades />
          </PrivateLayout>
        }
      />
      <Route
        path="/participantes"
        element={
          <PrivateLayout>
            <Participantes />
          </PrivateLayout>
        }
      />
      <Route
        path="/plantillas"
        element={
          <PrivateLayout>
            <Plantillas />
          </PrivateLayout>
        }
      />
      <Route
        path="/certificados"
        element={
          <PrivateLayout>
            <Certificados />
          </PrivateLayout>
        }
      />
      <Route
        path="/configuracion"
        element={
          <PrivateLayout>
            <Configuracion />
          </PrivateLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
