const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = 'https://proyect-qr-backend.onrender.com/api';

function api(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const u = new URL(BASE + urlPath);
    const opts = {
      hostname: u.hostname, port: u.port, path: u.pathname + u.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);

    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, body: { raw: body } }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  console.log('=== SEEDING PRODUCTION DATABASE ===\n');

  // Login
  const login = await api('POST', '/auth/login', { email: 'admin@cip.local', password: 'Password123' });
  if (!login.body.success) { console.error('LOGIN FAILED:', login.body); process.exit(1); }
  const token = login.body.token;
  console.log('✓ Login exitoso');
  console.log(`  Usuario: ${login.body.user?.nombre || 'admin'}`);

  let actIds = [];

  // 1. Crear actividades
  console.log('\n--- Creando actividades ---');
  const actividades = [
    { nombre: 'Curso de Gestión de Proyectos TI', tipo: 'Curso', descripcion: 'Gestión ágil de proyectos con Scrum', fecha_inicio: '2026-03-01', fecha_fin: '2026-03-30', responsable: 'Decano Nacional' },
    { nombre: 'Taller de Ética Profesional 2026', tipo: 'Taller', descripcion: 'Ética en la ingeniería', fecha_inicio: '2026-04-10', fecha_fin: '2026-04-12', responsable: 'Director Académico' },
    { nombre: 'Conferencia de Actualización 2026', tipo: 'Conferencia', descripcion: 'Nuevas tecnologías en ingeniería', fecha_inicio: '2026-05-15', fecha_fin: '2026-05-15', responsable: 'Comité Organizador' },
    { nombre: 'Seminario de Seguridad Estructural', tipo: 'Seminario', descripcion: 'Normas de seguridad en construcciones', fecha_inicio: '2026-06-20', fecha_fin: '2026-06-22', responsable: 'Jefe de Capítulo' },
    { nombre: 'Diplomado en Gestión Pública', tipo: 'Diplomado', descripcion: 'Formación en gestión pública', fecha_inicio: '2026-07-05', fecha_fin: '2026-09-30', responsable: 'Director de Capacitación' },
    { nombre: 'Taller de Liderazgo Organizacional', tipo: 'Taller', descripcion: 'Habilidades directivas', fecha_inicio: '2026-08-01', fecha_fin: '2026-08-03', responsable: 'Gerente General' },
    { nombre: 'Capacitación en Ética Profesional 2026', tipo: 'Curso', descripcion: 'Capacitación obligatoria en ética', fecha_inicio: '2026-02-01', fecha_fin: '2026-02-28', responsable: 'Comité de Ética' },
    { nombre: 'Conferencia de Actualización 2026-II', tipo: 'Conferencia', descripcion: 'Tendencias tecnológicas', fecha_inicio: '2026-09-10', fecha_fin: '2026-09-10', responsable: 'Comité Organizador' },
  ];

  for (const a of actividades) {
    const r = await api('POST', '/actividades', a, token);
    if (r.body.success) {
      actIds.push(r.body.data.id);
      console.log(`  ✓ ${a.nombre} (ID ${r.body.data.id})`);
    } else {
      console.log(`  ✗ ${a.nombre}: ${r.body.message}`);
    }
    await wait(300);
  }
  console.log(`  Total: ${actIds.length} actividades`);

  // 2. Crear participantes
  console.log('\n--- Creando participantes ---');
  const participantes = [
    { actividad_idx: 0, nombres: 'Jorge Lennon', apellidos: 'Anccasi Espinoza', tipo_documento: 'DNI', numero_documento: '71534031', email: 'jorge.anccasi@email.com' },
    { actividad_idx: 0, nombres: 'María Fernanda', apellidos: 'Torres Quispe', tipo_documento: 'DNI', numero_documento: '45678901', email: 'maria.torres@email.com' },
    { actividad_idx: 0, nombres: 'Carlos Alberto', apellidos: 'Ramos Huanca', tipo_documento: 'DNI', numero_documento: '32145678', email: 'carlos.ramos@email.com' },
    { actividad_idx: 0, nombres: 'Ana Lucía', apellidos: 'Mendoza Ccori', tipo_documento: 'CE', numero_documento: 'CE00234567', email: 'ana.mendoza@email.com' },
    { actividad_idx: 0, nombres: 'Luis Miguel', apellidos: 'Palomino Vega', tipo_documento: 'DNI', numero_documento: '67890123', email: 'luis.palomino@email.com' },
    { actividad_idx: 0, nombres: 'Rosa Elena', apellidos: 'García Paredes', tipo_documento: 'DNI', numero_documento: '23456789', email: 'rosa.garcia@email.com' },
    { actividad_idx: 1, nombres: 'Pedro Andrés', apellidos: 'Torres Vega', tipo_documento: 'DNI', numero_documento: '99887766', email: 'pedro.torres@email.com' },
    { actividad_idx: 1, nombres: 'Lucía Milagros', apellidos: 'Cárdenas Ruiz', tipo_documento: 'CE', numero_documento: 'CE00345678', email: 'lucia.cardenas@email.com' },
    { actividad_idx: 1, nombres: 'Diego Armando', apellidos: 'Quispe Huamán', tipo_documento: 'DNI', numero_documento: '11223344', email: 'diego.quispe@email.com' },
    { actividad_idx: 1, nombres: 'Carmen Rosa', apellidos: 'Delgado Pacheco', tipo_documento: 'DNI', numero_documento: '55667788', email: 'carmen.delgado@email.com' },
    { actividad_idx: 1, nombres: 'Alberto José', apellidos: 'Fernández López', tipo_documento: 'PASAPORTE', numero_documento: 'P12345678', email: 'alberto.fernandez@email.com' },
    { actividad_idx: 2, nombres: 'Ana Sofía', apellidos: 'Martínez Ríos', tipo_documento: 'DNI', numero_documento: '11223344', email: 'ana.martinez@email.com' },
    { actividad_idx: 2, nombres: 'Javier Eduardo', apellidos: 'Salazar Castro', tipo_documento: 'DNI', numero_documento: '33445566', email: 'javier.salazar@email.com' },
    { actividad_idx: 2, nombres: 'Patricia Beatriz', apellidos: 'Huamán Quispe', tipo_documento: 'DNI', numero_documento: '77889900', email: 'patricia.huaman@email.com' },
    { actividad_idx: 2, nombres: 'Gustavo Adolfo', apellidos: 'Reyes Pantoja', tipo_documento: 'CE', numero_documento: 'CE00456789', email: 'gustavo.reyes@email.com' },
    { actividad_idx: 2, nombres: 'Silvia Marina', apellidos: 'Córdova Sánchez', tipo_documento: 'DNI', numero_documento: '99001122', email: 'silvia.cordova@email.com' },
    { actividad_idx: 3, nombres: 'Raúl Enrique', apellidos: 'Moya Lozano', tipo_documento: 'DNI', numero_documento: '13579246', email: 'raul.moya@email.com' },
    { actividad_idx: 3, nombres: 'Gloria Esther', apellidos: 'Villegas Torres', tipo_documento: 'DNI', numero_documento: '24681357', email: 'gloria.villegas@email.com' },
    { actividad_idx: 3, nombres: 'Hugo Martín', apellidos: 'Rojas Pineda', tipo_documento: 'CE', numero_documento: 'CE00567890', email: 'hugo.rojas@email.com' },
    { actividad_idx: 3, nombres: 'Diana Patricia', apellidos: 'Soto Vásquez', tipo_documento: 'DNI', numero_documento: '86420975', email: 'diana.soto@email.com' },
    { actividad_idx: 3, nombres: 'Fernando Jesús', apellidos: 'Campos Ortiz', tipo_documento: 'PASAPORTE', numero_documento: 'P98765432', email: 'fernando.campos@email.com' },
    { actividad_idx: 4, nombres: 'Rebecca Liz', apellidos: 'Contreras Paniura', tipo_documento: 'DNI', numero_documento: '74185296', email: 'rebecca.contreras@email.com' },
    { actividad_idx: 4, nombres: 'Omar Alexander', apellidos: 'Hinostroza Ccanto', tipo_documento: 'DNI', numero_documento: '96385274', email: 'omar.hinostroza@email.com' },
    { actividad_idx: 4, nombres: 'Claudia María', apellidos: 'Espinoza Rivas', tipo_documento: 'DNI', numero_documento: '15935728', email: 'claudia.espinoza@email.com' },
    { actividad_idx: 4, nombres: 'Víctor Manuel', apellidos: 'Arias Huerta', tipo_documento: 'CE', numero_documento: 'CE00678901', email: 'victor.arias@email.com' },
    { actividad_idx: 4, nombres: 'Ruth Noemí', apellidos: 'Palomino Córdova', tipo_documento: 'DNI', numero_documento: '35795146', email: 'ruth.palomino@email.com' },
    { actividad_idx: 4, nombres: 'Edgar Antonio', apellidos: 'Zevallos Méndez', tipo_documento: 'DNI', numero_documento: '75315982', email: 'edgar.zevallos@email.com' },
    { actividad_idx: 5, nombres: 'Katherine', apellidos: 'Sánchez Arones', tipo_documento: 'CE', numero_documento: 'CE00789012', email: 'katherine.sanchez@email.com' },
    { actividad_idx: 5, nombres: 'Marco Antonio', apellidos: 'Cárdenas Ruiz', tipo_documento: 'DNI', numero_documento: '65432187', email: 'marco.cardenas@email.com' },
    { actividad_idx: 5, nombres: 'Rocío del Pilar', apellidos: 'Meza Quintana', tipo_documento: 'DNI', numero_documento: '15926348', email: 'rocio.meza@email.com' },
    { actividad_idx: 5, nombres: 'José Daniel', apellidos: 'Mamani Coila', tipo_documento: 'DNI', numero_documento: '98765432', email: 'jose.mamani@email.com' },
    { actividad_idx: 5, nombres: 'Fiorella Stefany', apellidos: 'Rivera Gutiérrez', tipo_documento: 'DNI', numero_documento: '45612378', email: 'fiorella.rivera@email.com' },
    { actividad_idx: 6, nombres: 'Juan Carlos', apellidos: 'Pérez García', tipo_documento: 'DNI', numero_documento: '11111111', email: 'juan.perez@email.com' },
    { actividad_idx: 6, nombres: 'María Elena', apellidos: 'López Torres', tipo_documento: 'DNI', numero_documento: '22222222', email: 'maria.lopez@email.com' },
    { actividad_idx: 6, nombres: 'Carlos Alberto', apellidos: 'Ramírez Silva', tipo_documento: 'DNI', numero_documento: '33333333', email: 'carlos.ramirez@email.com' },
    { actividad_idx: 7, nombres: 'Pedro Antonio', apellidos: 'Luna García', tipo_documento: 'DNI', numero_documento: '44444444', email: 'pedro.luna@email.com' },
    { actividad_idx: 7, nombres: 'Rosa María', apellidos: 'Vallejos Ríos', tipo_documento: 'DNI', numero_documento: '55555555', email: 'rosa.vallejos@email.com' },
  ];

  const partIds = [];
  for (const p of participantes) {
    const aid = actIds[p.actividad_idx];
    if (!aid) continue;
    const r = await api('POST', '/participantes', {
      nombres: p.nombres, apellidos: p.apellidos,
      tipo_documento: p.tipo_documento, numero_documento: p.numero_documento,
      email: p.email, actividad_id: aid,
    }, token);
    if (r.body.success) {
      partIds.push({ id: r.body.data.id, actividad_id: aid });
      console.log(`  ✓ ${p.nombres} ${p.apellidos}`);
    } else {
      console.log(`  ✗ ${p.nombres} ${p.apellidos}: ${r.body.message || r.body.raw?.slice(0, 100)}`);
    }
    await wait(200);
  }
  console.log(`  Total: ${partIds.length} participantes`);

  // 3. Validar APTO a todos
  console.log('\n--- Validando APTO ---');
  let validados = 0;
  for (const p of partIds) {
    const r = await api('POST', `/participantes/${p.id}/validar-apto`, { actividad_id: p.actividad_id }, token);
    if (r.body.success) validados++;
    await wait(100);
  }
  console.log(`  ✓ ${validados} participantes validados APTO`);

  // 4. Crear plantilla simple
  console.log('\n--- Creando plantilla ---');
  const plt = await api('POST', '/plantillas', { nombre: 'Certificado Oficial CIP' }, token);
  if (plt.body.success) {
    const pltId = plt.body.data.id;
    console.log(`  ✓ Plantilla creada ID ${pltId}`);

    const campos = [
      { placeholder: '{{NOMBRE_COMPLETO}}', x: 50, y: 42, font_size: 32, alignment: 'center', color: '#1a1a2e', width: 600, height: 50, orden: 1 },
      { placeholder: '{{DOCUMENTO}}', x: 50, y: 49, font_size: 16, alignment: 'center', color: '#555555', width: 400, height: 30, orden: 2 },
      { placeholder: '{{ACTIVIDAD_NOMBRE}}', x: 50, y: 56, font_size: 22, alignment: 'center', color: '#6B1D2A', width: 600, height: 40, orden: 3 },
      { placeholder: '{{FECHA_EMISION}}', x: 50, y: 63, font_size: 14, alignment: 'center', color: '#888888', width: 300, height: 25, orden: 4 },
      { placeholder: '{{CODIGO_UNICO}}', x: 50, y: 68, font_size: 11, alignment: 'center', color: '#aaaaaa', width: 350, height: 20, orden: 5 },
      { placeholder: '{{QR}}', x: 78, y: 78, font_size: 12, alignment: 'center', color: '#000000', width: 100, height: 100, orden: 6 },
      { placeholder: '{{LOGO_INSTITUCION}}', x: 12, y: 8, font_size: 12, alignment: 'center', color: '#000000', width: 80, height: 80, orden: 7 },
      { placeholder: '{{NOMBRE_AUTORIDAD}}', x: 35, y: 76, font_size: 16, alignment: 'center', color: '#1a1a2e', width: 300, height: 30, orden: 8 },
      { placeholder: '{{CARGO_AUTORIDAD}}', x: 35, y: 80, font_size: 13, alignment: 'center', color: '#6B1D2A', width: 300, height: 25, orden: 9 },
      { placeholder: '{{FIRMA_AUTORIDAD}}', x: 35, y: 83, font_size: 12, alignment: 'center', color: '#000000', width: 120, height: 50, orden: 10 },
    ];
    const cr = await api('PUT', `/plantillas/${pltId}/campos`, { campos }, token);
    if (cr.body.success) console.log(`  ✓ ${cr.body.data.campos.length} campos configurados`);

    // 5. Generar certificados
    console.log('\n--- Generando certificados ---');
    let totalCert = 0;
    for (let i = 0; i < actIds.length; i++) {
      const aid = actIds[i];
      const r = await api('POST', '/certificados/generar', { actividad_id: aid, plantilla_id: pltId }, token);
      if (r.body.success) {
        totalCert += r.body.generados || 0;
        console.log(`  ✓ Actividad ${i + 1} (ID ${aid}): ${r.body.generados} certificados`);
      } else {
        console.log(`  ✗ Actividad ${i + 1} (ID ${aid}): ${r.body.message}`);
      }
      await wait(500);
    }
    console.log(`  Total: ${totalCert} certificados`);
  } else {
    console.log(`  ✗ Error creando plantilla: ${plt.body.message}`);
  }

  // 6. Resumen final
  console.log('\n=== RESUMEN FINAL ===');
  const acts = await api('GET', '/actividades', null, token);
  const parts = await api('GET', '/participantes', null, token);
  const certs = await api('GET', '/certificados', null, token);
  const plants = await api('GET', '/plantillas', null, token);

  console.log(`  Actividades:   ${acts.body.data?.length || 0}`);
  console.log(`  Participantes: ${parts.body.data?.length || 0}`);
  console.log(`  Certificados:  ${certs.body.data?.length || 0}`);
  console.log(`  Plantillas:    ${plants.body.data?.length || 0}`);
  console.log('\n=== SEED COMPLETED ===');
})();
