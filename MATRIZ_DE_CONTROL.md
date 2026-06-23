# Matriz de Control — Sistema de Generación y Lectura de Códigos QR

## 1. Matriz de Roles vs Funcionalidades (Frontend)

| Módulo / Funcionalidad | ADMIN | ADMINISTRATIVO | Público |
|---|---|---|---|
| **Dashboard** — Ver estadísticas | ✅ | ✅ | ❌ |
| **Actividades** — Crear | ✅ | ✅ | ❌ |
| **Actividades** — Listar | ✅ | ✅ | ❌ |
| **Actividades** — Editar | ✅ | ✅ | ❌ |
| **Participantes** — Crear individual | ✅ | ✅ | ❌ |
| **Participantes** — Importar CSV | ✅ | ✅ | ❌ |
| **Participantes** — Listar | ✅ | ✅ | ❌ |
| **Participantes** — Marcar APTO/validar | ✅ | ✅ | ❌ |
| **Plantillas** — Listar | ✅ | ✅ | ❌ |
| **Plantillas** — Crear / Editar | ✅ | ✅ | ❌ |
| **Plantillas** — Subir imagen fondo | ✅ | ✅ | ❌ |
| **Plantillas** — Configurar campos | ✅ | ✅ | ❌ |
| **Plantillas** — **Eliminar** | ✅ | ❌ | ❌ |
| **Certificados** — Generar | ✅ | ✅ | ❌ |
| **Certificados** — Listar / Ver | ✅ | ✅ | ❌ |
| **Certificados** — Descargar PDF | ✅ | ✅ | ❌ |
| **Certificados** — **Revocar** | ✅ | ❌ | ❌ |
| **Configuración** — Ver | ✅ | ✅ | ❌ |
| **Configuración** — **Editar** | ✅ | ❌ | ❌ |
| **Configuración** — **Subir/Eliminar logo** | ✅ | ❌ | ❌ |
| **Configuración** — **Subir/Eliminar firma** | ✅ | ❌ | ❌ |
| **Validar certificado** (vía QR/código) | ✅ | ✅ | ✅ |
| **Descargar certificado** (vía enlace) | ✅ | ✅ | ✅ |

## 2. Matriz de Roles vs Endpoints (Backend)

### 2.1 Públicos (sin autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check del servidor |
| POST | `/api/auth/login` | Inicio de sesión |
| POST | `/api/auth/refresh` | Refrescar token JWT |
| POST | `/api/auth/forgot-password` | Solicitar restablecimiento de contraseña |
| POST | `/api/auth/reset-password` | Restablecer contraseña |
| GET | `/api/validacion?codigo_unico=` | Validar certificado por código |
| GET | `/api/validacion/qr/:codigo` | Validar certificado desde QR |
| GET | `/api/entrega/descargar?t=` | Descargar certificado (token enlace) |

### 2.2 Autenticados Generales (ADMIN + ADMINISTRATIVO)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/certificados/:id/ver?token=` | Ver PDF en navegador |

