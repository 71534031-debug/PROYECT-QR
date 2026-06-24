// Sistema de Certificados QR — Punto de entrada backend
// ISO 9001:2015 — Gestión de Calidad

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', (req, res, next) => { console.log(`${req.method} ${req.path}`); next(); });

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/actividades', require('./routes/actividades.routes'));
app.use('/api/participantes', require('./routes/participantes.routes'));
app.use('/api/plantillas', require('./routes/plantillas.routes'));
app.use('/api/certificados', require('./routes/certificados.routes'));
app.use('/api/configuracion', require('./routes/configuracion.routes'));
app.use('/api/validacion', require('./routes/validacion.routes'));
app.use('/api/entrega', require('./routes/entrega.routes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Error interno del servidor' });
});

module.exports = app;
