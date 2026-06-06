## ADDED Requirements

### Requirement: El servicio debe consumir la PokeAPI
El servicio Angular debe consumir los datos de la PokeAPI (https://pokeapi.co/api/v2/) usando el HttpClient de Angular.

#### Scenario: Obtener lista de Pokémon
- **WHEN** se llama al método para obtener la lista de Pokémon
- **THEN** el servicio debe retornar un Observable con los datos de la API

#### Scenario: Obtener detalles de un Pokémon específico
- **WHEN** se llama al método pasando el ID o nombre de un Pokémon
- **THEN** el servicio debe retornar un Observable con los datos detallados de ese Pokémon

### Requirement: El servicio debe manejar errores
El servicio debe manejar los errores de la API de manera apropiada.

#### Scenario: Error de conexión
- **WHEN** la API no está disponible o hay error de red
- **THEN** el servicio debe propagar el error al componente llamador

### Requirement: El servicio debe usar tipos TypeScript
El servicio debe definir interfaces TypeScript para los datos recibidos de la API.

#### Scenario: Definición de tipos
- **WHEN** se reciben datos de la API
- **THEN** los datos deben estar tipados con interfaces TypeScript definidas