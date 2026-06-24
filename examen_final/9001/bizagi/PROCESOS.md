# Diagramas BPMN — Procesos del Sistema (ISO 9001)

> Los diagramas BPMN fueron diseñados en Bizagi Modeler.
> A continuación se describen los macroprocesos, procesos y subprocesos.

---

## Macroproceso 1: Gestión de Autenticación y Seguridad

**Objetivo:** Controlar el acceso al sistema mediante autenticación JWT.

```
[Inicio] → Login → ¿Credenciales válidas? 
  ├── Sí → Generar JWT → [Dashboard]
  └── No → ¿Intentos < 3? 
       ├── Sí → Reintentar 
       └── No → Bloquear cuenta → Notificar ADMIN
```

**Actores:** ADMIN, ADMINISTRATIVO, Público  
**Evento de inicio:** Usuario solicita acceso  
**Evento de fin:** Acceso concedido/denegado  
**Reglas de negocio:**
- Máximo 3 intentos de login fallidos
- Token JWT expira en 24h
- Refresh token permite renovar sesión

---

## Macroproceso 2: Gestión de Actividades

**Objetivo:** Administrar actividades académicas/institucionales.

```
[Inicio] → Crear actividad → Validar datos → ¿Datos válidos?
  ├── Sí → Guardar en DB → [Fin]
  └── No → Mostrar error → Corregir datos
```

**Actores:** ADMIN, ADMINISTRATIVO  
**Entradas:** Nombre, fechas, tipo de actividad  
**Salidas:** Registro en tabla `actividades`

---

## Macroproceso 3: Gestión de Participantes

**Objetivo:** Registrar y validar participantes vinculados a actividades.

```
[Inicio] → Seleccionar actividad → Registrar participante
  → Validar datos → ¿Datos válidos?
    ├── Sí → ¿Importación CSV?
    │    ├── Sí → Parsear CSV → Validar filas → Insertar batch
    │    └── No → Insertar individual
    └── No → Mostrar error
  → Validar aptitud → Marcar APTO/NO APTO → [Fin]
```

**Actores:** ADMIN, ADMINISTRATIVO  
**Entradas:** Nombres, documento, email, actividad  
**Salidas:** Registro en `participantes` + `actividad_participante`

---

## Macroproceso 4: Gestión de Plantillas

**Objetivo:** Diseñar plantillas de certificados con editor visual.

```
[Inicio] → Crear plantilla → Configurar contenido HTML
  → ¿Usa imagen de fondo?
    ├── Sí → Subir imagen → Configurar campos (drag & drop)
    └── No → Usar plantilla texto
  → Guardar → [Fin]
```

**Actores:** ADMIN, ADMINISTRATIVO  
**Entradas:** Nombre, contenido HTML, imagen, coordenadas de campos  
**Salidas:** Registro en `plantillas` + `plantilla_campos` + archivo imagen

---

## Macroproceso 5: Gestión de Certificados

**Objetivo:** Generar, emitir y revocar certificados digitales.

```
[Inicio] → Seleccionar actividad + plantilla
  → Buscar participantes APTOs
  → ¿Hay participantes? → Sí → Generar PDFs (batch)
    → Insertar en DB (transacción)
    → ¿Éxito?
      ├── Sí → Commit → [Certificados EMITIDOS]
      └── No → Rollback → Mostrar error
```

**Actores:** ADMIN, ADMINISTRATIVO  
**Entradas:** actividad_id, plantilla_id  
**Salidas:** PDFs en `uploads/certificados/` + registros en `certificados`  
**Reglas de negocio:**
- No se pueden duplicar certificados para un mismo participante+actividad
- Solo participantes con estado APTO generan certificados
- La revocación es exclusiva de ADMIN

---

## Macroproceso 6: Validación y Entrega

**Objetivo:** Validar autenticidad de certificados vía QR y permitir descarga.

```
[Inicio] → Ingresar código QR (escáner o manual)
  → Buscar en DB → ¿Certificado existe?
    ├── Sí → ¿Estado EMITIDO?
    │    ├── Sí → Mostrar datos del certificado
    │    └── No → Mostrar estado (REVOCADO, etc.)
    └── No → Mostrar "No encontrado"
  → ¿Descargar? → Generar enlace temporal (48h) → [Fin]
```

**Actores:** Público (sin autenticación)  
**Entradas:** Código único UUID (desde QR o manual)  
**Salidas:** Datos del certificado en pantalla + PDF descargable  
**Seguridad:** Token JWT de descarga expira en 48h

---

## Macroproceso 7: Auditoría y Trazabilidad

**Objetivo:** Registrar todas las acciones críticas del sistema.

```
[Inicio] → Acción de usuario (crítica)
  → Insertar en auditoria_eventos
  → [Fin]
```

**Eventos auditados:**
- `CERTIFICADOS_GENERADOS` — Generación masiva
- `CERTIFICADO_DESCARGA` — Descarga individual
- `CERTIFICADO_REVOCADO` — Revocación
- `CONFIG_ACTUALIZADA` — Cambio de configuración
- `LOGO_ACTUALIZADO` / `LOGO_ELIMINADO`
- `FIRMA_ACTUALIZADA` / `FIRMA_ELIMINADA`

---

## Archivos Bizagi (.bpmn)

Los archivos `.bpmn` generados en Bizagi Modeler se encuentran en esta carpeta:

| Archivo | Proceso |
|---------|---------|
| `MP01_Autenticacion.bpmn` | Gestión de autenticación y seguridad |
| `MP02_Actividades.bpmn` | Gestión de actividades |
| `MP03_Participantes.bpmn` | Gestión de participantes |
| `MP04_Plantillas.bpmn` | Gestión de plantillas |
| `MP05_Certificados.bpmn` | Gestión de certificados |
| `MP06_Validacion.bpmn` | Validación y entrega |
| `MP07_Auditoria.bpmn` | Auditoría y trazabilidad |
