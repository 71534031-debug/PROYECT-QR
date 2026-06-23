# PROGRESS — PROYECT-QR (LISTO PARA PRODUCCIÓN)

**Última actualización:** 2026-06-22
**Estado:** Preparación para producción completada — PDF mejorado con fondo A4 landscape full bleed y campos superpuestos, frontend configurado para Vercel, backend configurado para Render, soporte dual MySQL/PostgreSQL, documentación de deploy.

---

## Resumen ejecutivo

| Indicador | Valor |
|-----------|-------|
| Tests backend (Jest) | 88 passing, 0 failing |
| Tests frontend (Jest) | 29 passing, 0 failing |
| Tests E2E (Cypress) | 6 passing, 4 failing (pre-existing) |
| Cobertura frontend | ~69% statements (threshold 60%) |
| Módulos completos | 5/5 Bloques |
| **Deploy frontend** | ✅ Vercel (vercel.json + .env.production) |
| **Deploy backend** | ✅ Render (render.yaml + npm start) |
| **Base de datos** | ✅ MySQL + PostgreSQL (Neon) |
| **PDF certificado** | ✅ A4 landscape, fondo full bleed, datos superpuestos |

---

## 0) Preparación para producción (2026-06-22)

| Bloque | Estado | Archivos clave |
|--------|--------|----------------|
| **PDF certificado mejorado** | ✅ | `backend/src/services/certificatePdf.js` — Times-Bold para nombres y actividad, Times-Italic para cargo, línea de firma dibujada |
| **Fondo certificado mejorado** | ✅ | `backend/scripts/generate_certificate_background.js` — 1754x1240px, bordes dorado/rojo, doble marco, línea de firma |
| **Frontend Vercel** | ✅ | `frontend/.env.production`, `frontend/vercel.json`, `frontend/vite.config.mjs` |
| **Backend Render** | ✅ | `backend/.env.production.example`, `render.yaml` (raíz), `package.json` start script |
| **Soporte PostgreSQL** | ✅ | `database/schema.postgresql.sql`, `database/seed.postgresql.sql`, `backend/src/config/db.js` (dual driver mysql2 + pg según DB_TYPE) |
| **SQL portable** | ✅ | Eliminados `ON DUPLICATE KEY UPDATE`, `JSON_OBJECT()`, `VALUES()` — ahora usa upsert con SELECT+INSERT/UPDATE y JSON.stringify() en JS |
| **README deploy** | ✅ | `README.md` — sección "Deploy en producción" con Neon, Render, Vercel paso a paso |

## 1) Bloques de refactorización completados

### Bloque 1: Setup de diseño profesional

| Componente | Implementación | Archivos clave |
|------------|---------------|----------------|
| Tailwind CSS v3 + PostCSS | Instalado y configurado con `preflight: false` | `frontend/tailwind.config.js`, `postcss.config.cjs` |
| Paleta CIP | Colores `#8B1A1A` (rojo CIP) y `#C5954C` (dorado) | `tailwind.config.js`, `variables.css` |
| shadcn/ui components | Button, Card, Input, Badge, Table, Dialog con variantes CIP | `frontend/src/components/ui/` |
| Animaciones | fade-in, slide-in-right, shimmer | `tailwind.config.js` + `global.css` |
| Build | Exitoso | `npm run build` pasa |

### Bloque 2: Corrección de bugs visuales

| Bug | Solución | Archivos clave |
|-----|----------|----------------|
| Dashboard PieChart labels | Labels fuera del pie con `midAngle` + `outerRadius + 24` | `Dashboard.jsx` |
| Actividades tabla responsive | Wrapper `overflow-x: auto` + min-widths | `Actividades.jsx` |
| DB UTF-8 encoding | `charset: 'utf8mb4'` en pool de MySQL | `backend/src/config/db.js` |

### Bloque 3: Rediseño completo Plantillas

