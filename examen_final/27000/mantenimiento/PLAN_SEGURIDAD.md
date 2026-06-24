# Plan de Mantenimiento de Seguridad — ISO 27000

## 1. Objetivo
Establecer las actividades periódicas de mantenimiento de la seguridad del Sistema de Certificados QR.

## 2. Actividades Periódicas

| Actividad | Frecuencia | Responsable | Herramienta |
|-----------|:---------:|-------------|-------------|
| **Actualizar dependencias** | Mensual | DevOps | `npm audit fix` |
| **Revisar logs de seguridad** | Semanal | Administrador | Logs de BD |
| **Escanear vulnerabilidades** | Mensual | Desarrollador | npm audit, SonarQube |
| **Rotar JWT_SECRET** | Trimestral | DevOps | Variable de entorno |
| **Revisar usuarios activos** | Mensual | Administrador | Tabla usuarios |
| **Probar recuperación de BD** | Trimestral | DevOps | Backup + restore |
| **Revisar política de seguridad** | Anual | Analista | Documento |
| **Renovar SSL** | Anual | Automático (Vercel/Render) | — |

## 3. Monitoreo Continuo

### 3.1 Health Check
```
GET /api/health
Response: { status: "ok", timestamp: "..." }
```
- Ejecutado cada 5 minutos (UptimeRobot o similar)
- Alerta si 3 verificaciones consecutivas fallan

### 3.2 Logs de Auditoría
```sql
-- Ejemplo de consulta de auditoría
SELECT u.email, a.accion, a.detalle, a.created_at
FROM auditoria_eventos a
JOIN usuarios u ON a.usuario_id = u.id
WHERE a.created_at > NOW() - INTERVAL 7 DAY
ORDER BY a.created_at DESC;
```

### 3.3 Alertas
| Evento | Alerta |
|--------|--------|
| 5+ intentos de login fallidos en 1 minuto | Email al administrador |
| Caída del health check | Email al desarrollador |
| Error 500 consecutivo | Email al administrador |
| Uso de disco > 80% | Email al DevOps |

## 4. Plan de Recuperación ante Desastres

### 4.1 Tipos de Desastre

| Tipo | RTO (Recovery Time) | RPO (Recovery Point) |
|------|:------------------:|:-------------------:|
| Caída de servidor | < 4 horas | < 24 horas |
| Corrupción de BD | < 8 horas | < 1 hora |
| Brecha de seguridad | < 1 hora | < 5 minutos |
| Desastre de hosting | < 48 horas | < 24 horas |

### 4.2 Procedimiento de Recuperación

```
1. Detectar la falla (health check + alerta)
2. Notificar al equipo (email/Slack)
3. Evaluar el impacto (crítico/alto/medio/bajo)
4. Ejecutar acción correctiva:
   a. Caída de servidor: Reiniciar dyno en Render
   b. Corrupción de BD: Restaurar backup
   c. Brecha: Rotar secretos, invalidar tokens
   d. Desastre hosting: Desplegar en infraestructura alternativa
5. Verificar recuperación (health check + pruebas)
6. Documentar el incidente
```

## 5. Cumplimiento Normativo

| Norma/Ley | Relevancia | Estado |
|-----------|-----------|:------:|
| **ISO 27001** | Sistema de Gestión de Seguridad de la Información | Documentación base |
| **Ley de Protección de Datos Personales** | Datos de participantes | Análisis inicial |
| **RGPD (GDPR)** | Si aplica a ciudadanos europeos | No aplica actualmente |

## 6. Indicadores de Seguridad (KSIs)

| Indicador | Objetivo | Fórmula |
|-----------|:-------:|---------|
| Tiempo medio de detección (MTTD) | < 30 min | Tiempo hasta detectar incidente |
| Tiempo medio de respuesta (MTTR) | < 4h (alto) | Tiempo hasta resolver incidente |
| Vulnerabilidades críticas | 0 | Conteo en npm audit + SonarQube |
| Intentos de acceso no autorizado | < 5/semana | Conteo en logs |
| % de endpoints con autenticación | 100% | Endpoints protegidos / total |
| % de uptime del sistema | ≥ 99.5% | Health check exitosos / total |

## 7. Presupuesto de Seguridad (Estimado)

| Concepto | Costo estimado |
|----------|:-------------:|
| SSL/TLS (incluido en hosting) | $0 |
| npm audit (gratuito) | $0 |
| SonarQube (Community) | $0 |
| Monitoreo (UptimeRobot free) | $0 |
| **Total** | **$0/mes** |

Todo el stack de seguridad actual utiliza herramientas gratuitas o incluidas en los servicios de hosting.
