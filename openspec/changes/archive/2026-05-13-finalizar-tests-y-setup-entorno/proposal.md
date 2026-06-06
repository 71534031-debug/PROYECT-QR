## Why

El proyecto PROYECT-QR (certificados digitales CIP-Huancavelica) tiene el backend y frontend funcionales con cobertura de tests insuficiente (~29% frontend, certificatePdf.js sin tests). El flujo E2E es inestable en Windows. Completar los tests y setup del entorno es necesario para alcanzar la estabilidad pre-producción y cumplir los criterios de aceptación.

## What Changes

- **Tests Jest para `certificatePdf.js`**: Mock de filesystem y QR para validar generación de PDF sin зависимость del sistema real.
- **Tests unitarios frontend**: Dashboard, Actividades, Participantes, Plantillas, Certificados, Configuración - objetivo coverage >60%.
- **Estabilización E2E Windows**: Eliminar dependencia de `wmic.exe` que causa ENOENT en `test:e2e`.
- **Setup completo entorno**: Verificar MySQL, crear `.env`, aplicar schema y seed, levantar backend:3000 y frontend:5173.
- **Tests de integración**: Correr Jest y Cypress contra el proyecto real y corregir errores de integración.

## Capabilities

### New Capabilities

- `tests-certificate-pdf`: Tests Jest para backend/src/services/certificatePdf.js con mocks de filesystem y QR.
- `tests-frontend-coverage`: Tests unitarios Jest para páginas operativas (Dashboard, Actividades, Participantes, Plantillas, Certificados, Configuración) con cobertura >60%.
- `e2e-windows-stabilization`: Estabilización de Cypress E2E en Windows eliminando dependencia de wmic.exe.
- `entorno-setup`: Setup completo del entorno local con MySQL, variables de entorno y datos seed.
- `tests-integracion`: Ejecución de todos los tests contra proyecto real y corrección de errores de integración.

### Modified Capabilities

- Ninguna (no hay cambios en requisitos, solo implementación de tests pendientes).

## Impact

- **Código afectado**: `backend/src/services/certificatePdf.js`, `frontend/src/pages/*.jsx`, `frontend/cypress/e2e/*.cy.js`
- **Dependencias**: Jest, Cypress, MySQL 8.0.36, sistema de archivos local para PDFs
- **APIs**: Sin cambios
- **Entorno**: Requiere MySQL corriendo, `.env` configurado, backend y frontend levantados
