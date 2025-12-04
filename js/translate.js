// Limpiar cookies de Google Translate
function clearGoogleTranslateCookies() {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //Limpiamos la cookies para cualquier dominio, window.location.hostname recoge el dominio 
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname;
}

// Limpiar al cargar
clearGoogleTranslateCookies();

// Obtener idioma guardado
let currentLang = localStorage.getItem("userLang") || "en";

// Inicializar Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "en",
            includedLanguages: "en,es",
            autoDisplay: false
        },
        "google_translate_element"
    );
    
    // Aplicar idioma guardado
    setTimeout(() => {
        const combo = document.querySelector(".goog-te-combo");
        if (combo) {
            combo.value = currentLang === "es" ? "es" : "";
            if (currentLang === "es") {
                combo.dispatchEvent(new Event("change"));
            }
            updateButton();
        }
    }, 500);
}

// Función para cambiar idioma
function toggleLanguage() {
    // Cambiar idioma
    const newLang = currentLang === "en" ? "es" : "en";
    
    // Guardar en localStorage
    localStorage.setItem("userLang", newLang);
    
    // Limpiar cookies y recargar
    clearGoogleTranslateCookies();
    location.reload();
}

// Actualizar botón
function updateButton() {
    const btn = document.getElementById("lang-toggle-btn");
    if (btn) {
        btn.textContent = currentLang === "en" ? "EN" : "ES";
    }
}