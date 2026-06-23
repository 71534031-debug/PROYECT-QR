import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../pages/Dashboard.jsx';

jest.mock('../services/api.js', () => ({
  loadSession: jest.fn(() => ({ user: { nombre: 'Admin', rol: 'ADMIN' } })),
  api: {
    get: jest.fn().mockResolvedValue({ data: { data: [] } }),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function Wrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Dashboard', () => {
  it('muestra nombre y rol del usuario', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText(/Hola,/)).toBeInTheDocument();
    expect(screen.getByText(/Admin/)).toBeInTheDocument();
    expect(screen.getByText(/ADMIN/)).toBeInTheDocument();
  });

  it('renderiza secciones principales', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Resumen General')).toBeInTheDocument();
    expect(screen.getByText('Analítica')).toBeInTheDocument();
    expect(screen.getByText('Acciones Rápidas')).toBeInTheDocument();
  });

  it('renderiza tarjetas de estadísticas', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Actividades')).toBeInTheDocument();
    expect(screen.getByText('Participantes')).toBeInTheDocument();
    expect(screen.getByText('Certificados')).toBeInTheDocument();
    expect(screen.getByText('Plantillas')).toBeInTheDocument();
    expect(screen.getByText('Actividades Activas')).toBeInTheDocument();
    expect(screen.getByText('Participantes APTO')).toBeInTheDocument();
  });

  it('renderiza acciones rápidas', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    expect(screen.getByText('Gestionar Actividades')).toBeInTheDocument();
    expect(screen.getByText('Registrar Participantes')).toBeInTheDocument();
    expect(screen.getByText('Generar Certificados')).toBeInTheDocument();
  });
});
