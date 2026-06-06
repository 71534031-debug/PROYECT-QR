const request = require('supertest');
const { createApp } = require('../app');

describe('GET /api/validacion', () => {
  it('400 sin código', async () => {
    const pool = { query: jest.fn() };
    const app = createApp({ pool });
    const res = await request(app).get('/api/validacion');
    expect(res.status).toBe(400);
  });

  it('404 código inexistente (RF-10 error)', async () => {
    const pool = {
      query: jest.fn(async (sql) => {
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[], []];
        if (sql.includes('FROM certificados')) return [[], []];
        return [[], []];
      })
    };
    const app = createApp({ pool });
    const res = await request(app).get('/api/validacion').query({ codigo_unico: 'x' });
    expect(res.status).toBe(404);
    expect(res.body.valido).toBe(false);
  });

  it('200 válido (RF-10 feliz)', async () => {
    const pool = {
      query: jest.fn(async (sql) => {
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[], []];
        if (sql.includes('FROM certificados')) {
          return [
            [
              {
                id: 1,
                estado: 'EMITIDO',
                fecha_emision: new Date('2026-01-01'),
                nombres: 'Juan',
                apellidos: 'Pérez',
                actividad: 'Curso X'
              }
            ],
            []
          ];
        }
        return [[], []];
      })
    };
    const app = createApp({ pool });
    const res = await request(app).get('/api/validacion').query({ codigo_unico: 'abc' });
    expect(res.status).toBe(200);
    expect(res.body.valido).toBe(true);
  });
});
