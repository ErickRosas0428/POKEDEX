const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
let pokemonData = []; // Almacenar datos de Pokémon globalmente

// Función para obtener los datos de todos los Pokémon
async function obtenerDatosPokemon() {
    const fetchPromises = Array.from({ length: 151 }, (_, i) => fetch(`${URL}${i + 1}`).then(response => response.json()));
    
    try {
        return await Promise.all(fetchPromises);
    } catch (error) {
        console.error("Error al cargar los Pokémon:", error);
        alert("Hubo un problema al cargar los datos de Pokémon.");
    }
}

// Función para crear el HTML de un Pokémon
function crearPokemonHTML(poke) {
    let tipos = poke.types.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');
    let pokeId = poke.id.toString().padStart(3, '0');

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other.dream_world.front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}</p>
                <p class="stat">${poke.weight}</p>
            </div>
        </div>
    `;
    return div;
}

// Función para mostrar una lista de Pokémon en el DOM
function mostrarPokemons(pokemons) {
    listaPokemon.innerHTML = ""; // Limpiar lista de Pokémon
    const fragment = document.createDocumentFragment();
    pokemons.forEach(poke => {
        fragment.appendChild(crearPokemonHTML(poke));
    });
    listaPokemon.appendChild(fragment);
}

// Función para filtrar y mostrar Pokémon basados en el tipo seleccionado
function filtrarYMostrarPokemon(tipo) {
    if (tipo === "ver-todos") {
        mostrarPokemons(pokemonData);
    } else {
        const pokemonsFiltrados = pokemonData.filter(data => data.types.some(type => type.type.name === tipo));
        mostrarPokemons(pokemonsFiltrados);
    }
}

// Función para filtrar Pokémon por nombre
function filtrarPorNombre(nombre) {
    const pokemonsFiltrados = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(nombre.toLowerCase()));
    if (pokemonsFiltrados.length === 0) {
        alert("No se encontraron Pokémon con ese nombre.");
    } else {
        mostrarPokemons(pokemonsFiltrados);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const buscarBtn = document.getElementById('buscar-btn');
    const buscador = document.getElementById('buscador');
    
    // Obtener datos de todos los Pokémon al cargar la página
    pokemonData = await obtenerDatosPokemon();
    if (pokemonData) {
        mostrarPokemons(pokemonData); // Mostrar todos los Pokémon
    }

    // Agregar evento de clic a los botones de encabezado
    botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
        const botonId = event.currentTarget.id;
        filtrarYMostrarPokemon(botonId);
    }));

    buscarBtn.addEventListener('click', () => {
        const busqueda = buscador.value.trim().toLowerCase();
        if (busqueda) {
            filtrarPorNombre(busqueda);
        }
    });
});
