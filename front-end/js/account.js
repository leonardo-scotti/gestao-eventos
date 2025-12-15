'use strict';

import { protegerPagina, apenasCliente } from './components/guards.js';
import { logout, getAuth } from "./auth.js";

protegerPagina();

const sair = document.getElementById('logout')
sair.addEventListener('click', async (event) => {
    await logout('cliente')
})

const myAccount = document.getElementById('my-account')
myAccount.addEventListener('click', (event) => {
    const register = document.getElementById('register')
    if (register.classList.contains('active')) {
        register.classList.remove('active')
    }

    const account = document.getElementById('minha-conta')
    if (!account.classList.contains('active')) {
        account.classList.add('active')
    }
})

function carregarInformações() {
    const user = getAuth()
    console.log(user)

    const usuario = user.usuario

    const cpfCnpj = document.getElementById('cpf_cnpj')
    cpfCnpj.value = usuario.cpf

    const nome = document.getElementById('nome-account')
    nome.value = usuario.nome

    const genero = document.getElementById('genero-account')
    genero.value = usuario.genero

    const dataNascimento = document.getElementById('data_account')
    const dataNascimentoFormatada = converterDataParaInput(usuario.data_nascimento)
    dataNascimento.value = dataNascimentoFormatada

    const email = document.getElementById('email-account')
    email.value = usuario.email

}

function converterDataParaInput(data) {
    if (!data) return ''

    const [dia, mes, ano] = data.split('/')
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

carregarInformações()
