## Why

Integrar múltiples APIs de anime populares en la aplicación existente para expandir el contenido disponible y practicar una arquitectura limpia con múltiples servicios. Los usuarios podrán explorar personajes de Dragon Ball, Naruto y One Piece desde una misma aplicación con navegación fluida, manteniendo el diseño moderno y la experiencia de usuario ya establecida.

## What Changes

- Agregar integración con Dragon Ball API (https://dragonball-api.com/api/characters)
- Agregar integración con Naruto API (https://narutodb.xyz/api/character)
- Agregar integración con One Piece API (https://api.api-onepiece.com/v2/characters/en)
- Crear 3 servicios independientes (DragonBallService, NarutoService, OnePieceService)
- Crear 3 componentes standalone (DragonBallComponent, NarutoComponent, OnePieceComponent)
- Actualizar navbar con nuevas opciones de navegación
- Agregar rutas en Angular Router para cada sección
- Mantener diseño dark mode, efectos hover y animaciones existentes

## Capabilities

### New Capabilities

- `dragon-ball-api`: Integración con API de Dragon Ball para mostrar personajes
- `naruto-api`: Integración con API de Naruto para mostrar personajes
- `one-piece-api`: Integración con API de One Piece para mostrar personajes
- `multi-api-navigation`: Sistema de navegación entre múltiples secciones de anime
- `character-card-component`: Componente reutilizable para mostrar tarjetas de personajes

### Modified Capabilities

- (Ninguno - es una extensión de la aplicación existente)

## Impact

- Nuevos servicios en src/app/services/ (dragonball.service.ts, naruto.service.ts, onepiece.service.ts)
- Nuevos componentes en src/app/components/ (dragon-ball/, naruto/, one-piece/)
- Actualización de app.routes.ts para nuevas rutas
- Actualización de navbar con nuevos enlaces
- Modelos de datos para cada API
- Sin cambios en funcionalidades existentes de anime de Jikan