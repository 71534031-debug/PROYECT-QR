require('dotenv').config();
const { createApp } = require('./app');
const { getPool } = require('./config/db');

const pool = getPool();
const app = createApp({ pool });
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
