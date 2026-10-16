# Vídeos

Vídeos animados para el [portfolio](../README.md), hechos con [Remotion](https://www.remotion.dev/): cada vídeo es un componente de React que se renderiza a MP4 o WebM.

No es una app del sitio: no se publica ni lo construye `scripts/build-sitio.mjs`. Solo se publica el vídeo final, copiado a `public/assets/video/` del portfolio.

## Cómo se usa

```console
npm i            # una vez
npm run dev      # Remotion Studio: vista previa en el navegador mientras se edita
npx remotion render Ondas out/ondas.mp4 --codec=h264 --crf=32 --muted   # exporta a out/ (no se sube a git)
npx remotion still Ondas out/ondas-poster.jpg --frame=0 --image-format=jpeg --jpeg-quality=70
npx remotion still Tarjeta out/og-image.jpg --image-format=jpeg --jpeg-quality=88   # imagen del enlace
npx remotion render TodoDemo out/TodoDemo.mp4 --public-dir=grabaciones --codec=h264 --crf=28 --muted   # igual SnakeDemo y SushiDemo
```

Después, copiar el vídeo de `out/` a `../public/assets/video/` (la imagen del enlace va a `../public/assets/img/`) y ponerlo en la página con `<video autoplay muted loop playsinline>`.

## Código

- [src/Root.tsx](src/Root.tsx): registra los vídeos (`<Composition>`), cada uno con su id, duración, fps y tamaño.
- [src/Ondas.tsx](src/Ondas.tsx): ondas de luz de la paleta en bucle, el fondo de la sección Skills (`public/assets/video/ondas.mp4` y su póster `ondas-poster.jpg`).
- [src/Demos.tsx](src/Demos.tsx): los clips de las tarjetas de Projects (`TodoDemo`, `SnakeDemo`, `SushiDemo`), montados sobre grabaciones reales de las apps publicadas. Van a `public/assets/video/todo-app.mp4`, `snake.mp4` y `sushi-tracker.mp4`.
- [grabaciones/](grabaciones/): las grabaciones en bruto y cómo se hicieron. `node grabaciones/grabar.mjs <url> <guion.js> <salida.mp4> <ancho> <alto>` abre Chrome sin ventana, un guion usa la app (`guion-*.js`) y los fotogramas capturados se juntan en un MP4 con el ffmpeg de Remotion. Por eso esos clips se renderizan con `--public-dir=grabaciones`.
- [src/Tarjeta.tsx](src/Tarjeta.tsx): la imagen que sale al compartir el enlace (og:image, 1200x630), con la portada de la web.
- [remotion.config.ts](remotion.config.ts): opciones del render. Lee las imágenes de la carpeta `public/` del portfolio.

## Licencia

Remotion es gratis para personas y equipos de hasta 3; para una empresa más grande hace falta su licencia ([condiciones](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)).
