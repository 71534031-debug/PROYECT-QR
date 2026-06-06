import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Plantillas from '../pages/Plantillas.jsx';

jest.mock('../services/api.js', () => ({
  api: { get: jest.fn().mockResolvedValue({ data: { data: [] } }), post: jest.fn() }
}));

jest.mock('../shared/requiredPlaceholders.js', () => ({
  REQUIRED_PLACEHOLDERS: ['{{NOMBRE_COMPLETO}}', '{{DOCUMENTO}}']
}));

import { api } from '../services/api.js';

describe('Plantillas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: { data: [] } });
    api.post.mockResolvedValue({ data: {} });
  });

  it('renderiza formulario con campos', () => {
    render(<Plantillas />);
    expect(screen.getByTestId('plantilla-form')).toBeInTheDocument();
    expect(screen.getByTestId('plantilla-nombre')).toBeInTheDocument();
    expect(screen.getByTestId('plantilla-contenido')).toBeInTheDocument();
  });

  it('tiene contenido inicial en textarea', () => {
    render(<Plantillas />);
    expect(screen.getByTestId('plantilla-contenido')).toHaveValue();
  });

  it('envia POST al crear plantilla', async () => {
    render(<Plantillas />);
    fireEvent.change(screen.getByTestId('plantilla-nombre'), { target: { value: 'Mi Plantilla' } });
    fireEvent.click(screen.getByTestId('plantilla-form').querySelector('button[type="submit"]'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/plantillas', expect.objectContaining({ nombre: 'Mi Plantilla' }));
    });
  });

  it('muestra lista de plantillas', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [{ id: 1, nombre: 'T1', activa: true }] } });
    render(<Plantillas />);
    await waitFor(() => {
      expect(screen.getByRole('listitem')).toHaveTextContent('T1');
    });
  });
});