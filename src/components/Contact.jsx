import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAIL_CONFIG = {
  serviceID: 'service_ntefp7r',
  templateID: 'template_sn1p69p',
  publicKey: 'QEkORHd0mpii5vUSm',
};

export default function Contact() {
  const formRef = useRef(null);
  const [enviando, setEnviando] = useState(false);
  // { texto, tipo: 'success' | 'error' } — igual que el form-message del sitio original
  const [mensaje, setMensaje] = useState(null);

  const enviar = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const datos = {
      from_name: 'Mi Portfolio Contact Form', // aparecerá como remitente
      reply_to: form.email.value,
      name: form.name.value.trim(),
      email: form.email.value.trim(),
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
        <div className="contact-links">
          <div className="link">
            <a
              href="https://github.com/PEDROMIRAS"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-interactive"
            >
              <i className="fa-brands fa-github" />
              GitHub
            </a>
          </div>
          <div className="link">
            <a
              href="https://www.linkedin.com/in/pedro-miras/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-interactive"
            >
              <i className="fa-brands fa-linkedin" />
              LinkedIn
            </a>
          </div>
          <div className="link">
            <a href="mailto:p.miraspc35@gmail.com" className="glass-card glass-card-interactive">
              <i className="fa-regular fa-envelope" />
              Gmail
            </a>
          </div>
        </div>

        <div className="contact-form glass-card">
          <form aria-label="Contact Form" ref={formRef} onSubmit={enviar}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your Name" required aria-required="true" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Your Email" required aria-required="true" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Your Message" required aria-required="true" />
            </div>
            {mensaje && <div className={`form-message form-message-${mensaje.tipo}`}>{mensaje.texto}</div>}
            <button type="submit" disabled={enviando}>
              {enviando ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
