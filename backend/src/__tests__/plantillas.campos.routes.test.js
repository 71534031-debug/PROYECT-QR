const request = require('supertest');
const { createApp } = require('../app');
const { createMockPool, authHeader } = require('./helpers/routeTestUtils');

describe('Plantilla Campos routes', () => {
  const base = '/api/plantillas';

  const VALID_CAMPOS = [
    { placeholder: '{{NOMBRE_COMPLETO}}', x: 50, y: 45, font_size: 28, alignment: 'center', color: '#1a1a2e', width: 400, height: 40 },
    { placeholder: '{{DOCUMENTO}}', x: 50, y: 52, font_size: 14, alignment: 'center', color: '#4b5563', width: 300, height: 24 },
    { placeholder: '{{ACTIVIDAD_NOMBRE}}', x: 50, y: 58, font_size: 16, alignment: 'center', color: '#1a1a2e', width: 400, height: 24 },
    { placeholder: '{{FECHA_EMISION}}', x: 50, y: 75, font_size: 12, alignment: 'center', color: '#6b7280', width: 200, height: 20 },
    { placeholder: '{{CODIGO_UNICO}}', x: 50, y: 80, font_size: 10, alignment: 'center', color: '#9ca3af', width: 200, height: 16 },
    { placeholder: '{{QR}}', x: 50, y: 65, font_size: 16, alignment: 'center', color: '#000000', width: 120, height: 120 },
    { placeholder: '{{LOGO_INSTITUCION}}', x: 50, y: 15, font_size: 16, alignment: 'center', color: '#000000', width: 100, height: 100 },
    { placeholder: '{{NOMBRE_AUTORIDAD}}', x: 50, y: 88, font_size: 14, alignment: 'center', color: '#1a1a2e', width: 300, height: 20 },
    { placeholder: '{{CARGO_AUTORIDAD}}', x: 50, y: 91, font_size: 12, alignment: 'center', color: '#4b5563', width: 300, height: 20 },
    { placeholder: '{{FIRMA_AUTORIDAD}}', x: 50, y: 85, font_size: 16, alignment: 'center', color: '#000000', width: 120, height: 50 },
  ];

  it('POST 201 plantilla sin contenido HTML (imagen_fondo)', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('INSERT INTO plantillas')) return [{ insertId: 10, affectedRows: 1 }, []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send({ nombre: 'Plantilla con fondo' });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(10);
  });

  it('GET /:id retorna plantilla con campos', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM plantillas WHERE')) return [[{ id: 1, nombre: 'P1', imagen_fondo: 'uploads/plantillas/fondo.jpg', activa: 1, contenido: null }], []];
        if (sql.includes('FROM plantilla_campos WHERE')) return [[{ id: 1, plantilla_id: 1, placeholder: '{{NOMBRE_COMPLETO}}', x: 50, y: 45, font_size: 28, alignment: 'center', color: '#1a1a2e', width: 400, height: 30, orden: 0 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(`${base}/1`).set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data.nombre).toBe('P1');
    expect(res.body.data.campos).toHaveLength(1);
    expect(res.body.data.campos[0].placeholder).toBe('{{NOMBRE_COMPLETO}}');
  });

  it('PUT /:id/campos guarda campos', async () => {
    const mockSaved = VALID_CAMPOS.map((c, i) => ({ id: i + 1, plantilla_id: 1, ...c, orden: i }));
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('DELETE FROM plantilla_campos')) return [[], []];
        if (sql.includes('FROM plantilla_campos WHERE')) return [mockSaved, []];
        if (sql.includes('INSERT INTO plantilla_campos')) return [[{ insertId: 1 }], []];
        if (sql.includes('SELECT id FROM plantillas WHERE')) return [[{ id: 1 }], []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).put(`${base}/1/campos`).set(authHeader()).send({ campos: VALID_CAMPOS });
    expect(res.status).toBe(200);
    expect(res.body.data.campos).toHaveLength(10);
  });

  it('PUT /:id/campos 404 para plantilla inexistente', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('SELECT id FROM plantillas')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).put(`${base}/999/campos`).set(authHeader()).send({ campos: VALID_CAMPOS });
    expect(res.status).toBe(404);
  });

  it('GET /:id/campos retorna lista de campos', async () => {
    const rows = [
      { id: 1, plantilla_id: 1, placeholder: '{{NOMBRE_COMPLETO}}', x: 50, y: 45, font_size: 28, alignment: 'center', color: '#1a1a2e', width: 400, height: 30, orden: 0 },
    ];
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM plantilla_campos WHERE')) return [rows, []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(`${base}/1/campos`).set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].placeholder).toBe('{{NOMBRE_COMPLETO}}');
  });
});
