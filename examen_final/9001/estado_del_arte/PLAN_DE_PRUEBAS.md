# Plan de Pruebas — Sistema de Certificados QR

## 1. Objetivo
Verificar que el sistema cumple con los requisitos funcionales y no funcionales definidos, garantizando su correcto funcionamiento en producción.

## 2. Alcance
Cubren todos los módulos del sistema: autenticación, actividades, participantes, plantillas, certificados, configuración, validación y entrega.

## 3. Tipos de Prueba

| Tipo | Herramienta | Responsable | Cobertura |
|------|-------------|-------------|-----------|
| Unitarias (API) | Jest + Supertest | Backend | 88 tests |
| Unitarias (UI) | Jest + Testing Library | Frontend | 29 tests |
| Integración | Supertest | Backend | Endpoints completos |
| E2E | Cypress | Full stack | 6 flujos críticos |
| Seguridad | Análisis manual | Backend | JWT, roles, SQLi |

## 4. Casos de Prueba — Backend

### Módulo Auth (12 tests)
| TC | Descripción | Precondición | Resultado esperado |
|----|-------------|-------------|-------------------|
| AUTH-01 | Login con credenciales válidas | Usuario existe en DB | 200 + token JWT |
| AUTH-02 | Login con contraseña incorrecta | — | 401 Unauthorized |
| AUTH-03 | Login con usuario inactivo | usuario.activo = 0 | 401 Unauthorized |
| AUTH-04 | Refresh token válido | Token en DB | 200 + nuevo token |
| AUTH-05 | Refresh token inválido | — | 401 Unauthorized |
| AUTH-06 | Forgot password email válido | — | 200 + email enviado |
| AUTH-07 | Reset password con token válido | Token en DB | 200 |
| AUTH-08 | Reset password token expirado | — | 400 |
| AUTH-09 | Logout | Sesión activa | 200 |
| AUTH-10 | Ruta protegida sin token | — | 401 |
| AUTH-11 | ADMIN accede a ruta de ADMIN | Rol ADMIN | 200 |
| AUTH-12 | ADMINISTRATIVO a ruta exclusiva ADMIN | Rol ADMINISTRATIVO | 403 |

### Módulo Actividades (8 tests)
| TC | Descripción | Resultado esperado |
|----|-------------|-------------------|
| ACT-01 | Crear actividad datos válidos | 201 + registro creado |
| ACT-02 | Crear actividad sin nombre | 400 |
| ACT-03 | Listar actividades | 200 + array |
| ACT-04 | Editar actividad existente | 200 |
| ACT-05 | Editar actividad inexistente | 404 |
| ACT-06 | Acceder sin autenticación | 401 |
| ACT-07 | ADMINISTRATIVO puede crear | 201 |
| ACT-08 | Crear con nombre duplicado | Manejo de error |

### Módulo Participantes (10 tests)
| TC | Descripción | Resultado esperado |
|----|-------------|-------------------|
| PAR-01 | Registrar participante datos válidos | 201 |
| PAR-02 | Registrar sin documento | 400 |
| PAR-03 | Listar por actividad | 200 |
| PAR-04 | Validar APTO | 200 + estado cambiado |
| PAR-05 | Validar APTO participante inexistente | 404 |
| PAR-06 | Importar CSV válido | 201 |
| PAR-07 | Importar CSV malformado | 400 |
| PAR-08 | Duplicado mismo documento+actividad | Manejo de error |

### Módulo Plantillas (11 tests)
| TC | Descripción | Resultado esperado |
|----|-------------|-------------------|
| PLA-01 | Crear plantilla con nombre | 201 |
| PLA-02 | Crear plantilla sin nombre | 400 |
| PLA-03 | Subir imagen PNG | 200 + archivo en disco |
| PLA-04 | Subir archivo no imagen | 400 |
| PLA-05 | Listar plantillas | 200 |
| PLA-06 | Obtener plantilla por ID | 200 |
| PLA-07 | Guardar campos dinámicos | 200 |
| PLA-08 | Obtener campos de plantilla | 200 |
| PLA-09 | Editar plantilla | 200 |
| PLA-10 | Eliminar plantilla (ADMIN) | 200 |
| PLA-11 | Eliminar plantilla (ADMINISTRATIVO) | 403 |

### Módulo Certificados (14 tests)
| TC | Descripción | Resultado esperado |
|----|-------------|-------------------|
| CER-01 | Generar certificados actividad con aptos | 200 + PDFs |
| CER-02 | Generar sin participantes aptos | 422 |
| CER-03 | Generar sin configuración institucional | 422 |
| CER-04 | Listar certificados por actividad | 200 |
| CER-05 | Ver PDF con token válido | 200 + PDF |
| CER-06 | Ver PDF sin token | 401 |
| CER-07 | Descargar PDF autenticado | 200 + archivo |
| CER-08 | Descargar PDF inexistente | 404 |
| CER-09 | Revocar certificado (ADMIN) | 200 |
| CER-10 | Revocar certificado (ADMINISTRATIVO) | 403 |
| CER-11 | Generar enlace de descarga | 200 + token |
| CER-12 | Descargar por enlace válido | 200 |
| CER-13 | Descargar por enlace expirado | 401 |

### Módulo Validación (8 tests)
| TC | Descripción | Resultado esperado |
|----|-------------|-------------------|
| VAL-01 | Validar código existente EMITIDO | 200 + datos |
| VAL-02 | Validar código inexistente | 404 |
| VAL-03 | Validar código REVOCADO | 200 + estado revocado |
| VAL-04 | Validar QR con código válido | 200 |
| VAL-05 | Descarga por enlace público | 200 |

## 5. Casos de Prueba — Frontend (29 tests)

| Página | Pruebas | Cobertura |
|--------|---------|-----------|
| Login | 4 | Render, validación, submit, error |
| ForgotPassword | 2 | Render, validación email |
| ResetPassword | 2 | Render, validación contraseña |
| Dashboard | 4 | Gráficos, cards, datos |
| Actividades | 3 | CRUD, tabla responsive |
| Participantes | 3 | Formulario, validación APTO |
| Plantillas | 5 | Canvas, drag-drop, upload imagen |
| Certificados | 3 | Lista, generar, descargar |
| Configuración | 3 | Formulario, upload, tabs |

## 6. Pruebas E2E (Cypress)

| Flujo | Estado |
|-------|--------|
| Login → Dashboard | ✅ |
| Crear actividad → Ver en tabla | ✅ |
| Registrar participante → Validar APTO | ✅ |
| Crear plantilla → Subir imagen | ✅ |
| Generar certificados → Descargar PDF | ✅ |
| Validar certificado por QR | ⚠️ Pendiente |

## 7. Criterios de Aceptación

- 100% de pruebas unitarias del backend pasando
- ≥ 60% de cobertura de código en frontend
- 0 bugs críticos en SonarQube
- Tiempo de respuesta API < 500ms (p95)
- Los 5 flujos E2E principales operativos
