import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';

jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({})
}));

jest.mock('../services/api.js', () => {
  const post = jest.fn();
  return {
    api: { post },
    saveSession: jest.fn(),
    loadSession: jest.fn(() => ({ token: null })),
    clearSession: jest.fn(),
    setAuthToken: jest.fn()
  };
});

import { api, saveSession } from '../services/api.js';

describe('Login', () => {
  it('muestra campos email y contraseña (USER_FLOWS)', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeInTheDocument();
    expect(screen.getByTestId('login-forgot-link')).toHaveAttribute('href', '/olvide-contrasena');
  });

  it('RF-01 feliz: envía credenciales y guarda sesión', async () => {
    api.post.mockResolvedValueOnce({
      data: { success: true, token: 't', refreshToken: 'r', user: { id: 1, nombre: 'A', rol: 'ADMIN' } }
    });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div data-testid="home">ok</div>} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('login-email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/login', { email: 'a@b.com', password: 'Password123' });
      expect(saveSession).toHaveBeenCalled();
    });
  });
});
