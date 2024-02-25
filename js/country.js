// Obtener los parámetros de la URL
const query = new URLSearchParams(window.location.search)
const params = query.get("name");

// Obtener referencia al elemento del DOM
const MAIN = document.querySelector("#main");

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
    const data = await fetchedData();
    checkDarkMode();
    renderCountryDetails(params,data);
});

// Función para renderizar los detalles del país
function renderCountryDetails(countryName, COUNTRIES) {
    lastMainContent = MAIN.innerHTML;
    // Limpiar el contenido principal
    MAIN.innerHTML = '';
    // Encuentra el país correspondiente en los datos
    const country = COUNTRIES.find(country => country.name === countryName);
    // Determinar la clase de modo oscuro
    let darkModeClass = "";
    darkModeClass = (isDarkMode) ? "dark-mode-secondary-active" : "dark-mode-secondary-inactive";
    let borderCountries = getBorderCountries(country, COUNTRIES);
    // Crear un nuevo contenedor para los detalles del país
    const WRAPPER = document.createElement("div");
    WRAPPER.classList = "details-container-wrapper";    
    const DETAILS_CONTAINER = document.createElement("div");
    DETAILS_CONTAINER.classList.add("country-details");
    DETAILS_CONTAINER.innerHTML = "";
    // Inserta los detalles del país en el contenedor
    DETAILS_CONTAINER.innerHTML = `
        <a id="return-btn" href="./index.html" class ="flex items-center back-btn dark-mode-secondary ${darkModeClass}">
            <i class="bi bi-arrow-left"></i><button class="">Back</button>
        </a>
        <div class="country-card-details">
            <div class="country-card-img-container">
                <img class="w-full h-full object-cover" src="${country.flags.svg}" alt="${country.name} flag">
            </div>
            <article class="card-info-container">
                <h2 class="country-card-title">${country.name}</h2>
                <div class ="country-card-inside">
                    <div class="country-card-info">
                        <div class="space-y-2">
                            <p><strong>Native Name:</strong> ${country.nativeName}</p>
                            <p><strong>Population:</strong> ${fixNumberPopulation(country.population)}</p>
                            <p><strong>Region:</strong> ${country.region}</p>
                            <p><strong>Sub Region:</strong> ${country.subregion}</p>
                            <p><strong>Capital:</strong> ${country.capital}</p>
                        </div>
                        <div class="space-y-2">
                            <p><strong>Top Level Domain:</strong> ${country.topLevelDomain}</p>
                            <p><strong>Currencies:</strong> ${country.currencies[0].name}</p>
                            <p><strong>Languages:</strong> ${getLanguages(country)}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-row flex-wrap justify-center">
                        <strong class="text-left">Border Countries: </strong>
                        ${borderCountries.innerHTML}
                    </div>
                </div>  
            </article>
        </div>
    `;
    // Agregar los detalles del país al documento  
    MAIN.appendChild(WRAPPER);
    WRAPPER.appendChild(DETAILS_CONTAINER);
}

// Función para obtener los países vecinos del país actual
function getBorderCountries(country, COUNTRIES) {
    const borderContainer = document.createElement("div");
    borderContainer.classList = "border-container";
    if (country.borders) {
        country.borders.forEach(border => {
            let borderCountry = COUNTRIES.find(borderCountry => borderCountry.alpha3Code.includes(`${border}`));
            if (borderCountry) { // Verificar si borderCountry está definido
                let darkModeClass = (isDarkMode) ? "dark-mode-secondary-active" : "dark-mode-secondary-inactive";
                const borderBtn = document.createElement("div");
                borderBtn.classList = `border-btn dark-mode-secondary ${darkModeClass}`;
                borderBtn.textContent = borderCountry.name;
                borderContainer.appendChild(borderBtn);
            }
        });
    } else {
        const borderMessage = document.createElement("div");
        borderMessage.classList = "border-message";
        borderMessage.innerHTML = "<p> No bordering countries</p>";
        return borderMessage;
    }
    return borderContainer;
}

// Función para formatear el número de población
function fixNumberPopulation(number){
    return number.toLocaleString('es-ES');
}

// Función para obtener los idiomas del país
function getLanguages(country){
    let languages = country.languages.map(language => language.name)
    return languages.join(", ");
}