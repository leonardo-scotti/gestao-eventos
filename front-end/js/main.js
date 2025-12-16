'use strict';

import { lerEventos } from "./conn/eventos.js";
import { criarCardEvento } from "./DOM/eventoDOM.js";
import { protegerPagina, apenasCliente } from './components/guards.js';
import { logout } from "./auth.js";

protegerPagina();
apenasCliente();

async function criarEventosHoje() {
    const container = document.getElementById('events');
    const response = await lerEventos();

    for (let i = 0; i <= 5; i++) {
        const evento = criarCardEvento(response.eventos[i]);
        container.appendChild(evento);
    }
}

criarEventosHoje();

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
