import Titulo from './Titulo.jsx';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-content">
        <figure className="about-img">
          <img src="./assets/img/portfolio-image.webp" alt="Pedro Miras, Web Developer" width="560" height="560" loading="lazy" />
        </figure>
        <div className="about-text">
          <Titulo className="about-title">ABOUT ME</Titulo>
          <p>
            I’m Pedro Miras, a Web Developer from Lorca, Spain. I work at NTT DATA on the software behind a parcel
            delivery service, mostly with Spring Boot, PL/SQL and Talend.
          </p>
          <p>
            In my own time I build small web apps like the ones below, mostly to try ideas out. Away from the
            keyboard, you’ll probably find me riding my motorbike.
          </p>
        </div>
      </div>
    </section>
  );
}
