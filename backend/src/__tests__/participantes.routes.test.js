const request = require('supertest');
const { Readable } = require('stream');
const { createApp } = require('../app');
const { createMockPool, authHeader } = require('./helpers/routeTestUtils');

const validParticipante = {
  nombres: 'Juan',
  apellidos: 'Pérez',
  tipo_documento: 'DNI',
  numero_documento: '12345678',
  email: 'juan@example.com',
  actividad_id: 1
};

describe('Participantes routes', () => {
  const base = '/api/participantes';

  it('POST 400 payload inválido', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send({ nombres: 'A' });
    expect(res.status).toBe(400);
  });

  it('POST 409 duplicado por documento', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('JOIN participantes p') && sql.includes('numero_documento')) {
          return [[{ id: 1 }], []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send(validParticipante);
    expect(res.status).toBe(409);
  });

  it('POST 201 crea participante y vínculo', async () => {
    const pool = createMockPool([
      async (sql, params, src) => {
        if (src === 'pool' && sql.includes('numero_documento')) return [[], []];
        if (src === 'pool' && sql.includes('p.email = ?')) return [[], []];
        if (src === 'conn' && sql.includes('INSERT INTO participantes')) return [{ insertId: 55, affectedRows: 1 }, []];
        if (src === 'conn' && sql.includes('INSERT INTO actividad_participante')) return [{ insertId: 1, affectedRows: 1 }, []];
        if (src === 'pool' && sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(base).set(authHeader()).send(validParticipante);
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(55);
  });

  it('GET lista con filtro actividad_id', async () => {
    const rows = [{ id: 1, email: 'a@b.com', actividad_id: 2 }];
    const pool = createMockPool([
      async (sql, params) => {
        if (sql.includes('FROM participantes p') && sql.includes('JOIN actividad_participante')) {
          expect(params).toEqual(['2']);
          return [rows, []];
        }
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).get(base).query({ actividad_id: 2 }).set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(rows);
  });

  it('POST importar 400 sin archivo', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/importar`).set(authHeader()).field('actividad_id', '1');
    expect(res.status).toBe(400);
  });

  it('POST importar procesa filas CSV', async () => {
    const csv =
      'nombres,apellidos,tipo_documento,numero_documento,email\n' +
      'Ana,García,DNI,87654321,ana@example.com\n' +
      'Bad,,DNI,111,not-email\n';
    let dupCalls = 0;
    const pool = createMockPool([
      async (sql, params, src) => {
        if (sql.includes('FROM actividad_participante ap') && sql.includes('numero_documento')) {
          dupCalls += 1;
          return [[], []];
        }
        if (sql.includes('FROM actividad_participante ap') && sql.includes('p.email = ?')) {
          return [[], []];
        }
        if (src === 'conn' && sql.includes('INSERT INTO participantes')) return [[{ insertId: 100 + dupCalls }], []];
        if (src === 'conn' && sql.includes('INSERT INTO actividad_participante')) return [[{ insertId: 1 }], []];
        if (sql.includes('IMPORT_PARTICIPANTES')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app)
      .post(`${base}/importar`)
      .set(authHeader())
      .field('actividad_id', '1')
      .attach('archivo', Readable.from([csv]), { filename: 'p.csv', contentType: 'text/csv' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.procesados).toBe(1);
    expect(res.body.errores).toBeGreaterThanOrEqual(1);
  });

  it('POST validar-apto 400 sin actividad_id', async () => {
    const pool = createMockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/10/validar-apto`).set(authHeader()).send({});
    expect(res.status).toBe(400);
  });

  it('POST validar-apto 404 sin vínculo', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM actividad_participante ap')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/10/validar-apto`).set(authHeader()).send({ actividad_id: 1 });
    expect(res.status).toBe(404);
  });

  it('POST validar-apto 422 datos inconsistentes en fila', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM actividad_participante ap')) {
          return [
            [
              {
                id: 99,
                nombres: 'X',
                apellidos: 'Y',
                tipo_documento: 'DNI',
                numero_documento: '12',
                email: 'bad@example.com'
              }
            ],
            []
          ];
        }
        if (sql.includes('UPDATE actividad_participante SET estado_validacion')) return [[{ affectedRows: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/10/validar-apto`).set(authHeader()).send({ actividad_id: 1 });
    expect(res.status).toBe(422);
  });

  it('POST validar-apto 200 APTO', async () => {
    const pool = createMockPool([
      async (sql) => {
        if (sql.includes('FROM actividad_participante ap')) {
          return [
            [
              {
                id: 99,
                nombres: 'Ana',
                apellidos: 'López',
                tipo_documento: 'DNI',
                numero_documento: '44556677',
                email: 'ana@example.com'
              }
            ],
            []
          ];
        }
        if (sql.includes('UPDATE actividad_participante SET estado_validacion')) return [[{ affectedRows: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post(`${base}/10/validar-apto`).set(authHeader()).send({ actividad_id: 1 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
