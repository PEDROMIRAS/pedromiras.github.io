(async () => {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  // Los campos de React solo se enteran del valor con el setter nativo y un evento input
  const escribir = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const boton = (texto) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(texto));
  const pestana = (texto) => [...document.querySelectorAll('nav button')].find((b) => b.textContent.includes(texto));
  // Pide un plato: lo toca en la carta, sube la cantidad y marca a quién se reparte
  const pedir = async (plato, mas, quienes) => {
    boton(plato).click();
    await esperar(700);
    for (let i = 0; i < mas; i++) { document.querySelector('[aria-label="Más"]').click(); await esperar(260); }
    for (const q of quienes) {
      const casilla = [...document.querySelectorAll('dialog label')].find((l) => l.textContent.trim() === q)?.querySelector('input');
      if (casilla && !casilla.checked) { casilla.click(); await esperar(220); }
    }
    await esperar(300);
    boton('Aceptar').click();
    await esperar(1100);
  };

  await esperar(400);
  boton('Nueva cena').click();
  await esperar(900);
  boton('Merendero Padilla').click();
  await esperar(1200);
  const nombre = document.querySelector('#nombre');
  for (const n of ['Lucía', 'Marcos', 'Irene']) {
    for (let i = 1; i <= n.length; i++) { escribir(nombre, n.slice(0, i)); await esperar(70); }
    await esperar(200);
    boton('Añadir').click();
    await esperar(500);
  }
  window.__inicio = performance.now(); // desde aquí se recorta el vídeo
  await esperar(500);
  pestana('Carta').click();
  await esperar(1000);
  await pedir('Morcillas', 2, ['Lucía', 'Marcos']);
  await pedir('Patatas chips', 0, []); // recuerda a quién se marcó la última vez
  boton('Bebidas').click();
  await esperar(1100);
  await pedir('Cerveza 1/3', 2, ['Irene']);
  await esperar(800);
  return Math.round(performance.now() - window.__inicio);
})()
