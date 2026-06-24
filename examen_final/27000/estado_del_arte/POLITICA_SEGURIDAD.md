# Política de Seguridad de la Información — ISO 27000

## 1. Objetivo
Establecer los lineamientos de seguridad de la información para el Sistema de Certificados QR, protegiendo la confidencialidad, integridad y disponibilidad de los datos.

## 2. Alcance
Aplica a todos los usuarios, datos, procesos y componentes tecnológicos del sistema, incluyendo frontend, backend, base de datos y almacenamiento de archivos.

## 3. Principios de Seguridad

| Principio | Descripción | Implementación |
|-----------|-------------|---------------|
| **Confidencialidad** | Solo usuarios autorizados acceden a datos | JWT, roles, contraseñas hasheadas |
| **Integridad** | Datos no modificados sin autorización | Validación server-side, transacciones SQL |
| **Disponibilidad** | Sistema accesible cuando se necesita | Health check, pool de conexiones, hosting redundante |

## 4. Controles de Acceso

### 4.1 Autenticación
- Login con email y contraseña
- Contraseñas hasheadas con **bcrypt** (salt rounds: 10)
- **JWT (JSON Web Tokens)** para sesiones
  - Access token: expira en **15 minutos**
  - Refresh token: expira en **7 días**
- Recuperación de contraseña mediante token con expiración de **1 hora**

### 4.2 Autorización (Roles)
| Rol | Permisos |
|-----|---------|
| **ADMIN** | Acceso completo: CRUD, revocar certificados, eliminar plantillas, configurar sistema |
| **ADMINISTRATIVO** | CRUD actividades/participantes/plantillas, generar certificados. NO puede eliminar plantillas, revocar certificados ni modificar configuración |

### 4.3 Control de Sesiones
- Logout invalida refresh token en DB
- Cada login genera par único de tokens
- Refresh token de un solo uso (se invalida al usarse)

## 5. Seguridad de Datos

### 5.1 Datos Personales
El sistema maneja datos personales (nombres, apellidos, documento de identidad, email). Se recomienda:
- Solicitar consentimiento informado al registrar participantes
- No compartir datos con terceros no autorizados
- Eliminar datos personales cuando ya no sean necesarios (política de retención)

### 5.2 Datos Críticos
| Dato | Protección |
|------|-----------|
| Contraseñas | bcrypt hash |
| Tokens JWT | Firma con secreto único (JWT_SECRET) |
| Nombres de participantes | Encriptación en tránsito (HTTPS) |
| Códigos QR | Código único aleatorio UUID |
| PDF de certificados | Token de descarga con expiración 48h |

## 6. Seguridad en la Red

- **HTTPS obligatorio** en producción (Vercel + Render lo proporcionan automáticamente)
- **CORS** configurado solo para el frontend autorizado
- **Rate limiting** recomendado (pendiente de implementar)
- **Validación de tipos MIME** en uploads de archivos

## 7. Seguridad en el Código

| Práctica | Estado |
|----------|:------:|
| Validación de entrada en server-side | ✅ |
| Prepared statements (SQL injection) | ✅ (MySQL2 utiliza ? placeholders) |
| No exposición de secretos en cliente | ✅ |
| Manejo de errores sin filtrar información sensible | ✅ |
| npm audit para dependencias | ✅ |
| ESLint para calidad de código | ✅ |

## 8. Respuesta a Incidentes

| Nivel | Descripción | Tiempo de respuesta |
|-------|-------------|:------------------:|
| 🔴 Crítico | Brecha de datos, caída total del sistema | < 1 hora |
| 🟡 Alto | Error que impide funcionalidad principal | < 4 horas |
| 🟢 Medio | Error en funcionalidad secundaria | < 24 horas |
| 🔵 Bajo | Bug cosmético o mejora | < 1 semana |

## 9. Roles y Responsabilidades

| Rol | Responsabilidad |
|-----|---------------|
| **Administrador del sistema** | Gestionar usuarios, configuración, revocar certificados, monitorear logs |
| **Usuario administrativo** | Gestión de actividades, participantes, plantillas y certificados |
| **Desarrollador** | Mantenimiento del código, corrección de bugs, despliegue |
| **Auditor** | Revisar logs de auditoría, verificar cumplimiento de políticas |
