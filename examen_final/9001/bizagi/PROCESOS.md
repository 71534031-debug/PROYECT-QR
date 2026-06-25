# Diagramas BPMN — Procesos del Sistema (ISO 9001)

> Los diagramas BPMN fueron diseñados en Bizagi Modeler.
> A continuación se describen los macroprocesos, procesos y subprocesos.

> **Repositorio GitHub:** [`https://github.com/71534031-debug/PROYECT-QR`](https://github.com/71534031-debug/PROYECT-QR) (branch `main`)
> Cada macroproceso enlaza a los archivos de código que lo implementan.

---

## Macroproceso 1: Gestión de Autenticación y Seguridad
> **Código:** [`auth.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js) · [`authenticate.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) · [`requireRoles.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/requireRoles.js#L1) · [`Login.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Login.jsx#L18)

**Objetivo:** Controlar el acceso al sistema mediante autenticación JWT.

```
[Inicio] → Login → ¿Credenciales válidas? 
  ├── Sí → Generar JWT → [Dashboard]
  └── No → ¿Intentos < 3? 
       ├── Sí → Reintentar 
       └── No → Bloquear cuenta → Notificar ADMIN
```

**Actores:** ADMIN, ADMINISTRATIVO, Público  
**Endpoints:** [`POST /api/auth/login`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L14) · [`POST /api/auth/refresh`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L57) · [`POST /api/auth/logout`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L81) · [`POST /api/auth/forgot-password`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L96) · [`POST /api/auth/reset-password`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L153)  
**Frontend:** [`Login.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Login.jsx#L18) · [`ForgotPassword.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/ForgotPassword.jsx#L7) · [`ResetPassword.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/ResetPassword.jsx#L7)  
**Middleware:** [`authenticate.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) · [`requireRoles.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/requireRoles.js#L1)  
**DB:** [`schema.sql#L4`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L4) (usuarios) · [`schema.sql#L14`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L14) (refresh_tokens) · [`schema.sql#L26`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L26) (password_reset_tokens)

---

## Macroproceso 2: Gestión de Actividades
> **Código:** [`actividades.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js) · [`Actividades.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Actividades.jsx#L31)

**Objetivo:** Administrar actividades académicas/institucionales.

```
[Inicio] → Crear actividad → Validar datos → ¿Datos válidos?
  ├── Sí → Guardar en DB → [Fin]
  └── No → Mostrar error → Corregir datos
```

**Actores:** ADMIN, ADMINISTRATIVO  
**Endpoints:** [`POST`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L10) · [`GET`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L34) · [`PUT/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L40)  
**DB:** [`schema.sql#L37`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L37) (actividades)

---

## Macroproceso 3: Gestión de Participantes
> **Código:** [`participantes.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js) · [`participanteValidators.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/utils/participanteValidators.js#L24) · [`Participantes.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Participantes.jsx#L17)

**Objetivo:** Registrar y validar participantes vinculados a actividades.

```
[Inicio] → Seleccionar actividad → Registrar participante
  → Validar datos → ¿Datos válidos?
    ├── Sí → ¿Importación CSV?
    │    ├── Sí → Parsear CSV → Validar filas → Insertar batch
    │    └── No → Insertar individual
    └── No → Mostrar error
  → Validar aptitud → Marcar APTO/NO APTO → [Fin]
```

**Actores:** ADMIN, ADMINISTRATIVO  
**Endpoints:** [`POST`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L27) · [`POST importar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L88) · [`GET`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L168) · [`POST validar-apto`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L182)  
**DB:** [`schema.sql#L52`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L52) (participantes) · [`schema.sql#L66`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L66) (actividad_participante)

---

## Macroproceso 4: Gestión de Plantillas
> **Código:** [`plantillas.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js) · [`plantillaValidators.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/utils/plantillaValidators.js#L14) · [`Plantillas.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Plantillas.jsx#L110) · [`DropZone.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/components/DropZone.jsx#L10)

**Objetivo:** Diseñar plantillas de certificados con editor visual.

```
[Inicio] → Crear plantilla → Configurar contenido HTML
  → ¿Usa imagen de fondo?
    ├── Sí → Subir imagen → Configurar campos (drag & drop)
    └── No → Usar plantilla texto
  → Guardar → [Fin]
```

**Actores:** ADMIN, ADMINISTRATIVO  
**Endpoints:** [`POST`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L38) · [`GET`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L63) · [`GET/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L75) · [`PUT/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L158) · [`DELETE/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L185) · [`POST/:id/imagen`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L139) · [`GET campos`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L90) · [`PUT campos`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L103)  
**DB:** [`schema.sql#L79`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L79) (plantillas) · [`schema.sql#L88`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L88) (plantilla_campos)

---

## Macroproceso 5: Gestión de Certificados
> **Código:** [`certificados.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js) · [`certificatePdf.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/services/certificatePdf.js#L38) · [`Certificados.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Certificados.jsx#L18)

**Objetivo:** Generar, emitir y revocar certificados digitales.

```
[Inicio] → Seleccionar actividad + plantilla
  → Buscar participantes APTOs
  → ¿Hay participantes? → Sí → Generar PDFs (batch)
    → Insertar en DB (transacción)
    → ¿Éxito?
      ├── Sí → Commit → [Certificados EMITIDOS]
      └── No → Rollback → Mostrar error
```

**Actores:** ADMIN, ADMINISTRATIVO  
**Endpoints:** [`POST generar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L25) · [`GET`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L115) · [`GET/:id/ver`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L143) · [`POST/:id/enlace-descarga`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L165) · [`GET/:id/descargar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L201) · [`POST/:id/revocar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L228)  
**Servicio PDF:** [`writeCertificatePdf`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/services/certificatePdf.js#L38) · [`writeImageBasedPdf`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/services/certificatePdf.js#L48) · [`writeHtmlBasedPdf`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/services/certificatePdf.js#L138)  
**DB:** [`schema.sql#L119`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L119) (certificados)

---

## Macroproceso 6: Validación y Entrega
> **Código:** [`validacion.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js) · [`entrega.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/entrega.routes.js) · [`Validar.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Validar.jsx#L6)

**Objetivo:** Validar autenticidad de certificados vía QR y permitir descarga.

```
[Inicio] → Ingresar código QR (escáner o manual)
  → Buscar en DB → ¿Certificado existe?
    ├── Sí → ¿Estado EMITIDO?
    │    ├── Sí → Mostrar datos del certificado
    │    └── No → Mostrar estado (REVOCADO, etc.)
    └── No → Mostrar "No encontrado"
  → ¿Descargar? → Generar enlace temporal (48h) → [Fin]
```

**Actores:** Público (sin autenticación)  
**Endpoints:** [`GET /api/validacion`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js#L77) · [`GET /api/validacion/qr/:codigo`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js#L84) · [`GET /api/entrega/descargar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/entrega.routes.js#L10)  
**Frontend:** [`Validar.jsx`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Validar.jsx#L6)

---

## Macroproceso 7: Auditoría y Trazabilidad
> **Código:** Insertado en cada módulo vía `auditoria_eventos` · [`schema.sql#L137`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L137)

**Objetivo:** Registrar todas las acciones críticas del sistema.

```
[Inicio] → Acción de usuario (crítica)
  → Insertar en auditoria_eventos
  → [Fin]
```

**Eventos auditados:**
- `CERTIFICADOS_GENERADOS` — Generación masiva
- `CERTIFICADO_DESCARGA` — Descarga individual
- `CERTIFICADO_REVOCADO` — Revocación
- `CONFIG_ACTUALIZADA` — Cambio de configuración
- `LOGO_ACTUALIZADO` / `LOGO_ELIMINADO`
- `FIRMA_ACTUALIZADA` / `FIRMA_ELIMINADA`

---

## Archivos Bizagi (.bpmn)

Los archivos `.bpmn` generados en Bizagi Modeler se encuentran en esta carpeta:

| Archivo | Proceso | Código relacionado |
|---------|---------|-------------------|
| `MP01_Autenticacion.bpmn` | Gestión de autenticación y seguridad | [`auth.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js) |
| `MP02_Actividades.bpmn` | Gestión de actividades | [`actividades.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js) |
| `MP03_Participantes.bpmn` | Gestión de participantes | [`participantes.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js) |
| `MP04_Plantillas.bpmn` | Gestión de plantillas | [`plantillas.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js) |
| `MP05_Certificados.bpmn` | Gestión de certificados | [`certificados.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js) |
| `MP06_Validacion.bpmn` | Validación y entrega | [`validacion.routes.js`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js) |
| `MP07_Auditoria.bpmn` | Auditoría y trazabilidad | [`schema.sql#L137`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L137) |
