import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Plantillas from '../pages/Plantillas.jsx';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function Wrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

jest.mock('../services/api.js', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: { data: [] } }),
    post: jest.fn().mockResolvedValue({ data: { success: true, data: { id: 1 } } }),
    put: jest.fn().mockResolvedValue({ data: { success: true } }),
  }
}));

import { api } from '../services/api.js';

describe('Plantillas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: { data: [] } });
  });

  it('renderiza formulario con campo nombre y upload', () => {
    render(<Plantillas />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText(/nombre descriptivo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/imagen de fondo/i).length).toBeGreaterThanOrEqual(1);
  });

  it('no renderiza textarea de contenido HTML', () => {
    render(<Plantillas />, { wrapper: Wrapper });
    expect(screen.queryByPlaceholderText(/contenido html/i)).not.toBeInTheDocument();
  });

  it('envia POST al crear plantilla sin contenido HTML', async () => {
    render(<Plantillas />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText(/nombre descriptivo/i);
    fireEvent.change(input, { target: { value: 'Certificado Base' } });
    const submitBtn = screen.getByRole('button', { name: /crear plantilla/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/plantillas', { nombre: 'Certificado Base' });
    });
  });

  it('muestra lista de plantillas guardadas', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [{ id: 1, nombre: 'Diploma CIP', activa: true }] } });
    render(<Plantillas />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText(/diploma cip/i)).toBeInTheDocument();
    });
  });

  it('carga y muestra campos al seleccionar plantilla con imagen', async () => {
    const plantillaConCampos = {
      id: 2, nombre: 'Plantilla Test', activa: true,
      imagen_fondo: 'uploads/plantillas/fondo.jpg',
      campos: [{ id: 1, placeholder: '{{NOMBRE_COMPLETO}}', x: 50, y: 45, font_size: 28, alignment: 'center' }],
    };
    api.get.mockResolvedValueOnce({ data: { data: [plantillaConCampos] } });
    api.get.mockResolvedValueOnce({ data: { data: plantillaConCampos } });
    render(<Plantillas />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText(/plantilla test/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/plantilla test/i));
    await waitFor(() => {
      expect(screen.getByText(/Nombre Completo/i)).toBeInTheDocument();
    });
  });
});
