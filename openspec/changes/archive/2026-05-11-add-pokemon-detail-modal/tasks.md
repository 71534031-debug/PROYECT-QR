## 1. Crear componente PokemonDetailModal

- [x] 1.1 Crear carpeta src/app/components/pokemon-detail/
- [x] 1.2 Crear pokemon-detail.component.ts (standalone component con @Input para el Pokémon)
- [x] 1.3 Crear pokemon-detail.component.html con el template del modal
- [x] 1.4 Crear pokemon-detail.component.css con los estilos del modal

## 2. Implementar funcionalidad del modal

- [x] 2.1 Implementar método para cerrar el modal
- [x] 2.2 Agregar cierre con clic en backdrop
- [x] 2.3 Agregar cierre con tecla Escape
- [x] 2.4 Mostrar: imagen grande, nombre, ID, tipos, altura, peso, habilidades

## 3. Integrar modal en PokedexComponent

- [x] 3.1 Importar PokemonDetailModal en PokedexComponent
- [x] 3.2 Agregar signal para controlar el Pokémon seleccionado (selectedPokemon)
- [x] 3.3 Agregar signal para controlar si el modal está abierto (isModalOpen)
- [x] 3.4 Agregar evento click a las tarjetas de Pokémon
- [x] 3.5 Añadir el componente del modal al template de Pokedex

## 4. Verificar funcionamiento

- [x] 4.1 Build del proyecto sin errores
- [ ] 4.2 Verificar que el modal se abre al hacer clic en una tarjeta
- [ ] 4.3 Verificar que el modal muestra todos los datos del Pokémon
- [ ] 4.4 Verificar que el modal se cierra con los tres métodos (X, backdrop, Escape)