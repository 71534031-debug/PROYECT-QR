## ADDED Requirements

### Requirement: Estructura de Proyecto Angular 21 Standalone
La aplicación DEBE utilizar Angular 21 con standalone components y arquitectura limpia.

#### Scenario: Componentes standalone
- **WHEN** se crea un nuevo componente
- **THEN** debe ser un standalone component (no usar NgModules)

#### Scenario: Archivo HTML separado
- **WHEN** se crea un componente
- **THEN** el template HTML debe estar en un archivo .html separado del .ts

#### Scenario: Archivo CSS separado
- **WHEN** se crea un componente
- **THEN** los estilos deben estar en un archivo .css separado del .ts

### Requirement: Servicios para Consumo de API
La aplicación DEBE tener servicios separados para el consumo de APIs.

#### Scenario: AnimeService
- **WHEN** se necesita consumir la API de Jikan
- **THEN** usar el AnimeService que centraliza todas las llamadas HTTP

#### Scenario: Métodos del servicio
- **WHEN** se implementa el AnimeService
- **THEN** debe tener métodos para: getTopAnime(), getSeasonAnime(), searchAnime(query), getPopularCharacters()

#### Scenario: Inyección de dependencias
- **WHEN** un componente necesita datos de la API
- **THEN** debe inyectar el AnimeService mediante constructor

### Requirement: Flujo de Datos Unidireccional
La aplicación DEBE seguir el patrón: API → Service → Component.ts → Component.html

#### Scenario: Llamada HTTP en servicio
- **WHEN** se necesita obtener datos
- **THEN** el service realiza la llamada HTTP usando HttpClient

#### Scenario: Observable en componente
- **WHEN** el service retorna un Observable
- **THEN** el componente se suscribe usando AsyncPipe o suscripción manual

#### Scenario: Datos en template
- **WHEN** el componente tiene datos disponibles
- **THEN** el template HTML muestra los datos usando interpolación o directivas

### Requirement: Diseño UI Moderno
La aplicación DEBE tener un diseño visual moderno inspiración en plataformas de streaming.

#### Scenario: Dark mode por defecto
- **WHEN** se renderiza la aplicación
- **THEN** el fondo debe ser oscuro (#1a1a2e o similar)

#### Scenario: Tarjetas modernas
- **WHEN** se muestra una tarjeta de anime/personaje
- **THEN** debe tener bordes redondeados, sombra sutil, y transición suave

#### Scenario: Navbar de navegación
- **WHEN** se muestra la aplicación
- **THEN** debe haber un navbar con enlaces a las diferentes secciones

#### Scenario: Transiciones suaves
- **WHEN** ocurre un cambio de estado (hover, navegación)
- **THEN** debe haber una transición CSS suave (0.3s o similar)

### Requirement: Manejo de Estados
La aplicación DEBE manejar estados de loading y errores.

#### Scenario: Estado de loading
- **WHEN** se está cargando data de la API
- **THEN** debe mostrar un spinner o indicador visual de carga

#### Scenario: Estado de error
- **WHEN** la API falla o devuelve error
- **THEN** debe mostrar un mensaje de error amigable (no mostrar error técnico)

#### Scenario: Estado vacío
- **WHEN** no hay datos para mostrar
- **THEN** debe mostrar un mensaje apropiado (ej: "No hay resultados")