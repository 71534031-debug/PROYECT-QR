## 1. Setup del Proyecto Angular 21

- [x] 1.1 Crear nuevo proyecto Angular 21 con Angular CLI (`ng new anime-dashboard`)
- [x] 1.2 Instalar dependencias necesarias (@angular/common/http)
- [x] 1.3 Configurar estructura de carpetas (src/app/components, services, models)
- [x] 1.4 Verificar que el proyecto compile y ejecute correctamente

## 2. Modelos y Tipos

- [x] 2.1 Crear interfaz Anime para datos de la API
- [x] 2.2 Crear interfaz Character para datos de personajes
- [x] 2.3 Crear tipo ApiResponse para respuestas de Jikan

## 3. AnimeService - Servicio de API

- [x] 3.1 Crear AnimeService con HttpClient inyectado
- [x] 3.2 Implementar método getTopAnime() consumiendo /top/anime
- [x] 3.3 Implementar método getSeasonAnime() consumiendo /seasons/now
- [x] 3.4 Implementar método searchAnime(query) consumiendo /anime?q={query}
- [x] 3.5 Implementar método getPopularCharacters() consumiendo /top/characters
- [x] 3.6 Agregar manejo de errores con catchError

## 4. Componente Navbar

- [x] 4.1 Crear NavbarComponent standalone
- [x] 4.2 Implementar template HTML con enlaces de navegación
- [x] 4.3 Implementar estilos CSS con diseño dark mode
- [x] 4.4 Agregar RouterLink para navegación entre secciones

## 5. Componente Dashboard (Home)

- [x] 5.1 Crear DashboardComponent standalone
- [x] 5.2 Implementar template con accesos rápidos a las 4 secciones
- [x] 5.3 Crear estilos con diseño responsivo y moderno

## 6. Componente TopAnime

- [x] 6.1 Crear TopAnimeComponent standalone
- [x] 6.2 Inyectar AnimeService y llamar getTopAnime()
- [x] 6.3 Implementar template con grid de tarjetas de anime
- [x] 6.4 Implementar estado de loading con spinner
- [x] 6.5 Implementar manejo de errores con mensaje amigable
- [x] 6.6 Crear estilos CSS con hover effects y transiciones

## 7. Componente SeasonAnime

- [x] 7.1 Crear SeasonAnimeComponent standalone
- [x] 7.2 Inyectar AnimeService y llamar getSeasonAnime()
- [x] 7.3 Implementar template con grid de tarjetas
- [x] 7.4 Mostrar indicador de temporada actual en header
- [x] 7.5 Implementar estados de loading y error
- [x] 7.6 Crear estilos CSS similares a TopAnime

## 8. Componente AnimeSearch

- [x] 8.1 Crear AnimeSearchComponent standalone
- [x] 8.2 Inyectar AnimeService y llamar searchAnime()
- [x] 8.3 Implementar input de búsqueda con debounce (300ms)
- [x] 8.4 Implementar template con resultados en grid
- [x] 8.5 Mostrar mensaje "No se encontraron resultados" cuando aplicable
- [x] 8.6 Implementar botón para limpiar búsqueda
- [x] 8.7 Crear estilos CSS para input y resultados

## 9. Componente PopularCharacters

- [x] 9.1 Crear PopularCharactersComponent standalone
- [x] 9.2 Inyectar AnimeService y llamar getPopularCharacters()
- [x] 9.3 Implementar template con grid de tarjetas de personajes
- [x] 9.4 Mostrar imagen, nombre y anime asociado
- [x] 9.5 Implementar estados de loading y error
- [x] 9.6 Crear estilos CSS con diseño de tarjetas

## 10. Configuración de Rutas

- [x] 10.1 Configurar app.routes.ts con rutas para cada componente
- [x] 10.2 Ruta raíz (/) muestra Dashboard
- [x] 10.3 Ruta /top-anime muestra TopAnimeComponent
- [x] 10.4 Ruta /season-anime muestra SeasonAnimeComponent
- [x] 10.5 Ruta /search muestra AnimeSearchComponent
- [x] 10.6 Ruta /characters muestra PopularCharactersComponent

## 11. Estilos Globales y Theme

- [x] 11.1 Crear styles.css con variables CSS para dark mode
- [x] 11.2 Definir paleta de colores (fondos, acentos, textos)
- [x] 11.3 Agregar reset de CSS y tipografía base
- [x] 11.4 Configurar estilos globales para transición suave

## 12. Testing y Verificación

- [x] 12.1 Verificar que todos los componentes rendericen correctamente
- [x] 12.2 Probar navegación entre todas las rutas
- [x] 12.3 Verificar manejo de estados de loading
- [x] 12.4 Verificar manejo de errores
- [x] 12.5 Probar diseño responsivo en diferentes tamaños de pantalla
- [x] 12.6 Build de producción sin errores (`ng build`)