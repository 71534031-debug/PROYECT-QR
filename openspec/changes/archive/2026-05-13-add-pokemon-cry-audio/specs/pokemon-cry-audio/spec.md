## ADDED Requirements

### Requirement: El modal debe reproducir el cry automáticamente
Cuando se abra el modal de detalle de un Pokémon, el sistema SHALL reproducir automáticamente el sonido oficial del Pokémon.

#### Scenario: Reproducción automática al abrir
- **WHEN** el modal de detalle se inicializa con un Pokémon
- **THEN** el sistema debe reproducir el cry automáticamente sin intervención del usuario

### Requirement: El usuario puede reproducir el sonido manualmente
El sistema SHALL permitir al usuario reproducir el sonido nuevamente haciendo clic en un botón.

#### Scenario: Reproducción manual con botón
- **WHEN** el usuario hace clic en el botón de reproducir sonido
- **THEN** el sistema debe reproducir el cry del Pokémon nuevamente

### Requirement: El sistema debe manejar errores de audio
El sistema SHALL manejar silenciosamente los errores cuando el audio no esté disponible.

#### Scenario: Audio no disponible
- **WHEN** el archivo de audio no existe o no puede cargarse
- **THEN** el sistema no debe mostrar error en pantalla ni interrumpir la experiencia del usuario

### Requirement: El sistema debe mostrar un indicador visual de audio
El sistema SHALL mostrar un ícono o indicador que represente la funcionalidad de sonido.

#### Scenario: Indicador visual presente
- **WHEN** el modal está visible
- **THEN** debe mostrarse un botón/ícono de audio visible en la interfaz