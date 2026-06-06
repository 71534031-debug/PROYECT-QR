## ADDED Requirements

### Requirement: Skeleton loading con animación shimmer
La aplicación DEBE mostrar un skeleton loading animado mientras carga el contenido de la API.

#### Scenario: Skeleton con efecto shimmer
- **WHEN** los datos están cargando
- **THEN** se muestra un skeleton con animación de brillo móvil

#### Scenario: Estructura del skeleton
- **WHEN** se renderiza un skeleton de tarjeta
- **THEN** debe tener: imagen placeholder rectangular y líneas de texto

### Requirement: Skeleton para tarjetas de anime
La aplicación DEBE implementar skeleton específico para representaciones de anime.

#### Scenario: Skeleton de tarjeta de anime
- **WHEN** se muestra el skeleton de anime
- **THEN** incluir: imagen aspect-ratio 3/4, línea de título, línea de tipo

#### Scenario: Grid de skeletons durante carga
- **WHEN** múltiples elementos están cargando
- **THEN** mostrar múltiples skeleton cards en el grid

### Requirement: Skeleton para personajes
La aplicación DEBE implementar skeleton específico para representaciones de personajes.

#### Scenario: Skeleton de tarjeta de personaje
- **WHEN** se muestra el skeleton de personaje
- **THEN** incluir: imagen circular o aspect-ratio, línea de nombre, línea de anime

### Requirement: Transición de skeleton a contenido
La aplicación DEBE hacer una transición suave cuando el contenido se carga.

#### Scenario: Reemplazo de skeleton por contenido
- **WHEN** los datos llegan
- **THEN** el skeleton se oculta y el contenido real aparece con fade-in

### Requirement: Skeleton con CSS puro
La aplicación DEBE implementar skeletons usando solo CSS sin JavaScript adicional.

#### Scenario: Implementación con pseudo-elementos
- **WHEN** se crea un skeleton
- **THEN** usar ::before o ::after con background gradiente y animación