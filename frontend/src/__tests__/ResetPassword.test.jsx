import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from '../pages/ResetPassword.jsx';

jest.mock('../services/api.js', () => ({
  api: { post: jest.fn() }
}));

import { api } from '../services/api.js';

describe('ResetPassword', () => {
  it('sin token muestra aviso', () => {
    render(
      <MemoryRouter initialEntries={['/restablecer-contrasena']}>
        <Routes>
          <Route path="/restablecer-contrasena" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Enlace inválido')).toBeInTheDocument();
    expect(screen.getByText(/el enlace de restablecimiento no es válido/i)).toBeInTheDocument();
    expect(screen.getByText('Solicitar nuevo enlace')).toBeInTheDocument();
  });

  it('envía token y nueva contraseña', async () => {
    api.post.mockResolvedValueOnce({ data: { success: true } });
    render(
      <MemoryRouter initialEntries={['/restablecer-contrasena?token=abc123token']}>
        <Routes>
          <Route path="/restablecer-contrasena" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
    const passwordInput = screen.getByLabelText(/nueva contraseña/i);
    const confirmInput = screen.getByLabelText(/confirmar contraseña/i);
    fireEvent.change(passwordInput, { target: { value: 'NuevaPass99' } });
    fireEvent.change(confirmInput, { target: { value: 'NuevaPass99' } });
    const submitBtn = screen.getByRole('button', { name: /restablecer contraseña/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/reset-password', { token: 'abc123token', new_password: 'NuevaPass99' });
    });
  });
});
