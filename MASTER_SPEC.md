# MASTER_SPEC

## 1) Que es el sistema
Sistema web para la **generacion y validacion segura de certificados digitales** del Colegio de Ingenieros del Peru - Consejo Departamental de Huancavelica (Area IEPI).  
Automatiza registro de actividades, carga de participantes, validacion previa, emision de certificados PDF con codigo unico y QR, almacenamiento, entrega y validacion publica en linea.

## 2) Actores y roles
- **Administrador**: configura parametros institucionales, gestiona plantillas y consulta historial.
- **Personal administrativo**: opera el flujo principal (actividades, participantes, validaciones, emision, entrega).
- **Participante**: descarga/recibe certificado y consulta validez.
- **Tercero verificador**: valida autenticidad por codigo unico o QR.

## 3) Modulos del sistema y proposito
1. **Autenticacion y acceso**
   - Inicio de sesion de usuarios internos y control por rol.
2. **Gestion de actividades**
   - Registro y edicion de actividades academicas/institucionales.
3. **Gestion de participantes**
   - Carga manual y masiva (Excel/CSV), asociacion por actividad y deteccion de duplicados.
4. **Validacion de datos**
   - Verificacion de campos obligatorios y observaciones antes de emitir.
5. **Gestion de plantillas**
   - Creacion, edicion, eliminacion y seleccion de plantillas de certificados.
6. **Configuracion institucional**
   - Parametros institucionales (nombre, logo, firma, cargo y autoridad).
7. **Generacion de certificados**
   - Emision automatica en PDF, codigo unico irrepetible y QR.
8. **Almacenamiento y trazabilidad**
   - Persistencia de certificados y metadatos, con fecha/hora de emision.
9. **Entrega**
   - Descarga del PDF y/o envio por correo.
10. **Validacion publica**
   - Verificacion en linea por codigo unico o QR.
11. **Historial y consultas**
   - Consulta de certificados emitidos con filtros.

## 4) Stack tecnologico definitivo
- **Frontend**: React `18.2.0`, Vite `5.2.0`
- **Backend**: Node.js `20.11.1`, Express `4.19.2`
- **Base de datos**: MySQL `8.0.36`
- **Despliegue**: Vercel (frontend), Render (backend)
- **Integraciones/librerias principales**: JWT, bcrypt, carga CSV/Excel, QR, PDF, correo SMTP
- **Arquitectura**: Cliente-Servidor en capas (N-tier), backend monolitico modular

## 5) Restricciones importantes
- Uso obligatorio de React + Node.js/Express + MySQL.
- Sistema 100% web (sin modo offline).
- Sin microservicios en esta version.
- Uso obligatorio de HTTPS en produccion.
- Validaciones criticas en backend (no confiar solo en frontend).
- Tiempo de respuesta objetivo: hasta 3 segundos en condiciones normales.
- Disponibilidad minima del modulo de validacion publica: 95% mensual.
- Soporte de emision masiva: al menos 100 certificados por lote.
- No subir `.env` al repositorio.
- Integraciones con Moodle/WordPress: fuera del alcance actual ([PENDIENTE] para fases futuras).

## 6) Decisiones técnicas (antes pendientes)
Cerrados en `DECISIONES_TECNICAS.md` e implementación en `backend/` + `frontend/`. El seguimiento de módulos y pruebas está en `PROGRESS.md`.

## 7) Referencias documentales
Este documento se construye con base en:
- `DOCUMENTOS/Documento de requerimientos de software.docx`
- `DOCUMENTOS/Formato 06 Requerimientos funcionales.docx`
- `DOCUMENTOS/Formato 07 Requerimientos no funcionales.docx`
- `DOCUMENTOS/Formato 08 Diagrama de casos de uso.docx`
- `DOCUMENTOS/Formato 09 Alcance del proyecto software.docx`
- `DOCUMENTOS/Formato 11 Arquitectura del sistema.docx`
- `DOCUMENTOS/REGLAS DE NEGOCIO.docx`
- `DOCUMENTOS/MODELO DE DATOS.docx`
- `DOCUMENTOS/API_SPEC.docx`
- `DOCUMENTOS/USER FLOWS.docx`
- `DOCUMENTOS/STACK.docx`
- `DOCUMENTOS/SETUP.docx`
- `DOCUMENTOS/Flujo CI_CD.docx`

## 8) Relacion con documentos de especificacion operativa
- `STACK.md`: stack, versiones, estructura de carpetas y comandos base.
- `CRITERIOS_ACEPTACION.md`: criterios BDD para RF-01 a RF-12.
