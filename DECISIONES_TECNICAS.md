# Decisiones técnicas — Cierre de pendientes (MASTER_SPEC)

Documento de registro de decisiones arquitectónicas que cierran los puntos antes marcados como pendientes en `MASTER_SPEC.md` y especificaciones relacionadas (`DOCUMENTOS/`). Todas las entradas de esta versión quedan en estado **✅ Cerrado**.

---

## Pendiente: Flujo exacto de recuperación de contraseña

**Decisión tomada:** Flujo estándar con **token opaco de un solo uso**. El usuario solicita recuperación solo con **correo** en `POST /api/auth/forgot-password`. El backend responde siempre con **mensaje neutro** (HTTP 200) sin revelar si el correo existe. Si el usuario existe y está **activo**, se genera un token aleatorio (≥32 bytes), se persiste **solo el hash** (SHA-256) en `password_reset_tokens`, caducidad **60 minutos**, un solo uso. Se envía correo (nodemailer) con enlace `https://{FRONTEND}/restablecer-contrasena?token={TOKEN_PLANO}`. Pantalla de reset envía `POST /api/auth/reset-password` con `token`, `new_password` y confirmación. Tras éxito: contraseña con **bcrypt**, marcar token como usado, **revocar todos los refresh tokens** del usuario y opcionalmente invalidar otros tokens de reset pendientes del mismo usuario. **Rate limiting:** máx. **5** solicitudes por hora por IP y por email. Validación de contraseña nueva: mínimo **10** caracteres, al menos una mayúscula, una minúscula y un dígito.

**Estado:** ✅ Cerrado

---

## Pendiente: Control de sesión (logout, expiración)

**Decisión tomada:** **Access JWT** de corta duración + **refresh token opaco** persistido en base de datos. **Access:** expiración **30 minutos**, algoritmo **HS256**, uso en cabecera `Authorization: Bearer`. **Refresh:** cadena aleatoria persistida como **hash**, TTL **7 días** desde emisión. **Login** (`POST /api/auth/login`) devuelve access + refresh (refresh preferiblemente en **cookie httpOnly Secure SameSite=Strict** si el despliegue permite credenciales CORS; si no, entrega en cuerpo JSON documentando el riesgo residual XSS). **Logout** (`POST /api/auth/logout`) revoca el refresh recibido (y opcionalmente solo el actual). **Renovación** (`POST /api/auth/refresh`) valida refresh no revocado ni expirado y emite nuevo par access + refresh (sin rotación obligatoria en v1 para simplicidad). **Sesiones concurrentes:** permitidas (varias filas `refresh_tokens` por usuario con `user_agent` e `ip`). **Cambio o reset de contraseña:** revocación masiva de todos los refresh del usuario. **Tiempo máximo de sesión:** inactividad efectiva acotada por expiración del access salvo refresh; límite absoluto **7 días** por caducidad del refresh.

**Estado:** ✅ Cerrado

---

## Pendiente: Estructura exacta de JWT y middleware de roles

**Decisión tomada:** Payload mínimo del access JWT (claims): `sub` (id numérico de usuario interno), `rol` (`ADMIN` | `ADMINISTRATIVO`), `typ` (`access`), `iat`, `exp`. No incluir datos sensibles ni listas de permisos extensas en el token. **Middleware `authenticate`:** verifica firma con `JWT_SECRET`, `exp`, `typ === "access"`, adjunta `req.user = { id, rol }`. **Middleware `requireRoles(...roles)`:** comprueba `req.user.rol` y responde **403** si no coincide. **Matriz de rutas:** configuración institucional y acciones de revocación/reemisión de certificados solo **ADMIN**; operación diaria (actividades, participantes, generación, historial, plantillas según política institucional) **ADMIN** y **ADMINISTRATIVO** salvo que una ruta se restrinja explícitamente solo a **ADMIN** (p. ej. `PUT /api/configuracion`). Endpoints públicos: login, forgot/reset, validación pública, descarga con token de entrega (ver apartado de descarga).

**Estado:** ✅ Cerrado

---

## Pendiente: Seguridad exacta de descarga pública

