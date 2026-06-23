# Sistema de Generación y Validación de Certificados con Código QR

Sistema web para la generación, gestión y validación de certificados digitales mediante códigos QR.

## Tecnologías

- **Frontend:** React + Vite (deploy en Vercel)
- **Backend:** Node.js + Express (deploy en Render)
- **Base de datos:** MySQL (local) / PostgreSQL (producción en Neon)

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

## Autor

Jorge Lennon Anccasi Espinoza
