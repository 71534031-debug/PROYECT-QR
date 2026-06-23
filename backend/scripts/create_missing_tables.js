require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'certificados_db',
    waitForConnections: true,
    connectionLimit: 1,
  });

  await pool.query(`CREATE TABLE IF NOT EXISTS plantilla_campos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plantilla_id INT NOT NULL,
    placeholder VARCHAR(100) NOT NULL,
    x FLOAT NOT NULL DEFAULT 50,
    y FLOAT NOT NULL DEFAULT 50,
    font_size INT NOT NULL DEFAULT 16,
    alignment ENUM('left','center','right') NOT NULL DEFAULT 'center',
    color VARCHAR(20) NOT NULL DEFAULT '#1a1a2e',
    width FLOAT NOT NULL DEFAULT 200,
    height FLOAT NOT NULL DEFAULT 30,
    orden INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plantilla_id) REFERENCES plantillas(id) ON DELETE CASCADE,
    UNIQUE KEY uq_plantilla_placeholder (plantilla_id, placeholder)
  )`);
  console.log('OK: plantilla_campos table created');

  // Also ensure plantillas has correct columns
  try {
    await pool.query('ALTER TABLE plantillas MODIFY COLUMN contenido MEDIUMTEXT NULL');
    console.log('OK: contenido column is nullable');
  } catch (e) {
    console.log('contenido column:', e.message);
  }
  try {
    await pool.query('ALTER TABLE plantillas ADD COLUMN imagen_fondo VARCHAR(512) NULL AFTER contenido');
  } catch (e) {
    if (e.errno !== 1060) console.log('imagen_fondo column:', e.message);
  }

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
