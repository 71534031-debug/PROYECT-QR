## Context

El proyecto es una aplicación web Angular 21 que funciona como Pokédex. El usuario quiere consumir datos de la PokeAPI (https://pokeapi.co/api/v2/) e implementarlos usando el patrón servicio → componente.ts → componente.html. El componente debe tener archivos separados para el template (HTML) y la lógica (TypeScript).

## Goals / Non-Goals

**Goals:**
- Crear un servicio Angular que consuma la PokeAPI usando HttpClient
- Mostrar una lista de Pokémon con su información en un componente
- Separar la lógica (TS) del template (HTML) en archivos distintos
- Implementar el flujo de datos: servicio → componente.ts → componente.html

**Non-Goals:**
- No se incluye paginación completa
- No se incluye búsqueda o filtrado avanzado
- No se incluye manejo de favoritos o almacenamiento local

## Decisions

1. **Uso de HttpClient**: Se usará el HttpClient de Angular para consumir la API en lugar de fetch nativo, ya que es el método recomendado en Angular y permite manejo de observables de forma nativa.

2. **Estructura del componente**: Se creará un componente `pokedex` con:
   - `pokedex.component.ts` - lógica y manejo de datos
   - `pokedex.component.html` - template para mostrar los datos

3. **Estructura del servicio**: Se creará `pokemon.service.ts` en la carpeta `services/` con métodos para obtener la lista de Pokémon y los detalles de cada uno.

4. **Patrón de datos**: Se usará el patrón Observer con RxJS para manejar las respuestas asíncronas de la API.

## Risks / Trade-offs

- [Riesgo] La PokeAPI puede tener limitaciones de rate → Mitigación: Implementar manejo básico de errores
- [Riesgo] Datos de la API pueden cambiar → Mitigación: Usar tipos TypeScript definidos para mayor seguridad