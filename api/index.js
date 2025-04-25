async function renderAPI() {
  console.log("Salve salve");
  //Extraindo valor do input e salvando os elementos HTML pelo ID
  const country = document.getElementById("countryInput").value;
  const respName = document.getElementById("country");
  const respRegion = document.getElementById("region");
  const respSigla = document.getElementById("sigla");
  const respLanguage = document.getElementById("language");
  const respPopulation = document.getElementById("population");

  //Chamando API
  const response = await fetch(
    `https://countryinfoapi.com/api/countries/name/${country}`
  );
  const data = await response.json();

  //Extraindo as informações da API
  const { name, subregion, population, cca3: sigla, languages } = data;

  //Transformando o Object "Languages" em um Array e extraindo o dado que queremos (no caso o idioma em si)
  const language = Object.entries(languages);
  const idiom = language[0][1];

  function formatarComPontos(numeroStr) {
    // Remove qualquer ponto existente, caso haja
    let treatedPopulation = numeroStr.replace(/\./g, "");

    // Usa regex para adicionar ponto a cada 3 dígitos da direita para a esquerda
    treatedPopulation = treatedPopulation.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return treatedPopulation;
  }

  const formattedPopulation = population
    ? formatarComPontos(population.toString())
    : "Desconhecida";

  //Enviando os dados para os elementos HTML
  respName.innerHTML = `O país escolhido foi: ${name}`;
  respSigla.innerHTML = `Sigla: ${sigla}`;
  respRegion.innerHTML = `Região: ${subregion}`;
  respLanguage.innerHTML = `Idioma: ${idiom}`;
  respPopulation.innerHTML = `População: ${formattedPopulation}`;
}
