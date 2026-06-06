import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Certificados from '../pages/Certificados.jsx';

jest.mock('../services/api.js', () => ({
  api: { get: jest.fn(), post: jest.fn() },
  saveSession: jest.fn(),
  loadSession: jest.fn(),
  clearSession: jest.fn(),
  setAuthToken: jest.fn()
}));

import { api } from '../services/api.js';

describe('Certificados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: { data: [] } });
  });

  it('renderiza formulario con selects', async () => {
    render(<Certificados />);
    expect(screen.getByTestId('cert-generar-form')).toBeInTheDocument();
  });

  it('carga inicial de listas', async () => {
    api.get
      .mockResolvedValueOnce({ data: { data: [{ id: 1, nombre: 'Act1' }] } })
      .mockResolvedValueOnce({ data: { data: [{ id: 1, nombre: 'Plant1' }] } })
      .mockResolvedValueOnce({ data: { data: [] } });
    render(<Certificados />);
    await waitFor(() => {
      expect(screen.getByTestId('cert-generar-form')).toBeInTheDocument();
    });
  });
});