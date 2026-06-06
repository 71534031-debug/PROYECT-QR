## Context

La aplicación será una SPA (Single Page Application) desarrollada con Angular 21 utilizando standalone components. El objetivo es consumir la API pública de Jikan para mostrar información de anime de manera moderna y responsiva. El usuario final será cualquier persona interesada en explorar contenido de anime de forma visual y atractiva.

La API de Jikan (https://jikan.moe/) es una API gratuita y pública que no requiere autenticación, lo que simplifica la implementación. Los endpoints a consumir son:

- GET /top/anime - Top anime rankeados
- GET /seasons/now - Anime de temporada actual
- GET /anime?q={query} - Búsqueda de anime
- GET /top/characters - Personajes populares

## Goals / Non-Goals

**Goals:**

- Crear una aplicación Angular 21 funcional con standalone components
- Implementar consumo de 4 APIs de Jikan de forma robusta
- Diseñar una interfaz moderna con dark mode, tarjetas con hover effects y transiciones suaves
- Establecer una arquitectura limpia con separación clara de responsabilidades (Services → Components → Templates)
- Implementar manejo de estados de loading y errores básicos
- Crear un layout responsivo que funcione bien en desktop y mobile

**Non-Goals:**

- Autenticación de usuarios (no requerido)
- Persistencia de datos local (sin base de datos local)
- Características avanzadas como favoritos o historial (mantener simple)
- Optimización exhaustiva de performance (aplicación mediana, no gigante)
- Testing extensivo (focus en funcionalidad y aprendizaje)

## Decisions

### 1. Angular 21 con Standalone Components

**Decisión:** Utilizar Angular 21 con standalone components en lugar de módulos tradicionales.

**Rationale:** Los standalone components son el estándar recomendado en Angular moderno desde versión 14+, eliminando la necesidad de NgModules y simplificando la estructura del proyecto. Angular 21 es la versión más reciente y ofrece mejor performance y developer experience.

**Alternativas consideradas:**
- Módulos tradicionales (NgModule): Más verboso, mayor boilerplate
- Angular Signals: Disponible en Angular 16+, usar para gestión de estado reactivo en componentes

### 2. Arquitectura de Servicios Separados

**Decisión:** Crear un AnimeService centralizado que maneje todas las llamadas a la API de Jikan.

**Rationale:** Centraliza la lógica de acceso a datos, facilita el mantenimiento y permite reutilizar código. Cada endpoint tendrá su método específico dentro del servicio.

**Alternativas consideradas:**
- Un servicio por cada endpoint: Puede generar duplicación de código para configuración de HTTP
- Servicios por componente: Viola principio de responsabilidad única

### 3. Flujo de Datos unidireccional

**Decisión:** Implementar flujo de datos unidireccional: API → Service → Component.ts → Component.html

**Rationale:** Es el patrón recomendado en Angular moderno, facilita el debugging y mantiene la lógica de presentación separada de la lógica de datos.

### 4. Separación de HTML y TypeScript

**Decisión:** Cada componente tendrá su archivo .ts separado del .html (no usar inline templates).

**Rationale:** Mejor legibilidad, separación de responsabilidades, facilita el mantenimiento y permite tooling mejor (linting, IDE support).

### 5. CSS por componente

**Decisión:** Cada componente tendrá su propio archivo .css encapsulado.

**Rationale:** Evita conflictos de estilos globales, facilita el scoped styling con ViewEncapsulation, mantiene el código organizado.

### 6. Diseño UI con Dark Mode

**Decisión:** Implementar dark mode por defecto con tarjetas modernas, gradientes sutiles y hover effects.

**Rationale:** Las plataformas de anime populares (Crunchyroll, Netflix) usan dark mode como padrão. El dark mode es más cómodo para sesiones largas de visualización y hace resaltar las imágenes de los animes.

## Risks / Trade-offs

- **[Riesgo]** API externa no disponible → **Mitigación**: Implementar manejo de errores con mensaje amigable al usuario y retry básico
- **[Riesgo]** Rate limiting de Jikan → **Mitigación**: La versión gratuita tiene límites, implementar caching simple con RxJS o evitar llamadas excesivas
- **[Riesgo]** Imágenes grandes afectando performance → **Mitigación**: Usar lazy loading de imágenes y mostrar thumbnails de tamaño apropiado
- **[Trade-off]** Simplicidad vs Features → Se prioriza un proyecto limpio y mantenible sobre cantidad de features

## Migration Plan

1. Crear proyecto Angular 21 nuevo con Angular CLI
2. Configurar estructura de carpetas (components, services, models)
3. Crear AnimeService con métodos para los 4 endpoints
4. Crear componentes uno por uno: Navbar, Dashboard, TopAnime, SeasonAnime, AnimeSearch, PopularCharacters
5. Implementar estilos CSS para cada componente
6. Testing básico de cada componente
7. Build y verificación de funcionamiento

## Open Questions

- ¿Usar Angular Signals para gestión de estado o mantener RxJS tradicional? → Se usará RxJS para las llamadas HTTP y Signals para estado local de componentes
- ¿Cuántos resultados mostrar por página? → 25 resultados por llamada (valor por defecto de Jikan), buena cantidad para visualización en grid
- ¿Implementar paginación? → Para MVP no, cargar más con botón "Cargar más" o scroll infinito opcional