const FILTER_OPTIONS = document.querySelectorAll(".option");
const TOGGLE_MENU = document.querySelector("#toggle-menu");
const OPTIONS_MENU = document.querySelector("#options-menu");
const MAIN_CONTAINER = document.querySelector("#main-container");
const SEARCH_BAR = document.querySelector("#search");
const DARK_MODE_BTN = document.querySelector(".dark-mode-btn");

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
    DARK_MODE_BTN.addEventListener("click", ()=>{
        applyDarkMode();
    })
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
        fixedNumber = fixNumberPopulation(country.population);
        li.innerHTML = `
        <div class="card">
            <div class="card-container-img">
                <img class="card-img" src="${country.flags.svg}" alt="${country.name} flag">
            </div>
            <article class="card-info dark-mode-secondary">
                <h2 class="card-info-title">${country.name}</h2>
                <div class="card-info-text"><h4 class="font-semibold">Population: </h4><p>${fixedNumber}</p></div>
                <div class="card-info-text"><h4 class="font-semibold">Region: </h4><p>${country.region}</p></div>
                <div class="card-info-text"><h4 class="font-semibold">Capital: </h4><p>${country.capital}</p></div>
            </article>
        </div>
        `;
        ul.appendChild(li);
    });
    MAIN_CONTAINER.appendChild(ul);
}

function fixNumberPopulation(number){
        return number.toLocaleString('es-ES');
}

TOGGLE_MENU.addEventListener('click', () => {
    OPTIONS_MENU.classList.toggle('hidden');
    TOGGLE_MENU.classList.toggle('rotate');
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
}