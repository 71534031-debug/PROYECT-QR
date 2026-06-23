require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const http = require('http');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API = 'http://localhost:3000';
let token = null;

function api(method, urlPath, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, API);
    const headers = { ...opts.headers };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const body = opts.body || opts.formData || undefined;
    if (opts.json) {
      headers['Content-Type'] = 'application/json';
    }
    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) {
      if (body instanceof fs.ReadStream || body instanceof FormData) {
        body.pipe(req);
      } else {
        req.write(body);
        req.end();
      }
    } else {
      req.end();
    }
  });
}

function apiFormData(method, urlPath, form) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, API);
    const headers = { ...form.getHeaders() };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    form.pipe(req);
  });
}

async function main() {
  // 0. Login
  console.log('--- LOGIN ---');
  const login = await api('POST', '/api/auth/login', {
    json: true,
    body: JSON.stringify({ email: 'admin@cip.local', password: 'Password123' })
  });
  if (!login.body.success) { console.error('Login failed:', login.body); process.exit(1); }
  token = login.body.token;
  console.log('Login OK');

  // 1. Upload background image to plantilla 1
  console.log('\n--- UPLOAD BACKGROUND TO PLANTILLA 1 ---');
  const imgPath = path.join(__dirname, '..', 'uploads', 'images', 'certificate_background.png');
  const form = new FormData();
  form.append('imagen_fondo', fs.createReadStream(imgPath), {
    filename: 'certificate_background.png',
    contentType: 'image/png'
  });
  const upload = await apiFormData('POST', '/api/plantillas/1/imagen', form);
  if (!upload.body.success) {
    console.error('Upload failed:', upload.body);
    process.exit(1);
  }
  console.log('Background uploaded:', upload.body.url);

  // 2. Configure campos for plantilla 1
  console.log('\n--- CONFIGURE CAMPOS ---');
  const campos = [
    { placeholder: '{{NOMBRE_COMPLETO}}', x: 50, y: 42, font_size: 28, alignment: 'center', color: '#1a1a2e', width: 500, height: 35, orden: 0 },
    { placeholder: '{{DOCUMENTO}}', x: 50, y: 52, font_size: 14, alignment: 'center', color: '#333', width: 400, height: 25, orden: 1 },
    { placeholder: '{{ACTIVIDAD_NOMBRE}}', x: 50, y: 62, font_size: 16, alignment: 'center', color: '#555', width: 500, height: 25, orden: 2 },
    { placeholder: '{{FECHA_EMISION}}', x: 50, y: 75, font_size: 12, alignment: 'center', color: '#666', width: 300, height: 20, orden: 3 },
    { placeholder: '{{CODIGO_UNICO}}', x: 50, y: 82, font_size: 9, alignment: 'center', color: '#888', width: 400, height: 15, orden: 4 },
    { placeholder: '{{QR}}', x: 85, y: 88, font_size: 12, alignment: 'center', color: '#000', width: 60, height: 60, orden: 5 },
    { placeholder: '{{LOGO_INSTITUCION}}', x: 50, y: 15, font_size: 12, alignment: 'center', color: '#000', width: 60, height: 60, orden: 6 },
    { placeholder: '{{NOMBRE_AUTORIDAD}}', x: 35, y: 88, font_size: 11, alignment: 'center', color: '#333', width: 250, height: 20, orden: 7 },
    { placeholder: '{{CARGO_AUTORIDAD}}', x: 35, y: 92, font_size: 10, alignment: 'center', color: '#555', width: 250, height: 18, orden: 8 },
    { placeholder: '{{FIRMA_AUTORIDAD}}', x: 35, y: 82, font_size: 12, alignment: 'center', color: '#000', width: 80, height: 40, orden: 9 },
  ];
  const camposResult = await api('PUT', '/api/plantillas/1/campos', {
    json: true,
    body: JSON.stringify({ campos })
  });
  if (!camposResult.body.success) {
    console.error('Campos config failed:', camposResult.body);
    process.exit(1);
  }
  console.log('Campos configured: ' + campos.length + ' fields');

  // 3. Create activity
  console.log('\n--- CREATE ACTIVITY ---');
  const actividad = await api('POST', '/api/actividades', {
    json: true,
    body: JSON.stringify({
      nombre: 'Curso de Gestión de Proyectos TI',
      tipo: 'Curso',
      descripcion: 'Capacitación en gestión de proyectos de tecnologías de información.',
      fecha_inicio: '2026-06-01',
      fecha_fin: '2026-06-20',
      responsable: 'Ing. Jorge Chumpitaz'
    })
  });
  if (!actividad.body.success) {
    console.error('Activity creation failed:', actividad.body);
    process.exit(1);
  }
  const actividadId = actividad.body.data.id;
  console.log('Activity created, ID:', actividadId);

  // 4. Create 5 participants
  console.log('\n--- CREATE PARTICIPANTS ---');
  const participantes = [
    { nombres: 'Jorge Lennon', apellidos: 'Anccasi Espinoza', tipo_documento: 'DNI', numero_documento: '71534031', email: 'jorge.anccasi@example.com' },
    { nombres: 'María Fernanda', apellidos: 'Torres Quispe', tipo_documento: 'DNI', numero_documento: '45678901', email: 'maria.torres@example.com' },
    { nombres: 'Carlos Alberto', apellidos: 'Ramos Huanca', tipo_documento: 'DNI', numero_documento: '32145678', email: 'carlos.ramos@example.com' },
    { nombres: 'Ana Lucía', apellidos: 'Mendoza Ccori', tipo_documento: 'DNI', numero_documento: '56789012', email: 'ana.mendoza@example.com' },
    { nombres: 'Luis Miguel', apellidos: 'Palomino Vega', tipo_documento: 'DNI', numero_documento: '67890123', email: 'luis.palomino@example.com' },
  ];

  const participantIds = [];
  for (const p of participantes) {
    const res = await api('POST', '/api/participantes', {
      json: true,
      body: JSON.stringify({ ...p, actividad_id: actividadId })
    });
    if (!res.body.success) {
      console.error('Failed to create participant:', p.nombres, res.body);
      process.exit(1);
    }
    participantIds.push(res.body.data.id);
    console.log('Created:', p.nombres, p.apellidos, '-> ID:', res.body.data.id);
  }

  // 5. Mark all as APTO
  console.log('\n--- VALIDATE PARTICIPANTS AS APTO ---');
  for (const pid of participantIds) {
    const res = await api('POST', `/api/participantes/${pid}/validar-apto`, {
      json: true,
      body: JSON.stringify({ actividad_id: actividadId })
    });
    if (!res.body.success) {
      console.error('Failed to validate participant:', pid, res.body);
      process.exit(1);
    }
    console.log('Validated APTO: participant ID', pid);
  }

  // 6. Generate certificates
  console.log('\n--- GENERATE CERTIFICATES ---');
  const gen = await api('POST', '/api/certificados/generar', {
    json: true,
    body: JSON.stringify({ actividad_id: actividadId, plantilla_id: 1 })
  });
  if (!gen.body.success) {
    console.error('Certificate generation failed:', gen.body);
    process.exit(1);
  }
  console.log('Certificates generated:', gen.body.generados);

  // 7. List certificates and get download URL for first one
  console.log('\n--- VERIFY CERTIFICATES ---');
  const certs = await api('GET', `/api/certificados?actividad_id=${actividadId}`);
  if (certs.body.success) {
    console.log('Total certificates:', certs.body.data.length);
    for (const c of certs.body.data) {
      console.log('  Cert:', c.id, '|', c.codigo_unico.slice(0, 8) + '...', '|', c.estado, '| PDF:', c.ruta_pdf);
    }
    const firstCert = certs.body.data[0];
    if (firstCert) {
      const dlLink = await api('POST', `/api/certificados/${firstCert.id}/enlace-descarga`);
      if (dlLink.body.success) {
        console.log('\nDownload link for first certificate:');
        console.log(dlLink.body.url);
      }
      const pdfPath = path.join(process.cwd(), firstCert.ruta_pdf);
      if (fs.existsSync(pdfPath)) {
        const stat = fs.statSync(pdfPath);
        console.log('PDF file exists:', pdfPath, `(${stat.size} bytes)`);
      } else {
        console.log('ERROR: PDF file not found:', pdfPath);
      }
    }
  } else {
    console.error('Failed to list certificates');
  }

  console.log('\n=== ALL DONE ===');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
