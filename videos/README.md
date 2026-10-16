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
```

Después, copiar el vídeo de `out/` a `../public/assets/video/` (la imagen del enlace va a `../public/assets/img/`) y ponerlo en la página con `<video autoplay muted loop playsinline>`.

## Código

- [src/Root.tsx](src/Root.tsx): registra los vídeos (`<Composition>`), cada uno con su id, duración, fps y tamaño.
- [src/Ondas.tsx](src/Ondas.tsx): ondas de luz de la paleta en bucle, el fondo de la sección Skills (`public/assets/video/ondas.mp4` y su póster `ondas-poster.jpg`).
- [src/Tarjeta.tsx](src/Tarjeta.tsx): la imagen que sale al compartir el enlace (og:image, 1200x630), con la portada de la web.
- [remotion.config.ts](remotion.config.ts): opciones del render. Lee las imágenes de la carpeta `public/` del portfolio.

## Licencia

Remotion es gratis para personas y equipos de hasta 3; para una empresa más grande hace falta su licencia ([condiciones](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)).
