## ADDED Requirements

### Requirement: Navegación entre secciones de anime
La aplicación DEBE permitir al usuario navegar entre las diferentes secciones de anime.

#### Scenario: Opciones de navegación en navbar
- **WHEN** se muestra el navbar
- **THEN** debe incluir enlaces para: Dragon Ball, Naruto, One Piece

#### Scenario: Navegación a Dragon Ball
- **WHEN** el usuario hace click en "Dragon Ball"
- **THEN** la aplicación navega a la ruta /dragon-ball y carga el componente DragonBall

#### Scenario: Navegación a Naruto
- **WHEN** el usuario hace click en "Naruto"
- **THEN** la aplicación navega a la ruta /naruto y carga el componente Naruto

#### Scenario: Navegación a One Piece
- **WHEN** el usuario hace click en "One Piece"
- **THEN** la aplicación navega a la ruta /one-piece y carga el componente OnePiece

#### Scenario: Indicador de sección activa
- **WHEN** el usuario está en una sección
- **THEN** el enlace correspondiente en el navbar debe mostrar estado activo (visual indicator)

#### Scenario: Lazy loading de componentes
- **WHEN** el usuario navega a una sección
- **THEN** el componente debe cargarse de forma lazy (solo cuando se necesita)