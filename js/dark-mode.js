// Verificar si hay un valor guardado en localStorage para isDarkMode
let isDarkMode = false; // Por defecto, el modo oscuro está desactivado
const storedDarkMode = localStorage.getItem('isDarkMode');
if (storedDarkMode !== null) {
    // Si hay un valor almacenado, se actualiza isDarkMode
    isDarkMode = JSON.parse(storedDarkMode); // Convertir el valor almacenado en JSON
}

// Obtener referencia al interruptor de modo oscuro y escuchar el evento de clic
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    // Llama a la función para aplicar el modo oscuro
    applyDarkMode(); 
});

// Función para aplicar el modo oscuro
function applyDarkMode(){
    // Obtener elementos con clases relacionadas con el modo oscuro
    const DARK_MODE_SECONDARY = document.querySelectorAll(".dark-mode-secondary");
    const DARK_MODE_MAIN = document.querySelectorAll(".dark-mode-main");

    // Alternar clases para cambiar entre los modos oscuro e inactivo
    DARK_MODE_SECONDARY.forEach(element => {
        element.classList.toggle("dark-mode-secondary-inactive");
        element.classList.toggle('dark-mode-secondary-active');
    });
    DARK_MODE_MAIN.forEach(element =>{
        element.classList.toggle("dark-mode-main-inactive");
        element.classList.toggle("dark-mode-main-active");
    });

    isDarkMode = !isDarkMode; // Cambiar el estado del modo oscuro
    // Guardar el valor actual de isDarkMode en localStorage
    localStorage.setItem('isDarkMode', isDarkMode);
}

// Función para verificar y aplicar el modo oscuro al cargar la página
function checkDarkMode (){
    if (isDarkMode){
        applyDarkMode(); // Aplicar el modo oscuro
        isDarkMode = !isDarkMode; // Cambiar el estado del modo oscuro para evitar un cambio doble
        localStorage.setItem('isDarkMode', isDarkMode); // Actualizar localStorage
    }
}