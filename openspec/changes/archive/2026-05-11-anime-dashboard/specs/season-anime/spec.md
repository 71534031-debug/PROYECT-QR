## ADDED Requirements

### Requirement: Mostrar Anime de Temporada Actual
La aplicación DEBE mostrar los animes de la temporada actual obtenidos del endpoint GET /seasons/now de la API de Jikan.

#### Scenario: Carga exitosa de temporada actual
- **WHEN** el usuario navega a la sección de Temporada Actual
- **THEN** la aplicación consume el endpoint /seasons/now y muestra las tarjetas de anime

#### Scenario: Mostrar información de temporada
- **WHEN** se renderiza cada tarjeta
- **THEN** debe mostrar: imagen del anime, título, tipo de anime (TV, Movie, OVA, etc.), y año/temporada

#### Scenario: Indicador de temporada actual
- **WHEN** se muestra el header de la sección
- **THEN** debe indicar claramente la temporada y año actual (ej: "Temporada Primavera 2026")

#### Scenario: Estado de carga
- **WHEN** la aplicación está esperando la respuesta de la API
- **THEN** debe mostrar un indicador de loading/spinner

#### Scenario: Error en la API
- **WHEN** la API de Jikan devuelve un error o no está disponible
- **THEN** debe mostrar un mensaje de error amigable al usuario