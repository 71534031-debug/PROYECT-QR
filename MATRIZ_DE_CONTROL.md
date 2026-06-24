# Matriz de Control — Sistema de Generación y Lectura de Códigos QR

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

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Evidencia |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|-----------|
| 1 | Inicio de sesión | Validar credenciales (email + password) contra base de datos | Acceso no autorizado al sistema | Hash bcrypt de contraseñas, verificación en base de datos | Preventivo | Por evento | ADMIN | Log de auditoría (`auditoria_eventos`) |
| 2 | Generación de token JWT | Crear token access + refresh al autenticarse | Suplantación de identidad | JWT firmado con `JWT_SECRET`, payload con `id` y `rol`, expiración definida | Preventivo | Por evento | ADMIN | Token almacenado en localStorage |
| 3 | Refrescar token | Renovar access token mediante refresh token | Sesión expirada sin posibilidad de renovación | Endpoint `/api/auth/refresh` verifica refresh token en base de datos | Correctivo | Por evento | ADMIN / ADMINISTRATIVO | Token renovado en localStorage |
| 4 | Cierre de sesión | Invalidar refresh token | Sesión persistente no controlada | Eliminación del refresh token de la base de datos | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Log de auditoría |
| 5 | Recuperación de contraseña | Enviar enlace de restablecimiento por email | Suplantación de cuenta vía correo | Token único temporizado en `password_reset_tokens`, expiración 1 hora | Preventivo | Por evento | Público | Log de auditoría |
| 6 | Restablecer contraseña | Cambiar password con token válido | Uso de token expirado o inválido | Validación del token antes del cambio, confirmación de coincidencia | Detectivo | Por evento | Público | Log de auditoría |
| 7 | Control de acceso por rol | Verificar rol en cada petición a backend | Usuario ejecuta acción no autorizada | Middleware `requireRoles` con lista blanca de roles por endpoint | Preventivo | Por request | ADMIN | Respuesta 403 Forbidden |
| 8 | Protección de rutas frontend | Redirigir al login si no hay token | Acceso a páginas internas sin autenticación | Verificación de token en `App.jsx`, `Navigate` a `/login` | Preventivo | Por ruta | ADMIN / ADMINISTRATIVO | Redirección automática |
| 9 | Expiración de sesión | Detectar token expirado y redirigir | Sesión inválida usada para peticiones | Interceptor de Axios captura 401, intenta refresh o redirige a login | Correctivo | Por request | ADMIN | Redirección a `/login` |

---

## II. MACROPROCESO: GESTIÓN DE ACTIVIDADES

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Evidencia |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|-----------|
| 10 | Crear actividad | Registrar nueva actividad con nombre, fechas, tipo | Duplicidad de actividades | Validación de datos requeridos en backend, unicidad por nombre | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Registro en tabla `actividades` |
| 11 | Listar actividades | Consultar actividades registradas | Exposición de datos no autorizados | Autenticación requerida, filtro por permisos de rol | Preventivo | Por consulta | ADMIN / ADMINISTRATIVO | Datos en tabla `actividades` |
| 12 | Editar actividad | Modificar datos de actividad existente | Modificación no autorizada | Verificación de rol (ADMIN o ADMINISTRATIVO), validación de existencia | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Log de auditoría (`CONFIG_ACTUALIZADA`) |
| 13 | Dashboard de actividades | Mostrar estadísticas de actividades por periodo | Datos incorrectos en reportes | Consultas agregadas con joins a participantes y certificados | Detectivo | Por consulta | ADMIN / ADMINISTRATIVO | Gráficos en Dashboard (`recharts`) |

---

## III. MACROPROCESO: GESTIÓN DE PARTICIPANTES

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Evidencia |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|-----------|
| 14 | Registrar participante | Ingresar datos personales (nombres, documento, email) vinculados a actividad | Datos duplicados o incorrectos | Validación de campos requeridos, unicidad por `numero_documento` por actividad | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Registro en tabla `participantes` + `actividad_participante` |
| 15 | Importar participantes CSV | Subir archivo CSV con lista de participantes | Datos malformados o incompletos | Parsing con `csv-parser`, validación por fila, transacción por lote | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Archivo CSV + registros en base de datos |
| 16 | Listar participantes | Consultar participantes filtrados por actividad | Exposición de datos personales sin control | Autenticación requerida, filtro por `actividad_id` | Preventivo | Por consulta | ADMIN / ADMINISTRATIVO | Datos en tabla `actividad_participante` |
| 17 | Validar participante como APTO | Marcar participante como apto para certificación | Validación incorrecta o no autorizada | Cambio de `estado_validacion` a `APTO`, verificación de rol, registro de evento | Detectivo | Por evento | ADMIN / ADMINISTRATIVO | Registro en `actividad_participante.estado_validacion` |
| 18 | Exportar participantes | Descargar lista en CSV, Excel o PDF | Fuga de datos personales | Autenticación requerida, exportación del lado del cliente | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Archivo exportado |

