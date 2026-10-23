(async () => {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  // Los campos de React solo se enteran del valor con el setter nativo y un evento input
  const escribir = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const boton = (texto) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(texto));
  const pestana = (texto) => [...document.querySelectorAll('nav button')].find((b) => b.textContent.includes(texto));
  const pedir = async (plato, mas, quienes) => {
    boton(plato).click();
    await esperar(400);
    for (let i = 0; i < mas; i++) document.querySelector('[aria-label="Más"]').click();
    for (const q of quienes) {
      const casilla = [...document.querySelectorAll('dialog label')].find((l) => l.textContent.trim() === q)?.querySelector('input');
      if (casilla && !casilla.checked) casilla.click();
    }
    boton('Aceptar').click();
    await esperar(500);
  };

  // Preparación rápida (se recorta del vídeo): la misma cena que en la otra grabación
  await esperar(300);
  boton('Nueva cena').click();
  await esperar(700);
  boton('Merendero Padilla').click();
  await esperar(1000);
  const nombre = document.querySelector('#nombre');
  for (const n of ['Lucía', 'Marcos', 'Irene']) { escribir(nombre, n); boton('Añadir').click(); await esperar(250); }
  pestana('Carta').click();
  await esperar(700);
  await pedir('Morcillas', 2, ['Lucía', 'Marcos']);
  await pedir('Patatas chips', 0, []);
  await pedir('Cerveza 1/3', 2, ['Irene']);
  await pedir('Ensalada', 0, ['Irene']);
  pestana('Pagar').click();
  await esperar(1200);

  window.__inicio = performance.now(); // desde aquí se recorta el vídeo
  await esperar(700);
  // Marcos pone 10 €, la app dice cuánto falta y Lucía pone justo eso
  const campos = () => [...document.querySelectorAll('main input[inputmode="decimal"]')];
  const poner = async (campo, texto) => {
    campo.focus();
    for (let i = 1; i <= texto.length; i++) { escribir(campo, texto.slice(0, i)); await esperar(150); }
    await esperar(300);
    // sin ventana la página no tiene foco y blur() no avisa; React escucha focusout para onBlur
    campo.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  };
  await poner(campos()[1], '10');
  await esperar(1500);
  const falta = document.querySelector('main .text-warn').textContent.match(/[\d.,]+/)[0];
  await poner(campos()[0], falta);
  await esperar(2400);
  boton('A partes iguales').click();
  await esperar(2200);
  return Math.round(performance.now() - window.__inicio);
})()
