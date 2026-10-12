export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-content">
        <figure className="about-img">
          <img src="./assets/img/portfolio-image.webp" alt="Pedro Miras, Web Developer" loading="lazy" />
        </figure>
        <div className="about-text">
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
            ABOUT ME
          </h2>
          <p>
            I’m Pedro Miras, a 25-year-old Web Developer from Lorca, Spain. I recently graduated in Web Application
            Development and enjoy creating efficient, user-friendly web solutions. I am highly motivated to learn new
            technologies, solve challenges, and grow as a developer while contributing to meaningful projects. My
            goal is to combine creativity and technical skills to build websites that people enjoy using.
          </p>
        </div>
      </div>
    </section>
  );
}
