import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Icono from './Icono.jsx';

const EMAIL = 'p.miraspc35@gmail.com';

const EMAIL_CONFIG = {
  serviceID: 'service_ntefp7r',
  templateID: 'template_sn1p69p',
  publicKey: 'QEkORHd0mpii5vUSm',
};

export default function Contact() {
  const formRef = useRef(null);
  const [enviando, setEnviando] = useState(false);
  // { texto, tipo: 'success' | 'error' }
  const [mensaje, setMensaje] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const copiarEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* sin permiso para el portapapeles: el enlace mailto sigue funcionando */
    }
  };

  const enviar = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const email = form.email.value.trim();
    const datos = {
      from_name: 'Mi Portfolio Contact Form', // aparecerá como remitente
      reply_to: email,
      name: form.name.value.trim(),
      email,
      message: form.message.value.trim(),
    };

    setEnviando(true);
    setMensaje(null);

    emailjs
      .send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.templateID, datos, { publicKey: EMAIL_CONFIG.publicKey })
      .then(() => {
        setMensaje({ texto: 'Message sent successfully. I will get back to you soon.', tipo: 'success' });
        form.reset();
      })
      .catch((error) => {
        console.error('Error al enviar el email', error);
        setMensaje({ texto: 'There was an error sending the message. Please try again.', tipo: 'error' });
      })
      .finally(() => setEnviando(false));
  };

  return (
    <section id="contact" className="contact">
      <h2 className="section-title">CONTACT</h2>
      <div className="contact-container">
        <div className="contact-info">
          <h3>Let’s talk</h3>
          <p>
            I’m always happy to talk about technology or compare notes with other developers. I’m not looking for a
            new job right now.
          </p>

          <div className="contact-email glass-card">
            <Icono nombre="envelope" />
            <a href={`mailto:${EMAIL}`} >
              {EMAIL}
            </a>
            <button type="button" className="btn btn-outline" onClick={copiarEmail}>
              {copiado ? 'Copied!' : 'Copy'}
            </button>
            <span role="status" className="sr-only">
              {copiado ? 'Email address copied' : ''}
            </span>
          </div>

          <ul className="contact-social">
            <li>
              <a href="https://github.com/PEDROMIRAS" target="_blank" rel="noopener noreferrer">
                <Icono nombre="github" />
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/pedro-miras/" target="_blank" rel="noopener noreferrer">
                <Icono nombre="linkedin" />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <div className="contact-form glass-card">
          <form aria-label="Contact Form" ref={formRef} onSubmit={enviar}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" autoComplete="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" autoComplete="email" required />
            </div>
            <div className="form-group full-width">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required />
            </div>
            {/* role="status": los lectores de pantalla anuncian el resultado del envío */}
            <div role="status">
              {mensaje && <p className={`form-message form-message-${mensaje.tipo}`}>{mensaje.texto}</p>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
