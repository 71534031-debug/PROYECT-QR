## ADDED Requirements

### Requirement: Tests for certificatePdf.js service
The backend SHALL provide Jest tests for `backend/src/services/certificatePdf.js` that validate PDF generation functionality using filesystem and QR mocks.

#### Scenario: Successful PDF generation with mocks
- **WHEN** `generateCertificatePdf` is called with valid certificate data
- **THEN** the function calls `fs.promises.writeFile` with correct path and mocked QR data URL, and returns the file path

#### Scenario: PDF generation handles filesystem errors
- **WHEN** `fs.promises.writeFile` throws an error
- **THEN** the function propagates the error without writing corrupted files

#### Scenario: QR code is generated correctly
- **WHEN** `generateCertificatePdf` is called
- **THEN** `qrcode.toDataURL` is called with the validation URL containing the unique code

### Requirement: Certificate data validation
The function SHALL validate that required certificate data (participante, actividad, codigoUnico, qrUrl) is present before attempting PDF generation.

#### Scenario: Missing required data
- **WHEN** `generateCertificatePdf` is called with missing required fields
- **THEN** the function throws an error with descriptive message

#### Scenario: Valid complete data
- **WHEN** `generateCertificatePdf` is called with all required fields (nombres, apellidos, nombreActividad, fechaEmision, codigoUnico, qrUrl, nombreInstitucion, logoPath, firmaPath, nombreAutoridad, cargoAutoridad)
- **THEN** the function proceeds to generate PDF without errors