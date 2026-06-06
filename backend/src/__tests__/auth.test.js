const request = require('supertest');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { createApp } = require('../app');

function mockPool(handlers) {
  const query = jest.fn(async (sql, params) => {
    for (const h of handlers) {
      const out = await h(sql, params);
      if (out !== undefined) return out;
    }
    return [[], []];
  });
  const getConnection = jest.fn(async () => ({
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    query
  }));
  return { query, getConnection };
}

function accessToken(userId = 1, rol = 'ADMIN') {
  return jwt.sign({ sub: userId, rol, typ: 'access' }, process.env.JWT_SECRET, { expiresIn: '30m' });
}

describe('POST /api/auth/login', () => {
  it('401 credenciales inválidas (RF-01 error)', async () => {
    const pool = mockPool([
      async (sql) => {
        if (sql.includes('FROM usuarios')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/login').send({ email: 'x@y.com', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('200 login ok con token y usuario (RF-01 feliz)', async () => {
    const hash = await bcrypt.hash('Password123', 4);
    const pool = mockPool([
      async (sql, params) => {
        if (sql.includes('FROM usuarios')) {
          return [
            [
              {
                id: 1,
                email: params[0],
                password_hash: hash,
                nombre: 'Admin',
                rol: 'ADMIN',
                activo: 1
              }
            ],
            []
          ];
        }
        if (sql.includes('INSERT INTO refresh_tokens')) return [[{ insertId: 1 }], []];
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'Password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.rol).toBe('ADMIN');
  });
});

describe('POST /api/auth/refresh', () => {
  it('400 sin refreshToken', async () => {
    const pool = mockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/refresh').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('401 token refresh no encontrado', async () => {
    const pool = mockPool([
      async (sql) => {
        if (sql.includes('FROM refresh_tokens rt')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken: 'deadbeef' });
    expect(res.status).toBe(401);
  });

  it('200 devuelve nuevo access token', async () => {
    const raw = crypto.randomBytes(8).toString('hex');
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    const pool = mockPool([]);
    pool.query.mockImplementation(async (sql, params) => {
      if (sql.includes('FROM refresh_tokens rt') && params[0] === hash) {
        return [
          [
            {
              rt_id: 1,
              usuario_id: 7,
              rol: 'ADMINISTRATIVO',
              activo: 1,
              nombre: 'Staff'
            }
          ],
          []
        ];
      }
      return [[], []];
    });
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken: raw });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.id).toBe(7);
  });
});

describe('POST /api/auth/logout', () => {
  it('200 con Bearer y refreshToken revoca hash', async () => {
    const raw = crypto.randomBytes(8).toString('hex');
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    const updates = [];
    const pool = mockPool([
      async (sql, params) => {
        if (sql.includes('UPDATE refresh_tokens SET revoked_at')) {
          updates.push({ hash: params[0] });
          return [[{ affectedRows: 1 }], []];
        }
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken()}`)
      .send({ refreshToken: raw });
    expect(res.status).toBe(200);
    expect(updates.some((u) => u.hash === hash)).toBe(true);
  });
});

describe('POST /api/auth/forgot-password', () => {
  it('200 aunque el correo no exista (no filtra)', async () => {
    const pool = mockPool([
      async (sql) => {
        if (sql.includes('FROM usuarios WHERE email')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'nadie@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/instrucciones/i);
  });

  it('200 usuario activo inserta token reset', async () => {
    const inserts = [];
    const pool = mockPool([
      async (sql, params) => {
        if (sql.includes('FROM usuarios WHERE email')) {
          return [[{ id: 3, activo: 1 }], []];
        }
        if (sql.includes('INSERT INTO password_reset_tokens')) {
          inserts.push(params);
          return [[{ insertId: 1 }], []];
        }
        if (sql.includes('INSERT INTO auditoria_eventos')) return [[{ insertId: 1 }], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'user@example.com' });
    expect(res.status).toBe(200);
    expect(inserts.length).toBeGreaterThanOrEqual(1);
  });
});

describe('POST /api/auth/reset-password', () => {
  it('400 sin token o contraseña', async () => {
    const pool = mockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/reset-password').send({ token: 'x' });
    expect(res.status).toBe(400);
  });

  it('422 política de contraseña', async () => {
    const pool = mockPool([]);
    const app = createApp({ pool });
    const res = await request(app).post('/api/auth/reset-password').send({ token: 'abc', new_password: 'corta' });
    expect(res.status).toBe(422);
  });

  it('400 enlace inválido', async () => {
    const pool = mockPool([
      async (sql) => {
        if (sql.includes('FROM password_reset_tokens')) return [[], []];
        return undefined;
      }
    ]);
    const app = createApp({ pool });
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'nohashmatch', new_password: 'NuevaPass99' });
    expect(res.status).toBe(400);
  });

  it('200 restablece y marca token usado', async () => {
    const plain = crypto.randomBytes(16).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(plain).digest('hex');
    const steps = [];
    const pool = mockPool([]);
    pool.query.mockImplementation(async (sql, params) => {
      if (sql.includes('FROM password_reset_tokens') && params[0] === tokenHash) {
        return [[{ id: 10, usuario_id: 5 }], []];
      }
      if (sql.includes('UPDATE usuarios SET password_hash')) {
        steps.push('password');
        return [[{ affectedRows: 1 }], []];
      }
      if (sql.includes('UPDATE password_reset_tokens SET used_at')) {
        steps.push('used');
        return [[{ affectedRows: 1 }], []];
      }
      if (sql.includes('UPDATE refresh_tokens SET revoked_at')) {
        steps.push('revoke_refresh');
        return [[{ affectedRows: 1 }], []];
      }
      if (sql.includes('INSERT INTO auditoria_eventos')) {
        steps.push('audit');
        return [[{ insertId: 1 }], []];
      }
      return [[], []];
    });
    const app = createApp({ pool });
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: plain, new_password: 'NuevaPass99' });
    expect(res.status).toBe(200);
    expect(steps).toContain('password');
    expect(steps).toContain('used');
  });
});
