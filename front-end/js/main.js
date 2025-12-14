'use strict'

import { lerEventos } from "./conn/eventos.js"
import { criarCardEvento } from "./eventoDOM.js"

async function criarEventosHoje() {
    const container = document.getElementById('events')
    const response = await lerEventos()

    for (let i = 0; i <= 5; i++) {
        const evento = criarCardEvento(response.eventos[i])

        container.appendChild(evento)
    }
}

//console.log(await lerEventos())
criarEventosHoje()