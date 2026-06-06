## ADDED Requirements

### Requirement: Consumir One Piece API
La aplicación DEBE obtener datos de personajes de la API de One Piece.

#### Scenario: Obtener lista de personajes
- **WHEN** el usuario navega a la sección One Piece
- **THEN** la aplicación consume GET https://api.api-onepiece.com/v2/characters/en

#### Scenario: Mostrar personajes en grid
- **WHEN** la API responde exitosamente
- **THEN** mostrar las tarjetas de personajes en un grid responsivo

#### Scenario: Datos del personaje a mostrar
- **WHEN** se renderiza cada tarjeta
- **THEN** debe mostrar: imagen del personaje, nombre, y información adicional (ocupación, afiliación)

#### Scenario: Estado de carga
- **WHEN** la aplicación está esperando la respuesta de la API
- **THEN** debe mostrar skeleton loading animado

#### Scenario: Error en la API
- **WHEN** la API de One Piece devuelve un error
- **THEN** debe mostrar un mensaje de error amigable con opción de reintentar