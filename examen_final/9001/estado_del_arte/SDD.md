# Software Design Document (SDD) — Sistema de Certificados QR

## 1. Introducción

### 1.1 Propósito
Documentar el diseño arquitectónico del sistema de generación y validación de certificados digitales mediante códigos QR.

### 1.2 Alcance
El sistema permite a instituciones educativas y profesionales (como el CIP) gestionar actividades, registrar participantes, diseñar plantillas, generar certificados digitales con QR únicos y validar su autenticidad.

## 2. Arquitectura del Sistema

### 2.1 Arquitectura General (Cliente-Servidor)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Frontend      │       │   Backend        │       │   Base de       │
│   (React+Vite)  │◄─────►│   (Express+Node)│◄─────►│   Datos         │
│   Vercel        │  HTTP │   Render         │       │   Neon/MySQL    │
└─────────────────┘  REST └─────────────────┘       └─────────────────┘
```

### 2.2 Patrón Arquitectónico
- **Backend:** MVC (Modelo-Vista-Controlador) con rutas Express
- **Frontend:** SPA (Single Page Application) con componentes React
- **API:** RESTful con autenticación JWT

### 2.3 Diagrama de Capas

```
┌──────────────────────────────────────────────────────┐
│                   CAPA DE PRESENTACIÓN                │
│  React Router │ Componentes │ Tailwind CSS │ Framer   │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP/JSON
┌──────────────────────▼───────────────────────────────┐
│                   CAPA DE NEGOCIO                     │
│  Express Router │ Middlewares │ Servicios │ Validad.  │
└──────────────────────┬───────────────────────────────┘
                       │ SQL
┌──────────────────────▼───────────────────────────────┐
│                   CAPA DE DATOS                       │
│  MySQL2/PostgreSQL │ Pool de Conexiones │ Migraciones │
└──────────────────────────────────────────────────────┘
```

## 3. Módulos del Sistema

| Módulo | Descripción | Tecnología |
|--------|-------------|-----------|
| Auth | Login, JWT, refresh token, recuperación de contraseña | JWT, bcrypt, nodemailer |
| Actividades | CRUD de actividades académicas | Express + MySQL/PostgreSQL |
| Participantes | Registro, importación CSV, validación APTO | Express + csv-parser |
| Plantillas | Editor visual con canvas drag-and-drop | React canvas + multer + sharp |
| Certificados | Generación PDF con QR, descarga, revocación | PDFKit + qrcode |
| Configuración | Logo, firma, datos institucionales | multer + Express |
| Validación | Validación pública de certificados por QR | React + cámara |
| Dashboard | Estadísticas con gráficos | Recharts + React Query |

## 4. Base de Datos

### 4.1 Diagrama Entidad-Relación

```
usuarios ──┐
           │
actividades ──── actividad_participante ──── participantes
     │                      │
     │                      └── certificados ──── plantillas
     │                                            │
     └── auditoria_eventos              plantilla_campos

configuracion_institucional (1 fila)
refresh_tokens
password_reset_tokens
```

### 4.2 Tablas Principales

| Tabla | Propósito | Registros esperados |
|-------|-----------|-------------------|
| `usuarios` | Usuarios del sistema (ADMIN, ADMINISTRATIVO) | < 50 |
| `actividades` | Actividades académicas | < 500/año |
| `participantes` | Personas registradas | < 5000/año |
| `actividad_participante` | Relación N:M con estado_validacion | < 50000 |
| `plantillas` | Plantillas de certificados | < 20 |
| `plantilla_campos` | Campos dinámicos del editor | < 200 |
| `certificados` | Certificados emitidos | < 5000/año |
| `configuracion_institucional` | Configuración del sistema | 1 fila |
| `auditoria_eventos` | Trazabilidad de acciones | < 10000/año |

## 5. Seguridad

- Contraseñas hasheadas con bcrypt
- JWT firmado con secreto único
- Roles (ADMIN / ADMINISTRATIVO) para control de acceso
- Tokens de descarga con expiración de 48h
- Validación de tipos de archivo en uploads (imágenes)
- Límite de tamaño de archivos (5MB)
