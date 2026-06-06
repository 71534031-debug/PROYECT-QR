# REPORTE FINAL — PROYECT-QR

**Fecha:** 2026-05-13
**Estado:** Completado ✅

---

## 1. Resumen ejecutivo

PROYECT-QR es una aplicación full-stack para la generación y validación de certificados digitales del CIP CD Huancavelica. El sistema permite crear actividades, registrar participantes, diseñar plantillas PDF con datos variables (nombre, DNI, actividad), generar certificados con códigos QR únicos, y validar su autenticidad via API/pública.

---

## 2. Módulos entregados

### Backend (Node.js + Express + MySQL 8)

| # | Módulo | Archivos | Descripción |
|---|--------|----------|-------------|
| 1 | API base | `app.js`, `server.js` | createApp, health endpoint, proxy Vite |
| 2 | Autenticación | `auth.routes.js` | login, refresh, logout, forgot-password, reset-password |
| 3 | Actividades | `actividades.routes.js` | CRUD completo |
| 4 | Participantes | `participantes.routes.js` | CRUD + import CSV + validar-apto |
| 5 | Plantillas | `plantillas.routes.js` | CRUD + carga de imagen |
| 6 | Configuración | `config.routes.js` | GET/PUT institución y autoridad |
| 7 | Certificados | `certificados.routes.js` | generar con códigos QR únicos |
| 8 | Entrega pública | `entrega.routes.js` | descarga por código único |
| 9 | Validación pública | `validacion.routes.js` | verificación por código/DNI |
| 10 | Validadores dominio | `participanteValidators.js`, `plantillaValidators.js` | Validación de entrada |
| 11 | Generación PDF/QR | `services/certificatePdf.js` | pdfkit + qrcode, archivos en `certificados/` |
| 12 | Auditoría | Inserciones en todas las rutas | Logs de acciones de usuarios |

### Frontend (React + Vite)

| # | Módulo | Archivo | Descripción |
|---|--------|---------|-------------|
| 1 | Login + recuperación | `Login.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx` | Autenticación completa |
| 2 | Dashboard | `Dashboard.jsx` | Resumen con estadísticas |
| 3 | Actividades | `Actividades.jsx` | Gestión de actividades |
| 4 | Participantes | `Participantes.jsx` | Registro y validación |
| 5 | Plantillas | `Plantillas.jsx` | Diseño con placeholders |
| 6 | Certificados | `Certificados.jsx` | Generación masiva |
| 7 | Configuración | `Configuracion.jsx` | Datos institucionales |
| 8 | Validación pública | `Validar.jsx` | Verificación por código QR |
| 9 | Servicio API | `services/api.js` | Axios + interceptores + gestión de sesión |

### Database (MySQL 8, puerto 3307)

| # | Tabla | Descripción |
|---|-------|-------------|
| 1 | `usuarios` | credenciales y roles (ADMIN/STAFF) |
| 2 | `actividades` | nombre, fechas, responsable, estado |
| 3 | `participantes` | datos personales, aptitud, actividadFK |
| 4 | `plantillas` | nombre, imagen_base64, placeholders |
| 5 | `certificados` | codigo_unico, qr_data, hash_pdf, metadata |
| 6 | `configuracion` | nombre_institucion, cargo_autoridad, nombre_autoridad, firmas |
| 7 | `auditoria` | logs de todas las acciones |

---

## 3. Suite de tests

### Backend — Jest

| Suite | Tests | Estado |
|-------|-------|--------|
| `auth.test.js` | 12 | PASS |
| `participantes.routes.test.js` | 10 | PASS |
| `actividades.routes.test.js` | 8 | PASS |
| `entrega.routes.test.js` | 6 | PASS |
| `config.routes.test.js` | 4 | PASS |
| `plantillas.routes.test.js` | 4 | PASS |
| `validacion.test.js` | 4 | PASS |
| `health.test.js` | 1 | PASS |
| `certificados.routes.test.js` | 10 | PASS |
| `certificatePdf.test.js` | 6 | PASS |
| `participanteValidators.test.js` | 10 | PASS |
| `plantillaValidators.test.js` | 4 | PASS |
| **TOTAL** | **79** | **100%** |

### Frontend — Jest

