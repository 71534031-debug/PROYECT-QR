CREATE DATABASE IF NOT EXISTS certificados_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE certificados_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  rol ENUM('ADMIN','ADMINISTRATIVO') NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  user_agent VARCHAR(512) NULL,
  ip VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  ip VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS actividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  responsable VARCHAR(200) NOT NULL,
  creado_por_usuario_id INT NULL,
  actualizado_por_usuario_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por_usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (actualizado_por_usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS participantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  tipo_documento ENUM('DNI','CE','PASAPORTE','OTRO') NOT NULL,
  numero_documento VARCHAR(40) NOT NULL,
  email VARCHAR(254) NOT NULL,
  telefono VARCHAR(30) NULL,
  codigo_cip VARCHAR(40) NULL,
  institucion VARCHAR(120) NULL,
  cargo VARCHAR(80) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS actividad_participante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actividad_id INT NOT NULL,
  participante_id INT NOT NULL,
  estado_validacion ENUM('PENDIENTE_VALIDACION','APTO','CON_OBSERVACION','BLOQUEADO') NOT NULL DEFAULT 'PENDIENTE_VALIDACION',
  observaciones TEXT NULL,
  UNIQUE KEY uq_actividad_participante (actividad_id, participante_id),
  FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
  FOREIGN KEY (participante_id) REFERENCES participantes(id) ON DELETE CASCADE
);

CREATE INDEX idx_ap_actividad ON actividad_participante(actividad_id);

CREATE TABLE IF NOT EXISTS plantillas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  contenido MEDIUMTEXT NOT NULL,
  activa TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS configuracion_institucional (
  id INT PRIMARY KEY,
  nombre_institucion VARCHAR(255) NOT NULL,
  logo_url VARCHAR(512) NULL,
  firma_url VARCHAR(512) NULL,
  cargo_autoridad VARCHAR(200) NOT NULL,
  nombre_autoridad VARCHAR(200) NOT NULL,
  nombre_app VARCHAR(200) NULL DEFAULT 'Sistema QR',
  email_contacto VARCHAR(254) NULL,
  telefono_contacto VARCHAR(30) NULL,
  direccion VARCHAR(255) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_unico CHAR(36) NOT NULL UNIQUE,
  actividad_id INT NOT NULL,
  participante_id INT NOT NULL,
  plantilla_id INT NOT NULL,
  estado ENUM('EMITIDO','REVOCADO','REEMPLAZADO') NOT NULL DEFAULT 'EMITIDO',
  ruta_pdf VARCHAR(512) NOT NULL,
  fecha_emision DATETIME NOT NULL,
  emitido_por_usuario_id INT NOT NULL,
  reemplazado_por_id INT NULL,
  FOREIGN KEY (actividad_id) REFERENCES actividades(id),
  FOREIGN KEY (participante_id) REFERENCES participantes(id),
  FOREIGN KEY (plantilla_id) REFERENCES plantillas(id),
  FOREIGN KEY (emitido_por_usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (reemplazado_por_id) REFERENCES certificados(id)
);

CREATE TABLE IF NOT EXISTS auditoria_eventos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  accion VARCHAR(80) NOT NULL,
  entidad_tipo VARCHAR(80) NULL,
  entidad_id BIGINT NULL,
  detalle_json JSON NULL,
  ip VARCHAR(45) NULL,
  user_agent TEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
