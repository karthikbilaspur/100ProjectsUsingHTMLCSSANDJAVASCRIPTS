const poke_container = document.getElementById('poke-container');
const pokemon_count = 150;
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

let currentPokemonIndex = 0;
let filteredPokemon = [];
let pokemonData = [];

// Fetch Pokémon data
async function fetchPokemons() {
    for (let i = 1; i <= pokemon_count; i++) {
        await getPokemon(i);
    }
}

async function getPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    pokemonData.push({
        id: data.id,
        name: data.name,
        imageUrl: data.sprites.front_default,
        types: data.types.map(type => type.type.name),
        stats: {
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            specialAttack: data.stats[3].base_stat,
            specialDefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat
        }
    });
    createPokemonCard(data);
}

function createPokemonCard(pokemon) {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');

    const poke_types = pokemon.types;
    const type = poke_types[0];
    const color = colors[type] || '#F5F5F5';

    pokemonEl.style.backgroundColor = color;

    const pokemonInnerHTML = `
    <div class="img-container">
        <img src="${pokemon.sprites.front_default}" alt="${name}">
    </div>
    <div class="info">
        <span class="number">#${id}</span>
        <h3 class="name">${name}</h3>
        <small class="type">Type: <span>${poke_types.join(', ')}</span> </small>
    </div>
    `


    pokemonEl.addEventListener('click', () => {
        displayPokemonDetails(pokemon);
    });

    
    pokemonEl.innerHTML = pokemonInnerHTML

    poke_container.appendChild(pokemonEl)
}

// Comparison feature
document.getElementById('compare-button').addEventListener('click', () => {
    const compareContainer = document.getElementById('compare-container');
    compareContainer.style.display = 'block';

    const compareSelect1 = document.getElementById('compare-select-1');
    const compareSelect2 = document.getElementById('compare-select-2');

    pokemonData.forEach((pokemon) => {
        const option = document.createElement('option');
        option.value = pokemon.id;
        option.text = pokemon.name;
        compareSelect1.appendChild(option);
        compareSelect2.appendChild(option.cloneNode(true));
    });

    document.getElementById('compare-stats-button').addEventListener('click', () => {
        const selectedPokemon1 = pokemonData.find((pokemon) => pokemon.id === parseInt(compareSelect1.value));
        const selectedPokemon2 = pokemonData.find((pokemon) => pokemon.id === parseInt(compareSelect2.value));

        const compareStatsResult = document.getElementById('compare-stats-result');
        compareStatsResult.innerHTML = '';

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        const headerCell1 = document.createElement('th');
        headerCell1.textContent = 'Stat';
        const headerCell2 = document.createElement('th');
        headerCell2.textContent = selectedPokemon1.name;
        const headerCell3 = document.createElement('th');
        headerCell3.textContent = selectedPokemon2.name;

        headerRow.appendChild(headerCell1);
        headerRow.appendChild(headerCell2);
        headerRow.appendChild(headerCell3);
        thead.appendChild(headerRow);

        const stats = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];
        stats.forEach((stat) => {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            cell1.textContent = stat;
            const cell2 = document.createElement('td');
            cell2.textContent = selectedPokemon1.stats[stat];
            const cell3 = document.createElement('td');
            cell3.textContent = selectedPokemon2.stats[stat];

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        compareStatsResult.appendChild(table);
    });
});

// Search functionality
document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const pokemonList = document.querySelectorAll('.pokemon');
    pokemonList.forEach((pokemon) => {
        if (pokemon.querySelector('.name').textContent.toLowerCase().includes(searchInput)) {
            pokemon.style.display = 'block';
        } else {
            pokemon.style.display = 'none';
        }
    });
});

// User profile
const username = 'JohnDoe';
document.getElementById('username').textContent = username;

// Pokémon collection
const pokemonCollection = [];
pokemonData.forEach((pokemon) => {
    const pokemonListItem = document.createElement('li');
    pokemonListItem.textContent = pokemon.name;
    document.getElementById('pokemon-collection').appendChild(pokemonListItem);
});

// Pokémon details
function displayPokemonDetails(pokemon) {
    const pokemonDetails = document.getElementById('pokemon-details');
    pokemonDetails.innerHTML = `
        <h2>${pokemon.name}</h2>
        <p>Type: ${pokemon.types.map(type => type).join(', ')}</p>
        <p>Stats:</p>
        <ul>
            <li>HP: ${pokemon.stats.hp}</li>
            <li>Attack: ${pokemon.stats.attack}</li>
            <li>Defense: ${pokemon.stats.defense}</li>
            <li>Special Attack: ${pokemon.stats.specialAttack}</li>
            <li>Special Defense: ${pokemon.stats.specialDefense}</li>
            <li>Speed: ${pokemon.stats.speed}</li>
        </ul>
    `;
}


// Pokémon news
const pokemonNews = [
    {
        title: 'New Pokémon Games Announced',
        content: 'The latest Pokémon games, Pokémon Sword and Shield, have been announced for release on November 15, 2019.'
    },
    {
        title: 'Pokémon Go Fest 2020',
        content: 'Pokémon Go Fest 2020 will take place on July 25-26, 2020, in various locations around the world.'
    }
];

function displayPokemonNews() {
    const pokemonNewsList = document.getElementById('pokemon-news-list');
    pokemonNews.forEach((news) => {
        const newsListItem = document.createElement('li');
        newsListItem.innerHTML = `
            <h2>${news.title}</h2>
            <p>${news.content}</p>
        `;
        pokemonNewsList.appendChild(newsListItem);
    });
}

fetchPokemons();