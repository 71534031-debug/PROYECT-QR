import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Participantes from '../pages/Participantes.jsx';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function Wrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

jest.mock('../services/api.js', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: { data: [{ id: 1, nombre: 'Curso A' }] } }),
    post: jest.fn().mockResolvedValue({ data: {} })
  }
}));

import { api } from '../services/api.js';

describe('Participantes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: { data: [{ id: 1, nombre: 'Curso A' }] } });
    api.post.mockResolvedValue({ data: {} });
  });

  it('renderiza select de actividad y formulario', async () => {
    render(<Participantes />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('participantes-actividad')).toBeInTheDocument();
      expect(screen.getByTestId('participante-form')).toBeInTheDocument();
    });
  });

  it('invoca POST al crear participante', async () => {
    render(<Participantes />, { wrapper: Wrapper });
    await waitFor(() => screen.getByTestId('participante-form'));
    fireEvent.change(screen.getByTestId('participantes-actividad'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('participante-nombres'), { target: { value: 'Pedro' } });
    fireEvent.change(screen.getByTestId('participante-apellidos'), { target: { value: 'Ramirez' } });
    fireEvent.change(screen.getByTestId('participante-numero-doc'), { target: { value: '87654321' } });
    fireEvent.change(screen.getByTestId('participante-email'), { target: { value: 'p@test.com' } });
    fireEvent.click(screen.getByTestId('participante-submit'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/participantes', expect.objectContaining({ nombres: 'Pedro' }));
    });
  });
});