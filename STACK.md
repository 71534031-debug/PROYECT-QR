# STACK

## 1) Stack tecnologico con versiones exactas

### Frontend
- React `18.2.0`
- React DOM `18.2.0`
- React Router DOM `6.22.3`
- Vite `5.2.0`
- Axios `1.6.8`
- SweetAlert2 `11.10.7`

### Backend
- Node.js `20.11.1`
- npm `10.2.4`
- Express `4.19.2`
- cors `2.8.5`
- dotenv `16.4.5`
- jsonwebtoken `9.0.2`
- bcrypt `5.1.0`
- multer `1.4.5-lts.1`
- csv-parser `3.0.0`
- mysql2 `3.9.7`
- uuid `9.0.1`
- qrcode `1.5.4`
- pdfkit `0.15.0`
- nodemailer `6.9.13`

### Base de datos e infraestructura
- MySQL `8.0.36`
- Git `2.44.0`
- Frontend deploy: Vercel
- Backend deploy: Render

## 2) Justificacion de cada eleccion (segun requerimientos del sistema)
- **React + Vite**: interfaz web dinamica, reutilizable y SPA para flujo administrativo con feedback rapido.
- **Node.js + Express**: API REST para autenticacion, actividades, participantes, certificados y validacion publica.
- **MySQL**: modelo relacional consistente para usuarios, actividades, participantes, plantillas y certificados.
- **JWT + bcrypt**: autenticacion de usuarios internos y proteccion de credenciales.
- **multer + csv-parser**: soporte a carga masiva de participantes por archivo.
- **pdfkit + qrcode + uuid**: emision PDF con codigo unico irrepetible y QR validable.
- **nodemailer**: soporte de entrega por correo de certificados.
- **Vercel/Render**: despliegue web cliente-servidor alineado a la arquitectura y entorno definidos.

## 3) Estructura de carpetas del proyecto

```text
backend/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- services/
|   |-- models/
|   |-- routes/
|   |-- middlewares/
|   |-- utils/
|   `-- app.js
|-- .env
`-- package.json

frontend/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- pages/
|   |-- layouts/
|   |-- services/
|   |-- hooks/
|   |-- router/
|   `-- main.jsx
|-- index.html
`-- package.json
```

## 4) Comandos base para instalar y correr

### Instalacion
```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### Ejecucion local
```bash
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```

### Produccion/build
```bash
# backend
npm start

# frontend
npm run build
npm run preview
```

## 5) Variables de entorno base (backend)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=[PENDIENTE]
DB_NAME=certificados_db
JWT_SECRET=[PENDIENTE]
EMAIL_USER=[PENDIENTE]
EMAIL_PASS=[PENDIENTE]
NODE_ENV=development
```

## 6) Consideraciones tecnicas obligatorias
- HTTPS en produccion.
- Validaciones criticas en backend.
- Manejo de errores con codigos HTTP estandar.
- Generacion de PDF y QR asincronica.
- Soporte de carga masiva CSV/Excel.
- Logs de trazabilidad en acciones criticas.
- No publicar archivos `.env`.
