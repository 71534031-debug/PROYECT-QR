const fs = require('fs');
const pdfPath = require('path').join(__dirname, '..', 'uploads', 'certificados', 'd16172f3-b14a-463a-8486-085dfdd422b6.pdf');
const buf = fs.readFileSync(pdfPath);
const isPdf = buf.slice(0, 5).toString() === '%PDF-';
console.log('Is valid PDF:', isPdf);
console.log('Size:', buf.length, 'bytes');
const text = buf.toString('latin1');
const keys = ['Jorge Lennon Anccasi Espinoza', 'DNI 71534031', 'Curso de Gestión de Proyectos TI', 'QR'];
keys.forEach(k => console.log('Contains "' + k + '":', text.includes(k)));
