// Idioma original de la página
let currentLang = "en";

// Inicializar Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "en",
            includedLanguages: "en,es"
        },
        "google_translate_element"
    );
}

// Función para cambiar idioma
function toggleLanguage() {
    const combo = document.querySelector(".goog-te-combo");

    if (!combo) return;

    // Cambiar idioma
    const newLang = currentLang === "en" ? "es" : "en";
    combo.value = newLang;
    combo.dispatchEvent(new Event("change"));

    // Actualizar estado
    currentLang = newLang;

    // Cambiar texto del botón
    const btn = document.getElementById("lang-toggle-btn");
    btn.textContent = currentLang === "en" ? "ES" : "EN";
}