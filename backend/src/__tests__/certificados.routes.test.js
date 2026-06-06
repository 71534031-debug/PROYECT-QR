jest.mock('../services/certificatePdf', () => ({
  writeCertificatePdf: jest.fn().mockResolvedValue(undefined)
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { createApp } = require('../app');
const { createMockPool, authHeader } = require('./helpers/routeTestUtils');
const { writeCertificatePdf } = require('../services/certificatePdf');

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

describe('Certificados routes', () => {
  const base = '/api/certificados';

  beforeEach(() => {
    writeCertificatePdf.mockClear();
  });

  it('POST generar 400 sin ids', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/generar`).set(authHeader()).send({});
    expect(res.status).toBe(400);
  });

  it('POST generar 422 sin configuración institucional', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('configuracion_institucional') && sql.includes('SELECT id')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/generar`).set(authHeader()).send({ actividad_id: 1, plantilla_id: 1 });
    expect(res.status).toBe(422);
  });

  it('POST generar 404 plantilla inactiva o ausente', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('configuracion_institucional') && sql.includes('SELECT id')) return [[{ id: 1 }], []];
        if (sql.includes('FROM plantillas WHERE id')) return [[{ id: 1, contenido: VALID_CONTENIDO, activa: 0 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/generar`).set(authHeader()).send({ actividad_id: 1, plantilla_id: 1 });
    expect(res.status).toBe(404);
  });

  it('POST generar 422 sin participantes aptos', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('configuracion_institucional') && sql.includes('SELECT id')) return [[{ id: 1 }], []];
        if (sql.includes('FROM plantillas WHERE id')) {
          return [[{ id: 1, contenido: VALID_CONTENIDO, activa: 1 }], []];
        }
        if (sql.includes('estado_validacion = \'APTO\'')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/generar`).set(authHeader()).send({ actividad_id: 1, plantilla_id: 1 });
    expect(res.status).toBe(422);
  });

  it('POST generar 200 genera certificados', async () => {
    const apto = {
      participante_id: 9,
      nombres: 'Luis',
      apellidos: 'Gómez',
      tipo_documento: 'DNI',
      numero_documento: '11223344',
      email: 'luis@example.com',
      actividad_nombre: 'Taller'
    };
    const fullCfg = {
      id: 1,
      logo_url: '',
      firma_url: '',
      nombre_autoridad: 'Dir',
      cargo_autoridad: 'Director'
    };
    const pool = createMockPool([
      async (sql, params, src) => {
        if (sql.includes('configuracion_institucional') && sql.includes('SELECT id')) return [[{ id: 1 }], []];
        if (sql.includes('FROM plantillas WHERE id')) {
          return [[{ id: 1, contenido: VALID_CONTENIDO, activa: 1 }], []];
        }
        if (sql.includes('estado_validacion = \'APTO\'')) return [[apto], []];
        if (sql.includes('SELECT * FROM configuracion_institucional')) return [[fullCfg], []];
        if (src === 'conn' && sql.includes('INSERT INTO certificados')) return [{ insertId: 500, affectedRows: 1 }, []];
        if (sql.includes('CERTIFICADOS_GENERADOS')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/generar`).set(authHeader()).send({ actividad_id: 1, plantilla_id: 1 });
    expect(res.status).toBe(200);
    expect(res.body.generados).toBe(1);
    expect(writeCertificatePdf).toHaveBeenCalledTimes(1);
  });

  it('GET lista', async () => {
    const rows = [{ id: 1, codigo_unico: 'uuid' }];
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM certificados WHERE')) return [rows, []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(base).query({ actividad_id: 1 }).set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(rows);
  });

  it('POST enlace-descarga devuelve token JWT', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/12/enlace-descarga`).set(authHeader()).send({});
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    const payload = jwt.verify(res.body.token, process.env.JWT_DOWNLOAD_SECRET);
    expect(payload.typ).toBe('cert_download');
    expect(payload.certificado_id).toBe(12);
  });

  it('GET detalle 404', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM certificados WHERE id')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(`${base}/999`).set(authHeader());
    expect(res.status).toBe(404);
  });

  it('GET detalle 200', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM certificados WHERE id')) {
          return [[{ id: 3, codigo_unico: 'abc', ruta_pdf: 'uploads/x.pdf', estado: 'EMITIDO' }], []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(`${base}/3`).set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data.codigo_unico).toBe('abc');
  });

  it('GET descargar staff 404 si archivo no existe', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM certificados WHERE id')) {
          return [[{ ruta_pdf: 'uploads/no-hay.pdf' }], []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(`${base}/3/descargar`).set(authHeader());
    expect(res.status).toBe(404);
  });

  it('POST revocar 200 solo ADMIN', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('UPDATE certificados SET estado')) return [[{ affectedRows: 1 }], []];
        if (sql.includes('CERTIFICADO_REVOCADO')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/8/revocar`).set(authHeader());
    expect(res.status).toBe(200);
  });

  it('POST revocar 403 ADMINISTRATIVO', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/8/revocar`).set(authHeader('ADMINISTRATIVO'));
    expect(res.status).toBe(403);
  });
});
