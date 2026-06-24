// Generador de Certificados PDF con Código QR
// ISO 9001:2015 — Proceso de Realización del Servicio

const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

async function generateCertificate(certificado, participante, actividad, plantilla, config) {
    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 40
    });

    const outputPath = path.join(__dirname, '..', 'uploads', 'certificados', `${certificado.codigo_unico}.pdf`);
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Fondo de la imagen de plantilla si existe
    if (plantilla.imagen_url) {
        const imgPath = path.join(__dirname, '..', plantilla.imagen_url);
        if (fs.existsSync(imgPath)) {
            doc.image(imgPath, 0, 0, { width: pageWidth, height: pageHeight });
        }
    }

    // Logo institucional
    if (config.logo_url) {
        const logoPath = path.join(__dirname, '..', config.logo_url);
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 30, { width: 80 });
        }
    }

    // Contenido dinámico según campos de la plantilla
    if (plantilla.campos && plantilla.campos.length > 0) {
        plantilla.campos.forEach(campo => {
            let valor = campo.texto_base || '';
            if (campo.es_dinamico) {
                valor = participante[campo.campo_dinamico] || actividad[campo.campo_dinamico] || '';
            }
            doc.fontSize(campo.tamano || 16)
               .fillColor(campo.color || '#000000')
               .text(valor, campo.posicion_x || 100, campo.posicion_y || 100, {
                   width: campo.ancho || 400,
                   align: campo.alineacion || 'center'
               });
        });
    } else {
        // Layout por defecto
        doc.fontSize(24).fillColor('#8B1A1A').text('CERTIFICADO', 0, 120, { align: 'center' });
        doc.fontSize(18).fillColor('#333').text(`Otorgado a: ${participante.nombres} ${participante.apellidos}`, 0, 180, { align: 'center' });
        doc.fontSize(14).fillColor('#555').text(`Por haber participado en: ${actividad.nombre}`, 0, 230, { align: 'center' });
    }

    // Firma digital
    if (config.firma_url) {
        const firmaPath = path.join(__dirname, '..', config.firma_url);
        if (fs.existsSync(firmaPath)) {
            doc.image(firmaPath, pageWidth / 2 - 60, pageHeight - 180, { width: 120 });
        }
    }
    doc.fontSize(11).fillColor('#333')
       .text(config.nombre_autoridad || '', pageWidth / 2, pageHeight - 100, { align: 'center' })
       .text(config.cargo_autoridad || '', pageWidth / 2, pageHeight - 80, { align: 'center' });

    // Código QR
    const validacionUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/validar?codigo=${certificado.codigo_unico}`;
    const qrBuffer = await QRCode.toBuffer(validacionUrl, { width: 120, margin: 1 });
    doc.image(qrBuffer, pageWidth - 160, pageHeight - 160, { width: 110 });

    // Número de certificado
    doc.fontSize(8).fillColor('#999').text(`Certificado N°: ${certificado.codigo_unico}`, pageWidth - 160, pageHeight - 40, { width: 130, align: 'center' });

    doc.end();
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve(outputPath));
        writeStream.on('error', reject);
    });
}

module.exports = { generateCertificate };
