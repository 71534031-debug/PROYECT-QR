# Sistema de Generación y Validación de Certificados con Código QR

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

Sistema web para la generación, gestión y validación de certificados digitales mediante códigos QR.

---

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Estructura](#estructura)
- [Desarrollo local](#desarrollo-local)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Base de datos](#base-de-datos)
- [Variables de Entorno](#variables-de-entorno)
  - [Backend (.env)](#backend-env)
  - [Frontend (.env.production)](#frontend-envproduction)
- [Health Check](#health-check)
- [Deploy en producción](#deploy-en-producción)
  - [1. Base de datos en Neon (PostgreSQL)](#1-base-de-datos-en-neon-postgresql)
  - [2. Backend en Render](#2-backend-en-render)
  - [3. Frontend en Vercel](#3-frontend-en-vercel)
  - [4. Verificar el deploy](#4-verificar-el-deploy)
- [Troubleshooting](#troubleshooting)
- [Autor](#autor)

---

## Tecnologías

- **Frontend:** React 18 + Vite 5 (deploy en Vercel)
- **Backend:** Node.js 18 + Express 4.19 (deploy en Render)
- **Base de datos:** MySQL 8 (local) / PostgreSQL (producción en Neon)
- **Autenticación:** JWT (access + refresh tokens)
- **PDF:** PDFKit con imagen de fondo y campos dinámicos
- **QR:** Librería qrcode con escaneo por cámara
- **Testing:** Jest + Supertest (backend), Jest + Testing Library (frontend), Cypress (E2E)
- **Estilos:** Tailwind CSS + CSS Modules con paleta CIP (rojo `#8B1A1A` / dorado `#C5954C`)

---

## Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **🔐 Autenticación** | Login con JWT, refresh tokens, recuperación de contraseña por email, control de acceso por roles (ADMIN / ADMINISTRATIVO) |
| **📋 Actividades** | CRUD de actividades académicas o institucionales con fechas y tipo |
| **👥 Participantes** | Registro individual o importación masiva por CSV, validación de estado (APTO / NO APTO / PENDIENTE), búsqueda y filtros |
| **🖼️ Plantillas** | Editor visual con canvas drag-and-drop para diseñar certificados, campos dinámicos (nombre, documento, actividad, fecha), imagen de fondo, previsualización |
| **📜 Certificados** | Generación masiva de PDFs con QR único por certificado, vista previa en modal, descarga individual o por enlace firmado, revocación |
| **⚙️ Configuración** | Personalización de nombre de institución, autoridad, cargo, logo institucional, firma digital |
| **✅ Validación QR** | Página pública para validar autenticidad de certificados escaneando el código QR o ingresando el código único |
| **📊 Dashboard** | Estadísticas con gráficos (Recharts) de actividades, participantes y certificados |
| **📤 Exportación** | Exportar datos a CSV, Excel y PDF desde cada módulo |
| **📋 Auditoría** | Trazabilidad completa de eventos: generación, descarga, revocación de certificados y cambios de configuración |

---

## Estructura

```text
backend/          # API REST (Express + Node.js)
frontend/         # SPA (React + Vite)
database/         # Schemas SQL (MySQL y PostgreSQL)
  schema.sql           # MySQL
  seed.sql             # MySQL seeds
  schema.postgresql.sql # PostgreSQL
  seed.postgresql.sql   # PostgreSQL seeds
render.yaml       # Config Render (opcional, deploy automático)
```

---

## Desarrollo local

### Backend

```bash
cd backend
cp .env.example .env  # editar credenciales
npm install
npm run dev           # http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

### Base de datos

```bash
# MySQL (local)
mysql -h localhost -P 3306 -u root -p < database/schema.sql
mysql -h localhost -P 3306 -u root -p < database/seed.sql
```

---

## Variables de Entorno

### Backend (.env)

```env
# ========== ENTORNO ==========
NODE_ENV=development

# ========== SERVIDOR ==========
PORT=3000

# ========== BASE DE DATOS ==========
DB_TYPE=mysql              # mysql | postgresql
DB_HOST=localhost
DB_PORT=3306               # 3306 (MySQL) / 5432 (PostgreSQL)
DB_USER=root
DB_PASSWORD=MySQLRoot123!
DB_NAME=certificados_db
DB_SSL=false               # true para Neon (PostgreSQL)

# ========== JWT ==========
JWT_SECRET=una_clave_segura_aqui
JWT_DOWNLOAD_SECRET=otra_clave_segura_aqui

# ========== URLs PÚBLICAS ==========
FRONTEND_PUBLIC_URL=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:3000

# ========== CORREO (recuperación de contraseña) ==========
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_o_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# ========== ARCHIVOS ==========
UPLOAD_DIR=uploads
```

### Frontend (.env.production)

```env
VITE_API_URL=https://proyect-qr-backend.onrender.com
```

---

## Health Check

El backend expone un endpoint de health check público (sin autenticación):

```bash
curl https://proyect-qr-backend.onrender.com/api/health
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2026-06-22T12:00:00.000Z"
}
```

**Respuesta con error de base de datos:**

```json
{
  "success": false,
  "message": "Error de conexión a la base de datos",
  "timestamp": "2026-06-22T12:00:00.000Z"
}
```

También puedes probar localmente:

```bash
curl http://localhost:3000/api/health
```

---

## Deploy en producción

### 1. Base de datos en Neon (PostgreSQL)

1. Crea una cuenta en [neon.tech](https://neon.tech)
2. Crea un proyecto nuevo (región cercana a Perú: US East o South America)
3. En la pestaña **Databases**, copia la cadena de conexión (Connection string)
4. Conéctate con `psql` o la consola de Neon y ejecuta:

```bash
psql "postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/certificados_db?sslmode=require" -f database/schema.postgresql.sql
psql "postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/certificados_db?sslmode=require" -f database/seed.postgresql.sql
```

### 2. Backend en Render

1. Crea una cuenta en [render.com](https://render.com) (conecta tu GitHub)
2. Ve a **New + > Web Service**
3. Conecta tu repositorio y selecciona la rama `main`
4. Configura:
   - **Name:** `proyect-qr-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Agrega las siguientes **Environment Variables** (saca los valores de tu `.env.production`):

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DB_TYPE` | `postgresql` |
| `DB_HOST` | (host de Neon) |
| `DB_PORT` | `5432` |
| `DB_USER` | (user de Neon) |
| `DB_PASSWORD` | (password de Neon) |
| `DB_NAME` | `certificados_db` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | (string aleatoria segura) |
| `JWT_DOWNLOAD_SECRET` | (string aleatoria segura) |
| `FRONTEND_PUBLIC_URL` | `https://proyect-qr.vercel.app` |
| `BACKEND_PUBLIC_URL` | `https://proyect-qr-backend.onrender.com` |
| `UPLOAD_DIR` | `uploads` |

6. Haz clic en **Create Web Service**

### 3. Frontend en Vercel

1. Instala Vercel CLI o usa la consola web: `npm i -g vercel`
2. En la raíz del frontend:

```bash
cd frontend
vercel --prod
```

3. O desde la web de Vercel:
   - **New Project > Import Git Repository**
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Agrega **Environment Variable**:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://proyect-qr-backend.onrender.com` |

5. **Importante:** En `frontend/.env.production` ya está definida la URL del backend para el build local.

### 4. Verificar el deploy

- Frontend: `https://proyect-qr.vercel.app`
- Backend: `https://proyect-qr-backend.onrender.com`
- Health check: `https://proyect-qr-backend.onrender.com/api/health`

---

## Troubleshooting

### Render cold start

**Problema:** La primera petición después de un periodo de inactividad tarda 30-60 segundos.

**Causa:** Render pone en "sleep" los servicios del plan gratis después de 15 minutos sin actividad.

**Solución:**
- Espera ~30 segundos y recarga la página.
- La respuesta llegará una vez que el servidor se inicie.
- Para evitar esto, puedes usar un servicio de uptime (ej. UptimeRobot) que haga una petición cada 10 minutos al endpoint `/api/health`.

### CORS

**Problema:** Error `No 'Access-Control-Allow-Origin' header is present` en la consola del navegador.

**Causa:** El backend no tiene configurado correctamente el origen del frontend.

**Solución:**
- Verifica que `FRONTEND_PUBLIC_URL` esté correcta en las variables de entorno de Render.
- En producción, debe ser `https://proyect-qr.vercel.app` (sin barra al final).
- En `backend/src/app.js`, CORS permite los orígenes configurados o usa `cors()` con opciones explícitas.
- Si el dominio cambió, actualiza la variable y redeploya.

### SSL Neon

**Problema:** `connect ECONNREFUSED` o `SSL connection error` al conectar a Neon.

**Causa:** Neon requiere conexión SSL/TLS obligatoria.

**Solución:**
- Verifica que `DB_SSL=true` esté configurado en Render.
- El archivo `backend/src/config/db.js` ya maneja SSL para PostgreSQL cuando `DB_SSL` es `true`.
- Si usas MySQL local, `DB_SSL` debe ser `false`.
- Prueba la conexión manualmente con `psql` usando `sslmode=require`.

### 404 en Vercel

**Problema:** Al recargar una ruta que no es `/` (ej. `/actividades`), Vercel devuelve 404.

**Causa:** Vite genera un SPA con rutas del lado del cliente; Vercel necesita saber que todas las rutas deben servir `index.html`.

**Solución:**
- El archivo `frontend/vercel.json` ya incluye las reglas necesarias:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- Si sigues viendo 404, verifica que `vercel.json` esté en la raíz del frontend (`frontend/vercel.json`).
- En Vercel, asegúrate de que **Root Directory** apunte a `frontend`.

### Uploads efímeros

**Problema:** Los logos, firmas o imágenes de fondo subidos desaparecen tras un redeploy.

**Causa:** Render usa un sistema de archivos efímero. Todo lo escrito en disco se pierde al redeployar.

**Solución:**
- Los archivos subidos (`uploads/`) no persisten entre deploys en Render.
- Para producción real, se recomienda usar un servicio de almacenamiento externo (AWS S3, Cloudinary, Supabase Storage).
- Actualmente el sistema almacena en `uploads/` dentro del contenedor de Render.
- Como workaround, evita redeployar después de subir archivos, o usa seed scripts para recargarlos.
- Los PDFs de certificados generados también se pierden; deben regenerarse si es necesario.

### DB no conecta

**Problema:** `Error: connect ECONNREFUSED` o `ENOTFOUND` al iniciar el backend.

**Causa:** Las credenciales de base de datos son incorrectas o la base de datos no está accesible.

**Solución:**
- Verifica que `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` sean correctos.
- Para Neon: el host tiene formato `ep-xxxx.us-east-2.aws.neon.tech`.
- Para MySQL local: `DB_HOST=localhost`, `DB_PORT=3306`.
- Asegúrate de que `DB_SSL=true` para Neon y `DB_SSL=false` para MySQL local.
- En Render, verifica que la IP de Render no esté bloqueada por firewall de Neon (Neon acepta conexiones de cualquier IP por defecto).
- Prueba la conexión independientemente:
  ```bash
  # PostgreSQL
  psql "postgresql://user:pass@host:5432/db?sslmode=require"
  # MySQL
  mysql -h host -P 3306 -u user -p
  ```

---

## Autor

Jorge Lennon Anccasi Espinoza
