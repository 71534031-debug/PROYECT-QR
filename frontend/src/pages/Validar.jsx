import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function Validar() {
  const [params] = useSearchParams();
  const [resultado, setResultado] = useState(null);
  const codigo = params.get('c') || '';

  useEffect(() => {
    if (!codigo) return;
    (async () => {
      try {
        const { data } = await api.get('/api/validacion', { params: { codigo_unico: codigo } });
        setResultado(data);
      } catch (err) {
        const body = err.response?.data;
        if (body && typeof body === 'object') setResultado(body);
        else setResultado({ valido: false, message: 'Error de validación' });
      }
    })();
  }, [codigo]);

  if (!codigo) return <p>Ingrese código en la URL (?c=)</p>;
  if (!resultado) return <p data-testid="validar-loading">Validando…</p>;

  return (
    <div data-testid="validar-resultado" style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Validación</h1>
      <p data-testid="validar-estado">{resultado.valido ? 'Válido' : 'Inválido'}</p>
      {resultado.data && (
        <pre data-testid="validar-datos">{JSON.stringify(resultado.data, null, 2)}</pre>
      )}
    </div>
  );
}
