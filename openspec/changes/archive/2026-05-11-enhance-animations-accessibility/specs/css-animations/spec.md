## ADDED Requirements

### Requirement: Variables CSS para animaciones globales
La aplicación DEBE definir variables CSS personalizadas para controlar todas las animaciones de forma centralizada.

#### Scenario: Definición de variables de animación
- **WHEN** se carga la aplicación
- **THEN** las variables --animation-duration-fast, --animation-duration-normal, --animation-duration-slow están disponibles

#### Scenario: Duraciones predefinidas
- **WHEN** se necesita una animación rápida
- **THEN** usar --animation-duration-fast (150ms)
- **WHEN** se necesita una animación normal
- **THEN** usar --animation-duration-normal (300ms)
- **WHEN** se necesita una animación lenta
- **THEN** usar --animation-duration-slow (500ms)

### Requirement: Animaciones CSS con keyframes
La aplicación DEBE implementar animaciones declarativas usando @keyframes para efectos reutilizables.

#### Scenario: Animación de fade-in
- **WHEN** un elemento necesita aparecer con animación
- **THEN** aplicar la animación fadeIn que改变 opacity de 0 a 1 y translateY

#### Scenario: Animación de pulse
- **WHEN** se necesita un efecto de pulso (loading states)
- **THEN** usar la animación pulse que escala ligeramente de forma continua

#### Scenario: Animación de shimmer
- **WHEN** se necesita efecto de brillo para skeleton loading
- **THEN** usar la animación shimmer que mueve un gradiente de izquierda a derecha

### Requirement: Transiciones CSS en propiedades óptimas
La aplicación DEBE usar transiciones CSS solo en propiedades que no disparan layout repaint.

#### Scenario: Transiciones en transform y opacity
- **WHEN** se aplica hover a una tarjeta
- **THEN** la transición usa transform: scale() y opacity para mantener 60fps

#### Scenario: Evitar animaciones costosas
- **WHEN** se animan elementos
- **THEN** NO se animan propiedades como width, height, top, left que disparan layout

### Requirement: Respetar prefers-reduced-motion
La aplicación DEBE detectar y respetar la preferencia de movimiento reducido del usuario.

#### Scenario: Usuario prefiere movimiento reducido
- **WHEN** el sistema tiene prefers-reduced-motion: reduce
- **THEN** las animaciones se deshabilitan o reducen significativamente

#### Scenario: Animación fallback para accessibility
- **WHEN** prefers-reduced-motion está activo
- **THEN** las transiciones se reducen a 0.1s o se eliminan