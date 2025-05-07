//API PAÍSES

// async function renderAPI() {
//   console.log("Salve salve");
//   //Extraindo valor do input e salvando os elementos HTML pelo ID
//   const country = document.getElementById("countryInput").value;
//   const respName = document.getElementById("country");
//   const respRegion = document.getElementById("region");
//   const respSigla = document.getElementById("sigla");
//   const respLanguage = document.getElementById("language");
//   const respPopulation = document.getElementById("population");

//   //Chamando API
//   const response = await fetch(
//     `https://countryinfoapi.com/api/countries/name/${country}`
//   );
//   const data = await response.json();

//   //Extraindo as informações da API
//   const { name, subregion, population, cca3: sigla, languages } = data;

//   //Transformando o Object "Languages" em um Array e extraindo o dado que queremos (no caso o idioma em si)
//   const language = Object.entries(languages);
//   const idiom = language[0][1];

//   function formatarComPontos(numeroStr) {
//     // Remove qualquer ponto existente, caso haja
//     let treatedPopulation = numeroStr.replace(/\./g, "");

//     // Usa regex para adicionar ponto a cada 3 dígitos da direita para a esquerda
//     treatedPopulation = treatedPopulation.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//     return treatedPopulation;
//   }

//   const formattedPopulation = population
//     ? formatarComPontos(population.toString())
//     : "Desconhecida";

//   //Enviando os dados para os elementos HTML
//   respName.innerHTML = `O país escolhido foi: ${name}`;
//   respSigla.innerHTML = `Sigla: ${sigla}`;
//   respRegion.innerHTML = `Região: ${subregion}`;
//   respLanguage.innerHTML = `Idioma: ${idiom}`;
//   respPopulation.innerHTML = `População: ${formattedPopulation}`;
// }

//API POKEMON

//
let randomPokemon = null;

//Componente para sortear um pokemon ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
  randomPokemon = await getRandomPokemon();
});

//Função para pegar um pokemon aleatório
async function getRandomPokemon() {
  const PkmLimit = 151;
  const getRandomPkmId = Math.floor(Math.random() * PkmLimit) + 1;

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${getRandomPkmId}`
  );
  const pokemonData = await response.json();

  const pkmSpeciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.name}/`
  );
  const pkmSpeciesData = await pkmSpeciesResponse.json();

  const randomPkm = {
    id: pokemonData.id,
    geracao: pkmSpeciesData.generation.name,
    nome: pokemonData.name,
    tipo1: pokemonData.types[0].type.name,
    tipo2: pokemonData.types[1]?.type.name || "Não tem",
    cor: pkmSpeciesData.color.name,
    habitat: pkmSpeciesData.habitat.name,
    peso: `${pokemonData.weight / 10} kg`,
    altura: `${pokemonData.height * 10} cm`,
  };

  console.log(randomPkm);
  return randomPkm;
}

function comparePokemonAtributos(atributoGuessPkm, atributoRandomPkm) {
  return atributoGuessPkm === atributoRandomPkm ? "green" : "red";
}

async function getGuessedPokemon(randomPkmData) {
  const guess = document.getElementById("guess").value;
  if (!guess) return;

  const guessResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${guess}`
  );
  const guessPkmData = await guessResponse.json();

  const guessPkmSpeciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${guessPkmData.name}/`
  );
  const guessPkmSpeciesData = await guessPkmSpeciesResponse.json();

  const guessedPkm = {
    imagem:
      guessPkmData?.sprites?.versions?.["generation-v"]?.["black-white"]
        ?.animated?.front_default || guessPkmData?.sprites?.front_default,
    geracao: guessPkmSpeciesData.generation.name,
    nome: guessPkmData.name,
    tipo1: guessPkmData.types[0].type.name,
    tipo2: guessPkmData.types[1]?.type.name || "Não tem",
    cor: guessPkmSpeciesData.color.name,
    habitat: guessPkmSpeciesData.habitat.name,
    peso: `${guessPkmData.weight / 10} kg`,
    altura: `${guessPkmData.height * 10} cm`,
  };
  console.log(guessedPkm);

  renderGuess(guessedPkm, randomPkmData);
}

function renderGuess(guessed, random) {
  const container = document.getElementById("guessesContainer");
  const div = document.createElement("div");
  div.className = "guess-line";
  div.innerHTML = `<div class="guess-box">
    <img src="${
      guessed.imagem
    }" alt="Imagem do Pokémon" style="height: 50px;" />
  </div>

  <div class="guess-box" style="background:${comparePokemonAtributos(
    guessed.tipo1,
    random.tipo1
  )}">${guessed.tipo1}</div>
  

  <div class="guess-box" style="background:${comparePokemonAtributos(
    guessed.tipo2,
    random.tipo2
  )}">${guessed.tipo2}</div>

    <div class="guess-box" style="background:${comparePokemonAtributos(
      guessed.habitat,
      random.habitat
    )}">${guessed.habitat}</div>

    <div class="guess-box" style="background:${comparePokemonAtributos(
      guessed.cor,
      random.cor
    )}">${guessed.cor}</div>

    <div class="guess-box" style="background:${comparePokemonAtributos(
      guessed.geracao,
      random.geracao
    )}">${guessed.geracao}</div>

    <div class="guess-box" style="background:${comparePokemonAtributos(
      guessed.altura,
      random.altura
    )}">${guessed.altura}</div>

    <div class="guess-box" style="background:${comparePokemonAtributos(
      guessed.peso,
      random.peso
    )}">${guessed.peso}</div>
  `;

  container.appendChild(div);
}
