const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 4567;

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rasterizing ZeroSurge Premium Icons</title>
</head>
<body style="background:#0B0F17;color:#fff;font-family:sans-serif;padding:20px;">
  <h2>Rendering ZeroSurge Premium Apple & PWA Icons...</h2>
  <script>
    function renderIcon(size, scaleRatio) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // 1. Solid dark background #0B0F17 (100% uniform, zero boundary artifacts)
      ctx.fillStyle = '#0B0F17';
      ctx.fillRect(0, 0, size, size);

      // 2. Geometry: ZeroSurge lightning bolt in 48x48 space:
      // M26 6L11 26H24L22 42L37 22H24L26 6Z
      const scale = (size / 48) * scaleRatio;
      const ox = (size - 48 * scale) / 2;
      const oy = (size - 48 * scale) / 2;

      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(scale, scale);

      const p = new Path2D('M26 6L11 26H24L22 42L37 22H24L26 6Z');

      // 3. Multi-layer ambient neon glow (native canvas glow, completely seamless)
      // Wide soft glow
      ctx.save();
      ctx.shadowColor = 'rgba(16, 185, 129, 0.45)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.fill(p);
      ctx.restore();

      // Core glow
      ctx.save();
      ctx.shadowColor = 'rgba(16, 185, 129, 0.75)';
      ctx.shadowBlur = 2;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.fill(p);
      ctx.restore();

      // 4. Gradient fill (#10B981 -> #34D399 -> #06B6D4)
      const grad = ctx.createLinearGradient(16, 8, 34, 42);
      grad.addColorStop(0, '#10B981');
      grad.addColorStop(0.5, '#34D399');
      grad.addColorStop(1, '#06B6D4');

      ctx.fillStyle = grad;
      ctx.fill(p);

      // 5. Crisp stroke
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.4;
      ctx.lineJoin = 'round';
      ctx.stroke(p);

      ctx.restore();

      return canvas.toDataURL('image/png');
    }

    async function send(name, dataUrl) {
      const base64 = dataUrl.split(',')[1];
      await fetch('/save?name=' + name, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64 })
      });
    }

    async function run() {
      // 1. apple-touch-icon.png (180x180 for iOS Home Screen): scaleRatio ~0.82 (62% height of icon)
      const appleIcon = renderIcon(180, 0.82);
      await send('apple-touch-icon.png', appleIcon);

      // 2. pwa-192x192.png
      const pwa192 = renderIcon(192, 0.82);
      await send('pwa-192x192.png', pwa192);

      // 3. pwa-512x512.png
      const pwa512 = renderIcon(512, 0.82);
      await send('pwa-512x512.png', pwa512);

      // 4. maskable-icon-512x512.png (Android adaptive safe zone - fits within 80% circle)
      const maskable = renderIcon(512, 0.68);
      await send('maskable-icon-512x512.png', maskable);

      document.body.innerHTML += '<h3 style="color:#10b981;">✓ All 4 icons rendered cleanly and saved successfully!</h3>';
    }

    run();
  </script>
</body>
</html>`;

let savedCount = 0;
const expectedIcons = [
  'apple-touch-icon.png',
  'pwa-192x192.png',
  'pwa-512x512.png',
  'maskable-icon-512x512.png',
];

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else if (req.method === 'POST' && req.url.startsWith('/save')) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const name = url.searchParams.get('name');
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const { base64 } = JSON.parse(body);
      const filePath = path.join(__dirname, '..', 'public', name);
      fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
      console.log(`[Icon Generator] Saved: ${filePath} (${fs.statSync(filePath).size} bytes)`);
      savedCount++;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));

      if (savedCount >= expectedIcons.length) {
        console.log('[Icon Generator] All 4 icons successfully written to public/!');
        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1000);
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[Icon Generator] Server listening at http://127.0.0.1:${PORT}`);
  exec(`npx agent-browser open http://127.0.0.1:${PORT}`, (err) => {
    if (err) console.error('[Icon Generator] Browser launch error:', err);
  });
});
