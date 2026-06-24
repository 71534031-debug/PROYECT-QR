# Plan de Pruebas — ISO/IEC 29119

## 1. Introducción
Aplicación del estándar **ISO/IEC 29119** (Software Testing) al Sistema de Certificados QR, definiendo procesos de prueba, niveles, tipos y documentación.

## 2. Procesos de Prueba (ISO 29119-2)

### 2.1 Proceso de Gestión de Pruebas

| Actividad | Responsable | Artefacto |
|-----------|-------------|-----------|
| Definir política de pruebas | Analista de calidad | Plan de Pruebas |
| Priorizar riesgos | Analista + Dev | Matriz de riesgos |
| Establecer criterios de entrada/salida | Analista de calidad | Criterios de aceptación |
| Reportar resultados | Desarrollador | Reporte de pruebas |

### 2.2 Proceso de Prueba Dinámica

```
┌──────────────────┐
│ Diseño de pruebas │ (Casos de prueba)
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Implementación    │ (Scripts de prueba)
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Ejecución         │ (Local + CI)
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Evaluación        │ (Resultados vs esperados)
└──────────────────┘
```

## 3. Niveles de Prueba (ISO 29119-4)

| Nivel | Cobertura | Herramienta | Tests |
|-------|-----------|-------------|:-----:|
| **Componente (Unitarias)** | Backend: 88, Frontend: 29 | Jest | 117 |
| **Integración** | Endpoints REST | Supertest | 88 |
| **Sistema** | API completa (back + front) | Supertest + testing-library | 117 |
| **Aceptación** | Flujos E2E completos | Cypress | 6 |

## 4. Tipos de Prueba (ISO 29119-4)

| Tipo | Objetivo | Aplicado |
|------|----------|:--------:|
| **Funcional** | Verificar que el sistema hace lo que debe | ✅ (88 tests) |
| **Rendimiento** | Verificar tiempos de respuesta bajo carga | ⚠️ Parcial (health check) |
| **Seguridad** | Verificar autenticación, autorización, validación | ✅ (tests auth) |
| **Usabilidad** | Verificar interfaz intuitiva | ⚠️ Manual (mockups) |
| **Portabilidad** | Verificar en múltiples navegadores/BD | ✅ (DB_TYPE, responsive) |
| **Confiabilidad** | Verificar disponibilidad y recuperación | ✅ (health, try/catch) |

## 5. Criterios de Entrada y Salida

### Criterios de Entrada
- Código compilado sin errores
- Pruebas unitarias pasando localmente
- Base de datos de prueba disponible
- Variables de entorno configuradas

### Criterios de Salida
- 100% de pruebas backend pasando (88/88)
- ≥ 60% cobertura frontend
- 0 bugs críticos
- 0 vulnerabilidades de seguridad conocidas
- Tiempo de respuesta < 500ms (p95)

## 6. Herramientas

| Herramienta | Propósito | Versión |
|-------------|-----------|:-------:|
| Jest | Framework de pruebas | 29.x |
| Supertest | Pruebas HTTP | 6.x |
| @testing-library/react | Pruebas de componentes | 14.x |
| Cypress | Pruebas E2E | 12.x |
| SonarQube | Análisis estático | Community |
| ESLint | Calidad de código | 8.x |

## 7. Reporte de Pruebas

| Módulo | Pruebas | Pasando | Fallando | Cobertura |
|--------|:-------:|:-------:|:--------:|:---------:|
| Backend | 88 | 88 | 0 | ~75% |
| Frontend | 29 | 29 | 0 | ~69% |
| E2E (Cypress) | 6 | 2 | 4* | — |

*\* 4 pruebas E2E fallan por problemas preexistentes de configuración de entorno E2E*