**Decisión tomada:** **No** habrá descarga de PDF por `GET /api/certificados/:id/descargar` sin autenticación. **Dos canales:** (1) **Personal interno:** `GET /api/certificados/:id/descargar` con **JWT access** válido y comprobación de que el certificado existe (opcional: rol puede descargar cualquier certificado emitido por la institución). (2) **Participante / enlace en correo:** `GET /api/entrega/descargar?t={TOKEN_DESCARGA}` sin sesión, donde `TOKEN_DESCARGA` es un **JWT firmado** separado del de sesión, claims: `typ: "cert_download"`, `sub` o claim dedicado `certificado_id`, `exp` **48 horas**, firmado con clave distinta o mismo secreto con `typ` discriminado. Respuestas **404** uniformes para token inválido o expirado. **Rate limiting** en ruta pública (p. ej. 30 solicitudes/minuto por IP). El **código único** del certificado **no** sustituye solo a la descarga sin token (evita enumeración masiva si el código se filtra en otro contexto la descarga sigue acotada por JWT de entrega en flujo de correo).

**Estado:** ✅ Cerrado

---

## Pendiente: Campos obligatorios exactos finales de participantes

**Decisión tomada:** Estructura mínima obligatoria alineada a REQ y API: `nombres` (texto 2–80), `apellidos` (texto 2–80), `tipo_documento` (enum: `DNI`, `CE`, `PASAPORTE`, `OTRO`), `numero_documento` (obligatorio; si `DNI`: exactamente **8 dígitos**; si `CE`: alfanumérico 9–12; otros: texto 4–20), `email` (formato RFC simplificado, max 254, normalizado a minúsculas trim), `actividad_id` (FK). **Unicidad dentro de la misma actividad:** par `(tipo_documento, numero_documento)` y recomendado también `(actividad_id, email)` para evitar duplicados lógicos. **Opcionales:** `telefono` (E.164 preferente), `codigo_cip`, `institucion`, `cargo`. Estado en vínculo actividad-participante: `PENDIENTE_VALIDACION` | `APTO` | `CON_OBSERVACION` | `BLOQUEADO` para gobernar emisión (solo **APTO** emite).

**Estado:** ✅ Cerrado

---

## Pendiente: Estructura mínima obligatoria de plantilla

**Decisión tomada:** La plantilla se almacena como **contenido HTML** (o texto enriquecido) con **lista cerrada de placeholders obligatorios** validados en backend al crear/editar. Placeholders obligatorios que deben aparecer literalmente en el contenido: `{{NOMBRE_COMPLETO}}`, `{{DOCUMENTO}}` (concatenación tipo + número para visualización), `{{ACTIVIDAD_NOMBRE}}`, `{{FECHA_EMISION}}`, `{{CODIGO_UNICO}}`, `{{QR}}` (zona reservada donde el motor inserta imagen QR), `{{LOGO_INSTITUCION}}`, `{{NOMBRE_AUTORIDAD}}`, `{{CARGO_AUTORIDAD}}`, `{{FIRMA_AUTORIDAD}}` (imagen desde configuración). **Personalizable:** textos introductorios y cierre, orden dentro de márgenes definidos por constantes del generador PDF. **Restricciones visuales:** márgenes mínimos laterales 20 mm; QR mínimo **120×120 px** en PDF; código único en bloque legible bajo el QR. **No eliminables por validación:** presencia de los placeholders anteriores; el sistema rechaza guardar plantilla si falta alguno.

**Estado:** ✅ Cerrado

---

## Pendiente: Relación usuarios-auditoría / ownership en modelo de datos

**Decisión tomada:** Tabla **`auditoria_eventos`** con columnas: `id`, `usuario_id` (FK a `usuarios`, **NULL** para eventos públicos o sistema), `accion` (varchar/enum estable), `entidad_tipo` (varchar), `entidad_id` (bigint nullable), `detalle_json` (JSON, sin secretos ni tokens en claro), `ip` (varchar 45), `user_agent` (text), `creado_en` (datetime UTC). **Ownership en emisión:** en `certificados` añadir `emitido_por_usuario_id` (FK a `usuarios`) obligatorio al generar lote. **Actividades (opcional v1 pero recomendado):** `creado_por_usuario_id` / `actualizado_por_usuario_id` en `actividades` para trazabilidad de quién registró. Eventos mínimos a registrar: `LOGIN_OK`, `LOGIN_FAIL`, `LOGOUT`, `PASSWORD_RESET_REQUEST`, `PASSWORD_RESET_OK`, `ACTIVIDAD_CREADA`, `ACTIVIDAD_EDITADA`, `PARTICIPANTE_CREADO`, `IMPORT_PARTICIPANTES`, `CERTIFICADOS_GENERADOS`, `CERTIFICADO_EMAIL_ENVIADO` / `FALLIDO`, `CERTIFICADO_DESCARGA`, `VALIDACION_PUBLICA`, `CONFIG_ACTUALIZADA`, `PLANTILLA_CREADA` / `EDITADA` / `ELIMINADA`, `CERTIFICADO_REVOCADO`, `CERTIFICADO_REEMITIDO`.

