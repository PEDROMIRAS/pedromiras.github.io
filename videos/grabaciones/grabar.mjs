// Graba una app con Chrome sin ventana: un guion la usa dentro de la página mientras CDP captura los
// fotogramas, y el ffmpeg de Remotion los junta en un MP4 respetando el tiempo real entre fotogramas.
// shortcut: rutas de Chrome y del ffmpeg de Remotion fijas para Windows; cambiarlas en otro equipo
// Uso: node grabar.mjs <url> <guion.js> <salida.mp4> <ancho> <alto> [escala]
import { spawn, execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const [url, guion, salida, ancho, alto, escala = '1'] = process.argv.slice(2);
const AQUI = path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/, '$1');
const frames = path.join(AQUI, 'frames-' + path.basename(salida, '.mp4'));
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames);
const perfil = path.join(AQUI, 'perfil-' + path.basename(salida, '.mp4'));
rmSync(perfil, { recursive: true, force: true }); // perfil limpio: sin datos guardados de otras pruebas

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--hide-scrollbars', '--remote-debugging-port=9391', `--user-data-dir=${perfil}`, 'about:blank']);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let destino;
for (let i = 0; i < 40 && !destino; i++) { await esperar(250); try { destino = (await (await fetch('http://127.0.0.1:9391/json')).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(destino.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pendientes = new Map();
const capturas = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pendientes.has(d.id)) { pendientes.get(d.id)(d.result); pendientes.delete(d.id); }
  if (d.method === 'Page.screencastFrame') {
    capturas.push({ t: d.params.metadata.timestamp, datos: d.params.data });
    ws.send(JSON.stringify({ id: ++id, method: 'Page.screencastFrameAck', params: { sessionId: d.params.sessionId } }));
  }
  if (d.method === 'Runtime.exceptionThrown') console.error('error en la página:', d.params.exceptionDetails.text);
};
const cdp = (method, params = {}) => new Promise((r) => { pendientes.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

await cdp('Runtime.enable');
await cdp('Page.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: +ancho, height: +alto, deviceScaleFactor: +escala, mobile: +ancho < 600 });
await cdp('Page.navigate', { url });
await esperar(2500);
await cdp('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: +ancho * +escala, maxHeight: +alto * +escala, everyNthFrame: 1 });
await esperar(300);
const r = await cdp('Runtime.evaluate', { expression: readFileSync(guion, 'utf8'), awaitPromise: true, returnByValue: true });
if (r.exceptionDetails) console.error('el guion falló:', r.exceptionDetails.exception?.description);
await esperar(300);
await cdp('Page.stopScreencast');
ws.close();
chrome.kill();

// Cada fotograma dura hasta el siguiente: CDP solo manda fotogramas cuando algo cambia en pantalla
const lista = capturas.map((c, i) => {
  const nombre = `f${String(i).padStart(5, '0')}.jpg`;
  writeFileSync(path.join(frames, nombre), Buffer.from(c.datos, 'base64'));
  const dura = i < capturas.length - 1 ? capturas[i + 1].t - c.t : 0.5;
  return `file '${nombre}'\nduration ${dura.toFixed(4)}`;
});
lista.push(`file 'f${String(capturas.length - 1).padStart(5, '0')}.jpg'`);
writeFileSync(path.join(frames, 'lista.txt'), lista.join('\n'));
const total = capturas.at(-1).t - capturas[0].t;
console.log(`${capturas.length} fotogramas en ${total.toFixed(1)} s`);
// El ffmpeg que trae Remotion (recortado: sin filtros -vf; los fotogramas ya salen a su tamaño)
const FFMPEG = 'C:/Users/pmira/Documents/GitHub/pedromiras.github.io/videos/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe';
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(frames, 'lista.txt'),
  '-r', '30', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-movflags', '+faststart', '-an', salida],
  { stdio: 'inherit' });
console.log('hecho:', salida);
