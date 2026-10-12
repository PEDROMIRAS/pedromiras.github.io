import Icono from './Icono.jsx';

// Datos de la sección Skills: una tarjeta por categoría, ordenadas por lo que más uso en el trabajo.
// Los iconos son los <symbol> de public/assets/img/iconos.svg.
const CATEGORIAS = [
  {
    titulo: 'Backend',
    items: [
      { icono: 'java', nombre: 'Java' },
      { icono: 'springboot', nombre: 'Spring Boot' },
      { icono: 'php', nombre: 'PHP' },
      { icono: 'symfony', nombre: 'Symfony' },
    ],
  },
  {
    titulo: 'Data',
    items: [
      { icono: 'table', nombre: 'PL/SQL' },
      { icono: 'talend', nombre: 'Talend' },
      { icono: 'mysql', nombre: 'MySQL' },
      { icono: 'mariadb', nombre: 'MariaDB' },
      { icono: 'mongodb', nombre: 'MongoDB' },
    ],
  },
  {
    titulo: 'Frontend',
    items: [
      { icono: 'html5', nombre: 'HTML5' },
      { icono: 'css3-alt', nombre: 'CSS3' },
      { icono: 'js', nombre: 'JS ES6+' },
      { icono: 'bootstrap', nombre: 'Bootstrap' },
    ],
  },
  {
    titulo: 'Tools',
    items: [
      { icono: 'git-alt', nombre: 'Git' },
      { icono: 'github', nombre: 'GitHub' },
      { icono: 'gitlab', nombre: 'GitLab' },
      { icono: 'jira', nombre: 'Jira' },
      { icono: 'microsoft', nombre: 'Teams' },
      { icono: 'code', nombre: 'VS Code' },
      { icono: 'terminal', nombre: 'PL/SQL Developer' },
      { icono: 'claude', nombre: 'Claude' },
      { icono: 'brain', nombre: 'AI-assisted development' },
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
                  <Icono nombre={item.icono} />
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
