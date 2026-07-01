const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const http = require('http');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbCI6IkFETUlOIiwidHlwIjoiYWNjZXNzIiwiaWF0IjoxNzgyOTQ3ODc4LCJleHAiOjE3ODI5NDk2Nzh9.f38xVi2qeR5KaEwOrxTrCc7CY8_nntF7t4uCyfT__Ys';
const BASE = 'http://localhost:3000/api';
const CERT_DIR = path.join(__dirname, '..', 'uploads', 'certificados');

function apiPost(urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(BASE + urlPath);
    const opts = {
      hostname: u.hostname, port: u.port, path: u.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, body: { raw: body } }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const pool = await mysql.createPool({
      host: 'localhost', port: 3307, user: 'root',
      password: 'MySQLRoot123!', database: 'certificados_db',
    });

    // Delete all certificates
    await pool.query("DELETE FROM auditoria_eventos WHERE entidad_tipo = 'certificado'");
    const [del] = await pool.query('DELETE FROM certificados');
    console.log(`Certificados eliminados de BD: ${del.affectedRows}`);

    if (fs.existsSync(CERT_DIR)) {
      const pdfs = fs.readdirSync(CERT_DIR).filter(f => f.endsWith('.pdf'));
      for (const f of pdfs) fs.unlinkSync(path.join(CERT_DIR, f));
      console.log(`PDFs eliminados del disco: ${pdfs.length}`);
    }
    await pool.end();

    // Regenerate all with plantilla 15
    const actividades = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 999, 2];
    let total = 0;
    for (const aid of actividades) {
      const r = await apiPost('/certificados/generar', { actividad_id: aid, plantilla_id: 15 });
      if (r.body.success) {
        total += r.body.generados || 0;
        console.log(`  Act ${aid}: ${r.body.generados} OK`);
      } else {
        console.log(`  Act ${aid}: ERROR ${r.body.message || r.body.msg || JSON.stringify(r.body)}`);
      }
    }
    console.log(`\nTotal generados: ${total}`);
  } catch (e) {
    console.error('FATAL:', e);
  }
})();
