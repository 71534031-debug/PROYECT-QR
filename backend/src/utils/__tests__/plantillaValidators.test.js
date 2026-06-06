const { validatePlantillaContenido, REQUIRED_PLACEHOLDERS } = require('../plantillaValidators');

describe('plantillaValidators', () => {
  it('falla si falta un placeholder', () => {
    const html = REQUIRED_PLACEHOLDERS.filter((p) => p !== '{{QR}}').join(' ');
    const r = validatePlantillaContenido(html);
    expect(r.ok).toBe(false);
  });

  it('pasa con todos los placeholders', () => {
    const html = REQUIRED_PLACEHOLDERS.join(' ');
    const r = validatePlantillaContenido(html);
    expect(r.ok).toBe(true);
  });
});
