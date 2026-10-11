// Datos de cada proyecto. Todos son mini-apps aparte (su propia carpeta, su propio
// build), enlazadas por ruta relativa: el flujo de trabajo de GitHub Actions las
// compila y las coloca junto a este sitio, cada una en su propia carpeta.
const PROYECTOS = [
  {
    nombre: 'Ramo de flores',
    descripcion: `An interactive page that gives you a different bouquet of flowers every time. You choose a
      color (yellow, orange, red, pink, purple, blue, white or a mix), tap, and the bouquet
      blooms. Each one is generated at random as an SVG, so the flower types, shades, positions
      and leaves are never the same. Built with React and Vite, fully responsive, and installable
      as an app that also works offline.`,
    url: './ramo-flores-amarillas/',
    imagen: './assets/img/ramo-flores.png',
    alt: 'Página del ramo de flores con un ramo de todos los colores',
    codigo: 'https://github.com/PEDROMIRAS/pedromiras.github.io/tree/main/ramo-flores-amarillas',
  },
  {
    nombre: 'TODO APP',
    descripcion: `A task management application built with React. This project demonstrates my skills in
      component-based UI, state management with hooks, and localStorage for data persistence.
      Features include task filtering (all, active, completed), real-time statistics, smooth
      animations, and a responsive design that adapts to any device.`,
    url: './todoApp/',
    imagen: './assets/img/todoApp.png.png',
    alt: 'Aplicacion lista de tareas',
    codigo: 'https://github.com/PEDROMIRAS/pedromiras.github.io/tree/main/todoApp',
  },
  {
    nombre: 'SUSHI TRACKER',
    descripcion: `A mobile-first web application designed to track sushi consumption, built with React (Vite) and Tailwind CSS.
      This project demonstrates my proficiency in modern React hooks, specifically utilizing lazy initialization for
      optimized rendering performance, and implementing localStorage for persistent historical data. Key features
      include a premium dark mode UI, interactive micro-animations, an off-canvas history drawer, and a fully
      responsive design tailored for touch interactions.`,
    url: './sushi-tracker/',
    imagen: './assets/img/sushi-tracker.png',
    alt: 'Aplicacion contador de sushi',
    codigo: 'https://github.com/PEDROMIRAS/pedromiras.github.io/tree/main/sushi-tracker',
  },
  {
    nombre: 'SNAKE',
    descripcion: `A classic Snake game rebuilt with React. The board, the snake and the fruit are driven entirely by
      component state and a game loop running on hooks, instead of direct DOM manipulation. Move with the arrow
      keys, eat fruit to grow, and cross an edge of the board to appear on the opposite side.`,
    url: './snake/',
    imagen: './assets/img/snake.png',
    alt: 'Juego de la serpiente',
    codigo: 'https://github.com/PEDROMIRAS/pedromiras.github.io/tree/main/snake',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <h2 id="projects-title" className="section-title">
        PROJECTS
      </h2>

      <div className="projects-container">
        {PROYECTOS.map((p) => (
          <article key={p.nombre} className="project glass-card glass-card-interactive">
            <h3 className="project-name">{p.nombre}</h3>
            <div className="project-info">
              <p>{p.descripcion}</p>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                <img src={p.imagen} alt={p.alt} />
              </a>
            </div>
            <div className="project-links">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                View Project
              </a>
              <a href={p.codigo} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                View Code
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
