import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Configuracion from '../pages/Configuracion.jsx';

jest.mock('../services/api.js', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: { data: {} } }),
    put: jest.fn().mockResolvedValue({ data: {} })
  },
  loadSession: jest.fn(() => ({ user: { rol: 'ADMIN' } }))
}));

import { api } from '../services/api.js';

describe('Configuracion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: { data: {} } });
    api.put.mockResolvedValue({ data: {} });
  });

  it('renderiza formulario con campos requeridos', async () => {
    render(<Configuracion />);
    await waitFor(() => {
      expect(screen.getByTestId('config-form')).toBeInTheDocument();
    });
  });

  it('invoca PUT al guardar con rol ADMIN', async () => {
    render(<Configuracion />);
    await waitFor(() => screen.getByTestId('config-nombre-institucion'));
    fireEvent.change(screen.getByTestId('config-nombre-institucion'), { target: { value: 'CIP Huancavelica' } });
    fireEvent.change(screen.getByTestId('config-cargo-autoridad'), { target: { value: 'Decano' } });
    fireEvent.change(screen.getByTestId('config-nombre-autoridad'), { target: { value: 'Dr. Garcia' } });
    fireEvent.click(screen.getByTestId('config-submit'));
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/configuracion', expect.objectContaining({ nombre_institucion: 'CIP Huancavelica' }));
    });
  });
});