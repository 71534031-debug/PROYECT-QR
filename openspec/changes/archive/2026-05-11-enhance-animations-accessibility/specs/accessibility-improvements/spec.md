## ADDED Requirements

### Requirement: Contraste WCAG AA en modo oscuro
La aplicación DEBE mantener un ratio de contraste mínimo de 4.5:1 para texto legible.

#### Scenario: Contraste de texto principal
- **WHEN** se muestra texto principal sobre fondo oscuro
- **THEN** el ratio de contraste debe ser mínimo 4.5:1

#### Scenario: Contraste de texto secundario
- **WHEN** se muestra texto secundario o metadata
- **THEN** el ratio de contraste debe ser mínimo 3:1

#### Scenario: Color de acentos accesibles
- **WHEN** se usan colores de acento para interactive elements
- **THEN** deben tener contraste suficiente con el fondo

### Requirement: Roles ARIA para componentes
La aplicación DEBE usar roles ARIA apropiados para mejorar la navegación con lectores de pantalla.

#### Scenario: Navigation con role correcto
- **WHEN** se renderiza el navbar
- **THEN** el elemento nav debe tener role="navigation" y aria-label

#### Scenario: Grid de contenido con role list
- **WHEN** se muestran tarjetas de anime
- **THEN** el contenedor debe tener role="list" y los items role="listitem"

#### Scenario: Loading states accesibles
- **WHEN** se muestra un spinner de carga
- **THEN** debe tener aria-busy="true" y aria-live="polite"

### Requirement: Navegación por teclado
La aplicación DEBE ser completamente navegable usando solo teclado.

#### Scenario: Focus visible
- **WHEN** un elemento recibe foco
- **THEN** debe tener un outline visible y claramente distinguishable

#### Scenario: Orden de tabulación lógico
- **WHEN** el usuario navega con Tab
- **THEN** el orden debe seguir el flujo visual de la página

#### Scenario: Skip to content link
- **WHEN** el usuario quiere saltar al contenido principal
- **THEN** debe existir un link de "Skip to content" visible al focalizar

### Requirement: Labels para elementos interactivos
Los elementos interactivos DEBEN tener labels accesibles.

#### Scenario: Botones con texto accesible
- **WHEN** se renderiza un botón
- **THEN** debe tener texto visible o aria-label

#### Scenario: Input de búsqueda etiquetado
- **WHEN** se muestra el campo de búsqueda
- **THEN** debe tener un label visible o aria-label

### Requirement: Estados accesibles para lectores de pantalla
Los cambios de estado DEBEN comunicarse a tecnologías asistivas.

#### Scenario: Loading comunicado
- **WHEN** la aplicación está cargando datos
- **THEN** debe comunicar el estado a usuarios de lectores de pantalla

#### Scenario: Error comunicado
- **WHEN** ocurre un error
- **THEN** debe usar aria-live para anunciar el mensaje de error