# ISO/IEC 25000 SQuaRE — Calidad del Producto de Software

## 1. Introducción
Aplicación del modelo **SQuaRE (Software Quality Requirements and Evaluation)** al Sistema de Certificados QR, evaluando calidad interna, externa y en uso.

## 2. Modelo de Calidad del Producto (ISO 25010)

### 2.1 Funcionalidad (Functional Suitability)

| Característica | Evaluación | Evidencia |
|---------------|-----------|-----------|
| Completez funcional | ✅ Alta | 88 pruebas backend, 29 frontend |
| Corrección funcional | ✅ Alta | Endpoints REST validados |
| Pertinencia funcional | ✅ Alta | Cubre requisitos del CIP |

### 2.2 Eficiencia de Desempeño (Performance Efficiency)

| Métrica | Valor | Evaluación |
|---------|-------|-----------|
| Tiempo de respuesta API (p95) | < 500ms | ✅ Aceptable |
| Tiempo de generación de PDF | < 3s | ✅ Aceptable |
| Tamaño de bundle frontend | ~250KB JS | ✅ Bueno |
| Uso de memoria backend | ~60MB idle | ✅ Bueno |

### 2.3 Compatibilidad (Compatibility)

- **Navegadores:** Chrome 90+, Firefox 90+, Edge 90+
- **Dispositivos:** Desktop y tablet
- **Bases de datos:** MySQL 8+ y PostgreSQL 14+ (según DB_TYPE)

### 2.4 Usabilidad (Usability)

| Aspecto | Implementación |
|---------|---------------|
| Consistencia visual | Tailwind CSS + paleta CIP |
| Responsive | Tailwind responsive utilities |
| Feedback visual | Toast notifications (sonner) |
| Tiempo de aprendizaje estimado | < 15 min para operadores |

### 2.5 Confiabilidad (Reliability)

- Health check endpoint (`/api/health`)
- Pool de conexiones a BD con reconexión
- Manejo de errores asíncronos con try/catch (corregido en esta auditoría)
- Tiempo de actividad objetivo: 99.5%

### 2.6 Seguridad (Security)

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- JWT con expiración (15 min access, 7 días refresh)
- Roles segregados (ADMIN vs ADMINISTRATIVO)
- Tokens de descarga con expiración de 48h
- Validación de tipos de archivo en uploads

### 2.7 Mantenibilidad (Maintainability)

| Métrica | Valor |
|---------|-------|
| Cobertura de pruebas backend | ~75% |
| Cobertura de pruebas frontend | ~69% |
| ESLint configurado | ✅ |
| SonarQube listo para análisis | ✅ |

## 3. Resultados de Evaluación

### 3.1 Calidad Interna (Código)

```javascript
// Ejemplo de código optimizado tras refactor
const safeAsync = (fn) => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next);
```

### 3.2 Calidad Externa (API)

| Endpoint | Método | Status | Tiempo promedio |
|----------|--------|--------|----------------|
| `/api/health` | GET | ✅ | 15ms |
| `/api/auth/login` | POST | ✅ | 120ms |
| `/api/participantes` | GET | ✅ | 80ms |
| `/api/certificados/generar` | POST | ✅ | 2.5s |
| `/api/validacion/qr/:codigo` | GET | ✅ | 50ms |

### 3.3 Calidad en Uso

- Efectividad: 100% de las tareas principales realizables
- Productividad: 3 clics para validar un certificado
- Satisfacción: Interfaz intuitiva con feedback visual
- Contexto: CIP y otras instituciones educativas
