export default function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Pedro Miras</p>
      <ul className="footer-links">
        <li>
          <a href="https://github.com/PEDROMIRAS" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/pedro-miras/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="#home">Back to top</a>
        </li>
      </ul>
    </footer>
  );
}
