## ADDED Requirements

### Requirement: Dashboard page unit tests
The Dashboard page SHALL have Jest unit tests covering the main functionality with coverage target for this component.

#### Scenario: Dashboard renders loading state
- **WHEN** Dashboard component mounts
- **THEN** it shows loading indicator or skeleton while fetching data

#### Scenario: Dashboard renders statistics
- **WHEN** Dashboard receives valid statistics data
- **THEN** it displays actividadCount, participanteCount, certificadoCount appropriately

#### Scenario: Dashboard handles error state
- **WHEN** API call fails
- **THEN** Dashboard displays error message and allows retry

### Requirement: Actividades page unit tests
The Actividades page SHALL have Jest unit tests covering CRUD operations.

#### Scenario: Actividades renders activity list
- **WHEN** Actividades page loads with existing activities
- **THEN** it displays list of activities with name, tipo, and dates

#### Scenario: Actividades shows create form
- **WHEN** User clicks "Nueva Actividad" button
- **THEN** modal or form appears for creating activity

#### Scenario: Actividades handles validation errors
- **WHEN** User submits form with missing required fields
- **THEN** validation errors are displayed inline

### Requirement: Participantes page unit tests
The Participantes page SHALL have Jest unit tests covering participant management.

#### Scenario: Participantes renders participant list
- **WHEN** Participantes page loads with existing participants
- **THEN** it displays list with document info and email

#### Scenario: Participantes shows CSV import
- **WHEN** User clicks "Importar CSV" button
- **THEN** file input dialog appears for CSV selection

#### Scenario: Participantes handles bulk import results
- **WHEN** CSV import completes with errors
- **THEN** error summary is displayed with problematic rows

### Requirement: Plantillas page unit tests
The Plantillas page SHALL have Jest unit tests covering template management.

#### Scenario: Plantillas renders template list
- **WHEN** Plantillas page loads
- **THEN** it displays available templates with preview option

#### Scenario: Plantillas shows editor for new template
- **WHEN** User clicks "Nueva Plantilla"
- **THEN** editor appears with placeholder validation

### Requirement: Certificados page unit tests
The Certificados page SHALL have Jest unit tests covering certificate generation and listing.

#### Scenario: Certificados renders certificate list
- **WHEN** Certificados page loads with existing certificates
- **THEN** it displays list with participant name, activity, and status

#### Scenario: Certificados shows generation modal
- **WHEN** User clicks "Generar Certificados" for an activity with aptos
- **THEN** confirmation modal shows number of certificates to generate

#### Scenario: Certificados handles generation progress
- **WHEN** Certificate generation is in progress
- **THEN** progress indicator is displayed and UI is non-interactive

### Requirement: Configuración page unit tests
The Configuracion page SHALL have Jest unit tests covering institutional settings.

#### Scenario: Configuracion renders current settings
- **WHEN** Configuracion page loads for ADMIN user
- **THEN** it displays form with nombreInstitucion, logo, firma, cargo, autoridad

#### Scenario: Configuracion saves valid settings
- **WHEN** User saves valid configuration
- **THEN** success message is displayed and values are persisted

#### Scenario: Configuracion validates required fields
- **WHEN** User submits with missing nombreInstitucion
- **THEN** validation error prevents save

#### Scenario: Configuracion restricted to ADMIN
- **WHEN** User with ADMINISTRATIVO role accesses Configuracion
- **THEN** access is denied with appropriate message

### Requirement: Coverage threshold enforcement
The frontend Jest configuration SHALL enforce a minimum coverage threshold of 60% for statements.

#### Scenario: Coverage below threshold
- **WHEN** Test run produces statement coverage below 60%
- **THEN** test suite fails with coverage threshold error

#### Scenario: Coverage meets threshold
- **WHEN** Test run produces statement coverage at or above 60%
- **THEN** test suite passes successfully