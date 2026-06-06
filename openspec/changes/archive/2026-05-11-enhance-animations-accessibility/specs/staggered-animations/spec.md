## ADDED Requirements

### Requirement: Aparición escalonada de tarjetas
Las tarjetas de anime/personajes DEBEN aparecer de forma escalonada cuando se cargan los datos.

#### Scenario: Retraso entre tarjetas
- **WHEN** los datos de anime se cargan
- **THEN** cada tarjeta aparece con un delay de 50ms respecto a la anterior

#### Scenario: Animación de entrada escalonada
- **WHEN** las tarjetas se renderizan
- **THEN** cada una tiene: translateY(20px) → translateY(0) y opacity 0 → 1

#### Scenario: Duración de cada animación
- **WHEN** una tarjeta individual entra
- **THEN** la animación dura 400ms

### Requirement: Grid con animation-delay basado en posición
Las animaciones escalonadas DEBEN basarse en la posición de la tarjeta en el grid.

#### Scenario: Cálculo de delay
- **WHEN** se renderiza la tarjeta en posición i del grid
- **THEN** el delay es: (i % número_de_columnas) * 50ms

#### Scenario: Batch de tarjetas
- **WHEN** se cargan 25 tarjetas
- **THEN** las primeras 5 aparecen rápidamente, las siguientes se unen progresivamente

### Requirement: Animación de entrada para página completa
Cuando se navega a una nueva página, la contenido DEBE entrar con animación escalonada.

#### Scenario: Dashboard con secciones
- **WHEN** se carga el dashboard
- **THEN** cada sección de tarjetas aparece con delay incremental

#### Scenario: Resultados de búsqueda
- **WHEN** se muestran resultados de búsqueda
- **THEN** las tarjetas aparecen de forma escalonada

### Requirement: Transform y opacity para性能
Las animaciones escalonadas DEBEN usar solo transform y opacity para mantener 60fps.

#### Scenario: Propiedades animadas
- **WHEN** se crea animación de entrada
- **THEN** solo usar: transform (translateY, scale) y opacity

#### Scenario: GPU acceleration
- **WHEN** se animan elementos
- **THEN** usar will-change: transform, opacity para optimización