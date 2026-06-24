# Test-Driven Development (TDD) — Sistema de Certificados QR

## 1. Ciclo TDD Aplicado

Para cada funcionalidad se siguió el ciclo **Red-Green-Refactor**:

```
┌─────────────────────────────────────────────────────┐
│  1. RED: Escribir prueba que falla                  │
│     └─ Define el comportamiento esperado             │
│                                                      │
│  2. GREEN: Escribir código mínimo que pasa la prueba │
│     └─ Implementa la funcionalidad                   │
│                                                      │
│  3. REFACTOR: Mejorar código sin cambiar comportamiento│
│     └─ Optimizar, limpiar, documentar                │
└─────────────────────────────────────────────────────┘
```

## 2. Estadísticas de Pruebas

| Suite | Pruebas | Estado | Cobertura |
|-------|---------|--------|-----------|
| Backend (Jest + Supertest) | 88 | ✅ Pasando | ~75% |
| Frontend (Jest + Testing Library) | 29 | ✅ Pasando | ~69% |
| E2E (Cypress) | 6 | ⚠️ 4 fallos preexistentes | — |

## 3. Backend — Pruebas por Módulo

| Módulo | Archivo de prueba | Pruebas | Funcionalidad probada |
|--------|-------------------|---------|----------------------|
| Health | `health.test.js` | 2 | GET /api/health |
| Auth | `auth.test.js` | 12 | Login, refresh, forgot/reset password, roles |
| Actividades | `actividades.routes.test.js` | 8 | CRUD actividades |
| Participantes | `participantes.routes.test.js` | 10 | CRUD, validación APTO |
| Plantillas | `plantillas.routes.test.js` | 11 | CRUD, upload imagen |
| Plantillas Campos | `plantillas.campos.routes.test.js` | 5 | CRUD campos dinámicos |
| Configuración | `config.routes.test.js` | 6 | GET/PUT configuración |
| Certificados | `certificados.routes.test.js` | 14 | Generar, ver, descargar, revocar |
| Entrega | `entrega.routes.test.js` | 6 | Descarga pública con token |
| Validación | `validacion.test.js` | 8 | Validación por código QR |
| PDF | `certificatePdf.test.js` | 6 | Generación PDF con/sin imagen |

## 4. Frontend — Pruebas por Página

| Página | Archivo de prueba | Pruebas | Funcionalidad probada |
|--------|-------------------|---------|----------------------|
| Login | `Login.test.jsx` | 4 | Formulario, validación, envío |
| ForgotPassword | `ForgotPassword.test.jsx` | 2 | Formulario, validación |
| ResetPassword | `ResetPassword.test.jsx` | 2 | Formulario, validación |
| Dashboard | `Dashboard.test.jsx` | 4 | Gráficos, estadísticas |
| Actividades | `Actividades.test.jsx` | 3 | CRUD, búsqueda |
| Participantes | `Participantes.test.jsx` | 3 | CRUD, validación APTO |
| Plantillas | `Plantillas.test.jsx` | 5 | Editor canvas, upload imagen |
| Certificados | `Certificados.test.jsx` | 3 | Listar, generar, descargar |
| Configuración | `Configuracion.test.jsx` | 3 | Formulario, upload logo/firma |

## 5. Ejemplo de Prueba TDD — Backend

**RED — Prueba que falla:**
```javascript
describe('POST /api/participantes/:id/validar-apto', () => {
  it('should mark participant as APTO', async () => {
    const res = await request(app)
      .post(`/api/participantes/${participanteId}/validar-apto`)
      .set('Authorization', `Bearer ${token}`)
      .send({ actividad_id: 1 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

**GREEN — Implementación mínima:**
```javascript
router.post('/:id/validar-apto', authenticate, requireRoles('ADMIN', 'ADMINISTRATIVO'), async (req, res) => {
    const { actividad_id } = req.body;
    await pool.query(
        "UPDATE actividad_participante SET estado_validacion = 'APTO' WHERE participante_id = ? AND actividad_id = ?",
        [req.params.id, actividad_id]
    );
    return res.json({ success: true });
});
```

**REFACTOR — Agregar validaciones:**
```javascript
// Se agregó verificación de existencia del participante
// Se agregó registro en auditoria_eventos
```

## 6. Comandos para Ejecutar Pruebas

```bash
# Backend (88 tests)
cd backend && npm test

# Frontend (29 tests + cobertura)
cd frontend && npm run test:coverage

# E2E (requiere backend + frontend corriendo)
cd frontend && npm run test:e2e
```
