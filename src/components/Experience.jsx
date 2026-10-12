// Trayectoria: trabajo actual y formación. Los datos van en una lista, igual que en Skills y Projects.
const ETAPAS = [
  {
    periodo: 'Jul 2026 – Present',
    titulo: 'Rising Software Engineer',
    lugar: 'NTT DATA · Logistics industry',
    descripcion:
      'Part of the customer technology team, maintaining and improving the software behind a parcel delivery service.',
    etiquetas: ['Spring Boot', 'PL/SQL', 'Talend', 'Jira'],
  },
  {
    periodo: 'Education · 2 years',
    titulo: 'Higher Degree in Web Application Development',
    lugar: 'IES Miguel Hernández · Alhama de Murcia',
    descripcion:
      'Front-end and back-end web development: HTML, CSS, JavaScript, PHP, Java and relational databases.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="experience" aria-labelledby="experience-title">
      <h2 id="experience-title" className="section-title">
        EXPERIENCE
      </h2>

      <div className="experience-container">
        {ETAPAS.map((etapa) => (
          <article key={etapa.titulo} className="experience-item glass-card">
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
          </article>
        ))}
      </div>
    </section>
  );
}
