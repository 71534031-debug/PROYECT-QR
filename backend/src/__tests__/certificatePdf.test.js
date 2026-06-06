jest.mock('qrcode', () => ({
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('fake-png-data'))
}));

jest.mock('fs', () => ({
  createWriteStream: jest.fn(() => {
    const { EventEmitter } = require('events');
    const stream = new EventEmitter();
    stream.write = jest.fn();
    stream.end = jest.fn();
    process.nextTick(() => stream.emit('finish'));
    return stream;
  })
}));

jest.mock('pdfkit', () => {
  return class MockPDFDocument {
    constructor() { this.y = 100; }
    pipe(dest) { return dest; }
    fontSize(_size) { return this; }
    text(_t, _opts) { return this; }
    image(_buf, _x, _y, _opts) { return this; }
    end() { return this; }
  };
});

jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined)
}));

const { writeCertificatePdf } = require('../services/certificatePdf');
const fs = require('fs/promises');
const QRCode = require('qrcode');

describe('writeCertificatePdf', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crea directorio con mkdir recursive', async () => {
    await writeCertificatePdf({
      outputPath: '/tmp/cert.pdf',
      templateHtml: 'Test',
      replacements: {},
      qrUrl: 'https://example.com/v?c=1'
    });
    expect(fs.mkdir).toHaveBeenCalledWith('/tmp', { recursive: true });
  });

  it('genera QR code con url de validacion', async () => {
    await writeCertificatePdf({
      outputPath: '/tmp/c.pdf',
      templateHtml: '',
      replacements: {},
      qrUrl: 'https://example.com/validar?c=a1b2c3d4'
    });
    expect(QRCode.toBuffer).toHaveBeenCalledWith(
      'https://example.com/validar?c=a1b2c3d4',
      expect.objectContaining({ type: 'png', width: 120 })
    );
  });

  it('completa sin errores con datos validos', async () => {
    await expect(writeCertificatePdf({
      outputPath: '/tmp/cert.pdf',
      templateHtml: '<p>Certificado para {{NOMBRE}}</p>',
      replacements: { '{{NOMBRE}}': 'Juan Perez' },
      qrUrl: 'https://example.com/validar?c=abc123'
    })).resolves.toBeUndefined();
  });

  it('lanza error si falta outputPath', async () => {
    await expect(writeCertificatePdf({
      templateHtml: 'Test',
      replacements: {},
      qrUrl: 'https://x.com'
    })).rejects.toThrow();
  });

  it('llama a toBuffer con qrUrl proporcionada', async () => {
    await writeCertificatePdf({
      outputPath: '/tmp/x.pdf',
      templateHtml: 'Test',
      replacements: {},
      qrUrl: 'https://test.com/v?c=xyz'
    });
    expect(QRCode.toBuffer).toHaveBeenCalledWith('https://test.com/v?c=xyz', expect.any(Object));
  });

  it('rechaza promesa si stream emite error', async () => {
    const { EventEmitter } = require('events');
    const fs = require('fs');
    fs.createWriteStream.mockImplementationOnce(() => {
      const stream = new EventEmitter();
      stream.write = jest.fn();
      stream.end = jest.fn();
      process.nextTick(() => stream.emit('error', new Error('EIO')));
      return stream;
    });
    await expect(writeCertificatePdf({
      outputPath: '/tmp/cert.pdf',
      templateHtml: 'Test',
      replacements: {},
      qrUrl: 'https://x.com?c=1'
    })).rejects.toThrow('EIO');
  });
});