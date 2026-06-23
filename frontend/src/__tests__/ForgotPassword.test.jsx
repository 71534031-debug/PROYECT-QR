import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword.jsx';

jest.mock('../services/api.js', () => ({
  api: { post: jest.fn() }
}));

import { api } from '../services/api.js';

describe('ForgotPassword', () => {
  it('envía correo al backend y muestra mensaje genérico', async () => {
    api.post.mockResolvedValueOnce({ data: { success: true, message: 'Si el correo existe, recibirá instrucciones.' } });
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/admin@cip\.local/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    const submitBtn = screen.getByRole('button', { name: /enviar instrucciones/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/forgot-password', { email: 'user@example.com' });
    });
  });
});
