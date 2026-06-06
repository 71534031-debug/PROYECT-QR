## ADDED Requirements

### Requirement: MySQL database availability verification
The development environment SHALL verify MySQL 8.0.36 is running and accessible before executing tests.

#### Scenario: MySQL is running
- **WHEN** Developer runs environment setup verification
- **THEN** connection to MySQL succeeds and database `certificados_db` exists

#### Scenario: MySQL is not running
- **WHEN** MySQL is not accessible
- **THEN** clear error message indicates MySQL status and setup instructions

### Requirement: Environment variables configuration
The backend SHALL have a properly configured `.env` file created from `.env.example` with all required variables.

#### Scenario: .env exists with all required variables
- **WHEN** Backend starts
- **THEN** all environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, JWT_DOWNLOAD_SECRET, FRONTEND_PUBLIC_URL) are loaded

#### Scenario: Missing .env file
- **WHEN** Backend starts without .env
- **THEN** error message prompts to create .env from .env.example

### Requirement: Database schema and seed application
The database SHALL have schema.sql and seed.sql applied with correct data for testing.

#### Scenario: Schema applied
- **WHEN** `database/schema.sql` is applied
- **THEN** all tables (usuarios, actividades, participantes, plantillas, certificados, configuracion, auditoria_eventos, refresh_tokens, password_reset_tokens) are created

#### Scenario: Seed data applied
- **WHEN** `database/seed.sql` is applied
- **THEN** test users exist (admin@cip.local, staff@cip.local with Password123)

### Requirement: Backend server on port 3000
The backend server SHALL be running on port 3000 with health check endpoint responding.

#### Scenario: Backend health check
- **WHEN** `GET http://localhost:3000/api/health` is called
- **THEN** response is 200 OK with JSON containing status

### Requirement: Frontend dev server on port 5173
The frontend dev server SHALL be running on port 5173 with Vite proxying /api to backend.

#### Scenario: Frontend accessible
- **WHEN** User opens `http://localhost:5173`
- **THEN** React application loads without errors

#### Scenario: API proxy works
- **WHEN** Frontend makes request to `/api/*`
- **THEN** request is proxied to backend on port 3000