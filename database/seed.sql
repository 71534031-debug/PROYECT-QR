-- Desarrollo: admin@cip.local / Password123
USE certificados_db;
INSERT INTO usuarios (email, password_hash, nombre, rol, activo) VALUES
('admin@cip.local', '$2b$10$xp.nRdRkuzhHD6QEEH9w9uSqttLk6oyRfkbQq3WON.9BYJ6xYP.5G', 'Administrador', 'ADMIN', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password_hash = VALUES(password_hash);

INSERT INTO usuarios (email, password_hash, nombre, rol, activo) VALUES
('staff@cip.local', '$2b$10$xp.nRdRkuzhHD6QEEH9w9uSqttLk6oyRfkbQq3WON.9BYJ6xYP.5G', 'Personal', 'ADMINISTRATIVO', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password_hash = VALUES(password_hash);