| Sub-bloque | Estado | Archivos clave |
|------------|--------|----------------|
| 3.1 Schema DB | `imagen_fondo` en plantillas, tabla `plantilla_campos` | `database/schema.sql` |
| 3.2 Tests backend (TDD) | 5 tests para endpoints de campos | `backend/src/__tests__/plantillas.campos.routes.test.js` |
| 3.3 Backend endpoints | POST /:id/imagen (multer), PUT/GET /:id/campos, GET /:id con campos | `backend/src/routes/plantillas.routes.js` |
| 3.4 PDF generation | `writeImageBasedPdf()` con overlay de imagen + sharp | `backend/src/services/certificatePdf.js` |
| 3.5 Tests frontend | 5 tests con QueryClientProvider + MemoryRouter | `frontend/src/__tests__/Plantillas.test.jsx` |
| 3.6 Editor canvas | Drag-drop campos, upload imagen, config panel, coordinate persistence | `frontend/src/pages/Plantillas.jsx`, `Plantillas.css` |
| 3.7 Integración certificados | Certificados usa `imagen_fondo` + `plantilla_campos` para PDF | `backend/src/routes/certificados.routes.js` |
| 3.8 Tests finales | 84 backend + 29 frontend pasando | Ambos builds exitosos |

---

## 2) Módulos originales (heredados)

| # | Módulo | Tests |
|---|--------|-------|
| 1 | API base (createApp, health) | `health.test.js` |
| 2 | Validadores de dominio | `/*.test.js` |
| 3 | Auth backend | `auth.test.js` |
| 4 | Actividades backend | `actividades.routes.test.js` |
| 5 | Participantes backend | `participantes.routes.test.js` |
| 6 | Plantillas backend (original) + campos | `plantillas.routes.test.js`, `plantillas.campos.routes.test.js` |
| 7 | Configuración backend | `config.routes.test.js` |
| 8 | Certificados backend | `certificados.routes.test.js` |
| 9 | Entrega pública backend | `entrega.routes.test.js` |
| 10 | Validación pública API | `validacion.test.js` |
| 11 | Validación pública UI | `Validar.jsx` |
| 12 | Login + recuperación UI | `Login.test.jsx`, `ForgotPassword.test.jsx`, `ResetPassword.test.jsx` |
| 13 | Sesión cliente | `api.test.js` |
| 14 | Helper tests | `routeTestUtils.js` |
| 15 | Generación PDF/QR | `certificatePdf.test.js` |
| 16 | Dashboard UI | `Dashboard.test.jsx` |
| 17 | Actividades UI | `Actividades.test.jsx` |
| 18 | Participantes UI | `Participantes.test.jsx` |
| 19 | Plantillas UI (refactorizado) | `Plantillas.test.jsx` |
| 20 | Certificados UI | `Certificados.test.jsx` |
| 21 | Configuración UI | `Configuracion.test.jsx` |

## 3) Archivos clave de la refactorización

| Archivo | Rol |
|---------|-----|
| `frontend/tailwind.config.js` | Paleta CIP + animaciones + shadcn/ui |
| `frontend/src/components/ui/Button.jsx`, `Card.jsx`, etc. | Componentes shadcn/ui con tema CIP |
| `frontend/src/styles/global.css` | Directivas Tailwind |
| `frontend/src/styles/variables.css` | Variables HSL shadcn/ui + colores CIP |
| `frontend/src/lib/utils.js` | Función `cn()` |
| `frontend/src/pages/Plantillas.jsx` | Editor canvas con campos arrastrables |
| `frontend/src/pages/Plantillas.css` | Estilos del nuevo editor |
| `frontend/src/__tests__/Plantillas.test.jsx` | 5 tests para nuevo editor |
| `backend/src/routes/plantillas.routes.js` | Endpoints de campos + imagen |
| `backend/src/services/certificatePdf.js` | `writeImageBasedPdf()` con overlay |
| `backend/src/routes/certificados.routes.js` | Integración imagen + campos |
| `backend/src/__tests__/plantillas.campos.routes.test.js` | 5 tests TDD para campos |
| `database/schema.sql` | Tabla `plantilla_campos` + `imagen_fondo` |

---

## 4) Hotfix: error crítico Plantillas (2026-06-18)

### Causa raíz

El flujo de creación de plantillas tenía 3 errores de base de datos que impedían guardar:

