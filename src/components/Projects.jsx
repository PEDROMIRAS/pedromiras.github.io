// Datos de cada proyecto. Todos son mini-apps aparte (su propia carpeta, su propio
// build), enlazadas por ruta relativa: el flujo de trabajo de GitHub Actions las
// compila y las coloca junto a este sitio, cada una en su propia carpeta.
const REPO = 'https://github.com/PEDROMIRAS/pedromiras.github.io/tree/main';

const PROYECTOS = [
  {
    nombre: 'Ramo de flores',
    descripcion: `A different bouquet of flowers every time. Choose a color, tap, and it blooms: each bouquet
      is drawn at random as an SVG, so no two are alike. Installable, and it works offline.`,
    etiquetas: ['React', 'SVG', 'PWA'],
    carpeta: 'ramo-flores-amarillas',
    imagen: { src: './assets/img/ramo-flores.png', ancho: 1280, alto: 720 },
    alt: 'Bouquet of flowers in every color',
  },
  {
    nombre: 'Todo App',
    descripcion: `A task manager: add, complete and delete tasks, filter them and see live statistics.
      Everything is saved in the browser.`,
    etiquetas: ['React', 'localStorage'],
    carpeta: 'todoApp',
    imagen: { src: './assets/img/todo-app.png', ancho: 1280, alto: 720 },
    alt: 'Task list application',
  },
  {
    nombre: 'Sushi Tracker',
    descripcion: `A mobile-first counter for sushi nights, with a single-player mode, a two-player duel on a
      split screen and a history of past sessions. Installable, and it works offline.`,
    etiquetas: ['React', 'Tailwind CSS', 'PWA'],
    carpeta: 'sushi-tracker',
    imagen: { src: './assets/img/sushi-tracker.png', ancho: 1280, alto: 720 },
    alt: 'Sushi counter application',
  },
  {
    nombre: 'Snake',
    descripcion: `The classic game. Move with the arrow keys or by swiping on a phone, eat fruit to grow and
      cross the edges of the board. It keeps your score and your best result.`,
    etiquetas: ['React', 'JavaScript'],
    carpeta: 'snake',
    imagen: { src: './assets/img/snake.png', ancho: 1280, alto: 720 },
    alt: 'Snake game board',
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
          <article key={p.nombre} className="project glass-card">
            <a className="project-image" href={`./${p.carpeta}/`} target="_blank" rel="noopener noreferrer">
              <img src={p.imagen.src} alt={p.alt} width={p.imagen.ancho} height={p.imagen.alto} loading="lazy" />
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
                <a href={`./${p.carpeta}/`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Live Demo
                </a>
                <a href={`${REPO}/${p.carpeta}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Source Code
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
