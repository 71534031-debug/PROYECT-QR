import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../components/Toast.jsx';
import Configuracion from '../pages/Configuracion.jsx';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function Wrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}

jest.mock('../services/api.js', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: { data: {} } }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
  loadSession: jest.fn(() => ({ user: { rol: 'ADMIN' } })),
  setAuthToken: jest.fn(),
}));

import { api } from '../services/api.js';

describe('Configuracion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: { data: { id: 1, nombre_app: 'Sistema QR', email_contacto: '', telefono_contacto: '', direccion: '' } } });
    api.put.mockResolvedValue({ data: {} });
  });

  it('renderiza pestanas de configuracion', async () => {
    render(<Configuracion />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('Información General')).toBeInTheDocument();
    });
  });

  it('invoca PUT al guardar configuracion', async () => {
    render(<Configuracion />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('Información General'));
    const input = screen.getByDisplayValue('Sistema QR');
    fireEvent.change(input, { target: { value: 'Sistema QR v2' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/configuracion', expect.objectContaining({ nombre_app: 'Sistema QR v2' }));
    });
  });
});
