let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    // Siempre visible si estamos arriba del todo
    if (currentScroll <= 0) {
        header.classList.remove("nav-hidden");
        return;
    }

    // Si estamos bajando → ocultar
    if (currentScroll > lastScroll) {
        header.classList.add("nav-hidden");
    } 
    // Si estamos subiendo → mostrar
    else {
        header.classList.remove("nav-hidden");
    }

    lastScroll = currentScroll;
});