### 2.3 ADMIN + ADMINISTRATIVO

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/actividades` | Crear actividad |
| GET | `/api/actividades` | Listar actividades |
| PUT | `/api/actividades/:id` | Editar actividad |
| POST | `/api/participantes` | Crear participante |
| POST | `/api/participantes/importar` | Importar participantes CSV |
| GET | `/api/participantes` | Listar participantes |
| POST | `/api/participantes/:id/validar-apto` | Validar participante como APTO |
| POST | `/api/plantillas` | Crear plantilla |
| GET | `/api/plantillas` | Listar plantillas |
| GET | `/api/plantillas/:id` | Obtener plantilla por ID |
| GET | `/api/plantillas/:id/campos` | Obtener campos de plantilla |
| PUT | `/api/plantillas/:id/campos` | Actualizar campos de plantilla |
| POST | `/api/plantillas/:id/imagen` | Subir imagen de fondo |
| PUT | `/api/plantillas/:id` | Editar plantilla |
| GET | `/api/configuracion` | Ver configuración institucional |
| POST | `/api/certificados/generar` | Generar certificados |
| GET | `/api/certificados` | Listar certificados |
| POST | `/api/certificados/:id/enlace-descarga` | Generar enlace de descarga |
| GET | `/api/certificados/:id` | Obtener certificado por ID |
| GET | `/api/certificados/:id/descargar` | Descargar PDF certificado |

### 2.4 Exclusivo ADMIN

| Método | Ruta | Descripción |
|--------|------|-------------|
| PUT | `/api/configuracion` | Editar configuración institucional |
| POST | `/api/configuracion/logo` | Subir logo institucional |
| DELETE | `/api/configuracion/logo` | Eliminar logo institucional |
| POST | `/api/configuracion/firma` | Subir firma digital |
| DELETE | `/api/configuracion/firma` | Eliminar firma digital |
| DELETE | `/api/plantillas/:id` | Eliminar plantilla |
| POST | `/api/certificados/:id/revocar` | Revocar certificado |

## 3. Matriz de Acceso por Tipo de Usuario

```
                    ┌─────────────────────────────┐
                    │       PÚBLICO               │
                    │  (sin autenticación)         │
                    │  • Login                     │
                    │  • Recuperar contraseña      │
                    │  • Validar certificado       │
                    │  • Descargar (con enlace)    │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────────────┐
                    │       AUTENTICADO            │
                    │  (token JWT válido)          │
                    │  • Ver PDF certificado       │
                    └──────────┬──────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
┌─────────▼──────────┐ ┌──────▼───────┐ ┌──────────▼──────────┐
│   ADMIN             │ │ADMINISTRATIVO│ │   PÚBLICO           │
│                     │ │              │ │   (sin auth)        │
│ • CRUD completo     │ │ • CRUD básico│ │                     │
│ • Configuración     │ │ • Sin acceso │ │ • Validación QR     │
│ • Revocar certif.   │ │   a config.  │ │ • Descarga pública  │
│ • Eliminar plant.   │ │ • Sin revocar│ │                     │
└─────────────────────┘ └──────────────┘ └─────────────────────┘
```

## 4. Matriz de Operaciones CRUD por Módulo

| Módulo | Crear | Leer | Editar | Eliminar | Acciones especiales |
|--------|-------|------|--------|----------|---------------------|
| **Auth** | Público (registro) | — | Usuario (reset pass) | — | Login, Refresh, Logout |
| **Actividades** | ADMIN + ADMVO | ADMIN + ADMVO | ADMIN + ADMVO | — | — |
| **Participantes** | ADMIN + ADMVO | ADMIN + ADMVO | — | — | Validar APTO, Importar CSV |
| **Plantillas** | ADMIN + ADMVO | ADMIN + ADMVO | ADMIN + ADMVO | **SOLO ADMIN** | Subir imagen fondo, Configurar campos |
| **Certificados** | ADMIN + ADMVO | ADMIN + ADMVO | — | — | Generar, Revocar (**SOLO ADMIN**), Descargar, Ver |
| **Configuración** | — | ADMIN + ADMVO | **SOLO ADMIN** | **SOLO ADMIN** | Subir/Eliminar logo y firma |
| **Validación** | — | Público | — | — | Consulta por código QR |
| **Entrega** | — | Público (con token) | — | — | Descarga por enlace |

## 5. Segregación de Responsabilidades

### Funciones exclusivas de ADMIN (protección de seguridad)
- Modificar la **configuración institucional** (nombre, logo, firma)
- **Revocar certificados** emitidos
- **Eliminar plantillas** del sistema
- Gestionar archivos sensibles (logo institucional, firma digital)

### Funciones compartidas (ADMIN + ADMINISTRATIVO)
- Gestión operativa de **actividades** (crear, editar)
- Gestión operativa de **participantes** (registrar, validar)
- Gestión de **plantillas** (crear, editar, subir imagen)
- **Generación y descarga** de certificados

### Funciones públicas (sin autenticación)
- **Validación de autenticidad** de certificados vía QR
- **Descarga** de certificados mediante enlace seguro (token JWT con expiración de 48h)
- **Recuperación de contraseña** vía correo electrónico

---

*Documento generado el 2026-06-22. Basado en el análisis completo del código fuente.*
