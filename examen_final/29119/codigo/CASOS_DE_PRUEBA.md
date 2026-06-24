# Casos de Prueba Detallados — ISO 29119

## 1. Formato de Caso de Prueba

Cada caso sigue la plantilla:
- **ID**: Identificador único
- **Título**: Descripción breve
- **Precondiciones**: Estado inicial requerido
- **Datos de entrada**: Valores de prueba
- **Pasos**: Secuencia de acciones
- **Resultado esperado**: Comportamiento correcto
- **Resultado obtenido**: Comportamiento real
- **Estado**: ✅ / ❌

---

## 2. Casos de Prueba — Backend

### Módulo Auth

| ID | Título | Entrada | Resultado Esperado | Estado |
|----|--------|---------|-------------------|:------:|
| TC-AUTH-01 | Login correcto ADMIN | `{ email: "admin@test.com", password: "123456" }` | 200 + token JWT | ✅ |
| TC-AUTH-02 | Login contraseña incorrecta | `{ email: "admin@test.com", password: "wrong" }` | 401 | ✅ |
| TC-AUTH-03 | Login usuario inactivo | Usuario con activo=0 | 401 | ✅ |
| TC-AUTH-04 | Refresh token válido | Token en DB | 200 + nuevo accessToken | ✅ |
| TC-AUTH-05 | Refresh token inválido | Token aleatorio | 401 | ✅ |
| TC-AUTH-06 | Forgot password email existe | Email registrado | 200 + email enviado | ✅ |
| TC-AUTH-07 | Forgot password email no existe | Email no registrado | 200 (seguridad) | ✅ |
| TC-AUTH-08 | Reset password token válido | `{ new_password: "new123", token: válido }` | 200 | ✅ |
| TC-AUTH-09 | Reset password token expirado | Token con fecha expirada | 400 | ✅ |
| TC-AUTH-10 | Logout | Token válido | 200 | ✅ |
| TC-AUTH-11 | Acceso ruta protegida sin token | — | 401 | ✅ |
| TC-AUTH-12 | Acceso ADMINISTRATIVO a ruta ADMIN | Token ADMINISTRATIVO | 403 | ✅ |

### Módulo Actividades

| ID | Título | Entrada | Resultado Esperado | Estado |
|----|--------|---------|-------------------|:------:|
| TC-ACT-01 | Crear actividad | `{ nombre: "Taller", fecha_inicio: "2026-01-01", tipo: "Taller" }` | 201 + registro | ✅ |
| TC-ACT-02 | Crear sin nombre | `{ fecha_inicio: "2026-01-01" }` | 400 | ✅ |
| TC-ACT-03 | Listar actividades | GET /api/actividades | 200 + array | ✅ |
| TC-ACT-04 | Editar actividad existente | PUT con ID válido | 200 | ✅ |
| TC-ACT-05 | Editar actividad inexistente | PUT con ID 9999 | 404 | ✅ |

### Módulo Participantes

| ID | Título | Entrada | Resultado Esperado | Estado |
|----|--------|---------|-------------------|:------:|
| TC-PAR-01 | Registrar participante | Datos válidos + actividad_id | 201 | ✅ |
| TC-PAR-02 | Registrar sin documento | Faltando documento_identidad | 400 | ✅ |
| TC-PAR-03 | Listar por actividad | GET con ?actividad_id=1 | 200 + array | ✅ |
| TC-PAR-04 | Validar APTO | POST /:id/validar-apto | 200 + estado actualizado | ✅ |
| TC-PAR-05 | Validar APTO inexistente | ID 9999 | 404 | ✅ |

### Módulo Certificados

| ID | Título | Entrada | Resultado Esperado | Estado |
|----|--------|---------|-------------------|:------:|
| TC-CER-01 | Generar certificados | POST con actividad_id | 200 + array códigos | ✅ |
| TC-CER-02 | Generar sin aptos | Sin participantes APTO | 422 | ✅ |
| TC-CER-03 | Ver PDF con token | Token de descarga válido | 200 + PDF | ✅ |
| TC-CER-04 | Ver PDF sin token | — | 401 | ✅ |
| TC-CER-05 | Revocar certificado | POST /:id/revocar (ADMIN) | 200 | ✅ |
| TC-CER-06 | Revocar no ADMIN | Token ADMINISTRATIVO | 403 | ✅ |

### Módulo Validación

| ID | Título | Entrada | Resultado Esperado | Estado |
|----|--------|---------|-------------------|:------:|
| TC-VAL-01 | Validar QR código existente EMITIDO | Código válido | 200 + datos certificado | ✅ |
| TC-VAL-02 | Validar QR código inexistente | Código aleatorio | 404 | ✅ |
| TC-VAL-03 | Validar QR código REVOCADO | Código revocado | 200 + estado=REVOCADO | ✅ |

---

## 3. Casos de Prueba — Frontend

| ID | Página | Prueba | Resultado Esperado | Estado |
|----|--------|--------|-------------------|:------:|
| TC-UI-01 | Login | Renderizar formulario | Campos y botón visibles | ✅ |
| TC-UI-02 | Login | Validar campos vacíos | Mensajes de error | ✅ |
| TC-UI-03 | Login | Envío correcto | Redirección a Dashboard | ✅ |
| TC-UI-04 | Dashboard | Renderizar gráficos | Barras + pastel visibles | ✅ |
| TC-UI-05 | Actividades | Crear y ver en tabla | Nueva fila aparece | ✅ |
| TC-UI-06 | Participantes | Validar APTO | Badge cambia a verde | ✅ |
| TC-UI-07 | Plantillas | Editor canvas | Campos arrastrables | ✅ |
| TC-UI-08 | Certificados | Generar certificados | Loading + éxito | ✅ |
| TC-UI-09 | Configuración | Subir logo | Preview se actualiza | ✅ |

---

## 4. Resumen de Resultados

| Tipo | Total | ✅ | ❌ | % Éxito |
|------|:----:|:--:|:--:|:-------:|
| Backend | 88 | 88 | 0 | 100% |
| Frontend | 29 | 29 | 0 | 100% |
| E2E | 6 | 2 | 4 | 33% |
| **Total** | **123** | **119** | **4** | **97%** |

Los 4 fallos E2E corresponden a problemas de entorno (falta de servidor backend en test E2E) y no a bugs reales del sistema.
