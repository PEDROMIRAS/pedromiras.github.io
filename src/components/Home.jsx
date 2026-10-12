export default function Home() {
  return (
    <section id="home" className="home">
      <div className="home-content">
        <h1>
          Hello, I'm <span>Pedro Miras</span>
        </h1>
        <h2>Web Developer · NTT DATA</h2>
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
              <i className="fa-brands fa-github" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/pedro-miras/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fa-brands fa-linkedin" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>

      <a href="#about" className="home-scroll" aria-label="Scroll to About">
        <i className="fa-solid fa-chevron-down" aria-hidden="true" />
      </a>
    </section>
  );
}
