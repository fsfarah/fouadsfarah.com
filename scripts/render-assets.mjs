// Renders the social image and the PNG/ICO favicons with local headless Chrome,
// using the self-hosted fonts and the facts in src/data/site.ts.
// Run after changing the name, headline or location:  node scripts/render-assets.mjs
// (Set CHROME=/path/to/chrome if `google-chrome` isn't on your PATH.)
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { site } from '../src/data/site.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => path.join(root, 'public', p);
const fontUrl = (f) => pathToFileURL(pub(`fonts/${f}`)).href;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Social image (option B): name on spruce, headline on two lines, mono domain and meta lines.
const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Schibsted Grotesk';font-weight:400 700;src:url('${fontUrl('schibsted-grotesk-latin-wght.woff2')}') format('woff2')}
@font-face{font-family:'IBM Plex Mono';font-weight:400;src:url('${fontUrl('ibm-plex-mono-latin-400.woff2')}') format('woff2')}
@font-face{font-family:'IBM Plex Mono';font-weight:500;src:url('${fontUrl('ibm-plex-mono-latin-500.woff2')}') format('woff2')}
html,body{margin:0}
.c{position:relative;width:1200px;height:630px;overflow:hidden;box-sizing:border-box;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;background:#0E6B5F;color:#FFF;font-family:'Schibsted Grotesk',sans-serif}
.d{position:absolute;inset:0;background-image:radial-gradient(circle,#3A887D 1.7px,transparent 2.2px);background-size:28px 28px;background-position:14px 14px;-webkit-mask-image:linear-gradient(to left,#000 0%,rgba(0,0,0,.55) 30%,rgba(0,0,0,0) 70%);mask-image:linear-gradient(to left,#000 0%,rgba(0,0,0,.55) 30%,rgba(0,0,0,0) 70%)}
.m{position:relative;font-family:'IBM Plex Mono',monospace}
.top{font-size:22px;font-weight:500;color:#A8E6D9}
.mid{position:relative;display:flex;flex-direction:column;gap:24px}
.name{margin:0;font-size:112px;line-height:.95;font-weight:600;letter-spacing:-.045em}
.head{margin:0;display:flex;flex-direction:column;font-size:30px;line-height:1.25;font-weight:500;letter-spacing:-.01em;color:#D2EBE5}
.bot{display:flex;flex-wrap:wrap;gap:8px 40px;font-size:20px;color:#D2EBE5}
</style></head><body><div class="c"><div class="d"></div>
<span class="m top">${esc(new URL(site.url).host)}</span>
<div class="mid"><p class="name">${esc(site.name)}</p><p class="head">${site.headlineLines.map((l) => `<span>${esc(l)}</span>`).join('')}</p></div>
<div class="m bot"><span>${esc(site.focus.join(' · '))}</span><span>${esc(site.location)}</span></div>
</div></body></html>`;

const iconHtml = (size, svg) =>
  `<!doctype html><html><head><style>html,body{margin:0}img{display:block;width:${size}px;height:${size}px}</style></head><body><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></body></html>`;

// --- minimal Chrome DevTools Protocol driver --------------------------------
const chrome = spawn(process.env.CHROME || 'google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', '--remote-debugging-port=9339', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  try { target = (await (await fetch('http://127.0.0.1:9339/json')).json()).find((t) => t.type === 'page'); } catch {}
  if (!target) await sleep(200);
}
if (!target) throw new Error('Could not start Chrome (set CHROME=/path/to/chrome).');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let seq = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Page.enable');

const dir = await mkdtemp(path.join(tmpdir(), 'render-assets-'));
async function render(html, width, height) {
  const file = path.join(dir, `page-${width}x${height}.html`);
  await writeFile(file, html);
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: pathToFileURL(file).href });
  await sleep(500);
  const ready = await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => [...document.fonts].every((f) => f.status !== "error"))', awaitPromise: true, returnByValue: true });
  if (ready.result?.result?.value === false) throw new Error('A font failed to load.');
  await sleep(200);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width, height, scale: 1 } });
  return Buffer.from(shot.result.data, 'base64');
}

// ICO with embedded PNG images (supported by every current browser).
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e); header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(png.length, e + 8); header.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.png)]);
}

const svg = await readFile(pub('favicon.svg'), 'utf8');
// At 16 and 32 px the outline from favicon.svg falls between pixels and blurs, so these
// sizes use the same F snapped to whole pixels (stroke weights rounded, proportions kept).
const pixelF = (size, d) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#0E6B5F"/><path fill="#FFF" d="${d}"/></svg>`;
const svg32 = pixelF(32, 'M11 9H22V12H14V15H21V18H14V23H11Z');
const svg16 = pixelF(16, 'M6 4H11V6H8V7H10V9H8V12H6Z');
await writeFile(pub('og-image.png'), await render(ogHtml, 1200, 630));
await writeFile(pub('apple-touch-icon.png'), await render(iconHtml(180, svg), 180, 180));
const png32 = await render(iconHtml(32, svg32), 32, 32);
const png16 = await render(iconHtml(16, svg16), 16, 16);
await writeFile(pub('favicon.ico'), ico([{ size: 16, png: png16 }, { size: 32, png: png32 }]));
console.log('Wrote public/og-image.png, public/apple-touch-icon.png, public/favicon.ico');
ws.close();
chrome.kill();
