const FILTER_OPTIONS = document.querySelectorAll(".option");
const TOGGLE_MENU = document.querySelector("#toggle-menu");
const ARROW_ICON = document.querySelector("#arrow-icon");
const OPTIONS_MENU = document.querySelector("#options-menu");
const MAIN_CONTAINER = document.querySelector("#main-container");
const MAIN = document.querySelector("#main");
const SEARCH_BAR = document.querySelector("#search");
let isDarkMode = false;
let lastMainContent ="";

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

document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchedData();
    renderCountries(data);
    SEARCH_BAR.addEventListener("keyup", (event)=>{
        const SEARCH_INPUT = event.target.value.trim().toLowerCase();
        const result = filterByName(data, SEARCH_INPUT);
        renderCountries(result);
    });
    FILTER_OPTIONS.forEach(option =>{
        option.addEventListener("click",() =>{
            const OPTION_VALUE = option.dataset.value;
            const result = filterByRegion(data, OPTION_VALUE);
            renderCountries(result);
        })
    });
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        applyDarkMode(); // Llama a la función para aplicar el modo oscuro
    });
});

function filterByName(countries,searchTerm){
    let NEW_ARRAY = countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return NEW_ARRAY;
}

function filterByRegion(countries,optionValue){
    let NEW_ARRAY = countries.filter(country => country.region.toLowerCase() === optionValue);
    return NEW_ARRAY;
}

function renderCountries(COUNTRIES) {
    MAIN_CONTAINER.innerHTML = '';  
    const ul = document.createElement("ul");
    ul.classList = "country-list";
    ul.innerHTML = "";
    COUNTRIES.forEach(country => {
        const li = document.createElement("li");
        li.classList = "country";
        let fixedNumber = fixNumberPopulation(country.population);
        let darkModeClass = "";
        darkModeClass = (isDarkMode) ? "dark-mode-secondary-active" : "dark-mode-secondary-inactive";
        li.innerHTML = `
        <div class="card" id="${country.id}"> <!-- Agrega el id del país como identificador -->
            <div class="card-container-img">
                <img class="card-img" src="${country.flags.svg}" alt="${country.name} flag">
            </div>
            <article class="card-info dark-mode-secondary ${darkModeClass}">
                <h2 class="card-info-title">${country.name}</h2>
                <div class="card-info-text"><h4 class="font-semibold">Population: </h4><p>${fixedNumber}</p></div>
                <div class="card-info-text"><h4 class="font-semibold">Region: </h4><p>${country.region}</p></div>
                <div class="card-info-text"><h4 class="font-semibold">Capital: </h4><p>${country.capital}</p></div>
            </article>
        </div>
        `;
        li.addEventListener("click", () => {
            renderCountryDetails(country.name,COUNTRIES);
        });
        ul.appendChild(li);
    });
    MAIN_CONTAINER.appendChild(ul);
}

function renderCountryDetails(countryId, COUNTRIES) {
    lastMainContent = MAIN.innerHTML;
    MAIN.innerHTML = '';
    // Encuentra el país correspondiente en los datos
    const country = COUNTRIES.find(country => country.name === countryId);
    let darkModeClass = "";
    darkModeClass = (isDarkMode) ? "dark-mode-secondary-active" : "dark-mode-secondary-inactive";
    let borderCountries = getBorderCountries(country);
    // Crea un nuevo cuerpo para los detalles del país
    const WRAPPER = document.createElement("div");
    WRAPPER.classList = "details-container-wrapper";    
    const DETAILS_CONTAINER = document.createElement("div");
    DETAILS_CONTAINER.classList.add("country-details");
    DETAILS_CONTAINER.innerHTML = "";
    // Inserta los detalles del país en el cuerpo
    DETAILS_CONTAINER.innerHTML = `
        <a id="return-btn" href="./index.html" class ="flex items-center back-btn dark-mode-secondary ${darkModeClass}">
            <i class="bi bi-arrow-left"></i><button class="">Back</button>
        </a>
        <div class="country-card-details">
            <div class="country-card-img-container">
                <img class="w-full h-full object-cover" src="${country.flags.svg}" alt="${country.name} flag">
            </div>
            <article class="card-info-container">
                <h2 class="card-info-title">${country.name}</h2>
                <div class ="flex flex-col">
                    <div class="country-card-info">
                        <div>
                            <p>Native Name: ${country.nativeName}</p>
                            <p>Population: ${fixNumberPopulation(country.population)}</p>
                            <p>Region: ${country.region}</p>
                            <p>Sub Region: ${country.subregion}</p>
                            <p>Capital: ${country.capital}</p>
                        </div>
                        <div>
                            <p>Top Level Domain: ${country.topLevelDomain}</p>
                            <p>Currencies: ${country.currencies[0].name}</p>
                            <p>Languages: ${getLanguages(country)}</p>
                        </div>
                    </div>
                    <div class="flex items-center flex-col md:flex-row">
                        <p>Border Countries: </p>
                        <div class="border-contaianer">${borderCountries.innerHTML}</div>
                    </div>
                </div>
                
                
            </article>
        </div>
    `;
    // Agrega el cuerpo de detalles al documento  
    MAIN.appendChild(WRAPPER);
    WRAPPER.appendChild(DETAILS_CONTAINER);
    const RETURN_BTN = document.querySelector("#return-btn");
    RETURN_BTN.addEventListener("click",()=>{
        MAIN.innerHTML = ""; // Elimina el contenido actual

        renderCountries(COUNTRIES); // Vuelve a renderizar los países
    });
}

function fixNumberPopulation(number){
        return number.toLocaleString('es-ES');
}

function getLanguages(country){
    let languages = country.languages.map(language => language.name)
    return languages.join(", ");
}

function getBorderCountries(country) {
    const borderContainer = document.createElement("div");
    borderContainer.classList = "border-container";
    if (country.borders) {
        country.borders.forEach(border => {
            let darkModeClass = "";
            darkModeClass = (isDarkMode) ? "dark-mode-secondary-active" : "dark-mode-secondary-inactive";
            const borderBtn = document.createElement("div");
            borderBtn.classList = `border-btn dark-mode-secondary ${darkModeClass}`;
            borderBtn.textContent = border;
            borderContainer.appendChild(borderBtn);
        });
    } else {
        const borderMessage = document.createElement("div");
        borderMessage.classList = "border-message";
        borderMessage.innerHTML = "<p> No bordering countries</p>";
        return borderMessage;
    }

    console.log(borderContainer);
    return borderContainer;
}

TOGGLE_MENU.addEventListener('click', () => {
    OPTIONS_MENU.classList.toggle('hidden');
    ARROW_ICON.classList.toggle('rotate');
});

function applyDarkMode(){
    const DARK_MODE_SECONDARY = document.querySelectorAll(".dark-mode-secondary");
    const DARK_MODE_MAIN = document.querySelector(".dark-mode-main");
    DARK_MODE_SECONDARY.forEach(element => {
        element.classList.toggle("dark-mode-secondary-inactive");
        element.classList.toggle('dark-mode-secondary-active');
    })
    DARK_MODE_MAIN.classList.toggle("dark-mode-main-inactive");
    DARK_MODE_MAIN.classList.toggle("dark-mode-main-active");
    isDarkMode = !isDarkMode; // Toggle el estado del modo oscuro
}