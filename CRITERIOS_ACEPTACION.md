# CRITERIOS_ACEPTACION

Documento de criterios de aceptacion en formato BDD para los requerimientos funcionales `RF-01` a `RF-12`.

## RF-01 - Autenticar usuarios internos
### Escenario feliz
**Dado** que existe un usuario interno activo (Administrador o Personal administrativo) con credenciales validas  
**Cuando** ingresa correo/usuario y contrasena correctos en inicio de sesion  
**Entonces** el sistema autentica, registra fecha/hora de acceso y habilita modulos segun su rol

### Escenario de error
**Dado** que el usuario ingresa credenciales incorrectas o no activas  
**Cuando** intenta iniciar sesion  
**Entonces** el sistema deniega el acceso, muestra mensaje de autenticacion fallida y restringe modulos internos

## RF-02 - Registrar actividad academica
### Escenario feliz
**Dado** que el personal administrativo esta autenticado  
**Cuando** registra una actividad con nombre, tipo, fecha, descripcion y responsable completos  
**Entonces** el sistema guarda la actividad y la deja disponible para asociar participantes

### Escenario de error
**Dado** que faltan campos obligatorios o la actividad duplica nombre/fechas clave  
**Cuando** intenta guardar el registro  
**Entonces** el sistema muestra observaciones de validacion y no crea la actividad

## RF-03 - Cargar participantes
### Escenario feliz
**Dado** que existe una actividad registrada  
**Cuando** el usuario carga participantes de forma manual o mediante archivo Excel/CSV valido  
**Entonces** el sistema registra participantes y los asocia a la actividad seleccionada

### Escenario de error
**Dado** que la carga contiene formato invalido, datos incompletos o duplicados en la misma actividad  
**Cuando** se procesa la carga  
**Entonces** el sistema marca observaciones, bloquea registros incorrectos y reporta errores de importacion

## RF-04 - Validar datos de participantes
### Escenario feliz
**Dado** que los registros tienen nombres, apellidos, documento, correo y actividad asociada  
**Cuando** el sistema ejecuta la validacion previa a emision  
**Entonces** marca al participante como apto para certificacion

### Escenario de error
**Dado** que existen datos incompletos o inconsistentes  
**Cuando** se ejecuta la validacion  
**Entonces** el sistema marca observaciones y bloquea esos registros para emision

## RF-05 - Gestionar plantillas de certificados
### Escenario feliz
**Dado** que el usuario autorizado accede al modulo de plantillas  
**Cuando** crea o edita una plantilla activa con contenido institucional valido  
**Entonces** el sistema guarda la plantilla y permite seleccionarla en la emision

### Escenario de error
**Dado** que la plantilla no cumple estructura minima requerida ([PENDIENTE: estructura exacta])  
**Cuando** intenta guardarla o usarla  
**Entonces** el sistema rechaza la operacion y muestra error de validacion de plantilla

## RF-06 - Generar certificado digital PDF
### Escenario feliz
**Dado** que hay participantes aptos y plantilla seleccionada  
**Cuando** se inicia la generacion de certificados  
**Entonces** el sistema crea un PDF por participante con datos institucionales y de actividad

### Escenario de error
**Dado** que hay errores de validacion pendientes o no existe plantilla activa  
**Cuando** se intenta generar certificados  
**Entonces** el sistema bloquea la emision y devuelve mensaje de error

## RF-07 - Generar codigo unico y QR
### Escenario feliz
**Dado** que se genera un certificado valido  
**Cuando** el sistema registra la emision  
**Entonces** asigna un codigo unico irrepetible y genera el QR asociado a validacion

### Escenario de error
**Dado** que falla la generacion del codigo unico o del QR  
**Cuando** se procesa la emision  
**Entonces** el sistema detiene la generacion y no publica un certificado incompleto

## RF-08 - Almacenar certificados emitidos
### Escenario feliz
**Dado** que el certificado fue generado correctamente  
**Cuando** el sistema persiste PDF y metadatos  
**Entonces** queda almacenado con trazabilidad (incluye fecha/hora de emision)

### Escenario de error
**Dado** que ocurre fallo de persistencia en base de datos o almacenamiento  
**Cuando** el sistema intenta registrar el certificado  
**Entonces** informa error critico y no marca la emision como completada

## RF-09 - Enviar o habilitar descarga del certificado
### Escenario feliz
**Dado** que el certificado existe y esta almacenado  
**Cuando** se ejecuta la entrega por correo o descarga desde la plataforma  
**Entonces** el participante recibe/accede al PDF emitido

### Escenario de error
**Dado** que el certificado no existe, no esta disponible o falla el envio  
**Cuando** el usuario intenta descargar/recibir el certificado  
**Entonces** el sistema bloquea la entrega y muestra mensaje de indisponibilidad

## RF-10 - Validar certificado en linea
### Escenario feliz
**Dado** que el participante o tercero ingresa codigo unico valido o escanea QR valido  
**Cuando** el sistema consulta el registro oficial  
**Entonces** muestra estado valido y datos basicos del certificado

### Escenario de error
**Dado** que el codigo no existe o no corresponde a un certificado registrado  
**Cuando** se ejecuta la validacion  
**Entonces** el sistema muestra certificado invalido/no encontrado y no expone validacion positiva

## RF-11 - Consultar historial de certificados
### Escenario feliz
**Dado** que existen certificados emitidos  
**Cuando** el usuario interno aplica filtros (actividad y/o participante)  
**Entonces** el sistema muestra el historial correspondiente

### Escenario de error
**Dado** que la consulta no tiene coincidencias o contiene filtros invalidos  
**Cuando** se ejecuta la busqueda  
**Entonces** el sistema retorna lista vacia o mensaje informativo sin fallar

## RF-12 - Configurar datos institucionales
### Escenario feliz
**Dado** que el administrador accede a configuracion institucional  
**Cuando** actualiza nombre, logo, firma, cargo y autoridad con datos validos  
**Entonces** el sistema guarda los parametros y los aplica en nuevas emisiones

### Escenario de error
**Dado** que los datos son invalidos o incompletos para configuracion institucional  
**Cuando** se intenta guardar  
**Entonces** el sistema rechaza cambios y mantiene la configuracion vigente
