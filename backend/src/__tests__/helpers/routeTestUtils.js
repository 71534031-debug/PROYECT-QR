const jwt = require('jsonwebtoken');

/**
 * Pool mock: handlers receive (sql, params, source) where source is 'pool' | 'conn'.
 * Return undefined to fall through; return [rows, fields] tuple to use as mysql2 result.
 */
function createMockPool(handlers = []) {
  const query = jest.fn(async (sql, params = []) => {
    for (const h of handlers) {
      const out = await h(sql, params, 'pool');
      if (out !== undefined) return out;
    }
    return [[], []];
  });
  const getConnection = jest.fn(async () => ({
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    query: jest.fn(async (sql, params = []) => {
      for (const h of handlers) {
        const out = await h(sql, params, 'conn');
        if (out !== undefined) return out;
      }
      return [[], []];
    })
  }));
  return { query, getConnection };
}

function authHeader(rol = 'ADMIN', userId = 1) {
  const token = jwt.sign({ sub: userId, rol, typ: 'access' }, process.env.JWT_SECRET, { expiresIn: '30m' });
  return { Authorization: `Bearer ${token}` };
}

module.exports = { createMockPool, authHeader };
