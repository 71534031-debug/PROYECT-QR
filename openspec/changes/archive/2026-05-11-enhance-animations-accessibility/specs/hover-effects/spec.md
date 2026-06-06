## ADDED Requirements

### Requirement: Hover effects en tarjetas de anime
Las tarjetas de anime DEBEN tener efectos visuales suaves al pasar el mouse.

#### Scenario: Scale en hover de tarjeta
- **WHEN** el usuario pasa el mouse sobre una tarjeta de anime
- **THEN** la tarjeta aumenta de escala a 1.02 (2%) con transición de 300ms

#### Scenario: Sombra mejorada en hover
- **WHEN** el usuario hace hover en una tarjeta
- **THEN** la sombra aumenta para crear efecto de profundidad

#### Scenario: Borde de acento en hover
- **WHEN** el usuario hace hover en una tarjeta
- **THEN** el borde adquiere un color de acento (#ff6b9d)

### Requirement: Hover effects en botones
Los botones DEBEN tener efectos de retroalimentación visual cuando se interactúa con ellos.

#### Scenario: Scale en botones
- **WHEN** el usuario hace hover en un botón
- **THEN** el botón escala a 1.05

#### Scenario: Cambio de color en hover
- **WHEN** el usuario hace hover en un botón
- **THEN** el fondo se ilumina ligeramente

#### Scenario: Elevación en botones
- **WHEN** el usuario hace hover en un botón
- **THEN** la sombra aumenta para indicar interactividad

### Requirement: Hover effects en enlaces de navegación
Los enlaces del navbar DEBEN tener efectos visuales que indiquen su naturaleza interactiva.

#### Scenario: Fondo de acento en hover
- **WHEN** el usuario hace hover en un enlace del navbar
- **THEN** aparece un fondo semitransparente de color acento

#### Scenario: Indicador activo
- **WHEN** el mouse está sobre un enlace activo
- **THEN** el indicador inferior se hace más visible

### Requirement: Transiciones suaves en todos los hover effects
Todas las interacciones DEBEN tener transiciones fluidas sin saltos.

#### Scenario: Duración consistente de transiciones
- **WHEN** se aplica cualquier hover effect
- **THEN** la transición dura entre 200ms y 300ms

#### Scenario: Ease function apropiado
- **WHEN** se animan hover effects
- **THEN** usar cubic-bezier(0.4, 0, 0.2, 1) para movimiento natural