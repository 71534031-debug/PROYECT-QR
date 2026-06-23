-- PostgreSQL Schema for PROYECT-QR
-- Compatible with Neon (Serverless PostgreSQL)

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN', 'ADMINISTRATIVO')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  token_hash CHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  user_agent VARCHAR(512) NULL,
  ip VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  token_hash CHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  ip VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS actividades (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  responsable VARCHAR(200) NOT NULL,
  creado_por_usuario_id INT NULL REFERENCES usuarios(id),
  actualizado_por_usuario_id INT NULL REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS participantes (
  id SERIAL PRIMARY KEY,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  tipo_documento VARCHAR(20) NOT NULL CHECK (tipo_documento IN ('DNI', 'CE', 'PASAPORTE', 'OTRO')),
  numero_documento VARCHAR(40) NOT NULL,
  email VARCHAR(254) NOT NULL,
  telefono VARCHAR(30) NULL,
  codigo_cip VARCHAR(40) NULL,
  institucion VARCHAR(120) NULL,
  cargo VARCHAR(80) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS actividad_participante (
  id SERIAL PRIMARY KEY,
  actividad_id INT NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
  participante_id INT NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
  estado_validacion VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE_VALIDACION' CHECK (estado_validacion IN ('PENDIENTE_VALIDACION', 'APTO', 'CON_OBSERVACION', 'BLOQUEADO')),
  observaciones TEXT NULL,
  UNIQUE (actividad_id, participante_id)
);

CREATE INDEX idx_ap_actividad ON actividad_participante(actividad_id);

CREATE TABLE IF NOT EXISTS plantillas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  contenido TEXT NULL,
  imagen_fondo VARCHAR(512) NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plantilla_campos (
  id SERIAL PRIMARY KEY,
  plantilla_id INT NOT NULL REFERENCES plantillas(id) ON DELETE CASCADE,
  placeholder VARCHAR(100) NOT NULL,
  x FLOAT NOT NULL DEFAULT 50,
  y FLOAT NOT NULL DEFAULT 50,
  font_size INT NOT NULL DEFAULT 16,
  alignment VARCHAR(10) NOT NULL DEFAULT 'center' CHECK (alignment IN ('left', 'center', 'right')),
  color VARCHAR(20) NOT NULL DEFAULT '#1a1a2e',
  width FLOAT NOT NULL DEFAULT 200,
  height FLOAT NOT NULL DEFAULT 30,
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (plantilla_id, placeholder)
);

CREATE TABLE IF NOT EXISTS configuracion_institucional (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nombre_institucion VARCHAR(255) NOT NULL DEFAULT '',
  logo_url VARCHAR(512) NULL,
  firma_url VARCHAR(512) NULL,
  cargo_autoridad VARCHAR(200) NOT NULL DEFAULT '',
  nombre_autoridad VARCHAR(200) NOT NULL DEFAULT '',
  nombre_app VARCHAR(200) NULL DEFAULT 'Sistema QR',
  email_contacto VARCHAR(254) NULL,
  telefono_contacto VARCHAR(30) NULL,
  direccion VARCHAR(255) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificados (
  id SERIAL PRIMARY KEY,
  codigo_unico UUID NOT NULL UNIQUE,
  actividad_id INT NOT NULL REFERENCES actividades(id),
  participante_id INT NOT NULL REFERENCES participantes(id),
  plantilla_id INT NOT NULL REFERENCES plantillas(id),
  estado VARCHAR(20) NOT NULL DEFAULT 'EMITIDO' CHECK (estado IN ('EMITIDO', 'REVOCADO', 'REEMPLAZADO')),
  ruta_pdf VARCHAR(512) NOT NULL,
  fecha_emision TIMESTAMP NOT NULL,
  emitido_por_usuario_id INT NOT NULL REFERENCES usuarios(id),
  reemplazado_por_id INT NULL REFERENCES certificados(id)
);

CREATE TABLE IF NOT EXISTS auditoria_eventos (
  id BIGSERIAL PRIMARY KEY,
  usuario_id INT NULL REFERENCES usuarios(id),
  accion VARCHAR(80) NOT NULL,
  entidad_tipo VARCHAR(80) NULL,
  entidad_id BIGINT NULL,
  detalle_json JSONB NULL,
  ip VARCHAR(45) NULL,
  user_agent TEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
