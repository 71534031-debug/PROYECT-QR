# Plan de Mantenimiento — ISO 25000

## 1. Objetivo
Establecer las actividades de mantenimiento del Sistema de Certificados QR para garantizar su calidad continua.

## 2. Tipos de Mantenimiento

| Tipo | Descripción | Frecuencia | Responsable |
|------|-------------|:----------:|-------------|
| **Correctivo** | Corrección de bugs reportados | Según incidencia | Desarrollador |
| **Evolutivo** | Nuevas funcionalidades | Semestral | Analista + Desarrollador |
| **Perfectivo** | Mejora de rendimiento/usabilidad | Trimestral | Desarrollador |
| **Preventivo** | Actualización de dependencias, parches de seguridad | Mensual | DevOps |

## 3. Actividades Programadas

| Actividad | Periodicidad | Detalle |
|-----------|:-----------:|---------|
| Actualizar dependencias npm | Mensual | `npm audit fix` en backend y frontend |
| Revisar logs de errores | Semanal | Revisar errores en producción |
| Ejecutar pruebas | Por cada PR | Backend: `npm test`, Frontend: `npm run test:coverage` |
| Análisis SonarQube | Mensual | Revisar code smells, duplicación, bugs |
| Backup de base de datos | Diario | Automático (configuración de hosting) |
| Renovación de certificados SSL | Anual | Automático (Vercel + Render) |
| Revisión de seguridad de JWT | Trimestral | Rotación de secretos si es necesario |
| Monitoreo de rendimiento | Continuo | Health check cada 5 min |

## 4. Proceso de Mantenimiento Correctivo

```
┌─────────────────┐
│  Reporte de bug │ (Usuario o monitor)
└────────┬────────┘
         ▼
┌─────────────────┐
│  Clasificación   │ (Crítico/Alto/Medio/Bajo)
└────────┬────────┘
         ▼
┌─────────────────┐
│  Asignación      │ (Desarrollador responsable)
└────────┬────────┘
         ▼
┌─────────────────┐
│  Reproducción    │ (Entorno de desarrollo)
└────────┬────────┘
         ▼
┌─────────────────┐
│  Corrección      │ (Con pruebas)
└────────┬────────┘
         ▼
┌─────────────────┐
│  PR + Revisión   │ (Code review)
└────────┬────────┘
         ▼
┌─────────────────┐
│  Despliegue      │ (Producción)
└─────────────────┘
```

## 5. Métricas de Mantenimiento

| Métrica | Objetivo | Cómo se mide |
|---------|:--------:|-------------|
| Tiempo medio de reparación (MTTR) | < 24h (crítico) | Desde reporte hasta despliegue |
| Número de bugs por release | < 3 | Conteo en issues tracker |
| Cobertura de pruebas | ≥ 70% backend, ≥ 60% frontend | Jest coverage report |
| Deuda técnica (SonarQube) | < 5% | Análisis SonarQube |
| Disponibilidad del sistema | ≥ 99.5% | Health check + uptime monitor |

## 6. Herramientas de Mantenimiento

| Herramienta | Uso |
|-------------|-----|
| Git + GitHub | Control de versiones |
| npm audit | Seguridad de dependencias |
| Jest + Supertest | Pruebas backend |
| Jest + Testing Library | Pruebas frontend |
| SonarQube | Análisis estático de código |
| ESLint | Calidad de código |
| Vercel + Render | Despliegue continuo |
| Neon / MySQL Workbench | Gestión de BD |

## 7. Estrategia de Versionado

Se sigue **Semantic Versioning (SemVer)**:
- **MAJOR**: Cambios incompatibles en API
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Corrección de bugs

Formato: `v1.0.0` → `v1.0.1` (bugfix) → `v1.1.0` (feature) → `v2.0.0` (breaking)
