## ADDED Requirements

### Requirement: Componente de tarjeta de personaje reutilizable
La aplicación DEBE tener un componente de tarjeta que pueda mostrar diferentes personajes.

#### Scenario: Renderizado de tarjeta
- **WHEN** se pasa un personaje al componente
- **THEN** debe mostrar: imagen, nombre, e información adicional

#### Scenario: Imagen del personaje
- **WHEN** se renderiza la tarjeta
- **THEN** mostrar la imagen del personaje con aspect-ratio apropiado

#### Scenario: Hover effect en tarjeta
- **WHEN** el usuario pasa el mouse sobre la tarjeta
- **THEN** aplicar efecto de escala y sombra (similar a tarjetas existentes)

#### Scenario: Diseño responsivo
- **WHEN** la tarjeta se muestra en diferentes tamaños de pantalla
- **THEN** adaptar su tamaño según el grid del contenedor

#### Scenario: Fallback de imagen
- **WHEN** la imagen del personaje no está disponible
- **THEN** mostrar un placeholder o imagen por defecto

### Requirement: Personalización visual por serie
La tarjeta DEBE permitir personalización de colores según la serie de anime.

#### Scenario: Color de acento
- **WHEN** se usa la tarjeta para diferentes series
- **THEN** permitir cambiar el color de acento mediante Input o CSS variables