## ADDED Requirements

### Requirement: Consumir Naruto API
La aplicación DEBE obtener datos de personajes de la API de Naruto.

#### Scenario: Obtener lista de personajes
- **WHEN** el usuario navega a la sección Naruto
- **THEN** la aplicación consume GET https://narutodb.xyz/api/character

#### Scenario: Mostrar personajes en grid
- **WHEN** la API responde exitosamente
- **THEN** mostrar las tarjetas de personajes en un grid responsivo

#### Scenario: Datos del personaje a mostrar
- **WHEN** se renderiza cada tarjeta
- **THEN** debe mostrar: imagen del personaje, nombre, y información adicional (clan, village)

#### Scenario: Estado de carga
- **WHEN** la aplicación está esperando la respuesta de la API
- **THEN** debe mostrar skeleton loading animado

#### Scenario: Error en la API
- **WHEN** la API de Naruto devuelve un error
- **THEN** debe mostrar un mensaje de error amigable con opción de reintentar

### Requirement: Manejo de paginación
La aplicación DEBE manejar la paginación de la API de Naruto.

#### Scenario: Página por defecto
- **WHEN** el usuario accede a Naruto por primera vez
- **THEN** cargar la primera página de personajes