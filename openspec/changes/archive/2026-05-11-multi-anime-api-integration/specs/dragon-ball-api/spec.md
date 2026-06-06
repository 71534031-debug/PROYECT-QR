## ADDED Requirements

### Requirement: Consumir Dragon Ball API
La aplicación DEBE obtener datos de personajes de la API de Dragon Ball.

#### Scenario: Obtener lista de personajes
- **WHEN** el usuario navega a la sección Dragon Ball
- **THEN** la aplicación consume GET https://dragonball-api.com/api/characters

#### Scenario: Mostrar personajes en grid
- **WHEN** la API responde exitosamente
- **THEN** mostrar las tarjetas de personajes en un grid responsivo

#### Scenario: Datos del personaje a mostrar
- **WHEN** se renderiza cada tarjeta
- **THEN** debe mostrar: imagen del personaje, nombre, y información adicional (raza, género)

#### Scenario: Estado de carga
- **WHEN** la aplicación está esperando la respuesta de la API
- **THEN** debe mostrar skeleton loading animado

#### Scenario: Error en la API
- **WHEN** la API de Dragon Ball devuelve un error
- **THEN** debe mostrar un mensaje de error amigable con opción de reintentar

### Requirement: Manejo de estructura de datos API
La aplicación DEBE transformar los datos de la API al formato interno.

#### Scenario: Mapeo de datos
- **WHEN** la API retorna los datos del personaje
- **THEN** transformar al modelo interno con campos normalizados