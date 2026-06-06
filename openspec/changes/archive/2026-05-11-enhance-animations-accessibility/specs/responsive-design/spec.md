## ADDED Requirements

### Requirement: Breakpoints responsivos estándar
La aplicación DEBE usar breakpoints estándar para diferentes tamaños de pantalla.

#### Scenario: Breakpoint mobile
- **WHEN** el ancho de pantalla es menor a 480px
- **THEN** aplicar estilos mobile

#### Scenario: Breakpoint tablet
- **WHEN** el ancho de pantalla está entre 481px y 768px
- **THEN** aplicar estilos tablet

#### Scenario: Breakpoint laptop
- **WHEN** el ancho de pantalla está entre 769px y 1024px
- **THEN** aplicar estilos laptop

#### Scenario: Breakpoint desktop
- **WHEN** el ancho de pantalla es mayor a 1024px
- **THEN** aplicar estilos desktop

### Requirement: Grid responsivo de tarjetas
El grid de tarjetas DEBE adaptarse automáticamente según el tamaño de pantalla.

#### Scenario: Grid mobile (menor a 480px)
- **WHEN** la pantalla es mobile
- **THEN** mostrar 2 columnas de tarjetas

#### Scenario: Grid tablet (481px - 768px)
- **WHEN** la pantalla es tablet
- **THEN** mostrar 3 columnas de tarjetas

#### Scenario: Grid laptop (769px - 1024px)
- **WHEN** la pantalla es laptop
- **THEN** mostrar 4 columnas de tarjetas

#### Scenario: Grid desktop (mayor a 1024px)
- **WHEN** la pantalla es desktop
- **THEN** mostrar 5 columnas de tarjetas

### Requirement: Navbar responsive
El navbar DEBE adaptarse a diferentes tamaños de pantalla.

#### Scenario: Navbar en desktop
- **WHEN** la pantalla es mayor a 768px
- **THEN** mostrar todos los enlaces en línea horizontal

#### Scenario: Navbar en mobile
- **WHEN** la pantalla es menor a 768px
- **THEN** mostrar enlaces en columna o menú hamburguesa

### Requirement: Contenedores con max-width
Los contenedores DEBEN tener un ancho máximo para legibilidad en pantallas grandes.

#### Scenario: Contenedor principal
- **WHEN** la pantalla es muy grande (mayor a 1400px)
- **THEN** el contenido debe estar limitado a max-width: 1400px

#### Scenario: Centrado de contenido
- **WHEN** el contenido tiene max-width
- **THEN** debe estar centrado con margin: 0 auto

### Requirement: Espaciado responsivo
El espaciado DEBE ajustarse según el tamaño de pantalla.

#### Scenario: Padding en mobile
- **WHEN** la pantalla es mobile
- **THEN** usar padding más pequeño (16px)

#### Scenario: Padding en desktop
- **WHEN** la pantalla es desktop
- **THEN** usar padding más generoso (24px)

#### Scenario: Gap en grid responsivo
- **WHEN** cambia el breakpoint
- **THEN** el gap entre tarjetas debe ajustarse apropiadamente