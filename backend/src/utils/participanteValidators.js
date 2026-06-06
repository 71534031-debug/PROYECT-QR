const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateDocumento(tipo, numero) {
  const n = String(numero || '').trim();
  if (tipo === 'DNI') {
    if (!/^\d{8}$/.test(n)) return { ok: false, message: 'DNI debe tener 8 dígitos' };
    return { ok: true };
  }
  if (tipo === 'CE') {
    if (!/^[A-Za-z0-9]{9,12}$/.test(n)) return { ok: false, message: 'CE inválido' };
    return { ok: true };
  }
  if (tipo === 'PASAPORTE' || tipo === 'OTRO') {
    if (n.length < 4 || n.length > 20) return { ok: false, message: 'Documento inválido' };
    return { ok: true };
  }
  return { ok: false, message: 'Tipo de documento inválido' };
}

function validateParticipantePayload(body) {
  const nombres = String(body?.nombres || '').trim();
  const apellidos = String(body?.apellidos || '').trim();
  const tipo = body?.tipo_documento;
  const numero = body?.numero_documento;
  const email = normalizeEmail(body?.email);
  const actividad_id = body?.actividad_id;

  if (nombres.length < 2 || nombres.length > 80) return { ok: false, message: 'Nombres inválidos' };
  if (apellidos.length < 2 || apellidos.length > 80) return { ok: false, message: 'Apellidos inválidos' };
  if (!['DNI', 'CE', 'PASAPORTE', 'OTRO'].includes(tipo)) return { ok: false, message: 'Tipo documento inválido' };
  const doc = validateDocumento(tipo, numero);
  if (!doc.ok) return doc;
  if (!EMAIL_RE.test(email) || email.length > 254) return { ok: false, message: 'Email inválido' };
  if (!actividad_id || Number.isNaN(Number(actividad_id))) return { ok: false, message: 'actividad_id inválido' };
  return { ok: true, normalized: { nombres, apellidos, tipo_documento: tipo, numero_documento: String(numero).trim(), email, actividad_id: Number(actividad_id) } };
}

module.exports = { normalizeEmail, validateDocumento, validateParticipantePayload };
