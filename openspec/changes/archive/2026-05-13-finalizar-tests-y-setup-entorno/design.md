## Context

El proyecto PROYECT-QR tiene backend completo con Express + MySQL y frontend React + Vite. Estado actual:

- **Backend**: Todas las rutas implementadas con tests Jest en `backend/src/__tests__/`. El módulo `certificatePdf.js` NO tiene tests dedicados.
- **Frontend**: Cobertura Jest ~29%. Páginas operativas (Dashboard, Actividades, Participantes, Plantillas, Certificados, Configuración) sin tests unitarios.
- **E2E**: Cypress configurado con flujo de certificado. El script `test:e2e` falla en Windows por dependencia de `wmic.exe`.
- **Entorno**: MySQL 8.0.36 requerido; `.env` necesita crearse desde `.env.example`.

## Goals / Non-Goals

**Goals:**
- Tests Jest para `certificatePdf.js` con mocks de filesystem y QR
- Coverage frontend >60% via tests de páginas operativas
- `test:e2e` estable en Windows sin `wmic.exe`
- Setup completo del entorno verificado
- Suite de tests de integración passing contra proyecto real

**Non-Goals:**
- Cambios en requisitos funcionales
- Refactoring de código existente
- Nuevas features
- Configuración CI/CD (ya está [PENDIENTE] en PROGRESS.md)

## Decisions

### 1. Tests `certificatePdf.js` con mocks de filesystem y QR

**Decisión:** Mockear `fs/promises` y `qrcode` usando `vi.mock()` de Vitest (backend usa Jest, verificar si jest-mock o manual stub).

**Alternativas:**
- Integración real con filesystem temporal: requiere cleanup, más lento
- Unit test puro sin mocks de filesystem: imposible sin reescribir función para inyección de dependencias

**Resultado:** Mock de `fs/promises` para `writeFile` y mock de `qrcode.toDataURL` para QR.

### 2. Tests frontend con Jest + Testing Library

**Decisión:** Usar patrones existentes en `frontend/src/__tests__/` (Jest + React Testing Library + mocks de Axios con `jest.mock`).

**Alternativas:**
- Testing Library vs Enzyme: El proyecto ya usa Testing Library
- MSW para mocks de API: Considerar si simplifies setup

**Resultado:** Patrón consistente con tests existentes (`Login.test.jsx`, `ForgotPassword.test.jsx`).

### 3. Estabilización E2E Windows - wmic.exe

**Decisión:** Eliminar dependencia de `wmic.exe` en el script `test:e2e`. El problema已知 en PROGRESS.md.

**Alternativas:**
- Usar script PowerShell alternativo compatible: Más portable
- Ignorar en Windows y documentar como known issue: No resuelve el problema

**Resultado:** Modificar `package.json` `test:e2e` para usar alternativa Windows-compatible o eliminar la dependencia.

### 4. Setup entorno automatizado vs manual

**Decisión:** Scripts de verificación y setup documentados pero ejecución manual supervisada (MySQL requiere credenciales válidas).

**Alternativas:**
- Script automatizado full: Requiere credenciales fijas, poco flexible
- Documentación + verificación manual: Más seguro y adaptable

**Resultado:** Checklist documentado en `tasks.md` para ejecución manual controlada.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Tests de `certificatePdf.js` fallan por diferencias en mock de PDF real | Mockear solo la generación QR y escritura filesystem; verificar output structurally |
| Cobertura >60% requiere tests exhaustivos de UI compleja | Priorizar páginas más críticas (Dashboard, Certificados, Participantes) |
| MySQL no disponible o credenciales incorrectas | Checklist de verificación antes de ejecutar tests; `[PENDIENTE]` en PROGRESS.md |
| `wmic.exe` eliminado afecta otras partes del sistema | Revisar todo uso de `wmic.exe` antes de modificar; buscar alternativas PowerShell nativas |

## Open Questions

1. ¿Cuál es la estrategia exacta de mock para `certificatePdf.js`? (¿jest-mock, sinon, manual stub?)
2. ¿El umbral exacto de coverage frontend debe ser 60% o 65%? (PROGRESS dice >60%)
3. ¿Debe el script `test:e2e` usar PowerShell o puede simplificarse a Cypress directo sin wrapper?
4. ¿Hay tests existentes de Cypress que deban adaptarse al nuevo setup?

---
*Dependencies: proposal.md*