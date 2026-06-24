# Plan de Control de Calidad — ISO 9001

## 1. Puntos de Control en el Ciclo de Vida

| Fase | Actividad | Responsable | Criterio de aceptación |
|------|-----------|-------------|----------------------|
| **Requisitos** | Revisión de requisitos | Analista | Requisitos completos y verificables |
| **Diseño** | Revisión de arquitectura | Arquitecto | Cumple con SDD |
| **Codificación** | Code review + ESLint | Desarrollador | Sin code smells, pruebas pasando |
| **Pruebas** | Ejecución de test suite | QA | 100% tests backend, ≥ 60% frontend |
| **Despliegue** | Verificación en producción | DevOps | Health check OK, funcionalidades críticas OK |

## 2. Indicadores de Calidad (KPIs)

| Indicador | Fórmula | Objetivo | Frecuencia |
|-----------|---------|:-------:|:---------:|
| Cobertura de pruebas | Líneas cubiertas / total | ≥ 70% | Por release |
| Tasa de bug por release | Bugs reportados / funcionalidades | < 10% | Por release |
| Tiempo de respuesta API | P95 de endpoints | < 500ms | Semanal |
| Disponibilidad | Uptime / tiempo total | ≥ 99.5% | Mensual |
| Satisfacción de usuario | Encuesta | ≥ 4/5 | Trimestral |

## 3. No Conformidades

| ID | Descripción | Fecha | Causa raíz | Acción correctiva | Estado |
|----|-------------|:----:|-----------|-------------------|:------:|
| NC-01 | Error al subir logo/firma | 24/06/2026 | Content-Type fijo en axios | Eliminado header default | ✅ Cerrada |
| NC-02 | Error al recuperar contraseña | 24/06/2026 | Campo password en vez de new_password | Renombrado campo | ✅ Cerrada |
| NC-03 | Variable CSS inexistente | 24/06/2026 | --border-color no definido | Cambiado a --border | ✅ Cerrada |

## 4. Mejora Continua

- Revisiones trimestrales del sistema
- Actualización de dependencias mensual
- Feedback de usuarios recopilado en cada uso
- Documentación actualizada en cada release
