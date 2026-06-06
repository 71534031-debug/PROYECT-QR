## Why

Se necesita crear una aplicación web con Angular 21 que funcione como una Pokédex, permitiendo a los usuarios visualizar información de los Pokémon consumiendo datos de la PokeAPI. Esto proporciona una experiencia de aprendizaje práctica sobre cómo integrar servicios HTTP en Angular y mostrar datos en componentes.

## What Changes

- Crear un servicio Angular para consumir la PokeAPI y obtener datos de Pokémon
- Crear un componente para mostrar la lista de Pokémon con su información
- Implementar el flujo de datos: servicio → componente.ts → componente.html
- Estructurar el proyecto con Angular 21 siguiendo las mejores prácticas

## Capabilities

### New Capabilities

- **pokedex-api-consumption**: Capacidad para consumir la PokeAPI desde un servicio Angular usando HttpClient
- **pokedex-display**: Capacidad para mostrar los datos de Pokémon en un componente con template separado

### Modified Capabilities

- Ninguno

## Impact

- Nuevo archivo de servicio: `src/app/services/pokemon.service.ts`
- Nuevo componente: `src/app/components/pokedex/` con archivos `.ts` y `.html` separados
- Dependencia adicional: consumo de PokeAPI (https://pokeapi.co/api/v2/)