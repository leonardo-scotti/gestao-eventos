'use strict'

export function criarCardEvento(evento) {
    const card = document.createElement('div')
    card.classList.add('event')

    const banner = document.createElement('img')
    banner.src = evento.banner
    card.appendChild(banner)

    const info = document.createElement('div')
    info.classList.add('info')

    const nomeEvento = document.createElement('h4')
    nomeEvento.textContent = evento.nome
    info.appendChild(nomeEvento)

    const date = document.getElementById('div')
    date.classList.add('date')

    const cidade = document.createElement('p')
    
}