const {
  normalizeEmail,
  validateDocumento,
  validateParticipantePayload
} = require('../participanteValidators');

describe('participanteValidators', () => {
  describe('normalizeEmail', () => {
    it('trim y minúsculas', () => {
      expect(normalizeEmail('  Test@MAIL.COM ')).toBe('test@mail.com');
    });
  });

  describe('validateDocumento', () => {
    it('DNI válido 8 dígitos', () => {
      expect(validateDocumento('DNI', '12345678')).toEqual({ ok: true });
    });
    it('DNI inválido', () => {
      expect(validateDocumento('DNI', '1234567')).toMatchObject({ ok: false });
    });
    it('CE alfanum 9-12', () => {
      expect(validateDocumento('CE', 'ABC123456')).toEqual({ ok: true });
    });
  });

  describe('validateParticipantePayload', () => {
    it('payload mínimo válido', () => {
      const r = validateParticipantePayload({
        nombres: 'Juan',
        apellidos: 'Pérez',
        tipo_documento: 'DNI',
        numero_documento: '12345678',
        email: 'a@b.co',
        actividad_id: 1
      });
      expect(r.ok).toBe(true);
    });
    it('nombres cortos fallan', () => {
      const r = validateParticipantePayload({
        nombres: 'J',
        apellidos: 'Pérez',
        tipo_documento: 'DNI',
        numero_documento: '12345678',
        email: 'a@b.co',
        actividad_id: 1
      });
      expect(r.ok).toBe(false);
    });
  });
});
