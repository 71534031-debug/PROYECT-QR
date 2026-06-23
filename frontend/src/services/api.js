import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

let isRefreshing = false;
let pendingQueue = [];

function processQueue(error) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  pendingQueue = [];
}

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

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) return Promise.reject(err);
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      clearSession();
      window.location.href = '/login';
      return Promise.reject(err);
    }
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(() => api(original));
    }
    original._retry = true;
    isRefreshing = true;
    try {
      const { data } = await axios.post('/api/auth/refresh', { refreshToken });
      if (data?.token) {
        saveSession({ token: data.token });
        setAuthToken(data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        processQueue(null);
        return api(original);
      }
      throw new Error('No token in response');
    } catch {
      isRefreshing = false;
      processQueue(new Error('Refresh failed'));
      clearSession();
      window.location.href = '/login';
      return Promise.reject(err);
    }
  }
);

export { api };
