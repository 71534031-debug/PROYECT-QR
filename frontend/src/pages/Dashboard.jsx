import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadSession } from '../services/api.js';
import './Dashboard.css';

export default function Dashboard({ onLogout }) {
  const { user } = loadSession();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Bienvenido al sistema de certificados</p>
      </div>

      <div className="dashboard-welcome">
        <h1>Hola, {user?.nombre || 'Usuario'}</h1>
        <p>Aquí está el resumen de tu actividad en el sistema</p>
        <span className="user-role">{user?.rol || 'Staff'}</span>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Actividades</div>
            <div className="stat-value">12</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Participantes</div>
            <div className="stat-value">156</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Plantillas</div>
            <div className="stat-value">5</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Certificados</div>
            <div className="stat-value">142</div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="action-card" onClick={() => navigate('/actividades')}>
          <div className="action-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="action-card-content">
            <h3>Gestionar Actividades</h3>
            <p>Crea y administra eventos y cursos</p>
          </div>
        </div>

        <div className="action-card" onClick={() => navigate('/participantes')}>
          <div className="action-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <div className="action-card-content">
            <h3>Registrar Participantes</h3>
            <p>Agrega participantes a tus actividades</p>
          </div>
        </div>

        <div className="action-card" onClick={() => navigate('/certificados')}>
          <div className="action-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          </div>
          <div className="action-card-content">
            <h3>Generar Certificados</h3>
            <p>Crea certificados masivos para participantes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
