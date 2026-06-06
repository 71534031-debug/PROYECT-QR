const fs = require('fs/promises');
const fssync = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

/**
 * Genera PDF mínimo reemplazando placeholders de plantilla por texto plano.
 */
async function writeCertificatePdf({ outputPath, templateHtml, replacements, qrUrl }) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  let text = String(templateHtml || '');
  Object.entries(replacements).forEach(([k, v]) => {
    text = text.split(k).join(v);
  });
  text = text.replace(/<[^>]+>/g, ' ');
  const qrBuffer = await QRCode.toBuffer(qrUrl, { type: 'png', width: 120 });

  const doc = new PDFDocument({ margin: 50 });
  const stream = fssync.createWriteStream(outputPath);
  doc.pipe(stream);
  doc.fontSize(12);
  doc.text(text, { width: 500 });
  doc.image(qrBuffer, 50, doc.y + 20, { width: 120 });
  doc.end();
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

module.exports = { writeCertificatePdf };
