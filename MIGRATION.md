# Cómo aplicar esto a tu repositorio

Este paquete sustituye **todo el contenido actual del repo** (salvo `.git/`) por la versión en React.
Los pasos, ejecutados desde la carpeta donde tienes clonado `pedromiras.github.io`:

## 1. Vaciar el repo (conservando el historial) y copiar lo nuevo

```bash
cd pedromiras.github.io

# Quita del control de versiones lo que ya no se necesita commitear
git rm -r --cached ramo-flores-amarillas/node_modules ramo-flores-amarillas/dist
git rm -r --cached sushi-tracker/dist

# Borra los archivos antiguos del sitio (css/, js/, index.html, todoApp/, snake/ en su versión vieja...)
# — pero NO borres la carpeta .git —
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

# Copia aquí dentro TODO el contenido de este paquete (este README y MIGRATION.md incluidos)
```

## 2. Revisar dos enlaces que apuntaban a otro repositorio

* En `src/components/Projects.jsx`, el botón "View Code" de **TODO APP** ahora apunta a
  `github.com/PEDROMIRAS/pedromiras.github.io/tree/main/todoApp` (antes apuntaba a tu repo `DAW2`,
  que se quedaría con la versión antigua en JavaScript). Si prefieres mantener el enlace a `DAW2`, cámbialo.
* Añadí una nueva tarjeta de proyecto para **Snake** (no estaba enlazada en la web, aunque la carpeta ya
  existía en el repo). Si no quieres mostrarla todavía, borra su bloque en `PROYECTOS` dentro de
  `src/components/Projects.jsx`.

## 3. Verificar en local que los 5 proyectos enlazan bien entre sí — ANTES de hacer push

```bash
npm run build:sitio
```

Esto compila el sitio principal y los 4 proyectos, los monta todos juntos tal como quedarán publicados, y
comprueba sola que las 5 rutas cargan de verdad. Si todo va bien, te deja la URL en la terminal para
abrirla en el navegador y pinchar por los proyectos tú mismo — así lo ves funcionando *antes* de publicar
nada. (`npm run dev` dentro de una carpeta concreta sirve para trabajar en el diseño de ESE proyecto, pero
ahí los enlaces a los demás no van a funcionar: cada uno es un servidor de desarrollo aparte. Más detalle
en el README.)

## 4. Activar GitHub Actions como origen de GitHub Pages

En GitHub → tu repo → **Settings → Pages → Build and deployment → Source**, elige **GitHub Actions**
(en vez de "Deploy from a branch"). Esto solo se hace una vez.

## 5. Commit y push

```bash
git add -A
git commit -m "Migrar todo el portafolio a React"
git push
```

A partir de aquí, cada `push` a `main` ejecuta ese mismo `build:sitio` dentro de GitHub Actions y publica el
resultado (pestaña **Actions** del repo para ver el progreso, ~1-2 minutos). Si algo no verifica, el
*workflow* falla ahí mismo y el sitio publicado no cambia — nunca se queda a medias.

---

## Nota sobre Sushi Tracker

Ya existía un conflicto de dependencias en `sushi-tracker/package.json` (no lo he creado yo):
`vite-plugin-pwa@0.19.8` solo admite Vite hasta la versión 5, pero el proyecto usa Vite 7. Con
`npm install` a secas, falla. El workflow de GitHub Actions ya usa `npm install --legacy-peer-deps`
para esa carpeta (igual que probablemente hiciste tú al instalarlo la primera vez), así que no requiere
ninguna acción por tu parte — lo dejo aquí solo para que sepas por qué ese proyecto es distinto a los demás.
Si en algún momento quieres solucionarlo de raíz, hay que actualizar `vite-plugin-pwa` a una versión que
soporte Vite 7.

## Qué más cambió, en resumen

- **`index.html` (raíz), `css/`, `js/`** → ahora son un proyecto React (`src/`, `vite.config.js`,
  `package.json`), mismo diseño exacto, sin cambios visuales.
- **`todoApp/`** y **`snake/`** → reescritos en React (antes JavaScript vanilla), mismo diseño y
  comportamiento.
- **`ramo-flores-amarillas/`** y **`sushi-tracker/`** → mismo código, solo limpieza: ya no se commitea
  `node_modules` ni `dist` (los genera el CI), y borré dos archivos duplicados sin usar en
  `sushi-tracker/src/components/` (`MainCounter copy.jsx`, `SushiCounter copy.jsx`).
- Los enlaces de "View Project" en la sección Projects ya no apuntan a `.../dist/index.html`, sino
  directamente a la carpeta de cada proyecto (`./snake/`, etc.), porque ahora cada uno se publica en su
  propia ruta en vez de dentro de una subcarpeta `dist/`.
