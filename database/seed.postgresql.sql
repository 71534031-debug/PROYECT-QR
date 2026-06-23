-- Seed data for PostgreSQL
-- Password for both users: Password123
-- bcrypt hash: $2b$10$xp.nRdRkuzhHD6QEEH9w9uSqttLk6oyRfkbQq3WON.9BYJ6xYP.5G

INSERT INTO usuarios (email, password_hash, nombre, rol, activo)
VALUES ('admin@cip.local', '$2b$10$xp.nRdRkuzhHD6QEEH9w9uSqttLk6oyRfkbQq3WON.9BYJ6xYP.5G', 'Administrador', 'ADMIN', TRUE)
ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre, password_hash = EXCLUDED.password_hash;

INSERT INTO usuarios (email, password_hash, nombre, rol, activo)
VALUES ('staff@cip.local', '$2b$10$xp.nRdRkuzhHD6QEEH9w9uSqttLk6oyRfkbQq3WON.9BYJ6xYP.5G', 'Personal', 'ADMINISTRATIVO', TRUE)
ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre, password_hash = EXCLUDED.password_hash;
