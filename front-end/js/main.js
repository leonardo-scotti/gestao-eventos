'use strict'

import items from '../events.json' with { type: 'json' }

async function carregarCarrossel() {
    const track = document.getElementById("carouselTrack");

    // Adiciona a lista original
    items.forEach(item => {
    track.innerHTML += `
        <div class="carousel-item">
        <img src="${item.img}" alt="">
        <span>${item.nome}</span>
        </div>
    `;
    });

    // Duplica para permitir scroll realmente infinito
    items.forEach(item => {
    track.innerHTML += `
        <div class="carousel-item">
        <img src="${item.img}" alt="">
        <span>${item.nome}</span>
        </div>
    `;
    });
}

carregarCarrossel()