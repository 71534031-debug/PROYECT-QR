const mysql = require('mysql2/promise');

let mysqlPool = null;
let pgPool = null;

function isPostgres() {
  const t = (process.env.DB_TYPE || 'mysql').toLowerCase();
  return t === 'postgresql' || t === 'postgres';
}

function createMySQLPool() {
  if (mysqlPool) return mysqlPool;
  if (process.env.NODE_ENV === 'test' && !process.env.MYSQL_HOST) return null;
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'certificados_db',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
  });
  return mysqlPool;
}

function createPgPool() {
  if (pgPool) return pgPool;
  const { Pool } = require('pg');
  pgPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'certificados_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 10,
  });
  return pgPool;
}

function convertParams(sql) {
  let idx = 0;
  return sql.replace(/\?/g, () => `$${++idx}`);
}

async function mysqlQuery(pool, sql, params) {
  const [rows] = await pool.query(sql, params);
  return [rows];
}

async function mysqlGetConnection(pool) {
  const conn = await pool.getConnection();
  return {
    query: (sql, params) => conn.query(sql, params).then(([rows]) => [rows]),
    beginTransaction: () => conn.beginTransaction(),
    commit: () => conn.commit(),
    rollback: () => conn.rollback(),
    release: () => conn.release(),
  };
}

async function pgQuery(pool, sql, params) {
  const pgSql = convertParams(sql);
  const isInsert = /^\s*INSERT\s/i.test(pgSql);
  if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
    const r = await pool.query(pgSql + ' RETURNING id', params);
    return [{ insertId: r.rows[0]?.id ?? 0, affectedRows: r.rowCount }];
  }
  const r = await pool.query(pgSql, params);
  return [r.rows];
}

async function pgGetConnection(pool) {
  const client = await pool.connect();
  return {
    query: (sql, params) => {
      const pgSql = convertParams(sql);
      return client.query(pgSql, params).then(r => [r.rows]);
    },
    beginTransaction: () => client.query('BEGIN'),
    commit: () => client.query('COMMIT'),
    rollback: () => client.query('ROLLBACK'),
    release: () => client.release(),
  };
}

function jsonObject(pairs) {
  if (isPostgres()) {
    const items = pairs.map(([k, v]) => `'${k}', ${v}`).join(', ');
    return `jsonb_build_object(${items})`;
  }
  const items = pairs.map(([k, v]) => `'${k}', ${v}`).join(', ');
  return `JSON_OBJECT(${items})`;
}

function onDuplicateUpdate(table, conflictCol, cols) {
  if (isPostgres()) {
    const setClause = cols.map(c => `${c} = EXCLUDED.${c}`).join(', ');
    return `ON CONFLICT (${conflictCol}) DO UPDATE SET ${setClause}`;
  }
  const setClause = cols.map(c => `${c} = VALUES(${c})`).join(', ');
  return `ON DUPLICATE KEY UPDATE ${setClause}`;
}

function getPool() {
  if (isPostgres()) {
    const pool = createPgPool();
    if (!pool) return null;
    return {
      query: (sql, params) => pgQuery(pool, sql, params),
      getConnection: () => pgGetConnection(pool),
      end: () => pool.end(),
    };
  }
  const pool = createMySQLPool();
  if (!pool) return null;
  return {
    query: (sql, params) => mysqlQuery(pool, sql, params),
    getConnection: () => mysqlGetConnection(pool),
    end: () => pool.end(),
  };
}

module.exports = { getPool, isPostgres, jsonObject, onDuplicateUpdate };
