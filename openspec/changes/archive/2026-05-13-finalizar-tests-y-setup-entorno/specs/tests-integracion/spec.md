## ADDED Requirements

### Requirement: Jest backend tests pass against real project
All backend Jest tests SHALL pass when running against the project with database connected.

#### Scenario: All backend tests pass
- **WHEN** Developer runs `cd backend && npm test`
- **THEN** all tests pass including auth, actividades, participantes, plantillas, config, certificados, entrega, validacion routes

#### Scenario: certificatePdf tests pass
- **WHEN** `backend/src/__tests__/certificatePdf.test.js` runs
- **THEN** all tests for PDF generation with mocks pass

### Requirement: Cypress E2E tests pass against real project
All Cypress E2E tests SHALL pass when running against the fully set up project (MySQL, backend:3000, frontend:5173).

#### Scenario: Login flow E2E passes
- **WHEN** `cypress/e2e/login.cy.js` runs against real backend
- **THEN** login flow completes successfully

#### Scenario: Certificate flow E2E passes
- **WHEN** `cypress/e2e/flujo-certificado.cy.js` runs against real backend
- **THEN** full certificate flow (config → actividad → participante → plantilla → generar) completes

#### Scenario: Public validation E2E passes
- **WHEN** `cypress/e2e/validar.cy.js` runs against real backend
- **THEN** public validation by unique code works correctly

### Requirement: Integration errors corrected
Integration errors discovered during test execution SHALL be fixed to ensure end-to-end functionality.

#### Scenario: No database connection errors
- **WHEN** Tests execute against real MySQL
- **THEN** no ECONNREFUSED or authentication errors occur

#### Scenario: JWT authentication works in E2E
- **WHEN** Cypress tests authenticate via login endpoint
- **THEN** access token is stored and used for subsequent authenticated requests

#### Scenario: PDF files are generated correctly
- **WHEN** Certificate generation API is called
- **THEN** PDF file is created on filesystem and metadata stored in database