const request = require('supertest');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { createApp } = require('../app');
const { createMockPool } = require('./helpers/routeTestUtils');

describe('Entrega pública GET /api/entrega/descargar', () => {
  const url = '/api/entrega/descargar';
  let relPath;
  let absPath;

  beforeEach(() => {
    relPath = path.join('uploads', `jest-entrega-${Date.now()}.pdf`);
    absPath = path.join(process.cwd(), relPath);
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, '%PDF-1.4 test');
  });

  afterEach(() => {
    try {
      fs.unlinkSync(absPath);
    } catch {
      /* ignore */
    }
  });

  it('404 sin token en query', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).get(url);
    expect(res.status).toBe(404);
  });

  it('404 JWT inválido', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).get(url).query({ t: 'not-a-jwt' });
    expect(res.status).toBe(404);
  });

  it('404 typ distinto de cert_download', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const bad = jwt.sign({ typ: 'other', certificado_id: 1 }, process.env.JWT_DOWNLOAD_SECRET);
    const res = await request(app).get(url).query({ t: bad });
    expect(res.status).toBe(404);
  });

  it('404 certificado no emitido', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM certificados WHERE id')) {
          return [[{ ruta_pdf: relPath, estado: 'REVOCADO' }], []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const token = jwt.sign({ typ: 'cert_download', certificado_id: 10 }, process.env.JWT_DOWNLOAD_SECRET);
    const res = await request(app).get(url).query({ t: token });
    expect(res.status).toBe(404);
  });

  it('404 archivo PDF ausente', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM certificados WHERE id')) {
          return [[{ ruta_pdf: 'uploads/no-existe.pdf', estado: 'EMITIDO' }], []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const token = jwt.sign({ typ: 'cert_download', certificado_id: 10 }, process.env.JWT_DOWNLOAD_SECRET);
    const res = await request(app).get(url).query({ t: token });
    expect(res.status).toBe(404);
  });

  it('200 descarga PDF emitido', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM certificados WHERE id')) {
          return [[{ ruta_pdf: relPath, estado: 'EMITIDO' }], []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const token = jwt.sign({ typ: 'cert_download', certificado_id: 77 }, process.env.JWT_DOWNLOAD_SECRET);
    const res = await request(app).get(url).query({ t: token });
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition'] || '').toMatch(/attachment/i);
  });
});
