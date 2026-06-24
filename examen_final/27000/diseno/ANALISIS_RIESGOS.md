# Análisis de Riesgos de Seguridad — ISO 27000

## 1. Metodología
Evaluación cualitativa de riesgos usando la matriz **Probabilidad × Impacto**.

**Escala:**
- Probabilidad: Baja (1), Media (2), Alta (3)
- Impacto: Bajo (1), Medio (2), Alto (3)
- **Riesgo = P × I**: ≤ 2 = Bajo, 3-4 = Medio, 6-9 = Alto

---

## 2. Matriz de Riesgos

| # | Riesgo | Descripción | Prob. | Impacto | Riesgo | Mitigación |
|---|--------|-------------|:----:|:-------:|:-----:|-----------|
| R1 | **Acceso no autorizado** | Usuario malicioso obtiene credenciales de ADMIN | 2 | 3 | **6 (Alto)** | JWT con expiración corta, bcrypt, monitoreo de logs |
| R2 | **Inyección SQL** | Ataque SQLi a endpoints sin prepared statements | 1 | 3 | **3 (Medio)** | Uso de parámetros ? en todas las consultas MySQL2 |
| R3 | **XSS (Cross-Site Scripting)** | Inyección de scripts maliciosos en formularios | 1 | 2 | **2 (Bajo)** | Validación server-side, escape de outputs |
| R4 | **Fuga de datos personales** | Exposición de nombres, documentos, emails | 2 | 3 | **6 (Alto)** | HTTPS, tokens de descarga con expiración, minimización de datos |
| R5 | **Subida de archivo malicioso** | Usuario sube script en vez de imagen | 1 | 3 | **3 (Medio)** | Validación MIME type, límite de tamaño 5MB |
| R6 | **Ataque de fuerza bruta** | Intentos repetidos de login | 2 | 2 | **4 (Medio)** | Rate limiting recomendado |
| R7 | **Caída de base de datos** | BD externa no disponible | 2 | 3 | **6 (Alto)** | Pool con reconexión, health check |
| R8 | **Fallo en generación de PDF** | Error al generar certificado | 2 | 2 | **4 (Medio)** | try/catch, logging, validación previa |
| R9 | **Intercepción de tráfico** | Datos en tránsito expuestos | 1 | 3 | **3 (Medio)** | HTTPS obligatorio en producción |
| R10 | **Token JWT comprometido** | Robo de token de sesión | 1 | 3 | **3 (Medio)** | Expiración corta, rotación de refresh token |
| R11 | **Suplantación de certificado** | QR falso que dirige a sitio malicioso | 1 | 3 | **3 (Medio)** | Código único UUID, validación server-side |
| R12 | **Pérdida de datos** | Sin backup, desastre en hosting | 1 | 3 | **3 (Medio)** | Backup diario automático (Neon) |

---

## 3. Mapa de Calor de Riesgos

```
Impacto →
         Bajo (1)    Medio (2)    Alto (3)
Prob ↓
Alta (3)     —            —           —
Media (2)    —         R6, R8       R1, R4, R7
Baja (1)    R3       R2, R5, R9,   R10, R11, R12
```

---

## 4. Controles Implementados

| Control | Riesgos cubiertos | Estado |
|---------|------------------|:------:|
| Prepared statements (MySQL2) | R2 | ✅ |
| JWT con expiración | R1, R10 | ✅ |
| bcrypt para contraseñas | R1 | ✅ |
| Validación MIME en uploads | R5 | ✅ |
| HTTPS (Vercel + Render) | R9 | ✅ |
| CORS configurado | R1 | ✅ |
| Manejo de errores global | R8 | ✅ |
| Tokens de descarga con expiración | R4 | ✅ |
| Pool de conexiones | R7 | ✅ |
| Health check endpoint | R7 | ✅ |

---

## 5. Controles Pendientes

| Control | Prioridad | Esfuerzo estimado |
|---------|:---------:|:-----------------:|
| Rate limiting (express-rate-limit) | Alta | 1h |
| Helmet para headers de seguridad | Alta | 30min |
| Auditoría de intentos de login fallidos | Alta | 2h |
| Logs centralizados (Winston/Morgan a archivo) | Media | 2h |
| Pruebas de penetración periódicas | Media | 4h |
| 2FA (Two-Factor Authentication) | Baja | 8h |

---

## 6. Evaluación de Riesgo Residual

| Riesgo | Riesgo inicial | Controles | Riesgo residual | Aceptable |
|--------|:-------------:|:---------:|:---------------:|:---------:|
| R1 | 6 (Alto) | JWT, bcrypt, roles | 2 (Bajo) | ✅ Sí |
| R2 | 3 (Medio) | Prepared statements | 1 (Bajo) | ✅ Sí |
| R4 | 6 (Alto) | HTTPS, tokens expiración | 2 (Bajo) | ✅ Sí |
| R7 | 6 (Alto) | Pool, health check | 3 (Medio) | ⚠️ Parcial |
| R8 | 4 (Medio) | try/catch, logging | 2 (Bajo) | ✅ Sí |

**Riesgo residual general: BAJO** — Aceptable para el contexto institucional del sistema.
