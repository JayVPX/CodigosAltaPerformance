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
    tipo2: pokemonData.types[1]?.type.name || "não tem",
    cor: pkmSpeciesData.color.name,
    habitat: pkmSpeciesData.habitat.name,
    peso: `${pokemonData.weight / 10} kg`,
    altura: `${pokemonData.height * 10} cm`,
  };

  console.log(randomPkm);
  return randomPkm;
}

//Função que compara os atributos dos pokemons e retorna uma flag "GREEN" (Truth) ou "RED" (false).
function comparePokemonAtributos(atributoGuessPkm, atributoRandomPkm) {
  return atributoGuessPkm === atributoRandomPkm ? "green" : "red";
}

//Função que pega os dados do Pokemon escolhido pelo usuário
async function getGuessedPokemon(randomPkmData) {
  try {
    const guess = document.getElementById("guess").value;
    if (!guess) return;

    const guessResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${guess}`
    );
    //Captura a response 404 para dizer que o pokémon não foi encontrado
    if (!guessResponse.ok) {
      if (guessResponse.status === 404) {
        throw new Error("Pokémon não encontrado! Tente novamente.");
      }
      throw new Error("Erro ao buscar Pokémon. Tente novamente mais tarde."); // Para outros erros
    }

    const guessPkmData = await guessResponse.json();

    const guessPkmSpeciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${guessPkmData.name}/`
    );
    const guessPkmSpeciesData = await guessPkmSpeciesResponse.json();

    const guessedPkm = {
      id: guessPkmData.id,
      imagem:
        guessPkmData?.sprites?.versions?.["generation-v"]?.["black-white"]
          ?.animated?.front_default || guessPkmData?.sprites?.front_default,
      geracao: guessPkmSpeciesData.generation.name,
      nome: guessPkmData.name,
      tipo1: guessPkmData.types[0].type.name,
      tipo2: guessPkmData.types[1]?.type.name || "não tem",
      cor: guessPkmSpeciesData.color.name,
      habitat: guessPkmSpeciesData.habitat?.name || "desconhecido",
      peso: `${guessPkmData.weight / 10} kg`,
      altura: `${guessPkmData.height * 10} cm`,
    };
    console.log(guessedPkm);

    renderGuess(guessedPkm, randomPkmData);
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "#FF6347",
      stopOnFocus: true,
    }).showToast();
  }
}

//Função que renderiza os dados do Pokemon escolhido pelo usuáiro
function renderGuess(guessed, random) {
  const container = document.getElementById("guessesContainer");
  const div = document.createElement("div");
  div.className = "guessLine";

  //Listagem dos atributos a serem comparados (nome) com os seus valores (label)
  const atributos = [
    { nome: "tipo1", label: guessed.tipo1 },
    { nome: "tipo2", label: guessed.tipo2 },
    { nome: "habitat", label: guessed.habitat },
    { nome: "cor", label: guessed.cor },
    { nome: "geracao", label: guessed.geracao },
    { nome: "altura", label: guessed.altura },
    { nome: "peso", label: guessed.peso },
  ];

  //Map para percorrer o array de atributos e realizar as comparações para cada um deles
  const attributesContainer = atributos
    .map(
      ({ nome, label }) =>
        `<div class="guessBox" style="background:${comparePokemonAtributos(
          guessed[nome],
          random[nome]
        )}">${label}</div>`
    )
    .join("");

  //Após o map, aqui é renderizado através do innerHTML a imagem do pokemon escolhido e seus dados já comparados
  div.innerHTML = `
    <div class="guessBox whiteBg">
      <img src="${guessed.imagem}" alt="${guessed.nome}"  />
    </div>
    ${attributesContainer}
  `;

  //Metódo que faz possível a criação de um elemento filho no container
  container.insertBefore(div, container.firstChild);

  //Aplicação da transição em cada bloco do Box das informações do pokemon
  const boxes = div.querySelectorAll(".guessBox");
  boxes.forEach((box, index) => {
    setTimeout(() => {
      box.classList.add("show");
    }, index * 400);
  });

  // Verifica se o nome do palpite do usuário é igual ao do Pokémon sorteado
  const isCorrect = guessed.nome === random.nome;

  // Espera o fim das animações antes de exibir a mensagem de acerto
  if (isCorrect) {
    const totalDelay = boxes.length * 150;
    setTimeout(() => {
      showWinModal();
    }, totalDelay + 2000);
  }
}

//Função que dá Reload para iniciar uma nova partida
function playAgain() {
  location.reload();
}

//Função que adiciona a flag "Active", mostrando o modal
function showWinModal() {
  const win = document.getElementById("winContainer");
  win?.classList.add("active");
}

//Função que remove a flag "Active", desaparecendo com o modal
function closeWinModal() {
  const win = document.getElementById("winContainer");
  win?.classList.remove("active");
}

function showModal() {
  const modal = document.getElementById("modalContainer");
  modal?.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("modalContainer");
  modal?.classList.remove("active");
}

//Função que retorna para a Home
function goBack() {
  window.location.href = "/src/pages/pagInicial.html";
}
