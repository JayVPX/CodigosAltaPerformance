let usuarios = [];
if (localStorage.getItem("usuarios")) {
  usuarios = JSON.parse(localStorage.getItem("usuarios"));
}

function load() {
  // captura o objeto da tabela do html
  let lista = document.querySelector(".lista");
  // usa o array de usuários para inserir numa tabela dinamicamente
  usuarios.forEach((elemento, index) => {
    // crio uma linha e uma coluna e organizo a ordem de criação
    let tr = document.createElement("tr");

    let tdOne = document.createElement("td");
    let tdTwo = document.createElement("td");
    let tdThree = document.createElement("td");
    let tdFour = document.createElement("td");

    // criar o texto da coluna
    tdOne.innerHTML = ` ${elemento.nome}`;
    tdTwo.innerHTML = ` ${elemento.usuario}`;
    tdThree.innerHTML = ` ${elemento.email}`;
    tdFour.innerHTML = ` ${elemento.senha}`;

    // inserir a coluna na linha
    tr.append(tdOne, tdTwo, tdThree, tdFour);

    // inserir a linha na tabela
    lista.append(tr);
  });
}
load();
