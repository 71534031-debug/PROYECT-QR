# Matriz de Doble Entrada Detallada

## Matriz: Módulos del Sistema vs Funcionalidades

| Módulo \ Funcionalidad | Crear | Leer | Editar | Eliminar | Buscar | Filtrar | Exportar | Importar | Validar | Generar PDF | Subir Imagen | Escanear QR |
|------------------------|:----:|:----:|:------:|:--------:|:------:|:-------:|:--------:|:--------:|:-------:|:-----------:|:------------:|:-----------:|
| **Auth** | — | — | Reset Pass | — | — | — | — | — | Login | — | — | — |
| **Actividades** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | — | — | — | — | — |
| **Participantes** | ✅ | ✅ | — | — | ✅ | ✅ | ✅ | ✅ CSV | APTO | — | — | — |
| **Plantillas** | ✅ | ✅ | ✅ | ✅ ADMIN | — | — | — | — | — | ✅ Vista previa | ✅ Fondo | — |
| **Certificados** | ✅ Generar | ✅ | — | — | ✅ | ✅ | ✅ | — | — | ✅ PDF | — | — |
| **Configuración** | — | ✅ | ✅ ADMIN | ✅ ADMIN | — | — | — | — | — | — | ✅ Logo/Firma | — |
| **Validación QR** | — | ✅ Público | — | — | ✅ | — | ✅ Descarga | — | ✅ Código | — | — | ✅ |

---

## Matriz: Roles vs Permisos CRUD

| Módulo | Crear | Leer | Editar | Eliminar | Acción Especial |
|--------|:----:|:----:|:------:|:--------:|:---------------:|
| **Auth** | Público | Privado | Usuario propio | — | Login, Refresh, Recuperación |
| **Actividades** | A + AV | A + AV | A + AV | — | Dashboard |
| **Participantes** | A + AV | A + AV | — | — | Validar APTO, Import CSV |
| **Plantillas** | A + AV | A + AV | A + AV | **Solo A** | Subir imagen, Config campos |
| **Certificados** | A + AV | A + AV | — | Cancelar: A + AV | Revocar: **Solo A** |
| **Configuración** | — | A + AV | **Solo A** | **Solo A** | Subir/Eliminar logo y firma |
| **Validación QR** | — | **Público** | — | — | Descarga pública con token |

*A = ADMIN, AV = ADMINISTRATIVO*

---

## Matriz: Endpoints vs Métodos HTTP

| Endpoint | GET | POST | PUT | DELETE |
|----------|:---:|:----:|:---:|:------:|
| `/api/health` | ✅ | — | — | — |
| `/api/auth/login` | — | ✅ | — | — |
| `/api/auth/refresh` | — | ✅ | — | — |
| `/api/auth/forgot-password` | — | ✅ | — | — |
| `/api/auth/reset-password` | — | ✅ | — | — |
| `/api/auth/logout` | — | ✅ | — | — |
| `/api/actividades` | ✅ | ✅ | ✅/:id | — |
| `/api/participantes` | ✅ | ✅ | — | — |
| `/api/participantes/importar` | — | ✅ | — | — |
| `/api/participantes/:id/validar-apto` | — | ✅ | — | — |
| `/api/plantillas` | ✅ | ✅ | ✅/:id | ✅/:id |
| `/api/plantillas/:id/campos` | ✅ | — | ✅ | — |
| `/api/plantillas/:id/imagen` | — | ✅ | — | — |
| `/api/configuracion` | ✅ | — | ✅ | — |
| `/api/configuracion/logo` | — | ✅ | — | ✅ |
| `/api/configuracion/firma` | — | ✅ | — | ✅ |
| `/api/certificados` | ✅ | — | — | — |
| `/api/certificados/generar` | — | ✅ | — | — |
| `/api/certificados/:id/ver` | ✅ | — | — | — |
| `/api/certificados/:id/descargar` | ✅ | — | — | — |
| `/api/certificados/:id/enlace-descarga` | — | ✅ | — | — |
| `/api/certificados/:id/revocar` | — | ✅ | — | — |
| `/api/validacion` | ✅ | — | — | — |
| `/api/validacion/qr/:codigo` | ✅ | — | — | — |
| `/api/entrega/descargar` | ✅ | — | — | — |

---

## Matriz: Base de Datos — Tablas vs Operaciones

| Tabla | INSERT | SELECT | UPDATE | DELETE | Llave primaria |
|-------|:------:|:------:|:------:|:------:|:--------------:|
| `usuarios` | Seed | Login, Perfil | Reset pass | — | id (INT) |
| `actividades` | Crear | Listar | Editar | — | id (INT) |
| `participantes` | Registrar | Listar | — | — | id (INT) |
| `actividad_participante` | Vincular | Listar | Validar | — | (actividad_id, participante_id) |
| `plantillas` | Crear | Listar | Editar | Eliminar | id (INT) |
| `plantilla_campos` | Guardar | Listar | Guardar | — | id (INT) |
| `certificados` | Generar | Listar, Ver | Revocar, Cancelar | — | id (INT) |
| `configuracion_institucional` | Inicializar | Ver | Editar | — | id=1 (fijo) |
| `auditoria_eventos` | Insertar | Consulta | — | — | id (INT) |
| `refresh_tokens` | Login | Refresh | — | Logout | id (INT) |
| `password_reset_tokens` | Forgot | Reset | — | Post-reset | id (INT) |

---

## Matriz: Pantallas Frontend vs Componentes UI

| Pantalla | Componentes shadcn/ui | Componentes personalizados | Estado de carga | Estado vacío |
|----------|----------------------|---------------------------|:---------------:|:------------:|
| Login | Button, Input, Card | — | Spinner | — |
| Dashboard | Card, Badge | Gráficos Recharts | Skeleton | Empty state |
| Actividades | Button, Input, Select, Badge | Modal CRUD | Skeleton filas | Empty SVG |
| Participantes | Button, Input, Select, Badge | Formulario lateral | Skeleton filas | Empty SVG |
| Plantillas | Button, Input, Select | Editor Canvas, DropZone | Spinner | Empty state |
| Certificados | Button, Input, Select, Badge | Modal preview PDF | Skeleton filas | Empty SVG |
| Configuración | Button, Input | DropZone, Tabs | Skeleton form | — |
| Validar QR | Button, Input | Escáner cámara | Loading spinner | Empty state |
