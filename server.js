/*
 * Tiny zero-dependency dev server for the portfolio + visual editor.
 *
 *   node server.js
 *   → http://localhost:4321/index.html?edit=1   edit ON the page (inline)
 *   → http://localhost:4321/editor.html         edit in a side-form (alternative)
 *   → http://localhost:4321/index.html          the public site
 *
 * Endpoints used by both editors:
 *   GET  /content.json     read current content (also served as a static file)
 *   POST /api/save         body = full content JSON → overwrites content.json
 *   POST /api/upload       body = { filename, dataUrl } → saves an image to the folder
 *
 * No npm install needed — uses only Node's built-in modules.
 * Change the port with:  PORT=4500 node server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ 'Cache-Control': 'no-store' }, headers || {}));
  res.end(body);
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    let size = 0;
    req.on('data', function (c) {
      size += c.length;
      if (size > 25 * 1024 * 1024) { reject(new Error('Body too large (max 25MB)')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', reject);
  });
}

// Keep requests inside ROOT (no path traversal)
function safePath(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const full = path.join(ROOT, clean);
  if (!full.startsWith(ROOT)) return null;
  return full;
}

const server = http.createServer(async function (req, res) {
  try {
    // ---- API: save content.json ----
    if (req.method === 'POST' && req.url === '/api/save') {
      const body = await readBody(req);
      let parsed;
      try { parsed = JSON.parse(body); }
      catch (e) { return send(res, 400, JSON.stringify({ error: 'Invalid JSON' }), { 'Content-Type': 'application/json' }); }
      fs.writeFileSync(path.join(ROOT, 'content.json'), JSON.stringify(parsed, null, 2) + '\n', 'utf8');
      return send(res, 200, JSON.stringify({ ok: true }), { 'Content-Type': 'application/json' });
    }

    // ---- API: upload an image (base64 data URL) ----
    if (req.method === 'POST' && req.url === '/api/upload') {
      const body = await readBody(req);
      let data;
      try { data = JSON.parse(body); } catch (e) { return send(res, 400, JSON.stringify({ error: 'Invalid JSON' }), { 'Content-Type': 'application/json' }); }
      const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(data.dataUrl || '');
      if (!m) return send(res, 400, JSON.stringify({ error: 'Expected an image data URL' }), { 'Content-Type': 'application/json' });
      // sanitise filename → basename only, keep a safe extension
      const extFromMime = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg' }[m[1]] || '.png';
      let base = path.basename(data.filename || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_');
      if (!/\.[a-zA-Z0-9]+$/.test(base)) base += extFromMime;
      const dest = safePath('/' + base);
      if (!dest) return send(res, 400, JSON.stringify({ error: 'Bad filename' }), { 'Content-Type': 'application/json' });
      fs.writeFileSync(dest, Buffer.from(m[2], 'base64'));
      return send(res, 200, JSON.stringify({ ok: true, filename: base }), { 'Content-Type': 'application/json' });
    }

    // ---- Static files ----
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/editor.html';
    const filePath = safePath(urlPath);
    if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return send(res, 404, 'Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, fs.readFileSync(filePath), { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  } catch (err) {
    send(res, 500, JSON.stringify({ error: String(err && err.message || err) }), { 'Content-Type': 'application/json' });
  }
});

server.listen(PORT, function () {
  console.log('\n  Portfolio server running:');
  console.log('  → Edit inline : http://localhost:' + PORT + '/index.html?edit=1');
  console.log('  → Edit (form) : http://localhost:' + PORT + '/editor.html');
  console.log('  → Public site : http://localhost:' + PORT + '/index.html');
  console.log('\n  Press Ctrl+C to stop.\n');
}).on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    console.error('\n  Port ' + PORT + ' is already in use.');
    console.error('  Start on another port, e.g.:  PORT=4500 node server.js\n');
    process.exit(1);
  }
  throw err;
});
