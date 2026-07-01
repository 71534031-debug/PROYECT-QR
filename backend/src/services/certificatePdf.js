const fs = require('fs/promises');
const fssync = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const A4_LANDSCAPE = [841.89, 595.28];

function convertCoords(xPct, yPct, pageW, pageH) {
  return {
    x: (xPct / 100) * pageW,
    y: (yPct / 100) * pageH,
  };
}

function formatSpanishDate(dateStr) {
  if (!dateStr) return '';
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return `Huancayo, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

const FONT_MAP = {
  '{{NOMBRE_COMPLETO}}': 'Times-Bold',
  '{{DOCUMENTO}}': 'Times-Roman',
  '{{ACTIVIDAD_NOMBRE}}': 'Times-Bold',
  '{{FECHA_EMISION}}': 'Times-Roman',
  '{{FECHA_EMISION_FORMATEADA}}': 'Times-Roman',
  '{{CODIGO_UNICO}}': 'Helvetica',
  '{{NOMBRE_AUTORIDAD}}': 'Times-Roman',
  '{{CARGO_AUTORIDAD}}': 'Times-Italic',
};

async function writeCertificatePdf({ outputPath, templateHtml, replacements, qrUrl, backgroundImagePath, campos }) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  if (backgroundImagePath && campos && campos.length > 0) {
    await writeImageBasedPdf({ outputPath, backgroundImagePath, campos, replacements, qrUrl });
  } else {
    await writeHtmlBasedPdf({ outputPath, templateHtml, replacements, qrUrl });
  }
}

async function downloadImage(url) {
  if (!url.startsWith('http')) return url;
  const parsed = new URL(url);
  const mod = parsed.protocol === 'https:' ? https : http;
  const tmpPath = path.join(require('os').tmpdir(), 'cert_bg_' + Date.now() + path.extname(parsed.pathname) || '.png');
  const file = fssync.createWriteStream(tmpPath);
  return new Promise((resolve, reject) => {
    mod.get(url, (res) => {
      if (res.statusCode !== 200) { file.close(); fssync.unlink(tmpPath, () => {}); resolve(url); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(tmpPath); });
    }).on('error', () => { file.close(); fssync.unlink(tmpPath, () => {}); resolve(url); });
  });
}

async function writeImageBasedPdf({ outputPath, backgroundImagePath, campos, replacements, qrUrl }) {
  const [pageW, pageH] = A4_LANDSCAPE;
  const resolvedBg = await downloadImage(backgroundImagePath);

  const doc = new PDFDocument({
    size: A4_LANDSCAPE,
    margin: 0,
    info: {
      Title: 'Certificado',
      Author: 'Sistema de Certificados CIP',
    },
  });
  const stream = fssync.createWriteStream(outputPath);
  doc.pipe(stream);

  if (fssync.existsSync(resolvedBg)) {
    doc.image(resolvedBg, 0, 0, { width: pageW, height: pageH });
  }

  // Track positions to draw signature line if needed
  let sigLineX = null, sigLineY = null, sigLineW = null;

  for (const c of campos) {
    const pos = convertCoords(c.x, c.y, pageW, pageH);
    const value = replacements[c.placeholder] || '';
    const fontSize = c.font_size || 16;

    if (c.placeholder === '{{QR}}') {
      if (qrUrl) {
        try {
          const qrBuffer = await QRCode.toBuffer(qrUrl, { type: 'png', width: c.width || 120 });
          const qrSize = Math.min(c.width || 120, c.height || 120);
          doc.image(qrBuffer, pos.x - qrSize / 2, pos.y - qrSize / 2, { width: qrSize });
        } catch { }
      }
      continue;
    }

    if (c.placeholder === '{{LOGO_INSTITUCION}}' || c.placeholder === '{{FIRMA_AUTORIDAD}}') {
      if (value && value.trim()) {
        const imgPath = path.resolve(process.cwd(), value);
        if (fssync.existsSync(imgPath)) {
          try {
            const imgW = c.width || 100;
            const imgH = c.height || 100;
            doc.image(imgPath, pos.x - imgW / 2, pos.y - imgH / 2, { width: imgW, height: imgH });
          } catch { }
        }
      }
      continue;
    }

    if (value) {
      const fontName = FONT_MAP[c.placeholder] || 'Helvetica';
      doc.font(fontName).fontSize(fontSize).fillColor(c.color || '#1a1a2e');

      const maxWidth = c.width || 500;
      const align = c.alignment || 'center';
      const textOpts = { width: maxWidth, align };
      let textX;
      if (align === 'left') {
        textX = pos.x;
      } else if (align === 'right') {
        textX = pos.x - maxWidth;
      } else {
        textX = pos.x - maxWidth / 2;
      }

      doc.text(value, textX, pos.y - fontSize * 0.35, textOpts);
    }

    // Track signature field for line drawing
    if (c.placeholder === '{{FIRMA_AUTORIDAD}}') {
      sigLineX = pos.x;
      sigLineY = pos.y;
      sigLineW = c.width || 180;

      // Draw signature line slightly below the signature image
      doc.moveTo(pos.x - sigLineW / 2, pos.y + (c.height || 40) / 2 + 8)
         .lineTo(pos.x + sigLineW / 2, pos.y + (c.height || 40) / 2 + 8)
         .lineWidth(1.5)
         .strokeColor('#333333')
         .stroke();
    }
  }

  doc.end();
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function writeHtmlBasedPdf({ outputPath, templateHtml, replacements, qrUrl }) {
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