**Estado:** ✅ Cerrado

---

## Pendiente: Formato exacto del QR (URL / base64 / imagen)

**Decisión tomada:** El **contenido codificado en el QR** es una **URL HTTPS absoluta** (texto plano estándar), no base64 del PDF ni JWT embebido. Formato literal: `https://{DOMINIO_FRONT_PUBLICO}/validar?c={CODIGO_UNICO}` donde `{CODIGO_UNICO}` es el mismo identificador opaco almacenado en BD (recomendado **UUID v4** en string minúsculas) usado por `GET /api/validacion?codigo_unico=`. En el **PDF**, el QR se renderiza como **imagen** generada a partir de esa cadena URL. Ejemplo: `https://certificados.ejemplo.gob.pe/validar?c=a1f2c9e4-7b3d-4a1e-9c0d-8f6e5d4c3b2a`.

**Estado:** ✅ Cerrado

---

## Pendiente: Política de vigencia / expiración de certificados

**Decisión tomada:** **Sin caducidad automática por tiempo** en la versión actual (los certificados académicos no expiran salvo normativa futura explícita). Campo `estado` en `certificados`: **`EMITIDO`** (válido en validación pública si no hay otra causa de invalidez), **`REVOCADO`** (nunca mostrar como válido; mensaje controlado “Certificado revocado”), **`REEMPLAZADO`** (el código anterior deja de ser válido como certificado pleno; la API de validación devuelve `valido: false`, `estado: REEMPLAZADO` y texto orientativo a solicitar el código actualizado si existe `reemplazado_por_id` en BD). **Reemisión:** nuevo registro de certificado con nuevo `codigo_unico`, nuevo PDF y nuevo QR; el anterior pasa a `REEMPLAZADO` y enlaza al nuevo. **Revocación:** solo rol **ADMIN** (o política explícita documentada si se delega). **Reglas de negocio asociadas:** certificado revocado o reemplazado no puede aparecer como válido (coherente con RN-018/RN-019).

**Estado:** ✅ Cerrado

---

## Pendiente (alcance): Integraciones Moodle / WordPress (MASTER_SPEC §5)

**Decisión tomada:** **Fuera del alcance de la versión actual.** No se define contrato API, webhooks ni SSO en esta fase. Cualquier integración queda explícitamente pospuesta a una **versión futura** con su propia ficha de requisitos; el sistema actual se entrega como **standalone** (React + API + MySQL).

**Estado:** ✅ Cerrado

---

## Pendiente (API_SPEC): Carga real de archivos multipart

**Decisión tomada:** Importación masiva de participantes mediante **`multipart/form-data`** en `POST /api/participantes/importar` con campo archivo (`archivo`) y `actividad_id`, procesado con **multer** (límites: tamaño máximo archivo **5 MB**, tipos MIME permitidos `text/csv`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`). Validación y parsing en backend; respuesta con conteo `procesados` y `errores` alineada a la especificación existente.

**Estado:** ✅ Cerrado

---

## Tabla resumen de estados

| # | Pendiente | Estado |
|---|-----------|--------|
| 1 | Flujo exacto de recuperación de contraseña | ✅ Cerrado |
| 2 | Control de sesión (logout, expiración) | ✅ Cerrado |
| 3 | Estructura exacta de JWT y middleware de roles | ✅ Cerrado |
| 4 | Seguridad exacta de descarga pública | ✅ Cerrado |
| 5 | Campos obligatorios exactos finales de participantes | ✅ Cerrado |
| 6 | Estructura mínima obligatoria de plantilla | ✅ Cerrado |
| 7 | Relación usuarios-auditoría / ownership | ✅ Cerrado |
| 8 | Formato exacto del QR | ✅ Cerrado |
| 9 | Política de vigencia / expiración de certificados | ✅ Cerrado |
| 10 | Integraciones Moodle / WordPress (alcance) | ✅ Cerrado |
| 11 | Carga real multipart (API_SPEC) | ✅ Cerrado |

**Leyenda:** ✅ Cerrado = decisión completa y aplicable a implementación sin ambigüedad bloqueante.

**Verificación de regla interna:** no queda ningún ítem en estado ⚠️ Parcial ni ❌ Pendiente aún; todos los puntos fueron resueltos hasta **✅ Cerrado** antes de cerrar el documento.
