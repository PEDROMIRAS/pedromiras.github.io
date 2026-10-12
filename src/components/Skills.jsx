// Datos de la sección Skills: una tarjeta por categoría, ordenadas por lo que más uso en el trabajo.
// Iconos de Font Awesome (cargado en index.html).
const CATEGORIAS = [
  {
    titulo: 'Backend',
    items: [
      { icono: 'fa-brands fa-java', nombre: 'Java' },
      { icono: 'fa-solid fa-leaf', nombre: 'Spring Boot' },
      { icono: 'fa-brands fa-php', nombre: 'PHP' },
      { icono: 'fa-brands fa-symfony', nombre: 'Symfony' },
    ],
  },
  {
    titulo: 'Data',
    items: [
      { icono: 'fa-solid fa-table', nombre: 'PL/SQL' },
      { icono: 'fa-solid fa-diagram-project', nombre: 'Talend' },
      { icono: 'fa-solid fa-database', nombre: 'MySQL' },
      { icono: 'fa-solid fa-server', nombre: 'MariaDB' },
      { icono: 'fa-brands fa-envira', nombre: 'MongoDB' },
    ],
  },
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
    titulo: 'Tools',
    items: [
      { icono: 'fa-brands fa-git-alt', nombre: 'Git' },
      { icono: 'fa-brands fa-github', nombre: 'GitHub' },
      { icono: 'fa-brands fa-gitlab', nombre: 'GitLab' },
      { icono: 'fa-brands fa-jira', nombre: 'Jira' },
      { icono: 'fa-brands fa-microsoft', nombre: 'Teams' },
      { icono: 'fa-solid fa-code', nombre: 'VS Code' },
      { icono: 'fa-solid fa-terminal', nombre: 'PL/SQL Developer' },
      { icono: 'fa-solid fa-robot', nombre: 'Claude' },
      { icono: 'fa-solid fa-brain', nombre: 'AI-assisted development' },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="skills" aria-label="Skills">
      <h2 className="section-title">SKILLS</h2>

      <div className="skills-container">
        {CATEGORIAS.map((categoria) => (
          <article key={categoria.titulo} className="skills-group glass-card">
            <h3 className="skill-category-title">{categoria.titulo}</h3>
            <ul className="skills-list">
              {categoria.items.map((item) => (
                <li key={item.nombre} className="skills-item">
                  <i className={item.icono} aria-hidden="true" />
                  <span>{item.nombre}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
