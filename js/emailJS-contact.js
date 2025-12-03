const EMAIL_CONFIG = {
    serviceID: 'service_ntefp7r',
    templateID: 'template_sn1p69p',
    publicKey: 'QEkORHd0mpii5vUSm'
};

// Inicializar EmailJS con tu Public Key
emailjs.init(EMAIL_CONFIG.publicKey);

//Manejo del formulario
const contactForm = document.querySelector('.contact-form form');
const submitButton = document.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', function(e){
    e.preventDefault(); //Prevenir recarga de pagina

    //Deshabilitar botton mientras se envia para reducir el riesgo de fallo
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }

    //Enviar email usando EmailJS
    emailjs.send(
        EMAIL_CONFIG.serviceID,
        EMAIL_CONFIG.templateID,
        formData
    )
    .then(function(response){
        console.log('Email enviado', response.status, response.text);

        showMessage('Mensaje enviado correctamente. Te responderé pronto.', 'success');

        //Limpiar formulario
        contactForm.reset();

        //Devolver el botton a sus estado inicial
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    })
    .catch(function(error){
        console.log('Error al enviar el email', error);

        showMessage('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');

        //Devolver el botton a sus estado inicial
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    });
});

//Mostrar mensajes en el formulario
function showMessage(text,type){
    //Crear elemento para poder mostrar el mensaje
    const message = document.createElement('div');
    message.className = `form-message form-message-${type}`;
    message.textContent = text;

    //Insertar antes del botón
    const buttonContainer = submitButton.parentElement;
    buttonContainer.insertBefore(message, submitButton);

    //Quitar el mensaje despues de un tiempo predefinido
    setTimeout(()=>{
        message.remove();
    },5000);
}