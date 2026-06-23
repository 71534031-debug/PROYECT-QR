const path = require('path');
const fs = require('fs');

// A4 landscape at ~150 DPI
const W = 1754, H = 1240;

function generateWithPngjs() {
  const PNG = require('pngjs').PNG;
  const png = new PNG({ width: W, height: H });

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;

      // Parchment gradient background
      const t = y / H;
      const base = 248 - t * 18;
      png.data[idx] = base;
      png.data[idx + 1] = base - 4;
      png.data[idx + 2] = base - 10;
      png.data[idx + 3] = 255;

      // Outer border: gold (#C5954C) 12px
      if (x < 12 || x >= W - 12 || y < 12 || y >= H - 12) {
        png.data[idx] = 197;
        png.data[idx + 1] = 149;
        png.data[idx + 2] = 76;
        continue;
      }

      // Inner border: dark red (#8B1A1A) 4px, offset by 18px from edge
      const bx = x - 18, by = y - 18;
      if (bx >= 0 && bx < 4 || bx >= W - 22 && bx < W - 18 || by >= 0 && by < 4 || by >= H - 22 && by < H - 18) {
        png.data[idx] = 139;
        png.data[idx + 1] = 26;
        png.data[idx + 2] = 26;
        continue;
      }

      // Corner decorative squares (top-left)
      const cornerSize = 40;
      if ((x < 18 + cornerSize && y < 18 + cornerSize) ||
          (x > W - 18 - cornerSize && y < 18 + cornerSize) ||
          (x < 18 + cornerSize && y > H - 18 - cornerSize) ||
          (x > W - 18 - cornerSize && y > H - 18 - cornerSize)) {
        const dx = Math.min(x - 18, y - 18, Math.abs(x - (W - 18)), Math.abs(y - (H - 18)));
        if (dx >= 0 && dx < 6) {
          png.data[idx] = 197; png.data[idx + 1] = 149; png.data[idx + 2] = 76;
        }
      }

      // Signature line area: subtle line at ~75% height for authority signature
      const sigLineY = Math.round(H * 0.78);
      if (y >= sigLineY - 1 && y <= sigLineY + 1 && x > W * 0.18 && x < W * 0.48) {
        png.data[idx] = 100;
        png.data[idx + 1] = 100;
        png.data[idx + 2] = 100;
      }

      // Light horizontal separator lines for structure
      const sepY1 = Math.round(H * 0.22);
      if (y >= sepY1 - 1 && y <= sepY1 && x > W * 0.12 && x < W * 0.88) {
        png.data[idx] = 180; png.data[idx + 1] = 160; png.data[idx + 2] = 130;
      }
    }
  }

  const buf = PNG.sync.write(png);
  const outPath = path.join(__dirname, '..', 'uploads', 'images', 'certificate_background.png');
  fs.writeFileSync(outPath, buf);
  console.log('Created background with pngjs:', outPath, `(${buf.length} bytes, ${W}x${H})`);
}

generateWithPngjs();
