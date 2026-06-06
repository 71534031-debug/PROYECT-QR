import { saveSession, clearSession, loadSession } from '../services/api.js';

describe('api session', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saveSession persiste token y loadSession lo restaura', () => {
    saveSession({ token: 'abc', refreshToken: 'r', user: { id: 1, rol: 'ADMIN' } });
    const s = loadSession();
    expect(s.token).toBe('abc');
    expect(s.refreshToken).toBe('r');
    expect(s.user.rol).toBe('ADMIN');
  });

  it('clearSession elimina claves', () => {
    saveSession({ token: 'x', refreshToken: 'y', user: { id: 1 } });
    clearSession();
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
