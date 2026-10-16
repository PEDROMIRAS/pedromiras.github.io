(async () => {
  const DUELO = true;
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  // Los campos de React solo se enteran del valor con el setter nativo y un evento input
  const escribir = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const boton = (texto) => [...document.querySelectorAll('button')].find((b) => b.textContent.includes(texto));
  await esperar(500);
  const nombre = document.querySelector('input[placeholder="Tu nombre..."]');
  if (nombre) {
    for (const n of ['P', 'Pe', 'Ped', 'Pedr', 'Pedro']) { escribir(nombre, n); await esperar(90); }
    await esperar(300);
    boton('Empezar a contar').click();
    await esperar(900);
  }
  if (DUELO) { document.querySelector('[aria-label="Modo duelo"]').click(); await esperar(600); }
  boton('A Comer').click();
  await esperar(1200);
  window.__inicio = performance.now(); // desde aquí se recorta el vídeo
  const mas = () => [...document.querySelectorAll('[aria-label="Añadir una pieza"]')];
  for (let i = 0; i < 12; i++) {
    const botones = mas();
    // En duelo, el rival come algo más despacio que Pedro
    const b = DUELO ? (i % 3 === 2 ? botones[0] : botones[botones.length - 1]) : botones[0];
    b.click();
    await esperar(DUELO ? 420 : 520);
  }
  await esperar(900);
  return Math.round(performance.now() - window.__inicio);
})()
