(async () => {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  const input = document.querySelector('#todoInput');
  // Escribe como una persona, letra a letra, y añade con el botón
  const escribir = async (texto) => {
    input.focus();
    for (const letra of texto) { input.value += letra; await esperar(55); }
    await esperar(250);
    document.querySelector('#addBtn').click();
    await esperar(450);
  };
  await esperar(500);
  await escribir('Revisar el ETL de envíos');
  await escribir('Curso de Spring Boot');
  await escribir('Sacar la moto el domingo');
  const marcar = async (n) => { document.querySelectorAll('.todo-checkbox')[n].click(); await esperar(700); };
  await marcar(0);
  await marcar(2);
  const filtro = async (n) => { document.querySelectorAll('.filter-btn')[n].click(); await esperar(1100); };
  await filtro(1);
  await filtro(2);
  await filtro(0);
  // Borra todo al final: el vídeo acaba como empieza, con la lista vacía, y el bucle empalma
  while (document.querySelector('.delete-btn')) { document.querySelector('.delete-btn').click(); await esperar(500); }
  await esperar(700);
  return true;
})()
