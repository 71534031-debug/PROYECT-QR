import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' }
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function saveSession({ token, refreshToken, user }) {
  if (token) localStorage.setItem('access_token', token);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
  if (user) localStorage.setItem('user', JSON.stringify(user));
  setAuthToken(token);
}

export function loadSession() {
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  setAuthToken(token || '');
  return { token, refreshToken, user };
}

export function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  setAuthToken(null);
}

export { api };
