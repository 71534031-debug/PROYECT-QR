# Matriz de Calidad — ISO 25000 SQuaRE

## Matriz: Requisitos de Calidad vs Módulos

| Requisito de Calidad | Auth | Act. | Part. | Plant. | Cert. | Config. | Val. QR |
|----------------------|:----:|:----:|:-----:|:------:|:-----:|:-------:|:-------:|
| **Funcionalidad** | | | | | | | |
| Completez | A | A | A | A | A | A | A |
| Corrección | A | A | A | A | A | A | A |
| Pertinencia | A | A | A | A | A | A | A |
| **Eficiencia** | | | | | | | |
| Tiempo respuesta | A | A | A | A | M | A | A |
| Uso recursos | A | A | A | A | M | A | A |
| **Compatibilidad** | | | | | | | |
| Navegadores | A | A | A | M | A | M | A |
| BD múltiple | — | A | A | A | A | A | — |
| **Usabilidad** | | | | | | | |
| Consistencia | A | A | A | A | A | A | A |
| Feedback | A | A | A | A | A | A | A |
| **Confiabilidad** | | | | | | | |
| Disponibilidad | A | A | A | A | A | A | A |
| Recuperación | M | M | M | M | M | M | — |
| **Seguridad** | | | | | | | |
| Autenticación | A | A | A | A | A | A | — |
| Autorización | A | A | A | A | A | A | — |
| **Mantenibilidad** | | | | | | | |
| Modularidad | A | A | A | A | A | A | A |
| Pruebas | A | A | A | A | A | A | A |

*A = Alto, M = Medio, B = Bajo*

---

## Matriz: Atributos de Calidad vs Estrategias

| Atributo | Estrategia Implementada | Herramienta |
|----------|------------------------|-------------|
| **Rendimiento** | Conexión pool a BD, lazy loading frontend | MySQL2/PG Pool, Vite |
| **Seguridad** | JWT, bcrypt, roles, validación tipos archivo | jsonwebtoken, bcrypt, multer |
| **Disponibilidad** | Health check, manejo errores asíncronos | Express error middleware |
| **Mantenibilidad** | MVC, rutas modulares, ESLint | Express Router, ESLint |
| **Portabilidad** | DB_TYPE auto, Vite proxy | Variables de entorno |
| **Usabilidad** | Tailwind, shadcn/ui, sonner, framer-motion | UI component library |
| **Integridad** | Transacciones SQL, validación server-side | MySQL2 transactions |
| **Auditabilidad** | Tabla auditoria_eventos | INSERT trigger desde API |

---

## Matriz: Métricas de Calidad por Tipo de Prueba

| Tipo Prueba | Métrica | Objetivo | Actual |
|-------------|---------|:--------:|:------:|
| Unitaria backend | % cobertura líneas | ≥ 70% | ~75% |
| Unitaria frontend | % cobertura líneas | ≥ 60% | ~69% |
| Integración | % endpoints probados | 100% | 100% |
| E2E | % flujos críticos | 100% | 83% (5/6) |
| Seguridad | Vulnerabilidades críticas | 0 | 0 |
| Rendimiento | P95 tiempo respuesta | < 500ms | < 300ms |

---

## Matriz: Riesgos de Calidad

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|:-----------:|:-------:|-----------|
| Caída de BD externa | Baja | Alto | Pool con reconexión, health check |
| Error en generación de PDF | Media | Alto | Logging, try/catch, validación previa |
| Subida de archivo malicioso | Baja | Alto | Validación tipo MIME, tamaño máximo |
| Token JWT comprometido | Baja | Alto | Expiración corta, refresh rotación |
| Carga masiva concurrente | Baja | Medio | Rate limiting (pendiente) |
