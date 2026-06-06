## Context

La aplicación AnimeHub existente tiene una buena arquitectura Angular 21 con standalone components y consume la API de Jikan. Ahora se quiere expandir para incluir 3 APIs adicionales de anime populares, cada una con su propio servicio y componente. El objetivo es practicar arquitectura limpia con múltiples servicios y mantener una experiencia de usuario consistente.

Las APIs a integrar:
- Dragon Ball API: https://dragonball-api.com/api/characters (gratuita, sin auth)
- Naruto API: https://narutodb.xyz/api/character (gratuita, sin auth)
- One Piece API: https://api.api-onepiece.com/v2/characters/en (gratuita, sin auth)

La aplicación existente ya tiene dark mode, animaciones, skeleton loading y diseño responsivo implementado.

## Goals / Non-Goals

**Goals:**

- Crear 3 servicios independientes para consumir cada API
- Crear 3 componentes standalone para mostrar personajes de cada serie
- Integrar navegación con Angular Router en el navbar existente
- Mantener estados de loading y manejo de errores en cada componente
- Mantener diseño consistente con la app existente (dark mode, hover effects, animaciones)
- Crear un componente de tarjeta de personaje reutilizable

**Non-Goals:**

- No modificar las funcionalidades existentes de Jikan API
- No implementar autenticación (APIs son públicas)
- No crear sistema de favoritos o persistencia local
- No crear tests extensivos (mantener simple para aprendizaje)
- No optimizar performance avanzada (app mediana, no gigante)

## Decisions

### 1. Servicios Separados por API

**Decisión:** Crear un servicio por cada API (DragonBallService, NarutoService, OnePieceService).

**Rationale:** Separación clara de responsabilidades, facilita mantenimiento, cada servicio puede evolucionar independientemente. Si una API cambia, solo afecta un servicio específico.

**Alternativas consideradas:**
- Un servicio genérico con configuración: Más complejo, pierde claridad
- Un servicio monolítico: Viola principio de responsabilidad única

### 2. Componentes Separados por Serie

**Decisión:** Crear un componente standalone por cada serie de anime.

**Rationale:** Permite personalización visual por serie (colores distintivos), lógica independiente, facilita testing y mantenimiento. Cada componente puede tener su propia lógica de transformación de datos.

**Alternativas consideradas:**
- Componente genérico con configuración: Pierde flexibilidad visual
- Reutilizar componente existente de anime: Los datos son diferentes, requiere adaptaciones complejas

### 3. Modelo de Datos por API

**Decisión:** Crear interfaces específicas para cada API en lugar de un modelo genérico.

**Rationale:** Cada API tiene una estructura de datos diferente. Usar interfaces específicas permite TypeScript verificar tipos correctamente y evita castings inseguros.

**Alternativas consideradas:**
- Modelo genérico con campos opcionales: Pierde type safety
- Un modelo único con Union Types: Más complejo, menos legible

### 4. Routing con Lazy Loading

**Decisión:** Usar lazy loading para los nuevos componentes de rutas.

**Rationale:** Mejora tiempo de carga inicial, carga solo lo necesario cuando el usuario navega a esa sección. El usuario no necesita cargar los 3 nuevos componentes al inicio.

**Alternativas consideradas:**
- Eager loading: Carga todo al inicio, más rápido para navegación pero lento al inicio

### 5. Reutilizar Componentes UI Existentes

**Decisión:** Reutilizar los estilos y estructura de skeleton loading, tarjetas, hover effects de la app existente.

**Rationale:** Mantiene consistencia visual, reduce código重复, ya tenemos buenos componentes UI funcionando.

## Risks / Trade-offs

- **[Riesgo]** Alguna API puede estar temporalmente no disponible → **Mitigación**: Implementar manejo de errores con retry básico y mensaje amigable
- **[Riesgo]** Estructura de datos de APIs puede cambiar → **Mitigación**: Crear interfaces que mapeen los datos, no depender directamente de la estructura externa
- **[Riesgo]** Rate limiting en APIs gratuitas → **Mitigación**: Implementar caching básico con RxJS, evitar llamadas excesivas
- **[Riesgo]** Imágenes de personajes pueden ser grandes → **Mitigación**: Usar lazy loading de imágenes, mostrar thumbnails cuando estén disponibles

## Migration Plan

1. Crear modelos/interfaces para cada API
2. Crear los 3 servicios con métodos básicos de GET
3. Crear los 3 componentes con estructura similar a los existentes
4. Actualizar navbar con nuevos enlaces
5. Agregar rutas en app.routes.ts
6. Testing básico de cada componente
7. Build y verificación

## Open Questions

- ¿Usar el mismo componente de tarjeta para todos o crear uno específico por serie? → Usar uno genérico con posibilidad de personalización mediante CSS variables o inputs
- ¿Cuántos personajes mostrar por defecto? → 20-25 personajes por carga, similar a lo existente
- ¿Implementar paginación o scroll infinito? → Por ahora solo primera página para mantener simple
- ¿Necesitamos mostrar más información de cada personaje? → Solo基本信息 (nombre, imagen, algún detalle) para mantener diseño limpio