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
            I’m Pedro Miras, a {edad()}-year-old Web Developer from Lorca, Spain. I enjoy building software that is
            simple to use and easy to maintain, from the database to what people see on screen.
          </p>
          <p>
            I’m curious by nature and always keen to learn new technologies and solve real problems. Away from the
            keyboard, you’ll probably find me riding my motorbike.
          </p>
        </div>
      </div>
    </section>
  );
}
