import { motion } from 'motion/react';
import Titulo from './Titulo.jsx';
import { SUBIDA } from '../movimiento.js';

// Trayectoria: trabajo actual y formación. Los datos van en una lista, igual que en Skills y Projects.
const ETAPAS = [
  {
    periodo: 'Jul 2026 - Present',
    titulo: 'Rising Software Engineer',
    lugar: 'NTT DATA · Logistics industry',
    descripcion:
      'I maintain and improve the software behind a parcel delivery service: resolving incidents with the code, the database and shipments, building and changing components, and developing ETL processes and PL/SQL.',
    etiquetas: ['Spring Boot', 'PL/SQL', 'Talend', 'Jira'],
  },
  {
    periodo: '2026 · 3.5 months',
    titulo: 'Internship',
    lugar: 'NTT DATA · Logistics industry',
    descripcion: 'Work placement for my degree, on the same project I work on today.',
  },
  {
    periodo: '2024 - 2026',
    titulo: 'Higher Degree in Web Application Development',
    lugar: 'IES Miguel Hernández · Alhama de Murcia',
    descripcion:
      'Front-end and back-end web development: HTML, CSS, JavaScript, PHP, Java and relational databases.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="experience" aria-labelledby="experience-title">
      <Titulo id="experience-title">Experience</Titulo>

      <div className="experience-container">
        {ETAPAS.map((etapa) => (
          <motion.article
            key={etapa.titulo}
            className="experience-item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={SUBIDA}
          >
            <span className="experience-period">{etapa.periodo}</span>
            <h3>{etapa.titulo}</h3>
            {etapa.lugar && <p className="experience-place">{etapa.lugar}</p>}
            <p>{etapa.descripcion}</p>
            {etapa.etiquetas && (
              <ul className="tags" aria-label="Technologies">
                {etapa.etiquetas.map((etiqueta) => (
                  <li key={etiqueta}>{etiqueta}</li>
                ))}
              </ul>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
