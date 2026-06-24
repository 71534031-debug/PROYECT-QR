# Matriz de Doble Entrada — Calidad del Software

## Matriz: ISO 25010 Características vs Módulos

| Característica | Subcaracterística | Login | Dashboard | Actividades | Participantes | Plantillas | Certificados | Config | Validar |
|----------------|-------------------|:-----:|:---------:|:-----------:|:-------------:|:----------:|:------------:|:------:|:-------:|
| **Funcionalidad** | Completez | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Corrección | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Pertinencia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Eficiencia** | Comportamiento temporal | ✅ | A | A | A | A | M | A | ✅ |
| | Uso de recursos | ✅ | ✅ | ✅ | ✅ | A | M | ✅ | ✅ |
| **Compatibilidad** | Coexistencia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Interoperabilidad | API | API | API | API | API | API | API | API |
| **Usabilidad** | Reconocimiento | ✅ | ✅ | ✅ | ✅ | M | ✅ | ✅ | ✅ |
| | Aprendizaje | ✅ | ✅ | ✅ | ✅ | M | ✅ | ✅ | ✅ |
| | Protección errores | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Estética UI | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Confiabilidad** | Madurez | A | A | A | A | A | M | A | A |
| | Disponibilidad | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Tolerancia fallos | — | — | — | — | — | M | — | — |
| **Seguridad** | Confidencialidad | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 |
| | Integridad | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | No repudio | JWT | — | — | — | — | QR | — | QR |
| | Auditoría | ✅ | — | — | — | — | ✅ | ✅ | ✅ |
| **Mantenibilidad** | Modularidad | A | A | A | A | A | A | A | A |
| | Reusabilidad | A | A | A | M | M | A | M | A |
| | Capacidad de prueba | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

*✅ = Sí/Verificado, A = Adecuado, M = Medio/Mejorable, 🟢 = Público*

---

## Matriz: Defectos Encontrados vs Módulos

| Defecto | Módulo | Severidad | Estado | Corrección |
|---------|--------|:---------:|:------:|-----------|
| `Content-Type: application/json` fijo en axios impide upload | Global (frontend) | 🔴 Crítico | ✅ Corregido | Eliminado header default del instance axios |
| Falta try/catch en endpoints de logo/firma | Config (backend) | 🔴 Crítico | ✅ Corregido | Agregado try/catch a 4 endpoints |
| `password` en vez de `new_password` en body | Auth (frontend) | 🟡 Medio | ✅ Corregido | Cambiado nombre del campo |
| Enlace a `/forgot-password` inexistente | Auth (frontend) | 🟡 Medio | ✅ Corregido | Cambiado a `/olvide-contrasena` |
| `handleViewPdf` con ruta relativa | Certificados | 🟡 Medio | ✅ Corregido | Usa `api.defaults.baseURL` |
| CSS `var(--border-color)` no existe | CSS (frontend) | 🟢 Leve | ✅ Corregido | Cambiado a `var(--border)` |
| `estadoBadge` sin caso CON_OBSERVACION | Participantes | 🟢 Leve | ✅ Corregido | Agregado al switch |
| `render.yaml` con DB_TYPE: mysql | Despliegue | 🟡 Medio | ✅ Corregido | Cambiado a postgresql |
