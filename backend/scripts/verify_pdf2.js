const fs = require('fs');
const path = require('path');
const pdfPath = path.join(__dirname, '..', 'uploads', 'certificados', 'd16172f3-b14a-463a-8486-085dfdd422b6.pdf');
const buf = fs.readFileSync(pdfPath);
console.log('PDF header:', buf.slice(0, 8).toString());
console.log('Size:', buf.length, 'bytes');

// Look for text in raw bytes with different encodings
const raw = buf.toString('binary');
const keywords = [
  'Jorge', 'Anccasi', 'Lennon',
  '71534031', 'DNI',
  'Curso', 'Proyectos',
  'Gesti\u00f3n', // utf8
  'Gestión', // latin1
];
for (const kw of keywords) {
  const idx = raw.indexOf(kw);
  if (idx >= 0) {
    console.log('Found "' + kw + '" at offset', idx, '- context:', raw.substring(Math.max(0, idx - 20), idx + 40));
  } else {
    console.log('NOT FOUND: "' + kw + '"');
  }
}

// Try to find any text in PDF operators
const textOps = raw.match(/\(([^)]*)\)/g);
if (textOps) {
  console.log('\nText operations found:', textOps.length);
  textOps.slice(0, 20).forEach(t => console.log('  ' + t.substring(0, 80)));
}
