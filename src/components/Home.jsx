import Icono from './Icono.jsx';

export default function Home() {
  return (
    <section id="home" className="home">
      <div className="home-content">
        <h1>
          Hello, I’m <span>Pedro Miras</span>
        </h1>
        <p className="home-puesto">
          Web Developer<span className="home-sep"> · </span>
          <span className="home-empresa">NTT DATA</span>
        </p>
        <p>I build and maintain web applications, from the database to the interface.</p>

        <div className="home-actions">
          <a href="#projects" className="btn btn-primary">
            View My Projects
          </a>
          <a href="#contact" className="btn btn-outline">
            Contact Me
          </a>
        </div>

        <ul className="home-social">
          <li>
            <a href="https://github.com/PEDROMIRAS" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Icono nombre="github" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/pedro-miras/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Icono nombre="linkedin" />
            </a>
          </li>
        </ul>
      </div>

      <a href="#about" className="home-scroll" aria-label="Scroll to About">
        <Icono nombre="chevron-down" />
      </a>
    </section>
  );
}
