import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Cinta from './components/Cinta.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  // Al llegar con un ancla (#projects, desde las apps) la sección aún no existía cuando el navegador la buscó
  useEffect(() => {
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
  }, []);

  // reducedMotion="user": con «reducir movimiento» nada se desplaza; solo se funde
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Home />
        <Cinta />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
