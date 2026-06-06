import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Actividades from '../pages/Actividades.jsx';

jest.mock('../services/api.js', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

import { api } from '../services/api.js';

describe('Actividades', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('muestra error si falla la carga', async () => {
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Fallo' } } });
    render(<Actividades />);
    await waitFor(() => {
      expect(screen.getByTestId('actividades-error')).toHaveTextContent('Fallo al cargar');
    });
  });

  it('renderiza formulario con campos requeridos', () => {
    render(<Actividades />);
    expect(screen.getByTestId('actividad-form')).toBeInTheDocument();
    expect(screen.getByTestId('actividad-nombre')).toBeInTheDocument();
    expect(screen.getByTestId('actividad-submit')).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay actividades', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });
    render(<Actividades />);
    await waitFor(() => {
      expect(screen.getByTestId('actividades-list')).toHaveTextContent('No hay actividades');
    });
  });

  it('envia formulario al hacer submit', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });
    api.post.mockResolvedValueOnce({ data: {} });
    render(<Actividades />);
    fireEvent.change(screen.getByTestId('actividad-nombre'), { target: { value: 'Nuevo Curso' } });
    fireEvent.change(screen.getByTestId('actividad-fecha-inicio'), { target: { value: '2026-01-01' } });
    fireEvent.change(screen.getByTestId('actividad-fecha-fin'), { target: { value: '2026-01-02' } });
    fireEvent.change(screen.getByTestId('actividad-responsable'), { target: { value: 'Dr. Smith' } });
    fireEvent.click(screen.getByTestId('actividad-submit'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/actividades', expect.objectContaining({ nombre: 'Nuevo Curso' }));
    });
  });
});