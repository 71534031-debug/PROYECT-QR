## Why

La Pokédex actual muestra una lista de Pokémon pero no permite ver los detalles de cada uno. Agregar una vista de detalle mejorará la experiencia del usuario y permitirá explorar información más completa de cada Pokémon (tipo, altura, peso, habilidades).

## What Changes

- Crear un componente de modal para mostrar detalles del Pokémon
- Mostrar información ampliada: imagen grande, ID, nombre, tipos, altura, peso, habilidades
- Implementar apertura/cierre del modal al hacer clic en una tarjeta
- Mantener la navegación simple sin necesidad de rutas adicionales

## Capabilities

### New Capabilities

- **pokemon-detail-modal**: Capacidad para mostrar una vista de detalle en un modal cuando el usuario hace clic en un Pokémon

### Modified Capabilities

- **pokedex-display**: Modificar el componente para detectar clics en las tarjetas y abrir el modal de detalle

## Impact

- Nuevo archivo: `src/app/components/pokemon-detail/pokemon-detail.component.ts`
- Nuevo archivo: `src/app/components/pokemon-detail/pokemon-detail.component.html`
- Nuevo archivo: `src/app/components/pokemon-detail/pokemon-detail.component.css`
- Modificación: `pokedex.component.ts` para incluir el modal y manejar eventos de clic
- Modificación: `pokedex.component.html` para añadir el elemento del modal