| Suite | Tests | Estado |
|-------|-------|--------|
| `Login.test.jsx` | 3 | PASS |
| `ForgotPassword.test.jsx` | 3 | PASS |
| `ResetPassword.test.jsx` | 3 | PASS |
| `Dashboard.test.jsx` | 3 | PASS |
| `Actividades.test.jsx` | 4 | PASS |
| `Participantes.test.jsx` | 3 | PASS |
| `Plantillas.test.jsx` | 4 | PASS |
| `Certificados.test.jsx` | 2 | PASS |
| `Configuracion.test.jsx` | 2 | PASS |
| `api.test.js` | 1 | PASS |
| **TOTAL** | **28** | **100%** |

### Frontend — Cypress E2E

| Spec | Tests | Estado |
|------|-------|--------|
| `login.cy.js` | 2 (credenciales inválidas, válidas) | PASS |
| `validar.cy.js` | 2 (código inválido, válido) | PASS |
| `flujo-certificado.cy.js` | 1 (flujo completo login→config→actividad→participante→plantilla→certificado) | PASS |
| **TOTAL** | **5** | **100%** |

---

## 4. Cobertura de código

| Indicador | Valor | Umbral |
|-----------|-------|--------|
| Statements | 69.04% | 60% ✅ |
| Branches | 48.24% | — |
| Functions | 73.07% | — |
| Lines | 70.63% | — |

Archivos con menor cobertura (no bloquean):
- `Certificados.jsx` (57.69%) — por debajo de threshold
- `Validar.jsx` (0%) — pendiente tests
- `App.jsx` (0%) — pendiente tests
- `requiredPlaceholders.js` (0%) — pendiente tests

---

## 5. Linting

| Proyecto | Resultado |
|----------|-----------|
| Backend | ✅ 0 errores |
| Frontend | ✅ 0 errores |

Fixes aplicados:
- `certificatePdf.test.js`: parámetros mock renombrados a `_nombre` (underscore prefix)
- Tests frontend: `require()` → `import` en 4 archivos
- `fireEvent` sin usar removido de `Certificados.test.jsx`
- `loadSession` sin usar removido de `Configuracion.test.jsx`
- `scripts/` ignorado en eslint.config.cjs (archivo de build)

---

## 6. Instrucciones para correr el proyecto

### Prerrequisitos

- Node.js 18+
- MySQL 8.0.36 (puerto 3307)
- npm

### Paso 1: Base de datos

```powershell
# Conectar a MySQL y ejecutar:
mysql -u root -pMySQLRoot123! -P 3307 < database/schema.sql
mysql -u root -pMySQLRoot123! -P 3307 < database/seed.sql
```

**Usuarios seed:** `admin@cip.local` / `Password123` (ADMIN), `staff@cip.local` / `Password123` (STAFF)

### Paso 2: Backend

```powershell
cd backend
npm install
cp .env.example .env  # ya existe si ya se corrió antes
npm run dev
# Server en http://localhost:3000
```

### Paso 3: Frontend

```powershell
cd frontend
npm install
npm run dev
# App en http://localhost:5173 (proxy /api → :3000)
```

### Paso 4: Tests

```powershell
# Backend Jest
cd backend; npm test

# Frontend Jest + coverage
cd frontend; npm run test:coverage

# Cypress E2E (requiere backend:3000 + frontend:5173 levantados)
cd frontend; npm run test:e2e
```

---

## 7. Deuda técnica pendiente

| Ítem | Prioridad |
|------|-----------|
| Tests Jest para Validar.jsx, App.jsx, requiredPlaceholders.js | Media |
| Tests CSV import participantes | Baja |
| Auditoría UI/reporte | Baja |
| Reemisión / REEMPLAZADO (certificados) | Si negocio lo exige |
| CI/CD (Render/Vercel) | Baja |
| OpenAPI spec | Baja |

---

## 8. Arquitectura

```
frontend (:5173) ──proxy /api──> backend (:3000) ──> MySQL (:3307)
                                              │
                                              └──> ./certificados/*.pdf (archivos generados)
```

- **Autenticación:** JWT (token + refresh) en headers `Authorization: Bearer`
- **Sesión cliente:** localStorage, refresh automático por interceptor Axios
- **Certificados:** archivos PDF con QR en `backend/certificados/`, registrados en DB
- **Validación:** código único + hash PDF para verificar autenticidad

---

*Generado automáticamente — PROYECT-QR 2026*