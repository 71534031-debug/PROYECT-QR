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
    expect(screen.getByTestId('reset-no-token')).toBeInTheDocument();
    expect(screen.getByTestId('reset-submit')).toBeDisabled();
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
    fireEvent.change(screen.getByTestId('reset-password'), { target: { value: 'NuevaPass99' } });
    fireEvent.change(screen.getByTestId('reset-password2'), { target: { value: 'NuevaPass99' } });
    fireEvent.click(screen.getByTestId('reset-submit'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/reset-password', { token: 'abc123token', new_password: 'NuevaPass99' });
      expect(screen.getByTestId('reset-message')).toBeInTheDocument();
    });
  });
});
