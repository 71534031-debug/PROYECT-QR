# Controles de Seguridad Implementados — ISO 27002

## 1. Controles Organizacionales

| Control ISO | Descripción | Implementación |
|:-----------:|-------------|---------------|
| **5.1** | Políticas de seguridad | Política de Seguridad (este documento) |
| **5.2** | Roles y responsabilidades | ADMIN y ADMINISTRATIVO con permisos segregados |
| **5.15** | Acuerdos de confidencialidad | Términos de uso del sistema |
| **5.17** | Segregación de responsabilidades | Roles CRUD bien definidos (ver Matriz de Control) |
| **5.24** | Gestión de incidentes | Plan de respuesta a incidentes |

## 2. Controles de Personas

| Control ISO | Descripción | Implementación |
|:-----------:|-------------|---------------|
| **6.1** | Investigación de antecedentes | Proceso manual (a cargo de la institución) |
| **6.2** | Términos y condiciones de empleo | Roles y permisos definidos |
| **6.3** | Concientización y capacitación | Documentación de usuario |

## 3. Controles Físicos

| Control ISO | Descripción | Implementación |
|:-----------:|-------------|---------------|
| **7.1** | Perímetro de seguridad física | Hosting cloud (Vercel + Render + Neon) |
| **7.9** | Equipos desatendidos | Sesión con timeout (JWT 15 min) |
| **7.10** | Política de escritorio limpio | Aplicable a estaciones de trabajo |

## 4. Controles Tecnológicos

### 4.1 Criptografía (ISO 27002: 8.24)

```
┌─────────────────────────────────────────────────────┐
│  Datos en tránsito     │  HTTPS (TLS 1.3)           │
│  Contraseñas           │  bcrypt (salt rounds: 10)  │
│  Tokens de sesión      │  JWT (HS256)               │
│  Códigos QR            │  UUID v4 aleatorio         │
│  Enlaces de descarga   │  Token UUID + expiración   │
└─────────────────────────────────────────────────────┘
```

### 4.2 Seguridad en Comunicaciones (ISO 27002: 8.20)

- HTTPS forzado en producción
- CORS restringido al frontend autorizado
- Headers de seguridad (pendiente: helmet)
- No exposición de IPs internas

### 4.3 Control de Acceso (ISO 27002: 9.x)

```
┌─────────────────────────────────────────────────────┐
│  Capa 1: Autenticación                              │
│  └─ Email + contraseña (bcrypt)                    │
│  └─ JWT Access Token (15 min)                      │
│  └─ Refresh Token (7 días, un solo uso)            │
│                                                     │
│  Capa 2: Autorización                               │
│  └─ Middleware de roles en cada endpoint            │
│  └─ requireRoles('ADMIN', 'ADMINISTRATIVO')        │
│                                                     │
│  Capa 3: Validación de recursos                     │
│  └─ Verificar propiedad del recurso                 │
│  └─ Validar datos de entrada                        │
└─────────────────────────────────────────────────────┘
```

### 4.4 Adquisición y Mantenimiento (ISO 27002: 14.x)

- Dependencias auditadas con `npm audit`
- Pruebas de seguridad integradas
- Revisión de código antes de merge

## 5. Controles por Módulo

### Auth
| Control | Implementación | Archivo |
|---------|---------------|---------|
| Hash de contraseña | bcrypt.genSalt + bcrypt.hash | `auth.controller.js` |
| JWT firmado | jwt.sign con JWT_SECRET | `auth.middleware.js` |
| Refresh token rotación | Invalida al usar, genera nuevo | `auth.controller.js` |
| Forgot password token | Token único + expiración 1h | `auth.controller.js` |
| Logout | DELETE refresh token de DB | `auth.controller.js` |

### Actividades
| Control | Implementación |
|---------|---------------|
| Prepared statements | `pool.query('SELECT ? FROM actividades', [id])` |
| Validación campos requeridos | `if (!nombre) return 400` |
| Autorización | `requireRoles` middleware |

### Participantes
| Control | Implementación |
|---------|---------------|
| Validación datos de entrada | Campos obligatorios, tipos |
| Importación CSV validada | csv-parser con validación |
| No duplicados | Verificación documento + actividad |

### Plantillas
| Control | Implementación |
|---------|---------------|
| Validación tipo MIME | multer fileFilter |
| Límite tamaño imagen | multer limits: 5MB |
| Eliminación solo ADMIN | requireRoles('ADMIN') |

### Certificados
| Control | Implementación |
|---------|---------------|
| Código único UUID | uuid.v4() |
| Token de descarga | UUID + expiración 48h |
| Revocación solo ADMIN | requireRoles('ADMIN') |
| Verificación de existencia | SELECT antes de operar |

## 6. Auditoría y Trazabilidad

### Tabla `auditoria_eventos`
```
id         INT AUTO_INCREMENT
usuario_id INT
accion     VARCHAR(100)
detalle    JSON
ip         VARCHAR(45)
created_at TIMESTAMP
```

### Eventos auditados
- Login exitoso y fallido
- Creación/edición de registros
- Validación APTO
- Generación de certificados
- Revocación de certificados
- Subida/eliminación de imágenes
- Cambios de configuración
