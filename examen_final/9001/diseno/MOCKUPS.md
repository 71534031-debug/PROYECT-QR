# Mockups — Diseño de Interfaz de Usuario

> A continuación se presentan los mockups de las pantallas principales del sistema.
> Los mockups fueron diseñados siguiendo la paleta CIP (rojo `#8B1A1A`, dorado `#C5954C`).

---

## 1. Login

```
┌──────────────────────────────────────────────────────┐
│                                                        │
│              ┌─────────────────────┐                    │
│              │   🔐                │                    │
│              │   Iniciar Sesión    │                    │
│              │                     │                    │
│              │   📧 Email          │                    │
│              │   [________________]│                    │
│              │                     │                    │
│              │   🔑 Contraseña     │                    │
│              │   [________________]│                    │
│              │                     │                    │
│              │   [ Iniciar Sesión ]│                    │
│              │                     │                    │
│              │   ¿Olvidaste tu     │                    │
│              │   contraseña?       │                    │
│              └─────────────────────┘                    │
│                                                        │
└──────────────────────────────────────────────────────┘
```

**Elementos:**
- Logo institucional (CIP) centrado
- Campo email con ícono
- Campo contraseña con toggle visibility
- Botón "Iniciar Sesión" (rojo #8B1A1A)
- Link "¿Olvidaste tu contraseña?"
- Animación fade-in con framer-motion

---

## 2. Dashboard

```
┌──────────────────────────────────────────────────────┐
│  📊 Dashboard                    👤 Admin             │
├──────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
│  │   12  │ │   5  │ │  450 │ │  380 │                 │
│  │Activ. │ │Plant.│ │Part. │ │Certif.│                 │
│  └──────┘ └──────┘ └──────┘ └──────┘                 │
│                                                        │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Actividades     │  │  Certificados   │              │
│  │  por Mes         │  │  por Estado     │              │
│  │  [Gráfico barras]│  │  [Gráfico pastel]│              │
│  └─────────────────┘  └─────────────────┘              │
│                                                        │
└──────────────────────────────────────────────────────┘
```

**Elementos:**
- 4 cards con indicadores (actividades, plantillas, participantes, certificados)
- Gráfico de barras (actividades por mes) con Recharts
- Gráfico de pastel (certificados por estado) con Recharts
- Badge de rol del usuario

---

## 3. Actividades

```
┌──────────────────────────────────────────────────────┐
│  📋 Actividades                         [+ Nueva]    │
├──────────────────────────────────────────────────────┤
│  🔍 [Buscar actividad...]                            │
│                                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │ Nombre     │ Fecha Ini │ Fecha Fin │ Tipo │ Acc. ││
│  ├──────────────────────────────────────────────────┤│
│  │ Capacit.   │ 01/06/2026│ 05/06/2026│ Taller│ ✏️🗑️ ││
│  │ Conferencia│ 15/05/2026│ 15/05/2026│ Charla│ ✏️🗑️ ││
│  └──────────────────────────────────────────────────┘│
│                                                       │
│                        « 1 2 3 »                      │
└──────────────────────────────────────────────────────┘
```

---

## 4. Participantes

```
┌──────────────────────────────────────────────────────┐
│  👥 Participantes                                     │
├──────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌───────────────────────────────┐  │
│  │ Nuevo Part.   │  │ Lista de Participantes        │  │
│  │               │  │ 🔍 [Buscar...]  [Filtro: ▼]  │  │
│  │ Actividad: [▼]│  │                               │  │
│  │ Nombres: [__] │  │ Nombres│Apellidos│Doc│Est│Acc │  │
│  │ Apellidos:[__]│  ├───────┼────────┼───┼───┼───┤  │
│  │ Documento:[__]│  │ Juan  │ Pérez  │...│ ✅│🔘 │  │
│  │ Email: [____] │  │ María │ López  │...│ ⏳│🔘 │  │
│  │               │  └───────────────────────────────┘  │
│  │ [Registrar]   │                                     │
│  └──────────────┘                                     │
└──────────────────────────────────────────────────────┘
```

---

## 5. Plantillas (Editor Canvas)

```
┌──────────────────────────────────────────────────────┐
│  🖼️ Editor de Plantilla: "Certificado CIP"           │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────┐  ┌────────────────────┐  │
│  │                        │  │  Propiedades        │  │
│  │  [   PREVIEW CANVAS   ]│  │                     │  │
│  │                        │  │  X: [120] Y: [80]  │  │
│  │   ┌─────────────────┐  │  │  Tamaño: [16px ▼] │  │
│  │   │  {{NOMBRE}}     │  │  │  Color: [■ #000]  │  │
│  │   └─────────────────┘  │  │  Alineación: [▼]  │  │
│  │                        │  │                     │  │
│  │   ┌─────────────────┐  │  │  [+ Agregar Campo] │  │
│  │   │  {{ACTIVIDAD}}  │  │  │                     │  │
│  │   └─────────────────┘  │  │  [💾 Guardar]       │  │
│  │                        │  └────────────────────┘  │
│  └────────────────────────┘                          │
│  📎 [Subir imagen de fondo]                          │
└──────────────────────────────────────────────────────┘
```

**Elementos:**
- Canvas tipo "lienzo" con vista previa A4 landscape
- Campos arrastrables (drag & drop) con {{placeholders}}
- Panel de propiedades para cada campo seleccionado
- Botón para subir imagen de fondo
- Botón guardar con feedback visual

---

## 6. Certificados

```
┌──────────────────────────────────────────────────────┐
│  📜 Certificados                                     │
├──────────────────────────────────────────────────────┤
│  [Actividad: ▼]  [Generar Certificados]              │
│  🔍 [Buscar...]  [Filtro: ▼]  [CSV] [Excel] [PDF]   │
│                                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │ ☐│Código│Participante│Doc│Estado│Emisión│Acciones││
│  ├──────────────────────────────────────────────────┤│
│  │ ☐│abc12.│Juan Pérez  │...│✅    │01/06  │👁️⬇️🔍 ││
│  │ ☐│def34.│María López │...│✅    │01/06  │👁️⬇️🔍 ││
│  └──────────────────────────────────────────────────┘│
│                                                       │
│  [Cancelar seleccionados]        « 1 2 3 »           │
└──────────────────────────────────────────────────────┘
```

---

## 7. Validación QR (Público)

```
┌──────────────────────────────────────────────────────┐
│                                                        │
│              ┌─────────────────────┐                    │
│              │     📷              │                    │
│              │    Validar          │                    │
│              │    Certificado      │                    │
│              │                     │                    │
│              │   🔍 Código único   │                    │
│              │   [________________]│                    │
│              │                     │                    │
│              │   [📷 Escanear QR]  │                    │
│              │   [✓ Validar]       │                    │
│              │                     │                    │
│              │   ┌─────────────────┐│                   │
│              │   │ ✅ CERTIFICADO   ││                   │
│              │   │ VÁLIDO          ││                   │
│              │   │ Juan Pérez      ││                   │
│              │   │ Capacitación    ││                   │
│              │   │ 01/06/2026      ││                   │
│              │   │ [📥 Descargar]  ││                   │
│              │   └─────────────────┘│                   │
│              └─────────────────────┘                    │
│                                                        │
└──────────────────────────────────────────────────────┘
```

---

## 8. Configuración

```
┌──────────────────────────────────────────────────────┐
│  ⚙️ Configuración                                     │
├──────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────────────────────┐│
│  │ General  │  │  Información General                ││
│  │          │  │                                     ││
│  │ Logo &   │  │  Institución: [________________]    ││
│  │ Firma    │  │  Autoridad:   [________________]    ││
│  │          │  │  Cargo:       [________________]    ││
│  │ QR       │  │  App:         [________________]    ││
│  │          │  │  Email:       [________________]    ││
│  │          │  │  Teléfono:    [________________]    ││
│  │          │  │  Dirección:   [________________]    ││
│  │          │  │                                     ││
│  │          │  │  [💾 Guardar Cambios]               ││
│  └──────────┘  └────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```
