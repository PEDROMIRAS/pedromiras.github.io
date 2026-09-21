# Ramo de flores

Página en React (Vite) con tres pantallas:

1. **Elegir color**: "Toca para elegir el color de tu ramo de flores" y ocho flores para tocar
   (amarillas, naranjas, rojas, rosas, moradas, azules, blancas o mezcla).
2. **Mensaje del color**: "Toca para recibir tu ramo de flores rojas".
3. **Ramo**: florece un ramo distinto cada vez.

En las pantallas 2 y 3 hay un único botón **Volver** (esquina superior izquierda) que lleva
siempre a la pantalla 1 (elegir color).

Puedes compartir el enlace con un color ya elegido (salta la pantalla 1): `index.html?color=rojas`
(valores: amarillas, naranjas, rojas, rosas, moradas, azules, blancas, multi).

## Comandos

    npm install
    npm run dev      # desarrollo en http://localhost:5173
    npm run build    # genera dist/index.html

`npm run build` deja en `dist/` la web lista: `index.html` (JS y CSS incluidos), `manifest.webmanifest`,
`sw.js` e `icons/`. **Sube la carpeta entera** (no solo `index.html`) a Netlify, Vercel, GitHub Pages,
tu hosting o cualquier servidor estático.

## Instalar como app

La página es instalable (PWA) y funciona sin conexión una vez abierta. Requisitos:

- Subir todos los archivos de `dist/` y servirlos por **https** (Netlify, Vercel y GitHub Pages ya lo hacen).
  Abriendo `index.html` con doble clic la web funciona, pero no se puede instalar.
- Android (Chrome, Edge, Samsung Internet) y ordenador: en la primera pantalla aparece el botón **Instalar**.
- iPhone/iPad: Safari no permite instalar con un botón; **Instalar** muestra los pasos
  (Compartir > Añadir a pantalla de inicio).
- Si ya se usa como app, el botón no aparece.

Nombre, colores e iconos: `public/manifest.webmanifest` y `public/icons/` (192, 512, maskable 512 y 180 para iPhone).
Si publicas cambios, sube el número de `VERSION` en `public/sw.js` para que los móviles renueven su copia.

## Estructura

- `src/App.jsx`         controla qué pantalla se ve (color / mensaje / ramo) y el tema de la página
- `src/Colores.jsx`     pantalla 1: mensaje genérico y flores para elegir
- `src/paletas.js`      colores de cada opción: tonos de flor, fondo de la página, lazo y flores permitidas
- `src/generarRamo.js`  genera los datos de cada ramo (tipos de flor, tonos, posiciones, hojas)
- `src/Ramo.jsx`        dibuja el ramo como SVG
- `src/Volver.jsx`      botón Volver
- `src/Instalar.jsx`    botón Instalar y ayuda para iPhone (`src/instalacion.js` guarda el estado)
- `src/Brote.jsx`       capullo de la pantalla 2
- `src/styles.css`      estilos y animaciones

Para añadir un color nuevo: agrega una entrada en `PALETAS` y su clave en `ORDEN` (`paletas.js`).
La cuadrícula de la pantalla 1 tiene 4 columnas (`.colores` en `styles.css`).
