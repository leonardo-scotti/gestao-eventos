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

    const date = document.createElement('div')
    date.classList.add('date')

    const cidade = document.createElement('p')
    cidade.textContent = `${evento.endereco[0].cidade} - ${evento.endereco[0].estado}`
    date.appendChild(cidade)

    const data = document.createElement('p')
    data.textContent = evento.dataRealizacao.data_inicio
    date.appendChild(data)

    info.appendChild(date)

    card.appendChild(info)

    return card
}