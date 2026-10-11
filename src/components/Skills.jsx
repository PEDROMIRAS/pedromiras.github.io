// Datos de la sección Skills: cada categoría con sus iconos (Font Awesome, cargado en index.html).
const CATEGORIAS = [
  {
    titulo: 'Frontend',
    items: [
      { icono: 'fa-brands fa-html5', nombre: 'HTML5' },
      { icono: 'fa-brands fa-css3-alt', nombre: 'CSS3' },
      { icono: 'fa-brands fa-js', nombre: 'JS ES6+' },
      { icono: 'fa-brands fa-bootstrap', nombre: 'Bootstrap' },
    ],
  },
  {
    titulo: 'Backend',
    items: [
      { icono: 'fa-brands fa-java', nombre: 'Java' },
      { icono: 'fa-brands fa-php', nombre: 'PHP' },
      { icono: 'fa-brands fa-symfony', nombre: 'Symfony' },
    ],
  },
  {
    titulo: 'Data',
    items: [
      { icono: 'fa-solid fa-database', nombre: 'MySQL' },
      { icono: 'fa-solid fa-server', nombre: 'MariaDB' },
      { icono: 'fa-brands fa-envira', nombre: 'MongoDB' },
    ],
  },
  {
    titulo: 'Tools',
    items: [
      { icono: 'fa-brands fa-git-alt', nombre: 'Git' },
      { icono: 'fa-brands fa-github', nombre: 'GitHub' },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="skills" aria-label="Skills">
      <h2 className="section-title">SKILLS</h2>

      {CATEGORIAS.map((categoria) => (
        <div key={categoria.titulo}>
          <h3 className="skill-category-title">{categoria.titulo}</h3>
          <div className="skills-container">
            {categoria.items.map((item) => (
              <div key={item.nombre} className="skills-item glass-card glass-card-interactive">
                <i className={item.icono} />
                <span>{item.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
