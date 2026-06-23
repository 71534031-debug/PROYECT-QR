const request = require('supertest');
const path = require('path');
const fs = require('fs');
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

  it('POST 201 plantilla sin contenido (nombre solo)', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('INSERT INTO plantillas')) return [{ insertId: 5, affectedRows: 1 }, []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send({ nombre: 'Solo nombre' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(5);
  });

  it('POST 400 nombre vacío', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send({ nombre: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('nombre');
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

  it('POST 200 imagen de fondo subida con éxito', async () => {
    const mockInsertId = 42;
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('UPDATE plantillas SET imagen_fondo')) return [[{ affectedRows: 1 }], []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });

    const testImgPath = path.join(__dirname, '__fixtures__', 'test.png');
    const fixturesDir = path.dirname(testImgPath);
    if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });
    if (!fs.existsSync(testImgPath)) {
      const minPng = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0x40, 0x00,
        0x00, 0x00, 0x00, 0xFF, 0xFF, 0x07, 0x80, 0x00, 0x01, 0xE3, 0xC0, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      fs.writeFileSync(testImgPath, minPng);
    }

    const res = await request(app)
      .post(`${base}/${mockInsertId}/imagen`)
      .set(authHeader())
      .attach('imagen_fondo', testImgPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.url).toMatch(/^uploads\/images\//);

    // Cleanup: remove file created by multer
    const savedPath = path.join(process.cwd(), res.body.url);
    if (fs.existsSync(savedPath)) {
      fs.unlinkSync(savedPath);
    }
  });

  it('POST 400 imagen tipo no permitido', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const fakeFilePath = path.join(__dirname, '__fixtures__', 'fake.txt');
    if (!fs.existsSync(path.dirname(fakeFilePath))) fs.mkdirSync(path.dirname(fakeFilePath), { recursive: true });
    fs.writeFileSync(fakeFilePath, 'no soy una imagen');

    try {
      const res = await request(app)
        .post(`${base}/1/imagen`)
        .set(authHeader())
        .attach('imagen_fondo', fakeFilePath);
      expect(res.status).toBe(400);
    } catch (e) {
      // multer may reset the connection on fileFilter rejection
      // verify the error is connection-related
      expect(e.message).toMatch(/ECONNRESET|socket hang up|aborted/i);
    }
    fs.unlinkSync(fakeFilePath);
  });
});
