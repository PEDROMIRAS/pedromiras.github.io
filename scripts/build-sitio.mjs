#!/usr/bin/env node
// Construye el sitio principal y los 4 proyectos, monta el resultado final en _site/
// (igual que quedará publicado) y comprueba que las 5 rutas cargan de verdad.
//
// Uso:
//   node scripts/build-sitio.mjs                 # build local: compila, monta, verifica y
//                                                  # deja el sitio servido para abrirlo en el navegador
//   node scripts/build-sitio.mjs --base=/mi-repo  # para probar en un repo que no sea la raíz del dominio
//   node scripts/build-sitio.mjs --sin-servir     # compila y verifica, pero no deja el servidor abierto
//                                                  # (es lo que usa el workflow de GitHub Actions)
//
// Es literalmente el mismo script que ejecuta el CI, así que lo que funcione (o falle) aquí
// es exactamente lo que funcionará (o fallará) una vez publicado.

import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith('--base=')) || '--base=').slice('--base='.length);
const dejarServido = !args.includes('--sin-servir') && !process.env.CI;

const PROYECTOS = [
  { nombre: 'Sitio principal', dir: '.', carpeta: '' },
  { nombre: 'Ramo de flores', dir: 'ramo-flores-amarillas', carpeta: 'ramo-flores-amarillas' },
  { nombre: 'TODO APP', dir: 'todoApp', carpeta: 'todoApp' },
  { nombre: 'Snake', dir: 'snake', carpeta: 'snake' },
  {
    nombre: 'Sushi Tracker',
    dir: 'sushi-tracker',
    carpeta: 'sushi-tracker',
    // Conflicto de dependencias ya existente entre vite-plugin-pwa y Vite 7 (no lo causamos
    // nosotros): --legacy-peer-deps lo sortea, igual que al instalarlo tú la primera vez.
    instalar: 'npm install --legacy-peer-deps',
    env: { BASE_PATH: `${base}/sushi-tracker/` },
  },
];

function ejecutar(comando, cwd, envExtra) {
  execSync(comando, { cwd, stdio: 'inherit', env: { ...process.env, ...envExtra } });
}

console.log(`\n▶ Construyendo el sitio${base ? ` (ruta base: ${base})` : ''}...\n`);

for (const p of PROYECTOS) {
  const ruta = join(RAIZ, p.dir);
  console.log(`\n— ${p.nombre} —`);
  ejecutar(p.instalar || 'npm ci', ruta);
  ejecutar('npm run build', ruta, p.env);

  if (!existsSync(join(ruta, 'dist', 'index.html'))) {
    console.error(`\n✗ "${p.nombre}" ha terminado el build sin generar dist/index.html. Paro aquí.`);
    process.exit(1);
  }
}

console.log('\n▶ Montando _site/...');
const SITIO = join(RAIZ, '_site');
rmSync(SITIO, { recursive: true, force: true });
mkdirSync(SITIO);
for (const p of PROYECTOS) {
  const destino = p.carpeta ? join(SITIO, p.carpeta) : SITIO;
  mkdirSync(destino, { recursive: true });
  cpSync(join(RAIZ, p.dir, 'dist'), destino, { recursive: true });
}
// Sin esto, GitHub Pages puede pasar Jekyll por encima del sitio y saltarse carpetas/archivos
// que empiecen por "_" o ".", rompiendo el build.
writeFileSync(join(SITIO, '.nojekyll'), '');

// ---------- Verificación: servir _site/ tal cual y comprobar las 5 rutas ----------

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const servidor = createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split('?')[0]);
  // GitHub Pages, cuando el sitio no está en la raíz del dominio (un repo que no sea
  // "usuario.github.io"), quita él solo ese prefijo antes de buscar el archivo. Lo
  // simulamos aquí para que la comprobación con --base refleje lo que pasará de verdad.
  if (base && ruta.startsWith(base)) ruta = ruta.slice(base.length) || '/';
  let archivo = join(SITIO, ruta);
  if (ruta.endsWith('/') || !existsSync(archivo)) archivo = join(SITIO, ruta, 'index.html');
  if (!existsSync(archivo) || !archivo.startsWith(SITIO)) {
    res.writeHead(404).end('No encontrado');
    return;
  }
  res.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] || 'application/octet-stream' });
  res.end(readFileSync(archivo));
});

await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const puerto = servidor.address().port;
const raizSitio = `http://127.0.0.1:${puerto}${base}/`;

console.log(`\n▶ Verificando enlaces en ${raizSitio} ...\n`);
let huboFallos = false;
for (const p of PROYECTOS) {
  const url = p.carpeta ? `${raizSitio}${p.carpeta}/` : raizSitio;
  try {
    const respuesta = await fetch(url);
    const cuerpo = await respuesta.text();
    const esHtmlDeLaApp = respuesta.ok && cuerpo.includes('<div id="root">');
    console.log(`  ${esHtmlDeLaApp ? '✓' : '✗'} ${p.nombre.padEnd(16)} ${url} -> HTTP ${respuesta.status}`);
    if (!esHtmlDeLaApp) huboFallos = true;
  } catch (e) {
    console.log(`  ✗ ${p.nombre.padEnd(16)} ${url} -> ${e.message}`);
    huboFallos = true;
  }
}

if (huboFallos) {
  console.error('\n✗ Algún enlace no carga. Nada se ha publicado todavía si esto corre en el CI.\n');
  servidor.close();
  process.exit(1);
}

console.log('\n✓ Los 5 enlaces cargan correctamente.\n');

if (dejarServido) {
  console.log(`Sitio servido en ${raizSitio} — ábrelo en el navegador y pulsa por los proyectos.`);
  console.log('Ctrl+C para parar.\n');
} else {
  servidor.close();
}
