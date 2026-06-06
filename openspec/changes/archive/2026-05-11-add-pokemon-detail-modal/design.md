## Context

El proyecto actual es una Pokédex Angular 21 standalone que muestra una lista de 30 Pokémon con búsqueda. Al hacer clic en una tarjeta no ocurre nada. Necesitamos agregar una vista de detalle en forma de modal para mostrar información adicional del Pokémon seleccionado.

## Goals / Non-Goals

**Goals:**
- Crear un componente de modal independiente para detalles de Pokémon
- Mostrar: imagen grande, nombre, ID, tipos, altura, peso, habilidades
- Implementar apertura del modal al hacer clic en una tarjeta
- Cerrar el modal al hacer clic fuera, en el botón de cierre, o presionar Escape

**Non-Goals:**
- No se incluye paginación o navegación entre detalles
- No se muestran estadísticas avanzadas (stats base, etc.)
- No se implementan animaciones complejas de entrada/salida

## Decisions

1. **Modal en lugar de ruta**: Se elige modal porque:
   - Mantiene la navegación simple (sin cambios en app.routes)
   - Mejor experiencia de usuario (no pierdes el contexto de la lista)
   - Más fácil de implementar y mantener
   - Ideal para proyectos de aprendizaje

2. **Componente standalone**: El modal será un standalone component que se importa en el PokedexComponent

3. **Comunicación padre-hijo**: El componente padre (Pokedex) pasa el Pokémon al modal mediante @Input

4. **Control de visibilidad**: El padre controla si el modal está abierto usando una signal

## Risks / Trade-offs

- [Riesgo] El modal debe mostrar datos que ya existen en el componente padre → Mitigación: Reutilizar los datos ya cargados, no hacer llamada API adicional
- [Riesgo] UX al cerrar el modal → Mitigación: Cerrar con clic en backdrop, botón X, y tecla Escape