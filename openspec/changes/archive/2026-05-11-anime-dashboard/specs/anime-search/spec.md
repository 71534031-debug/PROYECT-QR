## ADDED Requirements

### Requirement: Búsqueda de Anime por Nombre
La aplicación DEBE permitir al usuario buscar anime por nombre utilizando el endpoint GET /anime?q={query} de la API de Jikan.

#### Scenario: Búsqueda con texto válido
- **WHEN** el usuario escribe un término de búsqueda y presiona Enter o hace click en buscar
- **THEN** la aplicación consume el endpoint /anime?q={query} y muestra los resultados

#### Scenario: Resultados de búsqueda
- **WHEN** la búsqueda retorna resultados
- **THEN** mostrar las tarjetas de anime encontradas en un grid responsivo

#### Scenario: Sin resultados
- **WHEN** la búsqueda no encuentra ningún anime
- **THEN** debe mostrar un mensaje indicando "No se encontraron resultados"

#### Scenario: Campo de búsqueda vacío
- **WHEN** el usuario intenta buscar con el campo vacío
- **THEN** debe mostrar un mensaje de validación o no realizar la búsqueda

#### Scenario: Estado de carga durante búsqueda
- **WHEN** la aplicación está esperando la respuesta de la API
- **THEN** debe mostrar un indicador de loading/spinner

#### Scenario: Debounce en búsqueda
- **WHEN** el usuario está escribiendo
- **THEN** la búsqueda debe ejecutarse después de 300ms de inactividad (evitar llamadas excesivas)

#### Scenario: Limpiar búsqueda
- **WHEN** el usuario hace click en botón de limpiar
- **THEN** el campo de búsqueda se vacía y no se muestran resultados (o vuelve a estado inicial)