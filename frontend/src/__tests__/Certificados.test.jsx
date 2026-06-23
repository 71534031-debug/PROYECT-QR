import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Certificados from '../pages/Certificados.jsx';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function Wrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

jest.mock('../services/api.js', () => ({
  api: { get: jest.fn(), post: jest.fn() },
  saveSession: jest.fn(),
  loadSession: jest.fn(),
  clearSession: jest.fn(),
  setAuthToken: jest.fn()
}));

jest.mock('../utils/export.js', () => ({
  exportToCSV: jest.fn(),
  exportToExcel: jest.fn(),
  exportToPDF: jest.fn(),
  downloadPDF: jest.fn(),
  formatDate: jest.fn(),
  formatDateTime: jest.fn(),
}));

import { api } from '../services/api.js';

describe('Certificados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: { data: [] } });
  });

  it('renderiza formulario con selects', async () => {
    render(<Certificados />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('cert-generar-form')).toBeInTheDocument();
    });
  });

  it('carga inicial de listas', async () => {
    api.get
      .mockResolvedValueOnce({ data: { data: [{ id: 1, nombre: 'Act1' }] } })
      .mockResolvedValueOnce({ data: { data: [{ id: 1, nombre: 'Plant1' }] } })
      .mockResolvedValueOnce({ data: { data: [] } });
    render(<Certificados />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('cert-generar-form')).toBeInTheDocument();
    });
  });
});