---

## IV. MACROPROCESO: GESTIÓN DE PLANTILLAS

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Evidencia |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|-----------|
| 19 | Crear plantilla | Registrar nueva plantilla con nombre | Plantilla sin contenido válido | Inserción con `contenido` explícito (NULL permitido), validación de nombre requerido | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Registro en tabla `plantillas` |
| 20 | Editar plantilla | Modificar contenido HTML de la plantilla | Inyección de código malicioso | Almacenamiento como texto, renderizado controlado en servidor | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Log de auditoría |
| 21 | Subir imagen de fondo | Cargar imagen para fondo de certificado | Archivo malicioso o formato incorrecto | Validación de tipo MIME (`image/*`), almacenamiento en `uploads/`, campo `imagen_fondo` en DB | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Archivo en disco + referencia en `plantillas.imagen_fondo` |
| 22 | Configurar campos | Definir posición, tamaño, alineación de campos dinámicos en el canvas | Campos fuera de lugar o ilegibles | Coordenadas `x`, `y`, `font_size`, `alignment` almacenadas en `plantilla_campos`, vista previa en canvas | Detectivo | Por evento | ADMIN / ADMINISTRATIVO | Registros en tabla `plantilla_campos` |
| 23 | Listar plantillas | Consultar plantillas disponibles | Exposición de diseños no autorizados | Autenticación requerida, listado con filtro `activa` | Preventivo | Por consulta | ADMIN / ADMINISTRATIVO | Datos en tabla `plantillas` |
| 24 | Eliminar plantilla | Borrar plantilla del sistema | Pérdida irreversible de diseño | Restricción a rol **SOLO ADMIN**, confirmación previa (SweetAlert2) | Preventivo | Por evento | ADMIN | Log de auditoría |

---

## V. MACROPROCESO: GESTIÓN DE CERTIFICADOS

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Evidencia |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|-----------|
| 25 | Generar certificados | Crear PDF con datos de participantes APTOs para una actividad | Generación duplicada o datos incorrectos | Verificación de configuración institucional, plantilla activa, participantes APTO sin certificado previo, transacción atómica | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Registro en tabla `certificados` + PDF en `uploads/certificados/` |
| 26 | Ver PDF en navegador | Visualizar certificado en nueva pestaña | Acceso no autorizado a PDF | Token JWT en query param `?token=`, verificación en endpoint `/ver` | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Visualización en navegador |
| 27 | Descargar PDF | Descargar certificado al equipo local | Descarga sin autorización | Autenticación requerida, Content-Disposition con filename UTF-8 | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Log de auditoría (`CERTIFICADO_DESCARGA`) |
| 28 | Generar enlace de descarga | Crear token temporal para descarga pública | Enlace compartido sin control | JWT con `JWT_DOWNLOAD_SECRET`, expiración 48h, vinculado a `certificado_id` | Preventivo | Por evento | ADMIN / ADMINISTRATIVO | Token en URL firmada |
| 29 | Revocar certificado | Invalidar certificado emitido | Revocación no autorizada | Restricción a rol **SOLO ADMIN**, cambio de estado a `REVOCADO` | Preventivo | Por evento | ADMIN | Log de auditoría (`CERTIFICADO_REVOCADO`) |
| 30 | Cancelar certificados masivo | Cambiar estado a CANCELADO para múltiples certificados | Cancelación masiva errónea | Confirmación previa (SweetAlert2), transacción por lote, verificación de roles | Detectivo | Por evento | ADMIN / ADMINISTRATIVO | Log de auditoría |
| 31 | Firma digital en PDF | Superponer firma de la autoridad en el PDF | Firma falsificada o incorrecta | La firma se carga desde `configuracion_institucional.firma_url`, imagen administrada solo por ADMIN | Preventivo | Por generación | ADMIN | PDF generado con firma visible |

---

