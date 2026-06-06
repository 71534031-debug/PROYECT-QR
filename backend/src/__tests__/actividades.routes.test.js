const request = require('supertest');
const { createApp } = require('../app');
const { createMockPool, authHeader } = require('./helpers/routeTestUtils');

describe('Actividades routes', () => {
  const base = '/api/actividades';

  it('401 sin Bearer', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).get(base);
    expect(res.status).toBe(401);
  });

  it('403 rol no permitido', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).get(base).set(authHeader('PARTICIPANTE'));
    expect(res.status).toBe(403);
  });

  it('POST 400 datos incompletos', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send({ nombre: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST 409 actividad duplicada', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM actividades WHERE nombre') && sql.includes('LIMIT 1')) {
          return [[{ id: 9 }], []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const body = {
      nombre: 'Curso',
      tipo: 'TALLER',
      descripcion: 'd',
      fecha_inicio: '2026-01-01',
      fecha_fin: '2026-01-02',
      responsable: 'Staff'
    };
    const res = await request(app).post(base).set(authHeader()).send(body);
    expect(res.status).toBe(409);
  });

  it('POST 201 crea actividad', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM actividades WHERE nombre') && sql.includes('LIMIT 1')) return [[], []];
        if (sql.includes('INSERT INTO actividades')) return [{ insertId: 42, affectedRows: 1 }, []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const body = {
      nombre: 'Curso',
      tipo: 'TALLER',
      descripcion: 'd',
      fecha_inicio: '2026-01-01',
      fecha_fin: '2026-01-02',
      responsable: 'Staff'
    };
    const res = await request(app).post(base).set(authHeader('ADMINISTRATIVO', 2)).send(body);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(42);
  });

  it('GET lista actividades', async () => {
    const rows = [{ id: 1, nombre: 'A' }];
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('SELECT * FROM actividades')) return [rows, []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(base).set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(rows);
  });

  it('PUT 400 datos incompletos', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).put(`${base}/1`).set(authHeader()).send({});
    expect(res.status).toBe(400);
  });

  it('PUT 409 duplicado', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM actividades WHERE nombre') && sql.includes('AND id <>')) {
          return [[{ id: 2 }], []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const body = {
      nombre: 'Curso',
      tipo: 'TALLER',
      fecha_inicio: '2026-01-01',
      fecha_fin: '2026-01-02',
      responsable: 'Staff'
    };
    const res = await request(app).put(`${base}/1`).set(authHeader()).send(body);
    expect(res.status).toBe(409);
  });

  it('PUT 200 actualiza', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM actividades WHERE nombre') && sql.includes('AND id <>')) return [[], []];
        if (sql.includes('UPDATE actividades SET')) return [[{ affectedRows: 1 }], []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const body = {
      nombre: 'Curso',
      tipo: 'TALLER',
      fecha_inicio: '2026-01-01',
      fecha_fin: '2026-01-02',
      responsable: 'Staff'
    };
    const res = await request(app).put(`${base}/5`).set(authHeader()).send(body);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
