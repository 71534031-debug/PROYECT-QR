# Matriz de Control — Sistema de Generación y Lectura de Códigos QR

> **Repositorio GitHub:** [`github.com/71534031-debug/PROYECT-QR`](https://github.com/71534031-debug/PROYECT-QR) (branch `main`)
> Cada macroproceso y funcionalidad tiene enlace directo al archivo y línea de código donde se implementa.

## Índice de Enlaces Directos al Código

| # | Macroproceso | Backend | Frontend | Base de Datos |
|---|-------------|---------|----------|---------------|
| I | Seguridad y Acceso | [`auth.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js) · [`authenticate.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) · [`requireRoles.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/requireRoles.js#L1) | [`Login.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Login.jsx#L18) · [`App.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/App.jsx#L164) · [`api.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/services/api.js#L1) | [`usuarios`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L4) · [`refresh_tokens`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L14) · [`password_reset_tokens`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L26) |
| II | Actividades | [`actividades.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js) | [`Actividades.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Actividades.jsx#L31) | [`actividades`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L37) |
| III | Participantes | [`participantes.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js) | [`Participantes.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Participantes.jsx#L17) | [`participantes`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L52) · [`actividad_participante`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L66) |
| IV | Plantillas | [`plantillas.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js) | [`Plantillas.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Plantillas.jsx#L110) · [`DropZone.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/components/DropZone.jsx#L10) | [`plantillas`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L79) · [`plantilla_campos`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L88) |
| V | Certificados | [`certificados.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js) · [`certificatePdf.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/services/certificatePdf.js#L38) | [`Certificados.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Certificados.jsx#L18) | [`certificados`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L119) |
| VI | Configuración | [`app.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L66) · [`config.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js) | [`Configuracion.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Configuracion.jsx#L17) | [`configuracion_institucional`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L105) |
| VII | Validación y Entrega | [`validacion.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js) · [`entrega.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/entrega.routes.js) | [`Validar.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Validar.jsx#L6) | `certificados.codigo_unico` |
| VIII | Auditoría y Trazabilidad | Insertado en cada módulo | — | [`auditoria_eventos`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L137) |

---

## Macroprocesos del Sistema

| N° | Macroproceso | Módulo | Responsable |
|----|-------------|--------|-------------|
| I | **GESTIÓN DE SEGURIDAD Y ACCESO** | Autenticación y Autorización | ADMIN |
| II | **GESTIÓN DE ACTIVIDADES** | Actividades | ADMIN / ADMINISTRATIVO |
| III | **GESTIÓN DE PARTICIPANTES** | Participantes | ADMIN / ADMINISTRATIVO |
| IV | **GESTIÓN DE PLANTILLAS** | Plantillas | ADMIN / ADMINISTRATIVO |
| V | **GESTIÓN DE CERTIFICADOS** | Certificados | ADMIN |
| VI | **CONFIGURACIÓN INSTITUCIONAL** | Configuración | ADMIN |
| VII | **VALIDACIÓN Y ENTREGA** | Validación QR / Entrega | Público |
| VIII | **AUDITORÍA Y TRAZABILIDAD** | Auditoría de Eventos | ADMIN |

---

## I. MACROPROCESO: GESTIÓN DE SEGURIDAD Y ACCESO
> **Código:** [`auth.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js) · [`authenticate.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) · [`requireRoles.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/requireRoles.js#L1) · [`Login.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Login.jsx#L18) · [`api.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/services/api.js#L1)

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Código |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|--------|
| 1 | Inicio de sesión | Validar credenciales (email + password) contra base de datos | Acceso no autorizado al sistema | Hash bcrypt de contraseñas, verificación en base de datos | Preventivo | Por evento | ADMIN | [`auth.routes.js#L14`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L14) |
| 2 | Generación de token JWT | Crear token access + refresh al autenticarse | Suplantación de identidad | JWT firmado con `JWT_SECRET`, payload con `id` y `rol`, expiración definida | Preventivo | Por evento | ADMIN | [`auth.routes.js#L14-L55`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L14) |
| 3 | Refrescar token | Renovar access token mediante refresh token | Sesión expirada sin posibilidad de renovación | Endpoint `/api/auth/refresh` verifica refresh token en base de datos | Correctivo | Por evento | ADMIN / ADMINISTRATIVO | [`auth.routes.js#L57`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L57) |
| 4 | Cierre de sesión | Invalidar refresh token | Sesión persistente no controlada | Eliminación del refresh token de la base de datos | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`auth.routes.js#L81`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L81) |
| 5 | Recuperación de contraseña | Enviar enlace de restablecimiento por email | Suplantación de cuenta vía correo | Token único temporizado en `password_reset_tokens`, expiración 1 hora | Preventivo | Por evento | Público | [`auth.routes.js#L96`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L96) |
| 6 | Restablecer contraseña | Cambiar password con token válido | Uso de token expirado o inválido | Validación del token antes del cambio, confirmación de coincidencia | Detectivo | Por evento | Público | [`auth.routes.js#L153`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L153) |
| 7 | Control de acceso por rol | Verificar rol en cada petición a backend | Usuario ejecuta acción no autorizada | Middleware `requireRoles` con lista blanca de roles por endpoint | Preventivo | Por request | ADMIN | [`requireRoles.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/requireRoles.js#L1) |
| 8 | Protección de rutas frontend | Redirigir al login si no hay token | Acceso a páginas internas sin autenticación | Verificación de token en `App.jsx`, `Navigate` a `/login` | Preventivo | Por ruta | ADMIN / ADMINISTRATIVO | [`App.jsx#L164`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/App.jsx#L164) |
| 9 | Expiración de sesión | Detectar token expirado y redirigir | Sesión inválida usada para peticiones | Interceptor de Axios captura 401, intenta refresh o redirige a login | Correctivo | Por request | ADMIN | [`api.js#L48`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/services/api.js#L48) |

---

## II. MACROPROCESO: GESTIÓN DE ACTIVIDADES
> **Código:** [`actividades.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js) · [`Actividades.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Actividades.jsx#L31) · [`Dashboard.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Dashboard.jsx#L97)

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Código |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|--------|
| 10 | Crear actividad | Registrar nueva actividad con nombre, fechas, tipo | Duplicidad de actividades | Validación de datos requeridos en backend, unicidad por nombre | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`POST actividades`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L10) |
| 11 | Listar actividades | Consultar actividades registradas | Exposición de datos no autorizados | Autenticación requerida, filtro por permisos de rol | Preventivo | Por consulta | ADMIN / ADMINISTRATIVO | [`GET actividades`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L34) |
| 12 | Editar actividad | Modificar datos de actividad existente | Modificación no autorizada | Verificación de rol (ADMIN o ADMINISTRATIVO), validación de existencia | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`PUT actividades/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L40) |
| 13 | Dashboard de actividades | Mostrar estadísticas de actividades por periodo | Datos incorrectos en reportes | Consultas agregadas con joins a participantes y certificados | Detectivo | Por consulta | ADMIN / ADMINISTRATIVO | [`Dashboard.jsx#L97`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Dashboard.jsx#L97) |

---

## III. MACROPROCESO: GESTIÓN DE PARTICIPANTES
> **Código:** [`participantes.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js) · [`Participantes.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Participantes.jsx#L17)

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Código |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|--------|
| 14 | Registrar participante | Ingresar datos personales (nombres, documento, email) vinculados a actividad | Datos duplicados o incorrectos | Validación de campos requeridos, unicidad por `numero_documento` por actividad | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`POST participantes`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L27) |
| 15 | Importar participantes CSV | Subir archivo CSV con lista de participantes | Datos malformados o incompletos | Parsing con `csv-parser`, validación por fila, transacción por lote | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`POST importar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L88) |
| 16 | Listar participantes | Consultar participantes filtrados por actividad | Exposición de datos personales sin control | Autenticación requerida, filtro por `actividad_id` | Preventivo | Por consulta | ADMIN / ADMINISTRATIVO | [`GET participantes`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L168) |
| 17 | Validar participante como APTO | Marcar participante como apto para certificación | Validación incorrecta o no autorizada | Cambio de `estado_validacion` a `APTO`, verificación de rol, registro de evento | Detectivo | Por evento | ADMIN / ADMINISTRATIVO | [`POST validar-apto`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L182) |
| 18 | Exportar participantes | Descargar lista en CSV, Excel o PDF | Fuga de datos personales | Autenticación requerida, exportación del lado del cliente | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`Certificados.jsx#L18`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Certificados.jsx#L18) |

---

## IV. MACROPROCESO: GESTIÓN DE PLANTILLAS
> **Código:** [`plantillas.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js) · [`Plantillas.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Plantillas.jsx#L110) · [`DropZone.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/components/DropZone.jsx#L10)

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Código |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|--------|
| 19 | Crear plantilla | Registrar nueva plantilla con nombre | Plantilla sin contenido válido | Inserción con `contenido` explícito (NULL permitido), validación de nombre requerido | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`POST plantillas`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L38) |
| 20 | Editar plantilla | Modificar contenido HTML de la plantilla | Inyección de código malicioso | Almacenamiento como texto, renderizado controlado en servidor | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`PUT plantillas/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L158) |
| 21 | Subir imagen de fondo | Cargar imagen para fondo de certificado | Archivo malicioso o formato incorrecto | Validación de tipo MIME (`image/*`), almacenamiento en `uploads/`, campo `imagen_fondo` en DB | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`POST :id/imagen`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L139) |
| 22 | Configurar campos | Definir posición, tamaño, alineación de campos dinámicos en el canvas | Campos fuera de lugar o ilegibles | Coordenadas `x`, `y`, `font_size`, `alignment` almacenadas en `plantilla_campos`, vista previa en canvas | Detectivo | Por evento | ADMIN / ADMINISTRATIVO | [`PUT campos`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L103) |
| 23 | Listar plantillas | Consultar plantillas disponibles | Exposición de diseños no autorizados | Autenticación requerida, listado con filtro `activa` | Preventivo | Por consulta | ADMIN / ADMINISTRATIVO | [`GET plantillas`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L63) |
| 24 | Eliminar plantilla | Borrar plantilla del sistema | Pérdida irreversible de diseño | Restricción a rol **SOLO ADMIN**, confirmación previa (SweetAlert2) | Preventivo | Por evento | ADMIN | [`DELETE plantillas/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L185) |

---

## V. MACROPROCESO: GESTIÓN DE CERTIFICADOS
> **Código:** [`certificados.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js) · [`certificatePdf.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/services/certificatePdf.js#L38) · [`Certificados.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Certificados.jsx#L18)

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Código |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|--------|
| 25 | Generar certificados | Crear PDF con datos de participantes APTOs para una actividad | Generación duplicada o datos incorrectos | Verificación de configuración institucional, plantilla activa, participantes APTO sin certificado previo, transacción atómica | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`POST generar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L25) |
| 26 | Ver PDF en navegador | Visualizar certificado en nueva pestaña | Acceso no autorizado a PDF | Token JWT en query param `?token=`, verificación en endpoint `/ver` | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`GET :id/ver`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L143) |
| 27 | Descargar PDF | Descargar certificado al equipo local | Descarga sin autorización | Autenticación requerida, Content-Disposition con filename UTF-8 | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`GET :id/descargar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L201) |
| 28 | Generar enlace de descarga | Crear token temporal para descarga pública | Enlace compartido sin control | JWT con `JWT_DOWNLOAD_SECRET`, expiración 48h, vinculado a `certificado_id` | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | [`POST enlace-descarga`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L165) |
| 29 | Revocar certificado | Invalidar certificado emitido | Revocación no autorizada | Restricción a rol **SOLO ADMIN**, cambio de estado a `REVOCADO` | Preventivo | Por evento | ADMIN | [`POST revocar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L228) |
| 30 | Cancelar certificados masivo | Cambiar estado a CANCELADO para múltiples certificados | Cancelación masiva errónea | Confirmación previa (SweetAlert2), transacción por lote, verificación de roles | Detectivo | Por evento | ADMIN / ADMINISTRATIVO | [`Certificados.jsx#L18`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Certificados.jsx#L18) |
| 31 | Firma digital en PDF | Superponer firma de la autoridad en el PDF | Firma falsificada o incorrecta | La firma se carga desde `configuracion_institucional.firma_url`, imagen administrada solo por ADMIN | Preventivo | Por generación | ADMIN | [`certificatePdf.js#L48`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/services/certificatePdf.js#L48) |

---

## VI. MACROPROCESO: CONFIGURACIÓN INSTITUCIONAL
> **Código:** [`app.js#L66-L152`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L66) · [`config.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js) · [`Configuracion.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Configuracion.jsx#L17)

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Código |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|--------|
| 32 | Ver configuración | Consultar datos institucionales | Exposición de datos sensibles | Autenticación requerida, GET disponible para ADMIN y ADMINISTRATIVO | Preventivo | Por consulta | ADMIN / ADMINISTRATIVO | [`GET config`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js#L10) |
| 33 | Editar configuración | Modificar nombre, autoridad, cargo, contacto | Modificación no autorizada | Restricción a rol **SOLO ADMIN**, validación de campos requeridos | Preventivo | Por evento | ADMIN | [`PUT config`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js#L16) |
| 34 | Subir logo institucional | Cargar imagen del logo | Imagen inapropiada o maliciosa | Validación de tipo MIME, almacenamiento en `uploads/`, referencia `logo_url` en DB | Preventivo | Por evento | ADMIN | [`POST logo`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L66) |
| 35 | Eliminar logo | Borrar logo institucional | Pérdida de imagen institucional | Restricción a rol **SOLO ADMIN**, confirmación en frontend | Preventivo | Por evento | ADMIN | [`DELETE logo`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L89) |
| 36 | Subir firma digital | Cargar imagen de firma de autoridad | Firma falsificada | Validación de tipo MIME, almacenamiento en `uploads/`, referencia `firma_url` en DB | Preventivo | Por evento | ADMIN | [`POST firma`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L110) |
| 37 | Eliminar firma | Borrar firma digital | Pérdida de firma institucional | Restricción a rol **SOLO ADMIN**, confirmación en frontend | Preventivo | Por evento | ADMIN | [`DELETE firma`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L133) |

---

## VII. MACROPROCESO: VALIDACIÓN Y ENTREGA
> **Código:** [`validacion.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js) · [`entrega.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/entrega.routes.js) · [`Validar.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Validar.jsx#L6)

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Código |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|--------|
| 38 | Validar por código único | Ingresar código alfanumérico para verificar autenticidad | Código inválido o falsificado | Consulta a base de datos, devolución de datos del certificado sin autenticación | Detectivo | Por evento | Público | [`GET validacion`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js#L77) |
| 39 | Validar por QR | Escanear código QR con cámara | QR falso o adulterado | El QR contiene el `codigo_unico` UUID v4, validación contra base de datos | Preventivo | Por evento | Público | [`GET validacion/qr/:codigo`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js#L84) |
| 40 | Descarga por enlace | Descargar PDF mediante token de enlace | Enlace compartido sin control | Token JWT firmado con `JWT_DOWNLOAD_SECRET`, expiración 48h, verificación en servidor | Preventivo | Por evento | Público (con token) | [`GET entrega/descargar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/entrega.routes.js#L10) |
| 41 | Validar con cámara | Capturar código QR usando la cámara del dispositivo | Lectura incorrecta del QR | Integración con API de cámara del navegador, parsing del código | Detectivo | Por evento | Público | [`Validar.jsx#L6`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Validar.jsx#L6) |

---

## VIII. MACROPROCESO: AUDITORÍA Y TRAZABILIDAD
> **Código:** [`auditoria_eventos` schema](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L137) · Insertado en cada ruta del backend

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Código |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|--------|
| 42 | Registro de eventos | Insertar registro cada vez que se realiza una acción crítica | Falta de trazabilidad en acciones del sistema | Tabla `auditoria_eventos` con `usuario_id`, `accion`, `entidad_tipo`, `entidad_id`, `detalle_json`, `ip`, `user_agent`, `created_at` | Preventivo | Por evento crítico | Sistema | [`schema.sql#L137`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L137) |
| 43 | Eventos auditados | Registrar generación, descarga y revocación de certificados | Acciones no monitoreadas | Inserción automática en rutas: `CERTIFICADOS_GENERADOS`, `CERTIFICADO_DESCARGA`, `CERTIFICADO_REVOCADO`, `CONFIG_ACTUALIZADA` | Detectivo | Por evento | Sistema | [`certificados.routes.js#L25`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L25) |
| 44 | Trazabilidad de cambios en configuración | Registrar quién y cuándo modificó la configuración | Cambios no autorizados sin registro | Inserción en `auditoria_eventos` con `accion = 'CONFIG_ACTUALIZADA'` | Detectivo | Por evento | ADMIN | [`config.routes.js#L16`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js#L16) |
| 45 | Refresh tokens | Almacenar tokens de refresco en base de datos | Sesión persistente sin control | Tabla `refresh_tokens` con `token`, `usuario_id`, `expires_at`, eliminación al cerrar sesión | Preventivo | Por sesión | Sistema | [`schema.sql#L14`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L14) |
| 46 | Password reset tokens | Almacenar tokens de recuperación con expiración | Reutilización de tokens viejos | Tabla `password_reset_tokens` con `token`, `usuario_id`, `expires_at`, eliminación post-uso | Preventivo | Por evento | Sistema | [`schema.sql#L26`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L26) |

---

## Resumen de Controles por Tipo

| Tipo de Control | Cantidad | Descripción |
|-----------------|----------|-------------|
| 🛡️ **Preventivo** | 32 | Evitan que ocurra un riesgo (validaciones, roles, cifrado, autenticación) |
| 🔍 **Detectivo** | 8 | Detectan riesgos que ya ocurrieron (logs, auditoría, validación de datos) |
| 🔧 **Correctivo** | 2 | Corrigen riesgos después de ocurridos (refresh token, interceptor 401) |
| **Total** | **46** | |

---

## Leyenda

| Término | Significado |
|---------|-------------|
| **Macroproceso** | Proceso de alto nivel que agrupa funcionalidades relacionadas |
| **Funcionalidad** | Capacidad específica del sistema |
| **Actividades** | Tareas concretas que ejecuta el usuario o el sistema |
| **Riesgo** | Evento no deseado que puede afectar la seguridad o integridad |
| **Control Implementado** | Mecanismo técnico que mitiga el riesgo |
| **Tipo de Control** | Preventivo (evita), Detectivo (descubre), Correctivo (repara) |
| **Frecuencia** | Cada qué tanto se ejecuta el control |
| **Responsable** | Rol del usuario que ejecuta la funcionalidad |
| **Evidencia** | Registro o documento que prueba la ejecución del control |

---

*Documento generado el 2026-06-22. Basado en el análisis completo del código fuente del Sistema de Generación y Lectura de Códigos QR.*
