const request = require('supertest');
const { createApp } = require('../app');

describe('GET /api/health', () => {
  it('responde 200 con cuerpo ok', async () => {
    const app = createApp({ pool: null });
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
