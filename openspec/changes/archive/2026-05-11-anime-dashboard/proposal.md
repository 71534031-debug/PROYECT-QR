## Why

Crear una aplicación web moderna con Angular 21 para explorar y consumir contenido de anime mediante la API de Jikan. La aplicación funcionará como un dashboard/portal donde los usuarios puedan descubrir anime popular, ver anime de temporada actual, buscar títulos y explorar personajes populares. El objetivo es proporcionar una experiencia de usuario moderna, responsiva y fluida, inspirada en plataformas de streaming como Netflix y Crunchyroll, pero con un diseño simplificado y limpio ideal para aprendizaje.

## What Changes

- Nueva aplicación Angular 21 standalone con arquitectura limpia
- Dashboard principal con navegación a las diferentes secciones
- Componente para mostrar Top Anime con grid de tarjetas
- Componente para anime de temporada actual
- Componente de búsqueda de anime con input y resultados
- Componente de personajes populares
- Servicios para consumo de API de Jikan (4 endpoints)
- Estados de loading y manejo de errores
- Diseño dark mode con tarjetas modernas, hover effects y transiciones
- Layout responsivo con grid de tarjetas

## Capabilities

### New Capabilities

- `top-anime`: Mostrar los animes mejor rankeados de la API de Jikan con tarjetas modernas
- `season-anime`: Mostrar anime de la temporada actual (invierno/primavera/otoño/verano)
- `anime-search`: Búsqueda de anime por nombre con resultados en tiempo real
- `popular-characters`: Mostrar personajes populares de anime
- `angular-architecture`: Estructura de proyecto Angular 21 con standalone components, servicios separados, y flujo de datos limpio

### Modified Capabilities

- (Ninguno - es un proyecto nuevo)

## Impact

- Nueva aplicación Angular 21 en el workspace
- Dependencia de @angular/common/http para consumo de APIs
- Integración con API externa Jikan (https://jikan.moe/)
- Estilos CSS organizados por componente
- Componentes standalone con arquitectura limpia