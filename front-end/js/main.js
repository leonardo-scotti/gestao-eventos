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
    console.log(response)
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