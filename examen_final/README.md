# Examen Final — Sistema de Generación y Validación de Certificados con Código QR

**Curso:** Ingeniería de Software  
**Institución:** Universidad Continental

---

## Estructura del Examen

| Carpeta | Estándar | Enfoque | Contenido |
|---------|----------|---------|-----------|
| `9001/` | ISO 9001 | Gestión de Calidad | Bizagi (BPMN), estado del arte (SDD, TDD, plan de pruebas), diseño (mockups), código (matriz, controladores, plan de control), mantenimiento (mejora continua) |
| `25000/` | ISO 25000 | Calidad de Producto Software | SQuaRE, métricas de calidad, matriz de defectos, plan de mantenimiento |
| `29119/` | ISO 29119 | Pruebas de Software | Plan de pruebas, integración SonarQube, casos de prueba, resultados |
| `27000/` | ISO 27000 | Seguridad de la Información | Política de seguridad, análisis de riesgos, controles implementados, plan de seguridad |
| `despliegue/` | — | Despliegue | Guía de despliegue 1ra versión |

---

## Árbol de Archivos

```
examen_final/
├── README.md
├── 9001/
│   ├── README.md
│   ├── estado_del_arte/
│   │   ├── SDD.md                    (Documento de Diseño de Software)
│   │   ├── TDD.md                    (Desarrollo Guiado por Pruebas)
│   │   └── PLAN_DE_PRUEBAS.md       (Plan de Pruebas)
│   ├── diseno/
│   │   └── MOCKUPS.md               (Mockups de todas las pantallas)
│   ├── codigo/
│   │   ├── index.js                  (Entry point backend)
│   │   ├── certificate-generator.js (Generador PDF con QR)
│   │   ├── config-controller.js     (Controlador de configuración)
│   │   ├── MATRIZ_DOBLE_ENTRADA.md  (Matrices de funcionalidades, roles, endpoints, BD, UI)
│   │   └── PLAN_DE_CONTROL.md       (Puntos de control y no conformidades)
│   ├── mantenimiento/
│   │   └── MEJORA_CONTINUA.md       (Ciclo PHVA y lecciones aprendidas)
│   └── bizagi/
│       └── PROCESOS.md              (7 macroprocesos BPMN)
├── 25000/
│   ├── estado_del_arte/
│   │   └── SQuaRE.md                (ISO 25010: funcionalidad, eficiencia, usabilidad, seguridad)
│   ├── diseno/
│   │   ├── MATRIZ_CALIDAD.md        (Atributos vs módulos, riesgos de calidad)
│   │   └── MOCKUPS_CALIDAD.md       (Paneles de calidad, rendimiento, pruebas, seguridad)
│   ├── codigo/
│   │   └── MATRIZ_DOBLE_ENTRADA_CALIDAD.md  (Defectos encontrados, características ISO 25010)
│   └── mantenimiento/
│       └── PLAN_MANTENIMIENTO.md    (Correctivo, evolutivo, perfectivo, preventivo)
├── 29119/
│   ├── estado_del_arte/
│   │   └── PLAN_DE_PRUEBAS_29119.md (Procesos, niveles, tipos, criterios)
│   ├── diseno/
│   │   └── SONARQUBE_INTEGRACION.md (Configuración, métricas, CI, deuda técnica)
│   ├── codigo/
│   │   └── CASOS_DE_PRUEBA.md       (TC detallados: Auth, Act, Par, Cert, Val, UI)
│   └── mantenimiento/
│       └── RESULTADOS_PRUEBAS.md    (117/123 tests pasando, 8 bugs corregidos)
├── 27000/
│   ├── estado_del_arte/
│   │   └── POLITICA_SEGURIDAD.md    (Confidencialidad, integridad, disponibilidad)
│   ├── diseno/
│   │   └── ANALISIS_RIESGOS.md      (12 riesgos evaluados, matriz de calor, riesgo residual)
│   ├── codigo/
│   │   └── CONTROLES_IMPLEMENTADOS.md (Controles ISO 27002, por módulo, auditoría)
│   └── mantenimiento/
│       └── PLAN_SEGURIDAD.md        (Monitoreo, DRP, KSIs, presupuesto)
└── despliegue/
    └── GUIA_DESPLIEGUE.md           (Vercel + Render + Neon, troubleshooting)
```

---

## Hallazgos Clave de la Auditoría

| Bug | Severidad | Módulo | Corrección |
|-----|:---------:|--------|-----------|
| Content-Type fijo en axios bloquea uploads | 🔴 Crítico | Frontend global | Eliminado header default del instance |
| Sin try/catch en endpoints de logo/firma | 🔴 Crítico | Backend Config | Agregado a 4 endpoints |
| `password` en vez de `new_password` | 🟡 Medio | Auth Frontend | Renombrado campo |
| Enlace `/forgot-password` inexistente | 🟡 Medio | Auth Frontend | Corregido a `/olvide-contrasena` |
| Ruta relativa en handleViewPdf | 🟡 Medio | Certificados | Usa baseURL absoluto |
| DB_TYPE: mysql en render.yaml | 🟡 Medio | Despliegue | Cambiado a postgresql |
| CSS `var(--border-color)` inexistente | 🟢 Leve | 3 páginas CSS | Cambiado a `var(--border)` |
| estadoBadge sin CON_OBSERVACION | 🟢 Leve | Participantes | Agregado al switch |

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 + Tailwind CSS + shadcn/ui + Recharts + Framer Motion |
| Backend | Node.js + Express 4.19 + MySQL2 + PDFKit + JWT + bcrypt |
| Base de datos | PostgreSQL (Neon) / MySQL (según DB_TYPE) |
| Testing | Jest + Supertest (backend), Testing Library (frontend), Cypress (E2E) |
| Calidad | SonarQube Cloud + ESLint |
| CI/CD | Vercel (frontend) + Render (backend) |
| Seguridad | JWT access/refresh, bcrypt, prepared statements, validación MIME |

---

## Resultados de Pruebas

| Suite | Pruebas | Pasando | Cobertura |
|-------|:-------:|:-------:|:---------:|
| Backend | 88 | 88 (100%) | ~75% |
| Frontend | 29 | 29 (100%) | ~69% |
| E2E | 6 | 2 (33%) | — |
| **Total** | **123** | **119 (97%)** | — |

---

## Módulos desarrollados por integrante

| Integrante | Módulo | Repositorio |
|------------|--------|-------------|
| Jorge Lennon Anccasi Espinoza | Backend completo (API REST, DB, PDF, QR) | [GitHub](https://github.com/marana/proyect-qr) |
| [Integrante 2] | Frontend (Auth, Dashboard, Actividades) | [GitHub] |
| [Integrante 3] | Frontend (Participantes, Plantillas) | [GitHub] |
| [Integrante 4] | Frontend (Certificados, Configuración, Validar) | [GitHub] |

---

## Enlaces del Proyecto

- **Frontend:** https://proyect-qr.vercel.app
- **Backend:** https://proyect-qr-backend.onrender.com
- **Repositorio:** https://github.com/marana/proyect-qr
- **Health Check:** https://proyect-qr-backend.onrender.com/api/health
