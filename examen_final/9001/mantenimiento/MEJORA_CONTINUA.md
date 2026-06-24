# Mejora Continua — ISO 9001

## 1. Ciclo PHVA Aplicado al Mantenimiento

### Planificar
- Identificar áreas de mejora basadas en métricas
- Definir objetivos de calidad
- Asignar recursos

### Hacer
- Implementar cambios (correcciones, mejoras)
- Documentar procedimientos
- Capacitar usuarios

### Verificar
- Ejecutar pruebas
- Revisar métricas post-implementación
- Auditoría de código

### Actuar
- Estandarizar mejoras exitosas
- Actualizar documentación
- Retroalimentar al ciclo

## 2. Registro de Mejoras

| Mejora | Fecha | Área | Impacto | Estado |
|--------|:----:|------|:-------:|:------:|
| Eliminar Content-Type fijo de axios | 24/06/2026 | Frontend | 🔴 Crítico | ✅ |
| Agregar try/catch a uploads | 24/06/2026 | Backend | 🔴 Crítico | ✅ |
| Corregir CSS border-color | 24/06/2026 | Frontend | 🟢 Leve | ✅ |
| Agregar CON_OBSERVACION a badge | 24/06/2026 | Frontend | 🟢 Leve | ✅ |

## 3. Lecciones Aprendidas

1. **Pruebas tempranas**: Las pruebas E2E deben ejecutarse desde el inicio del desarrollo
2. **Validación de frontend**: No asumir que el interceptor de axios es seguro
3. **Manejo de errores**: Express requiere try/catch explícito en callbacks asíncronos
4. **CSS consistente**: Usar variables CSS definidas globalmente, no valores sueltos
