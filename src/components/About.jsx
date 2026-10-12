// Edad calculada a partir de la fecha de nacimiento: se actualiza sola cada 22 de septiembre.
function edad() {
  const hoy = new Date();
  const yaCumplio = hoy >= new Date(hoy.getFullYear(), 8, 22); // mes 8 = septiembre
  return hoy.getFullYear() - 2000 - (yaCumplio ? 0 : 1);
}

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
            I’m Pedro Miras, a {edad()}-year-old Web Developer from Lorca, Spain. I currently work at NTT DATA as
            a Rising Software Engineer in the logistics industry area, where I’m part of a customer technology team
            that maintains and improves the software behind a parcel delivery service.
          </p>
          <p>
            I graduated in Web Application Development and enjoy building efficient, user-friendly solutions. I’m
            always keen to learn new technologies, solve real problems and keep growing as a developer.
          </p>
        </div>
      </div>
    </section>
  );
}
