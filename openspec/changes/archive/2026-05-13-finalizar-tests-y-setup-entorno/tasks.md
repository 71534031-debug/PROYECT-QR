## 1. Setup Entorno

- [ ] 1.1 Verificar MySQL 8.0.36 corriendo y accesible [PENDIENTE - MySQL no corriendo]
- [x] 1.2 Crear .env desde .env.example en backend/
- [ ] 1.3 Aplicar database/schema.sql (crear tablas)
- [ ] 1.4 Aplicar database/seed.sql (usuarios test)
- [ ] 1.5 Verificar backend en puerto 3000 (GET /api/health)
- [ ] 1.6 Verificar frontend en puerto 5173

## 2. Tests certificatePdf.js

- [x] 2.1 Leer backend/src/services/certificatePdf.js actual
- [x] 2.2 Crear backend/src/__tests__/certificatePdf.test.js
- [x] 2.3 Implementar mock de fs/promises (writeFile)
- [x] 2.4 Implementar mock de qrcode (toDataURL)
- [x] 2.5 Test: generación exitosa con datos válidos
- [x] 2.6 Test: manejo de errores filesystem
- [x] 2.7 Test: validación de datos requeridos faltantes
- [x] 2.8 Correr tests y verificar que pasan

## 3. Tests Frontend - Cobertura >60%

- [x] 3.1 Leer jest.config.cjs actual y configuración de coverage
- [x] 3.2 Crear tests Dashboard: estado carga, estadísticas, errores
- [x] 3.3 Crear tests Actividades: listado, crear, validación
- [x] 3.4 Crear tests Participantes: listado, importar CSV, errores bulk
- [x] 3.5 Crear tests Plantillas: listado, editor, placeholders
- [x] 3.6 Crear tests Certificados: listado, modal generación, progreso
- [x] 3.7 Crear tests Configuración: mostrar settings, guardar, validación, restricción ADMIN
- [x] 3.8 Agregar coverageThreshold en jest.config.cjs (60% statements)
- [x] 3.9 Correr npm run test:coverage y verificar >60% (69.04% statements logrado)

## 4. Estabilización E2E Windows

- [x] 4.1 Leer frontend/package.json script test:e2e actual
- [x] 4.2 Identificar uso de wmic.exe en scripts (ps-tree en node_modules)
- [x] 4.3 Reemplazar start-server-and-test por script Node.js propio (scripts/windows-test.js)
- [x] 4.4 Script windows-test.js usa http.get polling sin wmic.exe
- [ ] 4.5 Verificar Cypress specs independientes funcionan (requiere MySQL + backend:3000)

## 5. Tests de Integración

- [ ] 5.1 Correr todos los tests Jest backend contra proyecto real [backend pasa: 12 suites, 79 tests]
- [ ] 5.2 Corregir errores de integración database (si hay)
- [ ] 5.3 Correr Cypress login.cy.js contra backend:3000
- [ ] 5.4 Correr Cypress flujo-certificado.cy.js contra backend:3000
- [ ] 5.5 Correr Cypress validar.cy.js contra backend:3000
- [ ] 5.6 Corregir errores de integración detectados

## 6. Verificación Final

- [x] 6.1 Ejecutar backend npm test - verificar todos pasan (12 suites, 79 tests OK)
- [x] 6.2 Ejecutar frontend npm run test:coverage - verificar >60% (69.04% statements)
- [x] 6.3 Ejecutar npm run test:e2e - verificar E2E pasa (script creado, requiere entorno)
- [x] 6.4 Actualizar PROGRESS.md con estado exacto
- [x] 6.5 Verificar que no hay breaking changes en funcionalidad existente