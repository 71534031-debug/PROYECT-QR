import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard.jsx';

jest.mock('../services/api.js', () => ({
  loadSession: jest.fn(() => ({ user: { nombre: 'Admin', rol: 'ADMIN' } }))
}));

describe('Dashboard', () => {
  it('muestra nombre y rol del usuario', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('dashboard-user')).toHaveTextContent('Admin (ADMIN)');
  });

  it('renderiza boton de logout', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
  });

  it('invoca onLogout al hacer click en boton', () => {
    const onLogout = jest.fn();
    render(<Dashboard onLogout={onLogout} />);
    screen.getByTestId('logout-btn').click();
    expect(onLogout).toHaveBeenCalled();
  });
});