## VI. MACROPROCESO: CONFIGURACIÓN INSTITUCIONAL

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Evidencia |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|-----------|
| 32 | Ver configuración | Consultar datos institucionales | Exposición de datos sensibles | Autenticación requerida, GET disponible para ADMIN y ADMINISTRATIVO | Preventivo | Por consulta | ADMIN / ADMINISTRATIVO | Datos en `configuracion_institucional` |
| 33 | Editar configuración | Modificar nombre, autoridad, cargo, contacto | Modificación no autorizada | Restricción a rol **SOLO ADMIN**, validación de campos requeridos | Preventivo | Por evento | ADMIN | Log de auditoría (`CONFIG_ACTUALIZADA`) |
| 34 | Subir logo institucional | Cargar imagen del logo | Imagen inapropiada o maliciosa | Validación de tipo MIME, almacenamiento en `uploads/`, referencia `logo_url` en DB | Preventivo | Por evento | ADMIN | Archivo en disco + Log de auditoría |
| 35 | Eliminar logo | Borrar logo institucional | Pérdida de imagen institucional | Restricción a rol **SOLO ADMIN**, confirmación en frontend | Preventivo | Por evento | ADMIN | Log de auditoría |
| 36 | Subir firma digital | Cargar imagen de firma de autoridad | Firma falsificada | Validación de tipo MIME, almacenamiento en `uploads/`, referencia `firma_url` en DB | Preventivo | Por evento | ADMIN | Archivo en disco + Log de auditoría |
| 37 | Eliminar firma | Borrar firma digital | Pérdida de firma institucional | Restricción a rol **SOLO ADMIN**, confirmación en frontend | Preventivo | Por evento | ADMIN | Log de auditoría |

---

## VII. MACROPROCESO: VALIDACIÓN Y ENTREGA

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Evidencia |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|-----------|
| 38 | Validar por código único | Ingresar código alfanumérico para verificar autenticidad | Código inválido o falsificado | Consulta a base de datos, devolución de datos del certificado sin autenticación | Detectivo | Por evento | Público | Datos del certificado en pantalla |
| 39 | Validar por QR | Escanear código QR con cámara | QR falso o adulterado | El QR contiene el `codigo_unico` UUID v4, validación contra base de datos | Preventivo | Por evento | Público | Datos del certificado en pantalla |
| 40 | Descarga por enlace | Descargar PDF mediante token de enlace | Enlace compartido sin control | Token JWT firmado con `JWT_DOWNLOAD_SECRET`, expiración 48h, verificación en servidor | Preventivo | Por evento | Público (con token) | Archivo PDF descargado |
| 41 | Validar con cámara | Capturar código QR usando la cámara del dispositivo | Lectura incorrecta del QR | Integración con API de cámara del navegador, parsing del código | Detectivo | Por evento | Público | Resultado de validación |

---

## VIII. MACROPROCESO: AUDITORÍA Y TRAZABILIDAD

| N° | Funcionalidad | Actividades | Riesgo | Control Implementado | Tipo de Control | Frecuencia | Responsable | Evidencia |
|----|--------------|-------------|--------|---------------------|-----------------|------------|-------------|-----------|
| 42 | Registro de eventos | Insertar registro cada vez que se realiza una acción crítica | Falta de trazabilidad en acciones del sistema | Tabla `auditoria_eventos` con `usuario_id`, `accion`, `entidad_tipo`, `entidad_id`, `detalle_json`, `ip`, `user_agent`, `created_at` | Preventivo | Por evento crítico | Sistema | Registro en `auditoria_eventos` |
| 43 | Eventos auditados | Registrar generación, descarga y revocación de certificados | Acciones no monitoreadas | Inserción automática en rutas: `CERTIFICADOS_GENERADOS`, `CERTIFICADO_DESCARGA`, `CERTIFICADO_REVOCADO`, `CONFIG_ACTUALIZADA` | Detectivo | Por evento | Sistema | Log en `auditoria_eventos` |
| 44 | Trazabilidad de cambios en configuración | Registrar quién y cuándo modificó la configuración | Cambios no autorizados sin registro | Inserción en `auditoria_eventos` con `accion = 'CONFIG_ACTUALIZADA'` | Detectivo | Por evento | ADMIN | Log en `auditoria_eventos` |
| 45 | Refresh tokens | Almacenar tokens de refresco en base de datos | Sesión persistente sin control | Tabla `refresh_tokens` con `token`, `usuario_id`, `expires_at`, eliminación al cerrar sesión | Preventivo | Por sesión | Sistema | Registro en `refresh_tokens` |
| 46 | Password reset tokens | Almacenar tokens de recuperación con expiración | Reutilización de tokens viejos | Tabla `password_reset_tokens` con `token`, `usuario_id`, `expires_at`, eliminación post-uso | Preventivo | Por evento | Sistema | Registro en `password_reset_tokens` |

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
