## ADDED Requirements

### Requirement: Mostrar Top Anime desde API de Jikan
La aplicación DEBE mostrar los animes mejor rankeados obtenidos del endpoint GET /top/anime de la API de Jikan.

#### Scenario: Carga exitosa de Top Anime
- **WHEN** el usuario navega a la sección de Top Anime
- **THEN** la aplicación consume el endpoint /top/anime y muestra las tarjetas de anime en un grid responsivo

#### Scenario: Mostrar información del anime
- **WHEN** se renderiza cada tarjeta de anime
- **THEN** debe mostrar: imagen del anime, título, puntuación (score), y número de episodios

#### Scenario: Estado de carga
- **WHEN** la aplicación está esperando la respuesta de la API
- **THEN** debe mostrar un indicador de loading/spinner

#### Scenario: Error en la API
- **WHEN** la API de Jikan devuelve un error o no está disponible
- **THEN** debe mostrar un mensaje de error amigable al usuario

### Requirement: Grid de tarjetas responsivo
Las tarjetas de anime deben mostrarse en un grid que se ajuste al tamaño de pantalla.

#### Scenario: Grid en desktop
- **WHEN** la pantalla tiene más de 1024px de ancho
- **THEN** el grid muestra 5 tarjetas por fila

#### Scenario: Grid en tablet
- **WHEN** la pantalla tiene entre 768px y 1024px
- **THEN** el grid muestra 3 tarjetas por fila

#### Scenario: Grid en mobile
- **WHEN** la pantalla tiene menos de 768px
- **THEN** el grid muestra 2 tarjetas por fila

### Requirement: Hover effects en tarjetas
Las tarjetas de anime deben tener efectos visuales al pasar el mouse.

#### Scenario: Hover en tarjeta
- **WHEN** el usuario pasa el mouse sobre una tarjeta
- **THEN** la tarjeta debe escalar ligeramente (1.05x) y mostrar más información (sinopsis breve)