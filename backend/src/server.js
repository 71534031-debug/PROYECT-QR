require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createApp } = require('./app');
const { getPool } = require('./config/db');

const uploadDirs = [
  path.join(__dirname, '..', 'uploads', 'certificados'),
  path.join(__dirname, '..', 'uploads', 'images'),
];
for (const dir of uploadDirs) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const pool = getPool();
const app = createApp({ pool });
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
