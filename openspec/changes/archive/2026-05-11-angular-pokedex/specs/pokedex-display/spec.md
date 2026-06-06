## ADDED Requirements

### Requirement: El componente debe mostrar los datos del Pokémon
El componente debe renderizar los datos de los Pokémon obtenidos del servicio en el template HTML.

#### Scenario: Mostrar lista de Pokémon
- **WHEN** el componente recibe los datos del servicio
- **THEN** debe mostrar cada Pokémon con su nombre e imagen

### Requirement: El componente debe tener archivos separados
El componente debe tener la lógica en un archivo .ts separado del template HTML.

#### Scenario: Estructura de archivos
- **WHEN** se crea el componente
- **THEN** debe existir un archivo .ts con la lógica y un archivo .html con el template

### Requirement: El flujo de datos debe ser servicio → componente.ts → componente.html
Los datos deben fluir desde el servicio hacia el componente TypeScript y luego renderizarse en el template HTML.

#### Scenario: Flujo de datos
- **WHEN** el componente se inicializa
- **THEN** debe llamar al servicio, obtener los datos, y mostrarlos en el template

### Requirement: El componente debe manejar el estado de carga
El componente debe indicar cuando está cargando los datos.

#### Scenario: Estado de carga
- **WHEN** se están obteniendo los datos de la API
- **THEN** debe mostrarse un indicador de carga en el template