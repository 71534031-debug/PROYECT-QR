const request = require('supertest');
const { createApp } = require('../app');
const { createMockPool, authHeader } = require('./helpers/routeTestUtils');

describe('Configuración routes', () => {
  const base = '/api/configuracion';

  it('401 sin token', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).get(base);
    expect(res.status).toBe(401);
  });

  it('GET devuelve fila o null', async () => {
    const cfg = { id: 1, nombre_institucion: 'CIP' };
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM configuracion_institucional')) return [[cfg], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(base).set(authHeader('ADMINISTRATIVO'));
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(cfg);
  });

  it('PUT 403 ADMINISTRATIVO no puede actualizar', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app)
      .put(base)
      .set(authHeader('ADMINISTRATIVO'))
      .send({ nombre_institucion: 'X', cargo_autoridad: 'Y', nombre_autoridad: 'Z' });
    expect(res.status).toBe(403);
  });

  it('PUT 400 campos obligatorios faltantes', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).put(base).set(authHeader()).send({ nombre_institucion: 'Solo nombre' });
    expect(res.status).toBe(400);
  });

  it('PUT 200 ADMIN actualiza', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('INSERT INTO configuracion_institucional')) return [[{ affectedRows: 1 }], []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app)
      .put(base)
      .set(authHeader())
      .send({
        nombre_institucion: 'Inst',
        logo_url: null,
        firma_url: null,
        cargo_autoridad: 'Decano',
        nombre_autoridad: 'Ana Pérez'
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
