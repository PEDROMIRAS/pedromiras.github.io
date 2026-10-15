import { motion } from 'motion/react';
import Icono from './Icono.jsx';
import { SUBIDA } from '../movimiento.js';
import Titulo from './Titulo.jsx';

// Datos de la sección Skills: una tarjeta por categoría, ordenadas por lo que más uso en el trabajo.
// Los iconos son los <symbol> de public/assets/img/iconos.svg.
export const CATEGORIAS = [
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

const LISTA = { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const ETIQUETA = { oculto: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { ...SUBIDA, duration: 0.5 } } };

export default function Skills() {
  return (
    <section id="skills" className="skills" aria-label="Skills">
      <Titulo>SKILLS</Titulo>

      <div className="skills-container">
        {CATEGORIAS.map((categoria) => (
          <motion.article
            key={categoria.titulo}
            className="skills-group glass-card"
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="skill-category-title">{categoria.titulo}</h3>
            <motion.ul className="skills-list" variants={LISTA}>
              {categoria.items.map((item) => (
                <motion.li key={item.nombre} className="skills-item" variants={ETIQUETA}>
                  <Icono nombre={item.icono} />
                  <span>{item.nombre}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
