# Matriz de Doble Entrada Detallada

> **Repositorio:** [`https://github.com/71534031-debug/PROYECT-QR`](https://github.com/71534031-debug/PROYECT-QR) (branch `main`)
> Cada celda enlaza directamente al archivo y línea donde se implementa la funcionalidad.

---

## Matriz: Módulos del Sistema vs Funcionalidades

| Módulo \ Funcionalidad | Crear | Leer | Editar | Eliminar | Buscar/Filtrar | Exportar | Importar | Validar | Generar PDF | Subir Imagen | Escanear QR |
|------------------------|:----:|:----:|:------:|:--------:|:--------------:|:--------:|:--------:|:-------:|:-----------:|:------------:|:-----------:|
| **Auth** | — | — | [`Reset Pass`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L153) | — | — | — | — | [`Login`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L14) | — | — | — |
| **Actividades** | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L10) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L34) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L40) | ❌ | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Actividades.jsx#L31) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L115) | — | — | — | — | — |
| **Participantes** | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L27) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L168) | — | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Participantes.jsx#L17) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L115) | [`✅ CSV`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L88) | [`APTO`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L182) | — | — | — |
| **Plantillas** | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L38) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L63) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L158) | [`✅ ADMIN`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L185) | — | — | — | — | [`✅ Vista previa`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Plantillas.jsx#L110) | [`✅ Fondo`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L139) | — |
| **Certificados** | [`✅ Generar`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L25) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L115) | — | `Revocar:` [`✅ ADMIN`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L228) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Certificados.jsx#L18) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/entrega.routes.js#L10) | — | — | [`✅ PDF`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/services/certificatePdf.js#L38) | — | — |
| **Configuración** | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js#L10) | [`✅ ADMIN`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js#L16) | [`✅ ADMIN`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L89) | — | — | — | — | — | [`✅ Logo/Firma`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L66) | — |
| **Validación QR** | — | [`✅ Público`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js#L84) | — | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Validar.jsx#L6) | [`✅ Descarga`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/entrega.routes.js#L10) | — | [`✅ Código`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js#L77) | — | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Validar.jsx#L6) |

---

## Matriz: Roles vs Permisos CRUD

| Módulo | Crear | Leer | Editar | Eliminar | Acción Especial | Middleware |
|--------|:----:|:----:|:------:|:--------:|:---------------:|-----------|
| **Auth** | Público | Privado | Usuario propio | — | Login, Refresh, Recuperación | — |
| **Actividades** | A + AV | A + AV | A + AV | — | Dashboard | [`authenticate`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) + [`requireRoles`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/requireRoles.js#L1) |
| **Participantes** | A + AV | A + AV | — | — | Validar APTO, Import CSV | [`authenticate`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) |
| **Plantillas** | A + AV | A + AV | A + AV | **Solo A** | Subir imagen, Config campos | [`authenticate`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) |
| **Certificados** | A + AV | A + AV | — | Cancelar: A + AV | Revocar: **Solo A** | [`authenticate`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) |
| **Configuración** | — | A + AV | **Solo A** | **Solo A** | Subir/Eliminar logo y firma | [`authenticate`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/middlewares/authenticate.js#L4) |
| **Validación QR** | — | **Público** | — | — | Descarga pública con token | Sin autenticación |

*A = ADMIN, AV = ADMINISTRATIVO*

---

## Matriz: Endpoints vs Métodos HTTP (con enlaces al código)

| Endpoint | GET | POST | PUT | DELETE | Archivo |
|----------|:---:|:----:|:---:|:------:|---------|
| `/api/health` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L62) | — | — | — | `app.js#L62` |
| `/api/auth/login` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L14) | — | — | `auth.routes.js#L14` |
| `/api/auth/refresh` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L57) | — | — | `auth.routes.js#L57` |
| `/api/auth/forgot-password` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L96) | — | — | `auth.routes.js#L96` |
| `/api/auth/reset-password` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L153) | — | — | `auth.routes.js#L153` |
| `/api/auth/logout` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/auth.routes.js#L81) | — | — | `auth.routes.js#L81` |
| `/api/actividades` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L34) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L10) | [`✅/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/actividades.routes.js#L40) | — | `actividades.routes.js` |
| `/api/participantes` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L168) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L27) | — | — | `participantes.routes.js` |
| `/api/participantes/importar` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L88) | — | — | `participantes.routes.js#L88` |
| `/api/participantes/:id/validar-apto` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/participantes.routes.js#L182) | — | — | `participantes.routes.js#L182` |
| `/api/plantillas` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L63) | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L38) | [`✅/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L158) | [`✅/:id`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L185) | `plantillas.routes.js` |
| `/api/plantillas/:id/campos` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L90) | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L103) | — | `plantillas.routes.js` |
| `/api/plantillas/:id/imagen` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/plantillas.routes.js#L139) | — | — | `plantillas.routes.js#L139` |
| `/api/configuracion` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js#L10) | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/config.routes.js#L16) | — | `config.routes.js` |
| `/api/configuracion/logo` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L66) | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L89) | `app.js` |
| `/api/configuracion/firma` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L110) | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/app.js#L133) | `app.js` |
| `/api/certificados` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L115) | — | — | — | `certificados.routes.js#L115` |
| `/api/certificados/generar` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L25) | — | — | `certificados.routes.js#L25` |
| `/api/certificados/:id/ver` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L143) | — | — | — | `certificados.routes.js#L143` |
| `/api/certificados/:id/descargar` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L201) | — | — | — | `certificados.routes.js#L201` |
| `/api/certificados/:id/enlace-descarga` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L165) | — | — | `certificados.routes.js#L165` |
| `/api/certificados/:id/revocar` | — | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/certificados.routes.js#L228) | — | — | `certificados.routes.js#L228` |
| `/api/validacion` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js#L77) | — | — | — | `validacion.routes.js#L77` |
| `/api/validacion/qr/:codigo` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/validacion.routes.js#L84) | — | — | — | `validacion.routes.js#L84` |
| `/api/entrega/descargar` | [`✅`](https://github.com/71534031-debug/PROYECT-QR/blob/main/backend/src/routes/entrega.routes.js#L10) | — | — | — | `entrega.routes.js#L10` |

---

## Matriz: Base de Datos — Tablas vs Operaciones (con enlaces al schema)

| Tabla | INSERT | SELECT | UPDATE | DELETE | Llave primaria | Schema |
|-------|:------:|:------:|:------:|:------:|:--------------:|--------|
| `usuarios` | Seed | Login, Perfil | Reset pass | — | id (INT) | [`schema.sql#L4`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L4) |
| `actividades` | Crear | Listar | Editar | — | id (INT) | [`schema.sql#L37`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L37) |
| `participantes` | Registrar | Listar | — | — | id (INT) | [`schema.sql#L52`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L52) |
| `actividad_participante` | Vincular | Listar | Validar | — | (actividad_id, participante_id) | [`schema.sql#L66`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L66) |
| `plantillas` | Crear | Listar | Editar | Eliminar | id (INT) | [`schema.sql#L79`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L79) |
| `plantilla_campos` | Guardar | Listar | Guardar | — | id (INT) | [`schema.sql#L88`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L88) |
| `certificados` | Generar | Listar, Ver | Revocar, Cancelar | — | id (INT) | [`schema.sql#L119`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L119) |
| `configuracion_institucional` | Inicializar | Ver | Editar | — | id=1 (fijo) | [`schema.sql#L105`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L105) |
| `auditoria_eventos` | Insertar | Consulta | — | — | id (INT) | [`schema.sql#L137`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L137) |
| `refresh_tokens` | Login | Refresh | — | Logout | id (INT) | [`schema.sql#L14`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L14) |
| `password_reset_tokens` | Forgot | Reset | — | Post-reset | id (INT) | [`schema.sql#L26`](https://github.com/71534031-debug/PROYECT-QR/blob/main/database/schema.sql#L26) |

---

## Matriz: Pantallas Frontend vs Componentes UI (con enlaces al código)

| Pantalla | Ruta React | Componentes UI | Componentes personalizados | Archivo |
|----------|:----------:|----------------|---------------------------|---------|
| [Login](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Login.jsx#L18) | `/login` | Button, Input, Card | — | `Login.jsx#L18` |
| [Dashboard](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Dashboard.jsx#L97) | `/` | Card, Badge | Gráficos Recharts | `Dashboard.jsx#L97` |
| [Actividades](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Actividades.jsx#L31) | `/actividades` | Button, Input, Select, Badge | Modal CRUD | `Actividades.jsx#L31` |
| [Participantes](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Participantes.jsx#L17) | `/participantes` | Button, Input, Select, Badge | Formulario lateral | `Participantes.jsx#L17` |
| [Plantillas](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Plantillas.jsx#L110) | `/plantillas` | Button, Input, Select | Editor Canvas, DropZone | `Plantillas.jsx#L110` |
| [Certificados](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Certificados.jsx#L18) | `/certificados` | Button, Input, Select, Badge | Modal preview PDF | `Certificados.jsx#L18` |
| [Configuración](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Configuracion.jsx#L17) | `/configuracion` | Button, Input | DropZone, Tabs | `Configuracion.jsx#L17` |
| [Validar QR](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/pages/Validar.jsx#L6) | `/validar` | Button, Input | Escáner cámara | `Validar.jsx#L6` |

### Enrutamiento principal
| Archivo | Línea | URL GitHub |
|---------|-------|------------|
| App.jsx (rutas) | L164 | [App.jsx#L164](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/App.jsx#L164) |
| PrivateLayout | L133 | [App.jsx#L133](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/App.jsx#L133) |
| Sidebar | L35 | [App.jsx#L35](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/App.jsx#L35) |

### Servicios
| Archivo | Línea | URL GitHub |
|---------|-------|------------|
| api.js (axios instance) | L1 | [api.js#L1](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/services/api.js#L1) |
| Interceptor refresh token | L48 | [api.js#L48](https://github.com/71534031-debug/PROYECT-QR/blob/main/frontend/src/services/api.js#L48) |