| # | Error | Causa | Síntoma |
|---|-------|-------|---------|
| 1 | `Field 'contenido' doesn't have a default value` | Columna `contenido` era `NOT NULL` en DB real (vs `NULL` en `schema.sql`). El INSERT no incluía `contenido`. | `POST /api/plantillas` devolvía 500 |
| 2 | `Unknown column 'imagen_fondo' in 'field list'` | Columna `imagen_fondo` no existía en la tabla real (`schema.sql` la define pero nunca se migró). | `POST /:id/imagen` devolvía 500 |
| 3 | `Table 'plantilla_campos' doesn't exist` | Tabla `plantilla_campos` nunca fue creada en la DB real. | `GET /:id` y `PUT /:id/campos` devolvían 500 |

Además, el frontend ocultaba el error real tras un mensaje genérico `'Error al crear plantilla'`.

### Solución aplicada

| Archivo | Cambio |
|---------|--------|
| `backend/scripts/create_missing_tables.js` | Script de migración que: (1) ALTER `contenido` → NULL, (2) ADD `imagen_fondo`, (3) CREATE `plantilla_campos` |
| `backend/src/routes/plantillas.routes.js` | (1) INSERT unificado: siempre incluye `contenido` explícitamente (`NULL` cuando no se provee). (2) try-catch en TODOS los endpoints (GET, POST, PUT, DELETE) con `console.error` + mensaje real. (3) Validación `pool` no nulo. (4) `req.user.id || null` por seguridad FK. |
| `frontend/src/pages/Plantillas.jsx` | (1) Error handlers muestran `err.response?.data?.message || err.message` en vez de genérico. (2) `accept="image/*"` en input file. |
| `backend/src/__tests__/plantillas.routes.test.js` | Tests nuevos: (1) POST sin contenido (nombre solo). (2) POST nombre vacío. (3) Upload imagen PNG real con verificación DB + disco. (4) Rechazo de tipo no imagen. |

### Tests que pasan

| Suite | Tests |
|-------|-------|
| Backend `plantillas.routes.test.js` | 11 tests (6 nuevos) |
| Backend `plantillas.campos.routes.test.js` | 5 tests |
| Cypress `plantillas.cy.js` | 1 test E2E (nuevo: crear + upload imagen) |

### Para restaurar la DB desde cero

Ejecutar en orden:
```sql
source database/schema.sql;
source database/seed.sql;
```

---

## 5) Deuda conocida (no bloquea)

| Área | Estado |
|------|--------|
| Tests Jest Validar.jsx, App.jsx, requiredPlaceholders.js | Pendiente — cobertura bajo umbral |
| Tests CSV import participantes | Pendiente — ruta existe, falta test unit |
| Auditoría UI/reporte | Inserciones en rutas; sin UI de reporte |
| Reemisión / REEMPLAZADO | Pendiente si negocio lo exige |
| OpenAPI spec | Pendiente opcional |
| Tablas faltantes en DB (refresh_tokens, password_reset_tokens, etc.) | Si se ejecuta `schema.sql` completo se crean todas; la DB actual solo tiene algunas. Correr `source database/schema.sql` para sincronizar. |

---

## 6) Scripts de ejecución

```powershell
# 1. MySQL (puerto 3307, usuario root, contraseña MySQLRoot123!)
#    Ejecutar: database/schema.sql + database/seed.sql

# 2. Backend (puerto 3000)
cd backend; npm install; npm run dev

# 3. Frontend (puerto 5173, proxy /api)
cd frontend; npm install; npm run dev

# 4. Tests backend (88 tests)
cd backend; npm test

# 5. Tests frontend + coverage (29 tests)
cd frontend; npm run test:coverage

# 6. E2E Cypress (requiere backend:3000 + frontend:5173 levantados)
cd frontend; npm run test:e2e
```

---

## 7) Referencias de documentación

| Documento | Rol |
|-----------|-----|
| `DECISIONES_TECNICAS.md` | Arquitectura cerrada |
| `FUNCTIONAL_DEFINITION.md` | Requisitos funcionales |
| `CRITERIOS_ACEPTACION.md` | Criterios BDD |
| `MASTER_SPEC.md` | Visión del proyecto |
| `REPORTE_FINAL.md` | Reporte final del proyecto |
| `MODELO_DE_DATOS.md` | Modelo de datos actualizado |
| `API_SPEC.md` | API spec actualizada |