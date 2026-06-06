const REQUIRED_PLACEHOLDERS = [
  '{{NOMBRE_COMPLETO}}',
  '{{DOCUMENTO}}',
  '{{ACTIVIDAD_NOMBRE}}',
  '{{FECHA_EMISION}}',
  '{{CODIGO_UNICO}}',
  '{{QR}}',
  '{{LOGO_INSTITUCION}}',
  '{{NOMBRE_AUTORIDAD}}',
  '{{CARGO_AUTORIDAD}}',
  '{{FIRMA_AUTORIDAD}}'
];

function validatePlantillaContenido(contenido) {
  const text = String(contenido || '');
  for (const ph of REQUIRED_PLACEHOLDERS) {
    if (!text.includes(ph)) return { ok: false, message: `Falta placeholder obligatorio: ${ph}` };
  }
  return { ok: true };
}

module.exports = { validatePlantillaContenido, REQUIRED_PLACEHOLDERS };
