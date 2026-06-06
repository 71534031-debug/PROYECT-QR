## 1. Preparación del entorno

- [x] 1.1 Verificar que el proyecto Angular 21 esté configurado correctamente
- [x] 1.2 Verificar que HttpClientModule esté disponible en la aplicación

## 2. Crear el servicio Pokemon

- [x] 2.1 Crear la carpeta src/app/services/
- [x] 2.2 Crear el archivo pokemon.service.ts
- [x] 2.3 Definir las interfaces TypeScript para Pokemon (Pokemon, PokemonList)
- [x] 2.4 Implementar el método getPokemonList() que consuma la PokeAPI
- [x] 2.5 Implementar el método getPokemonDetails(id: string) para obtener detalles
- [x] 2.6 Agregar manejo de errores en el servicio

## 3. Crear el componente Pokedex

- [x] 3.1 Crear la carpeta src/app/components/pokedex/
- [x] 3.2 Crear el archivo pokedex.component.ts con la lógica del componente
- [x] 3.3 Crear el archivo pokedex.component.html con el template
- [x] 3.4 Injectar el PokemonService en el componente
- [x] 3.5 Implementar la llamada al servicio en ngOnInit
- [x] 3.6 Agregar estado de carga (loading)
- [x] 3.7 Mostrar los datos de los Pokémon en el template

## 4. Integración en la aplicación

- [x] 4.1 Agregar el componente al módulo principal (app.module.ts o standalone)
- [x] 4.2 Agregar el componente al template principal (app.component.html)
- [x] 4.3 Probar que la aplicación funcione correctamente
- [x] 4.4 Verificar el flujo de datos: servicio → componente.ts → componente.html