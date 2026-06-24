# ISO 9001:2015 — Gestión de Calidad

## Enfoque en el Sistema de Certificados QR

La ISO 9001:2015 se aplica al sistema mediante la gestión por procesos, la mejora continua y el enfoque al cliente (usuarios que validan certificados).

---

## Contenido

| Carpeta | Descripción |
|---------|-------------|
| `bizagi/` | Diagramas BPMN de los macroprocesos del sistema |
| `estado_del_arte/` | SDD, TDD, plan de pruebas, documento de requisitos |
| `diseno/` | Mockups y prototipos de interfaz de usuario |
| `codigo/` | Matriz de doble entrada, macroprocesos, procedimientos, actividades, funciones |
| `mantenimiento/` | Plan de mantenimiento, SQ, implementación del plan de pruebas |

---

## Mapa de Procesos (ISO 9001)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESOS ESTRATÉGICOS                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Planificación │  │  Revisión    │  │  Mejora Continua     │   │
│  │   de Calidad  │  │  por Direc.  │  │  (PQRSF, auditoría)  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    PROCESOS OPERATIVOS                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Gestión  │ │ Gestión  │ │ Gestión  │ │   Validación     │   │
│  │  de      │ │  de      │ │  de      │ │   y Entrega      │   │
│  │Activid.  │ │Particip. │ │Plantillas│ │   de Certif.     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    PROCESOS DE APOYO                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Autenticación│  │ Configuración│  │  Auditoría de        │   │
│  │  y Seguridad │  │ Institucional│  │  Eventos (Trazabil.) │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Ciclo PHVA aplicado al sistema

| Fase | Actividad | Evidencia |
|------|-----------|-----------|
| **P**lanificar | Definición de requisitos, diseño de arquitectura, plan de pruebas | SDD, TDD, plan de pruebas |
| **H**acer | Desarrollo de módulos, pruebas unitarias, integración continua | Código en Git, tests automáticos |
| **V**erificar | Pruebas de integración, revisión de código (SonarQube), validación de requisitos | Reportes de SonarQube, tests passing |
| **A**ctuar | Corrección de bugs, mejora de rendimiento, actualización de documentación | Incidencias cerradas, nuevas versiones |

---

## Indicadores de Calidad

| Indicador | Fórmula | Meta | Frecuencia |
|-----------|---------|------|------------|
| % Pruebas pasadas | (Tests pasados / Tests totales) × 100 | ≥ 90% | Por commit |
| Cobertura de código | (Líneas cubiertas / Líneas totales) × 100 | ≥ 60% | Diario |
| Tiempo de respuesta API | Percentil 95 de tiempo de respuesta | < 500ms | Semanal |
| Disponibilidad | (Uptime / Tiempo total) × 100 | ≥ 99.5% | Mensual |
| Bugs críticos en SonarQube | Conteo de bugs con severidad crítica | 0 | Por análisis |
