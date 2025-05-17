import { parse } from 'cookie-es';    // este sim é feito pra rodar no browser

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith('/index.html')) {
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("toggle-register");
    const loginBtn = document.getElementById("toggle-login");

    registerBtn.addEventListener("click", () => {
      container.classList.add("active");
    });
    loginBtn.addEventListener("click", () => {
      container.classList.remove("active");
    });
  } 

  if (path.endsWith('/pagInicial.html')) {
    const boasVindas = document.getElementById("greeting");
    const userJson   = sessionStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      boasVindas.textContent = `Olá, ${user.nome}`; 
    }
  }

  if (path.endsWith('/list.html')) {
    const tbodyUsers = document.getElementById("listagem-usuarios");
    const rawUsers = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(rawUsers);

    usuarios.forEach(user => {
      const tr = document.createElement('tr');

      // para cada campo que quiser mostrar
      const campos = ['nome', 'usuario', 'email', 'senha'];
      campos.forEach(campo => {
        const td = document.createElement('td');
        td.textContent = `${campo[0].toUpperCase() + campo.slice(1)}: ${user[campo]}`;
        tr.appendChild(td);
      });

      tbodyUsers.appendChild(tr);
    })
  }
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
}

function login() {
  usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const usuario = document.getElementById("usuarioL").value.trim();
  const senha = document.getElementById("senhaL").value.trim();

  const achado = usuarios.find(u => u.usuario === usuario && u.senha === senha);
  const cookies = parse(document.cookie || '');

  if (achado) {
    sessionStorage.setItem('user', JSON.stringify(achado));
  }

  if (achado) {
    sessionStorage.setItem('isLoggedIn', 'true');
  // também gravamos um cookie pra middleware:
    document.cookie = 'isLoggedIn=true; Path=/; SameSite=Lax';
    window.location.href = '/pages/pagInicial.html';

  } else {
    alert("Usuário ou senha incorretos.");
  }
  
}
window.login = login;
window.cadastrar = cadastrar;
