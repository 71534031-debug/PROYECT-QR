const request = require('supertest');
const { createApp } = require('../app');
const { createMockPool, authHeader } = require('./helpers/routeTestUtils');

const VALID_CONTENIDO = [
  '{{NOMBRE_COMPLETO}}',
  '{{DOCUMENTO}}',
  '{{ACTIVIDAD_NOMBRE}}',
  '{{FECHA_EMISION}}',
  '{{CODIGO_UNICO}}',
  '{{QR}}',
  '{{LOGO_INSTITUCION}}',
  '{{NOMBRE_AUTORIDAD}}',
  '{{CARGO_AUTORIDAD}}',
  '{{FIRMA_AUTORIDAD}}'
].join(' ');

describe('Plantillas routes', () => {
  const base = '/api/plantillas';

  it('POST 400 sin placeholders completos', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send({ nombre: 'P', contenido: 'vacío' });
    expect(res.status).toBe(400);
  });

  it('POST 201 plantilla válida', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('INSERT INTO plantillas')) return [{ insertId: 3, affectedRows: 1 }, []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send({ nombre: 'Cert base', contenido: VALID_CONTENIDO });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(3);
  });

  it('GET lista', async () => {
    const rows = [{ id: 1, nombre: 'P1', activa: 1 }];
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM plantillas')) return [rows, []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(base).set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(rows);
  });

  it('PUT 400 contenido inválido', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).put(`${base}/1`).set(authHeader()).send({ contenido: 'sin placeholders' });
    expect(res.status).toBe(400);
  });

  it('PUT 200 actualiza', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('UPDATE plantillas SET')) return [[{ affectedRows: 1 }], []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).put(`${base}/2`).set(authHeader()).send({ nombre: 'Nuevo', contenido: VALID_CONTENIDO });
    expect(res.status).toBe(200);
  });

  it('DELETE 403 ADMINISTRATIVO', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).delete(`${base}/1`).set(authHeader('ADMINISTRATIVO'));
    expect(res.status).toBe(403);
  });

  it('DELETE 200 ADMIN', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('DELETE FROM plantillas')) return [[{ affectedRows: 1 }], []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).delete(`${base}/9`).set(authHeader());
    expect(res.status).toBe(200);
  });
});
