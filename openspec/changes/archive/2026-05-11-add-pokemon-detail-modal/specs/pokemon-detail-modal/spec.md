## ADDED Requirements

### Requirement: El modal debe mostrar los detalles del Pokémon
El componente de modal debe mostrar la información completa del Pokémon seleccionado.

#### Scenario: Mostrar información del Pokémon
- **WHEN** el modal se abre con un Pokémon como input
- **THEN** debe mostrar: imagen grande, nombre, ID, tipos, altura, peso, habilidades

### Requirement: El modal debe cerrarse correctamente
El usuario debe poder cerrar el modal de varias formas.

#### Scenario: Cerrar haciendo clic en el botón X
- **WHEN** el usuario hace clic en el botón de cierre (X)
- **THEN** el modal debe закрыться (cerrarse)

#### Scenario: Cerrar haciendo clic fuera del contenido
- **WHEN** el usuario hace clic en el backdrop (área fuera del contenido del modal)
- **THEN** el modal debe cerrarse

#### Scenario: Cerrar presionando Escape
- **WHEN** el usuario presiona la tecla Escape
- **THEN** el modal debe cerrarse

### Requirement: El modal debe ser visualmente atractivo
El diseño del modal debe ser moderno y coherente con la Pokédex.

#### Scenario: Estilo visual
- **WHEN** el modal está visible
- **THEN** debe tener fondo oscuro con efecto blur, bordes redondeados, y animación suave de entrada