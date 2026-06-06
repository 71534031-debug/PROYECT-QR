## Why

La Pokédex actual muestra información visual de los Pokémon pero no ofrece retroalimentación auditiva. Agregar la reproducción del cry oficial enriquecerá la experiencia del usuario y permitirá aprender sobre manejo de audio en Angular.

## What Changes

- Reproducir automáticamente el cry del Pokémon al abrir el modal de detalle
- Agregar un botón para reproducir manualmente el sonido
- Mostrar un indicador visual de audio (ícono de speaker)
- Manejar errores silenciosamente si el audio no está disponible

## Capabilities

### New Capabilities

- **pokemon-cry-audio**: Capacidad para reproducir el sonido oficial del Pokémon desde la PokeAPI

### Modified Capabilities

- Ninguno (el modal ya existe, esta es una característica adicional)

## Impact

- Modificación: `src/app/components/pokemon-detail/pokemon-detail.component.ts` - agregar lógica de audio
- Modificación: `src/app/components/pokemon-detail/pokemon-detail.component.html` - agregar botón de audio
- Modificación: `src/app/components/pokemon-detail/pokemon-detail.component.css` - estilos del botón
- La PokeAPI proporciona los cry en: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sounds/`