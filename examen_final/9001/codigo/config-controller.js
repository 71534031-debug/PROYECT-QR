// Controlador de Configuración Institucional
// ISO 9001:2015 — Gestión de Recursos

const pool = require('../config/db');

exports.getConfig = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM configuracion_institucional LIMIT 1');
    if (rows.length === 0) return res.status(200).json({ success: true, data: null });
    return res.status(200).json({ success: true, data: rows[0] });
};

exports.updateConfig = async (req, res) => {
    const { nombre_institucion, nombre_aplicacion, nombre_autoridad, cargo_autoridad,
            email_contacto, telefono_contacto, direccion_contacto } = req.body;
    const [existing] = await pool.query('SELECT id FROM configuracion_institucional LIMIT 1');
    if (existing.length > 0) {
        await pool.query('UPDATE configuracion_institucional SET ? WHERE id = ?', [req.body, existing[0].id]);
    } else {
        await pool.query('INSERT INTO configuracion_institucional SET ?', req.body);
    }
    const [updated] = await pool.query('SELECT * FROM configuracion_institucional LIMIT 1');
    return res.status(200).json({ success: true, data: updated[0] });
};

exports.uploadImage = async (req, res) => {
    const tipo = req.params.tipo; // 'logo' o 'firma'
    if (!req.file) return res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
    const campoUrl = `${tipo}_url`;
    const campoPath = `${tipo}_path`;
    await pool.query(`UPDATE configuracion_institucional SET ${campoUrl} = ?, ${campoPath} = ? WHERE id = 1`, 
                     [`/uploads/${req.file.filename}`, req.file.path]);
    return res.status(200).json({ success: true, message: `${tipo} actualizado correctamente`, data: { url: `/uploads/${req.file.filename}` } });
};

exports.deleteImage = async (req, res) => {
    const tipo = req.params.tipo;
    const campoUrl = `${tipo}_url`;
    const campoPath = `${tipo}_path`;
    await pool.query(`UPDATE configuracion_institucional SET ${campoUrl} = NULL, ${campoPath} = NULL WHERE id = 1`);
    return res.status(200).json({ success: true, message: `${tipo} eliminado correctamente` });
};
