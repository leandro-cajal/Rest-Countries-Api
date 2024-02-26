// Declaración de constantes para seleccionar elementos del DOM
const FILTER_OPTIONS = document.querySelectorAll(".option");
const TOGGLE_MENU = document.querySelector("#toggle-menu");
const ARROW_ICON = document.querySelector("#arrow-icon");
const OPTIONS_MENU = document.querySelector("#options-menu");
const MAIN_CONTAINER = document.querySelector("#main-container");
const MAIN = document.querySelector("#main");
const SEARCH_BAR = document.querySelector("#search");

// Función asincrónica para obtener datos de una URL
async function fetchedData() {
    const url = "./data.json";
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`${res.status}`);
        }
        data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// Evento que se ejecuta cuando el DOM ha sido cargado
document.addEventListener("DOMContentLoaded", async () => {
    // Obtener los datos y renderizar los países
    const data = await fetchedData();
    checkDarkMode();
    renderCountries(data);
    // Escuchar el evento de tecla levantada en la barra de búsqueda
    SEARCH_BAR.addEventListener("keyup", (event) => {
        const SEARCH_INPUT = event.target.value.trim().toLowerCase();
        const result = filterByName(data, SEARCH_INPUT);
        renderCountries(result);
    });
    // Escuchar el evento de click en las opciones de filtro
    FILTER_OPTIONS.forEach(option =>{
        option.addEventListener("click",() =>{
            const OPTION_VALUE = option.dataset.value;
            const result = filterByRegion(data, OPTION_VALUE);
            renderCountries(result);
        })
    });
    // Obtener referencia al formulario
    const form = document.querySelector('form');
    // Escuchar el evento submit del formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
        const SEARCH_INPUT = SEARCH_BAR.value.trim().toLowerCase();
        const result = filterByName(data, SEARCH_INPUT);
        if (result.length === 1) {
            const country = result[0];
            window.location.href = `./country.html?name=${country.name}`;
        }
    });
});

// Función para filtrar países por nombre
function filterByName(countries,searchTerm){
    let NEW_ARRAY = countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return NEW_ARRAY;
}

// Función para filtrar países por región
function filterByRegion(countries,optionValue){
    let NEW_ARRAY = countries.filter(country => country.region.toLowerCase() === optionValue);
    return NEW_ARRAY;
}

// Función para renderizar países en la interfaz
function renderCountries(COUNTRIES) {
    // Determinar la clase de modo oscuro
    let darkModeClass = "";
    darkModeClass = (isDarkMode) ? "dark-mode-secondary-active" : "dark-mode-secondary-inactive";
    // Limpiar el contenedor principal y crear una lista de países
    MAIN_CONTAINER.innerHTML = '';  
    const ul = document.createElement("ul");
    ul.classList = "country-list";
    ul.innerHTML = "";
    COUNTRIES.forEach(country => {
        // Crear elementos de lista para cada país y añadirlos a la lista
        const li = document.createElement("li");
        li.classList = "country";
        let fixedNumber = fixNumberPopulation(country.population);
        li.innerHTML = `
        <a href="country.html?name=${country.name}" class="card">
            <div class="card-container-img">
                <img class="card-img" src="${country.flags.svg}" alt="${country.name} flag">
            </div>
            <article class="card-info dark-mode-secondary ${darkModeClass}">
                <h2 class="card-info-title">${country.name}</h2>
                <div class="card-info-text"><h4 class="font-semibold">Population: </h4><p>${fixedNumber}</p></div>
                <div class="card-info-text"><h4 class="font-semibold">Region: </h4><p>${country.region}</p></div>
                <div class="card-info-text"><h4 class="font-semibold">Capital: </h4><p>${country.capital}</p></div>
            </article>
        </a>
        `;
        ul.appendChild(li);
    });
    MAIN_CONTAINER.appendChild(ul);
}

// Función para formatear el número de población
function fixNumberPopulation(number){
        return number.toLocaleString('es-ES');
}

// Evento de click en el menú desplegable
TOGGLE_MENU.addEventListener('click', () => {
    OPTIONS_MENU.classList.toggle('hidden');
    ARROW_ICON.classList.toggle('rotated');
});