# Definición funcional (consolidado)

Fuente: `MASTER_SPEC.md`, `CRITERIOS_ACEPTACION.md`, `DECISIONES_TECNICAS.md`, `DOCUMENTOS/` (requerimientos y API).

## RF-01 Autenticación interna
Login con email y contraseña; JWT access + refresh; logout; recuperación y reset de contraseña según `DECISIONES_TECNICAS.md`; roles `ADMIN` y `ADMINISTRATIVO`.

## RF-02 Actividades académicas
CRUD de actividades con: nombre, tipo, fechas inicio/fin, descripción, responsable; validación y duplicados (nombre + fechas clave).

## RF-03 Participantes
Alta manual e importación CSV/Excel (multipart); asociación a actividad; duplicados por actividad.

## RF-04 Validación de participantes
Campos obligatorios y estados `PENDIENTE_VALIDACION` | `APTO` | `CON_OBSERVACION` | `BLOQUEADO` según `DECISIONES_TECNICAS.md`; solo `APTO` para emisión.

## RF-05 Plantillas
CRUD; contenido HTML con placeholders obligatorios validados en backend.

## RF-06–RF-08 Certificados
Generación masiva PDF por participante apto; código único UUID; QR con URL pública de validación; persistencia metadatos + archivo; `emitido_por_usuario_id`; estados `EMITIDO` | `REVOCADO` | `REEMPLAZADO`.

## RF-09 Entrega
Descarga staff con JWT; descarga participante con JWT `cert_download` (48 h); correo con enlace opcional.

## RF-10 Validación pública
Por `codigo_unico` o ruta QR; respuesta válido/inválido y datos básicos; estados revocados/reemplazados no válidos.

## RF-11 Historial
Listado con filtros `actividad_id`, `participante_id`.

## RF-12 Configuración institucional
Solo `ADMIN`: nombre institución, logo, firma, cargo y nombre de autoridad; requerido antes de emitir (RN-020).

## Auditoría
Tabla `auditoria_eventos` y eventos listados en `DECISIONES_TECNICAS.md`.
