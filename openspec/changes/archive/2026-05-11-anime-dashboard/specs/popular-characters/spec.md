## ADDED Requirements

### Requirement: Mostrar Personajes Populares
La aplicación DEBE mostrar los personajes de anime más populares obtenidos del endpoint GET /top/characters de la API de Jikan.

#### Scenario: Carga exitosa de personajes populares
- **WHEN** el usuario navega a la sección de Personajes Populares
- **THEN** la aplicación consume el endpoint /top/characters y muestra las tarjetas de personajes

#### Scenario: Mostrar información del personaje
- **WHEN** se renderiza cada tarjeta de personaje
- **THEN** debe mostrar: imagen del personaje, nombre del personaje, y anime al que pertenece

#### Scenario: Grid de personajes
- **WHEN** se muestran los personajes
- **THEN** deben mostrarse en un grid responsivo similar al de animes

#### Scenario: Estado de carga
- **WHEN** la aplicación está esperando la respuesta de la API
- **THEN** debe mostrar un indicador de loading/spinner

#### Scenario: Error en la API
- **WHEN** la API de Jikan devuelve un error o no está disponible
- **THEN** debe mostrar un mensaje de error amigable al usuario