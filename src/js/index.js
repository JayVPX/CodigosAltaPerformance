// Funcionalidade do Register

const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});
loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Cadastro Usuarios
let usuarios = [];
if (localStorage.getItem("usuarios")) {
  // verifica se o local storage existe e converte o que houver lá para objeto e guarda no objeto de usuários
  usuarios = JSON.parse(localStorage.getItem("usuarios"));
}

function cadastrar() {
  // capturar os dados do input
  let salvaNome = document.querySelector("#nomeR").value;
  let salvaUsuario = document.querySelector("#usuarioR").value;
  let salvaEmail = document.querySelector("#emailR").value;
  let salvaSenha = document.querySelector("#senhaR").value;

  // criar um objeto com os dados do input
  let usuario = {
    nome: salvaNome,
    usuario: salvaUsuario,
    email: salvaEmail,
    senha: salvaSenha,
  };

  // adicionar o usuario criado a lista de usuários
  usuarios.push(usuario);

  // converte para stringify e guarda no local storage
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  window.location.href = "branchs/home.html";
  console.log(usuarios);
}

function login() {
  window.location.href = "branchs/home.html";
}
