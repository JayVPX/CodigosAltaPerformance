import * as yup from 'yup';


document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path == '/' || path.endsWith('/index.html')) {
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
    const userJson = sessionStorage.getItem('user');
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
let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")

function validarUsuario(usuario_object) {
  const schemaObrigatorios = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    usuario: yup.string().required('Usuário é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    senha: yup.string().required('Senha é obrigatória'),
    cpf: yup.string().required('CPF é obrigatório')
  });

  const schemaCompleto = yup.object({
    nome: yup.string()
      .required('Nome é obrigatório')
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .matches(/^[A-Za-zÀ-ÿ\s]+$/, 'Nome não pode conter números ou símbolos'),

    usuario: yup.string()
      .required('Usuário é obrigatório')
      .min(4, 'Usuário deve ter no mínimo 4 caracteres')
      .test('sem-espacos', 'Usuário não pode conter espaços', value => !/\s/.test(value))
      .test('usuario-existe', 'Usuário com esse Username já existe', function (value) {
        const { usuarios } = this.options.context;
        return !usuarios.some(u => u.usuario === value);
      }),

    email: yup.string()
      .required('Email é obrigatório')
      .email('Formato de email inválido')
      .test('email-existe', 'Email já cadastrado', function (value) {
        const { usuarios } = this.options.context;
        return !usuarios.some(u => u.email === value);
      }),

    senha: yup.string()
      .required('Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .test('senha-forte', 'Senha deve conter uma letra maiúscula, um número e um caractere especial', value => {
        return /[A-Z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[^A-Za-z0-9]/.test(value);
      }),

    cpf: yup.string()
      .required('CPF é obrigatório')
      .matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF em formato inválido')
      .test('cpf-valido', 'CPF inválido', function (value) {
        const cpf = value.replace(/[^\d]/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf[10]);
      })
      .test('cpf-existe', 'CPF já cadastrado', function (value) {
        const { usuarios } = this.options.context;
        const cpfLimpo = value.replace(/[^\d]/g, '');
        return !usuarios.some(u => (u.cpf || '').replace(/[^\d]/g, '') === cpfLimpo);
      })
  });

  return schemaObrigatorios.validate(usuario_object, { abortEarly: false })
    .then(() => {
      // Todos os obrigatórios estão preenchidos, validar completamente
      return schemaCompleto.validate(usuario_object, {
        context: { usuarios },
        abortEarly: false
      });
    })
    .then(() => true)
    .catch(err => {
      const mensagens = err.errors ?? [err.message ?? 'Erro inesperado na validação.'];
      alert(mensagens.join('\n'));
      return false;
    });
}

function cadastrar() {
  // Capturar os dados do input
  let salvaNome = document.querySelector("#nomeR").value;
  let salvaUsuario = document.querySelector("#usuarioR").value;
  let salvaEmail = document.querySelector("#emailR").value;
  let salvaSenha = document.querySelector("#senhaR").value;
  let salvaCPF = document.querySelector("#cpfR").value;

  // Criar um objeto com os dados do input
  let usuario = {
    nome: salvaNome,
    usuario: salvaUsuario,
    email: salvaEmail,
    senha: salvaSenha,
    cpf: salvaCPF
  };
  validarUsuario(usuario).then(valido => {
    if (valido) {

      usuarios.push(usuario); // Adicionar o usuario criado a lista de usuários
      localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Converte para stringify e guarda no local storage
      alert("Usuário cadastrado com sucesso!");
      window.location.href = '/'
    }
  });
}

function login() {
  // usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const usuario = document.getElementById("usuarioL").value.trim();
  const senha = document.getElementById("senhaL").value.trim();

  const achado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  if (achado) {
    sessionStorage.setItem('user', JSON.stringify(achado));
    sessionStorage.setItem('isLoggedIn', 'true');
    // também gravamos um cookie pra middleware:
    document.cookie = 'isLoggedIn=true; Path=/; SameSite=Lax';
    window.location.href = '/pages/pagInicial.html';

  } else {
    alert("Usuário ou senha incorretos.");
  }
}

function logOut() {
  sessionStorage.setItem('user', undefined);
  sessionStorage.setItem('isLoggedIn', 'false');
  document.cookie = 'isLoggedIn=false; Path=/; SameSite=Lax';
}

window.login = login;
window.cadastrar = cadastrar;
window.logOut = logOut;
