## Context

La aplicación Anime Dashboard existente necesita mejorar su experiencia de usuario con animaciones modernas, efectos visuales y mejor accesibilidad. El proyecto actual tiene una buena arquitectura Angular 21 pero carece de polish visual. Las metas son crear una interfaz que se sienta moderna y fluida,similar a plataformas como Netflix o Crunchyroll, manteniendo excelente rendimiento y accesibilidad.

El proyecto actual usa standalone components, servicios separados para API, y tiene un theme dark mode ya implementado. Las mejoras se centrarán en CSS y templates HTML sin modificar la lógica de TypeScript.

## Goals / Non-Goals

**Goals:**

- Implementar animaciones suaves con CSS transitions (0.3s-0.5s de duración)
- Crear skeleton loading animado para estados de carga
- Añadir hover effects con transform y box-shadow en tarjetas
- Implementar staggered animations para aparición de contenido
- Mejorar navbar con transiciones en hover y efectos de scroll
- Asegurar contraste WCAG AA en modo dark (ratio mínimo 4.5:1)
- Implementar diseño responsive con breakpoints: 480px, 768px, 1024px, 1440px
- Agregar roles ARIA y atributos de accesibilidad
- Optimizar animaciones para no afectar performance (GPU acceleration)

**Non-Goals:**

- No agregar librerías externas de animaciones (solo CSS puro)
- No cambiar la lógica de componentes TypeScript
- No modificar el consumo de API o estructura de datos
- No implementar animaciones 3D o efectos complejos que afecten rendimiento
- No crear animations para usuarios que prefieran reduced-motion

## Decisions

### 1. CSS Animations vs JavaScript Animations

**Decisión:** Usar únicamente animaciones CSS con @keyframes y transitions.

**Rationale:** Las animaciones CSS son más performantes porque pueden ejecutarse en el compositor GPU, tienen mejor soporte en navegadores modernos, y no requieren librerías adicionales. Angular ya tiene capacidades de animaciones pero agregar @angular/animations incrementaría el bundle size.

**Alternativas consideradas:**
- Angular Animations (@angular/animations): Mayor control pero más peso
- Librerías externas (Animate.css, GSAP): Funcional pero innecesario overhead

### 2. Skeleton Loading con CSS puro

**Decisión:** Implementar skeleton loading usando pseudo-elementos y animación CSS.

**Rationale:** Evita dependencia de librerías, es muy liviano, y permite personalización completa del look de los skeletons. Se puede implementar directamente en el template HTML.

### 3. prefers-reduced-motion para accesibilidad

**Decisión:** Respetar la preferencia del sistema mediante media query prefers-reduced-motion.

**Rationale:** Es parte de las mejores prácticas de accesibilidad y permite a usuarios sensibles a movimientos disfrutar de la aplicación sin mareos.

### 4. Breakpoints responsivos

**Decisión:** Usar breakpoints estándar: 480px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop).

**Rationale:** Estos son los breakpoints más utilizados y cubren la mayoría de dispositivos. El grid de anime usará estas media queries para ajustar columnas.

### 5. CSS Custom Properties (Variables CSS)

**Decisión:** Crear variables CSS centralizadas para animaciones.

**Rationale:** Facilita mantenimiento, permite theme consistente, y permite cambios globales de forma rápida.

## Risks / Trade-offs

- **[Riesgo]** Animaciones excesivas pueden afectar performance → **Mitigación**: Usar transform y opacity que no disparan layout, evitar animaciones de propiedades costosas como width/height
- **[Riesgo]** Skeleton loading puede aumentar tamaño de CSS → **Mitigación**: Mantener skeleton simple con伪-elementos, reutilizar clases
- **[Riesgo]** Accesibilidad puede ser pasada por alto → **Mitigación**: Auditoría manual con Lighthouse, testing con lectores de pantalla
- **[Trade-off]** Animaciones vs Performance → Se prioriza experiencia visual sobre animations complejas, se mantiene 60fps como objetivo

## Migration Plan

1. Agregar variables CSS globales para animaciones en styles.css
2. Crear componente skeleton simple o mixins reutilizables
3. Actualizar cada componente CSS con las nuevas animaciones
4. Agregar atributos ARIA a templates HTML según necesidad
5. Testing visual en diferentes tamaños de pantalla
6. Verificar con Lighthouse accessibility score

## Open Questions

- ¿Usar Angular View Transitions API cuando esté estable? → Por ahora CSS estándar, monitorear soporte de navegadores
- ¿Necesitamos animaciones de página (page transitions)? → No para MVP, mantener simple
- ¿Implementar loading spinner animado? → Ya existe spinner CSS, mejorar con mejor animación