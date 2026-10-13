# Snake

El juego clásico de la serpiente en React (Vite). Forma parte del [portfolio](../README.md).

Demo: <https://pedromiras.github.io/snake/>

## Cómo se juega

- Se mueve con las flechas del teclado o deslizando el dedo en el móvil.
- Cada fruta hace crecer a la serpiente y suma puntos.
- Los bordes del tablero (30 × 30 celdas) se atraviesan: sales por un lado y entras por el otro.
- La partida termina al chocar con tu propio cuerpo.
- La mejor puntuación se guarda en el navegador (`localStorage`).

## Código

- [src/juego.js](src/juego.js): las reglas del juego, sin nada de React.
- [src/juego.test.js](src/juego.test.js): tests de esas reglas.
- [src/App.jsx](src/App.jsx): el tablero, el teclado y los gestos táctiles.

## Uso en local

```bash
npm install
npm run dev     # servidor de desarrollo
npm test        # tests de las reglas
npm run build   # versión de producción en dist/
```
