import { useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { usePausa, useVideoPausado } from '../pausa.js';
import Titulo from './Titulo.jsx';

// Datos de cada proyecto. Todos son mini-apps aparte (su propia carpeta, su propio
// build), enlazadas por ruta relativa: el flujo de trabajo de GitHub Actions las
// compila y las coloca junto a este sitio, cada una en su propia carpeta.
const REPO = 'https://github.com/PEDROMIRAS/pedromiras.github.io/tree/main';

// Clip de la app en uso (grabación real montada con Remotion, videos/src/Demos.tsx). Solo se descarga al
// acercarse a Projects; hasta entonces, y con reducir movimiento, se ve la captura
function Clip({ p }) {
  const clip = useRef(null);
  const cerca = useInView(clip, { once: true, margin: '300px' });
  const quieta = useReducedMotion();
  const pausado = usePausa();
  useVideoPausado(clip, pausado);
  if (quieta) return <img src={p.imagen.src} alt={p.alt} width={p.imagen.ancho} height={p.imagen.alto} loading="lazy" />;
  return (
    <video
      ref={clip}
      src={cerca ? p.video : undefined}
      poster={p.imagen.src}
      width={p.imagen.ancho}
      height={p.imagen.alto}
      autoPlay={!pausado}
      muted
      loop
      playsInline
    />
  );
}

// Ramo de flores sigue en el repositorio y publicado en su carpeta, pero no se enseña aquí.
// `demo` y `codigo` solo hacen falta en proyectos con repo propio; los demás salen de `carpeta`.
const PROYECTOS = [
  {
    nombre: 'Yo pago lo mío',
    descripcion: `Splits the bill of a group dinner. Pick the restaurant’s menu, mark who shares each dish, and it
      works out what everyone owes and who pays whom, to the cent. Installable, and it works offline.`,
    etiquetas: ['React', 'TypeScript', 'Tailwind CSS', 'PWA', 'UI in Spanish'],
    demo: 'https://pedromiras.github.io/yo-pago-lo-mio/',
    codigo: 'https://github.com/PEDROMIRAS/yo-pago-lo-mio',
    imagen: { src: './assets/img/yo-pago-lo-mio.webp', ancho: 1280, alto: 720 },
    video: './assets/video/yo-pago-lo-mio.mp4',
    alt: 'Dinner bill splitting application',
  },
  {
    nombre: 'Todo App',
    descripcion: `A task manager: add, complete and delete tasks, filter them and see live statistics.
      Everything is saved in the browser.`,
    etiquetas: ['React', 'localStorage', 'UI in Spanish'],
    carpeta: 'todoApp',
    imagen: { src: './assets/img/todo-app.webp', ancho: 1280, alto: 720 },
    video: './assets/video/todo-app.mp4',
    alt: 'Task list application',
  },
  {
    nombre: 'Sushi Tracker',
    descripcion: `A mobile-first counter for sushi nights, with a single-player mode, a two-player duel on a
      split screen and a history of past sessions that an optional account keeps in the cloud.
      Installable, and it works offline.`,
    etiquetas: ['React', 'Tailwind CSS', 'Supabase', 'PWA', 'UI in Spanish'],
    carpeta: 'sushi-tracker',
    imagen: { src: './assets/img/sushi-tracker.webp', ancho: 1280, alto: 720 },
    video: './assets/video/sushi-tracker.mp4',
    alt: 'Sushi counter application',
  },
  {
    nombre: 'Snake',
    descripcion: `The classic game. Move with the arrow keys or by swiping on a phone, eat fruit to grow and
      don’t hit the walls or your own tail. It keeps your score and your best result.`,
    etiquetas: ['React', 'JavaScript'],
    carpeta: 'snake',
    imagen: { src: './assets/img/snake.webp', ancho: 1280, alto: 720 },
    video: './assets/video/snake.mp4',
    alt: 'Snake game board',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <Titulo id="projects-title">Projects</Titulo>
      <p className="projects-intro">
        Small apps I build in my own time to try ideas out. My day-to-day work is back end and data, and it stays
        private.
      </p>

      <div className="projects-container">
        {PROYECTOS.map((p) => {
          const demo = p.demo ?? `./${p.carpeta}/`;
          const codigo = p.codigo ?? `${REPO}/${p.carpeta}`;
          return (
            <article key={p.nombre} className="project glass-card">
              <a
                className="project-image"
                href={demo}
                tabIndex={-1}
                aria-hidden="true"
              >
                <Clip p={p} />
              </a>
              <div className="project-body">
                <h3 className="project-name">{p.nombre}</h3>
                <p>{p.descripcion}</p>
                <ul className="tags" aria-label="Technologies">
                  {p.etiquetas.map((etiqueta) => (
                    <li key={etiqueta}>{etiqueta}</li>
                  ))}
                </ul>
                <div className="project-links">
                  <a
                    href={demo}
                    className="btn btn-primary"
                    aria-label={`Live demo: ${p.nombre}`}
                  >
                    Live demo
                  </a>
                  <a
                    href={codigo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    aria-label={`Source code: ${p.nombre}`}
                  >
                    Source code
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
