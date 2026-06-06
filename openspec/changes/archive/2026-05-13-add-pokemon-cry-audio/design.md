## Context

El proyecto actual tiene un modal de detalle de Pokémon que muestra información visual. Ahora agregaremos audio para enriquecer la experiencia. La PokeAPI no provee el cry directamente en el endpoint de detalles, pero los sonidos están disponibles en el repositorio de GitHub de PokeAPI.

## Goals / Non-Goals

**Goals:**
- Reproducir automáticamente el cry al abrir el modal
- Agregar botón para reproducir manualmente
- Mostrar indicador visual del estado del audio
- Manejar errores silenciosamente si el audio no carga

**Non-Goals:**
- No se incluye lista de sonidos o selector
- No se guarda historial de sonidos reproducidos
- No se implementan controles de volumen

## Decisions

1. **Audio Source**: Usar la URL del repositorio de PokeAPI
   - Format: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sounds/cries/{id}.wav`
   - El ID del Pokémon se usa para construir la URL
   - No requiere llamadas API adicionales

2. **HTML5 Audio API**: Usar el elemento Audio nativo del browser
   - Simpler que Web Audio API para este caso de uso
   - Suficiente para reproducir un archivo de audio
   - Soporte universal en browsers modernos

3. **Reproducción automática**: Reproducir al inicializar el componente
   - Usar ngOnInit del PokemonDetailComponent
   - Silenciar errores con try/catch para no interrumpir la UI

4. **Botón de replay**: Agregar botón en el header del modal
   - Icono de speaker con estado visual
   - Simple click handler que reproduce nuevamente

## Risks / Trade-offs

- [Riesgo] El archivo de audio puede no existir para algunos Pokémon → Mitigación: try/catch silencioso
- [Riesgo] CORS issues con el repositorio de GitHub → Mitigación: Verificar que el dominio permita acceso
- [Riesgo] El audio puede tardar en cargar → Mitigación: No bloquear la UI, reproducción asíncrona