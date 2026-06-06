const mysql = require('mysql2/promise');

let pool = null;

function getPool() {
  if (pool) return pool;
  if (process.env.NODE_ENV === 'test' && !process.env.MYSQL_HOST) {
    return null;
  }
  pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'certificados_db',
    waitForConnections: true,
    connectionLimit: 10
  });
  return pool;
}

module.exports = { getPool };
