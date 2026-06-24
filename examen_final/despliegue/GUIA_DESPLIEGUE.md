# Guía de Despliegue — Sistema de Certificados QR

## 1. Arquitectura de Despliegue

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vercel    │────►│   Render    │────►│   Neon      │
│  Frontend   │     │  Backend    │     │ PostgreSQL  │
│  React+Vite │     │  Express    │     │             │
│             │     │  Node.js    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                        │
       │              ┌──────────────┐         │
       └─────────────►│   Uploads    │◄────────┘
                      │  (Render)    │
                      └──────────────┘
```

| Componente | Proveedor | Plan | URL |
|-----------|-----------|------|-----|
| Frontend | Vercel | Gratuito/Hobby | `https://sistema-certificados.vercel.app` |
| Backend | Render | Gratuito/Free | `https://sistema-certificados-api.onrender.com` |
| Base de datos | Neon | Gratuito/Free | `postgresql://...neon.tech` |

## 2. Requisitos Previos

```bash
# Node.js 18+ (LTS recomendado)
node --version   # v18.x o superior

# npm 9+
npm --version    # 9.x o superior

# Git
git --version    # Configurar remote origin
```

## 3. Variables de Entorno

### Backend (`backend/.env`)
```env
# Configuración de la base de datos
DB_TYPE=postgresql
DATABASE_URL=postgresql://usuario:password@host:5432/db

# JWT
JWT_SECRET=tu_secreto_jwt_aqui_minimo_32_caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (para CORS y enlaces QR)
FRONTEND_URL=https://sistema-certificados.vercel.app

# Email (para recuperación de contraseña)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu_app_password

# Puerto
PORT=3000
```

### Frontend (`frontend/.env`)
```env
# Backend URL (vacío para desarrollo con proxy de Vite)
VITE_API_URL=https://sistema-certificados-api.onrender.com
```

## 4. Despliegue del Backend en Render

### 4.1 Usando render.yaml (Infrastructure as Code)

```yaml
# render.yaml
services:
  - type: web
    name: sistema-certificados-api
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_VERSION
        value: 18
      - key: DB_TYPE
        value: postgresql
      - key: DATABASE_URL
        fromDatabase:
          type: postgresql
          name: sistema-certificados-db
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://sistema-certificados.vercel.app
```

### 4.2 Manual (desde Dashboard de Render)

1. Crear nuevo **Web Service**
2. Conectar repositorio de GitHub
3. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. Agregar variables de entorno
5. Crear base de datos PostgreSQL desde Dashboard
6. Desplegar

### 4.3 Health Check
```bash
# Verificar que el backend está funcionando
curl https://sistema-certificados-api.onrender.com/api/health
# → {"status":"ok","timestamp":"2026-01-01T00:00:00.000Z"}
```

## 5. Despliegue del Frontend en Vercel

### 5.1 Desde Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
cd frontend
vercel --prod
```

### 5.2 Desde Dashboard de Vercel

1. Importar repositorio de GitHub
2. Configurar:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Agregar variable de entorno `VITE_API_URL`
4. Desplegar

## 6. Post-Despliegue

### 6.1 Verificar
```bash
# 1. Backend health check
curl https://sistema-certificados-api.onrender.com/api/health

# 2. Frontend
curl https://sistema-certificados.vercel.app

# 3. Login de prueba
curl -X POST https://sistema-certificados-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'
```

### 6.2 Seed de Base de Datos
```bash
# Si es necesario, ejecutar seed
cd backend && npm run seed
```

## 7. Despliegue Local (Desarrollo)

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:3000
# → http://localhost:3000/api/health
```

### Base de datos
```bash
# Opción 1: MySQL local
# Opción 2: Neon (nube) - gratis
```

## 8. Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Error 504 en Render | Backend free se duerme | Esperar 30s, se reactiva solo |
| CORS error | `FRONTEND_URL` incorrecta | Verificar variable en Render |
| BD connection refused | DATABASE_URL errónea | Verificar cadena de conexión |
| Build falla en Vercel | Versión de Node incorrecta | Fijar `nodeVersion: 18` en vercel.json |
| Uploads no se ven | Ruta relativa en URL | Usar `api.defaults.baseURL` |
| Error "No file sent" | Content-Type incorrecto | NO forzar application/json en axios |
