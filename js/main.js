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

const MAIN_CONTAINER = document.querySelector("#main-container");

document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchedData();
    console.log(data[10]);
    renderCountries(data);
    
});


function renderCountries(COUNTRIES) {
    const ul = document.createElement("ul");
    ul.classList = "country-list";
    ul.innerHTML = "";
    COUNTRIES.forEach(country => {
        const li = document.createElement("li");
        li.classList = "country";
        li.innerHTML = `
        <div class="card">
            <div class="card-container-img">
                <img class="card-img" src="${country.flags.svg}" alt="${country.name} flag">
            </div>
            <article class="card-info">
                <h2 class="card-info-title">${country.name}</h2>
                <div class="card-info-text"><h4 class="font-semibold">Population: </h4><p>${country.population}</p></div>
                <div class="card-info-text"><h4 class="font-semibold">Region: </h4><p>${country.region}</p></div>
                <div class="card-info-text"><h4 class="font-semibold">Capital: </h4><p>${country.capital}</p></div>
            </article>
        </div>
        `;
        console.log(`${country.flags.svg}`);
        ul.appendChild(li);
    });
    MAIN_CONTAINER.appendChild(ul)
}