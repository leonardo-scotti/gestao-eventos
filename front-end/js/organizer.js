'use strict'

import { inserirEvento } from "./conn/eventos.js"

const inicio_organizador = document.getElementById('inicio-organizador')
const dashboard_organizador = document.getElementById('dashboard-organizador')
const criar_evento_organizador = document.getElementById('criar-evento-organizador')
const criar_ingresso_evento_organizador = document.getElementById('criar-ingresso-evento-organizador')
const main = document.querySelector('main')

const side_bar = document.querySelector('.side-bar')

const link_inicio_organizador = side_bar.querySelector('a[href*="inicio-organizador"]')
const link_dashboard_organizador = side_bar.querySelector('a[href*="dashboard-organizador"]')
const link_criar_evento_organizador = side_bar.querySelector('a[href*="criar-evento-organizador"]')
const link_criar_ingresso_evento_organizador = document.getElementById('btn-ingressos')

const btn_cancel_event = document.getElementById('btn-cancel')
const btn_public_event = document.getElementById('btn-public')

const banner_input = document.getElementById('banner')
const banner_img = document.getElementById('banner-image')


// Inputs do Evento
const nome_evento = document.getElementById('nome_evento')
const descricao_evento = document.getElementById('descricao_evento')
const data_inicio = document.getElementById('data_inicio')
const data_termino = document.getElementById('data_termino')
const hora_de_inicio = document.getElementById('hora_de_inicio')
const hora_de_termino = document.getElementById('hora_de_termino')
const cep = document.getElementById('cep')
const estado = document.getElementById('estado')
const rua = document.getElementById('rua')
const numero_do_endereco = document.getElementById('numero_do_endereco')
const bairro = document.getElementById('bairro')
const complemento = document.getElementById('complemento')
const categoria = document.getElementById('categoria')
const assunto = document.getElementById('assunto')
const banner = document.getElementById('banner')

const nome_ingresso = document.getElementById('nome_ingresso')
const descricao_ingresso = document.getElementById('descricao_ingresso')
const quantidade_ingresso = document.getElementById('quantidade_ingresso')
const valor_ingresso = document.getElementById('valor_ingresso')


//EventListerners

link_inicio_organizador.addEventListener('click', function () {
    dashboard_organizador.classList.remove('active')
    criar_evento_organizador.classList.remove('active')
    criar_ingresso_evento_organizador.classList.remove('active')
    inicio_organizador.classList.add('active')
})

link_dashboard_organizador.addEventListener('click', function () {
    inicio_organizador.classList.remove('active')
    criar_evento_organizador.classList.remove('active')
    criar_ingresso_evento_organizador.classList.remove('active')
    dashboard_organizador.classList.add('active')
})

link_criar_evento_organizador.addEventListener('click', function () {
    inicio_organizador.classList.remove('active')
    dashboard_organizador.classList.remove('active')
    criar_ingresso_evento_organizador.classList.remove('active')
    criar_evento_organizador.classList.add('active')
    side_bar.style.display = 'none'
})

link_criar_ingresso_evento_organizador.addEventListener('click', function () {
    criar_evento_organizador.classList.remove('active')
    criar_ingresso_evento_organizador.classList.add('active')
})

btn_cancel_event.addEventListener('click', function () {
    criar_ingresso_evento_organizador.classList.remove('active')
    criar_evento_organizador.classList.add('active')
})

banner_input.addEventListener('change', function () {
    banner_img.src = URL.createObjectURL(banner_input.files[0])
})

if (btn_public_event) {
    btn_public_event.addEventListener('click', PublicarEvento)
}
//Funções


async function PublicarEvento(e) {
    // 1. IMPORTANTE: Previne o F5 automático
    e.preventDefault(); 

    const dados = new FormData();

    dados.append('nome', nome_evento.value);
    dados.append('descricao', descricao_evento.value);
    dados.append('data_inicio', data_inicio.value);
    dados.append('hora_inicio', hora_de_inicio.value);
    dados.append('data_termino', data_termino.value);
    dados.append('hora_termino', hora_de_termino.value);
    dados.append('id_categoria', categoria.value); 
    dados.append('id_assunto', assunto.value);
    dados.append('is_visible', 'true'); 

    if (banner_input.files.length > 0) {
        dados.append('banner', banner_input.files[0]);
    }
    dados.append('quantidade_ingresso', quantidade_ingresso.value);
    dados.append('quantidade_ingresso_comprado', 0);
    dados.append('cep', cep.value);
    dados.append('estado', estado.value);
    dados.append('rua', rua.value);
    dados.append('numero', numero_do_endereco.value);
    dados.append('bairro', bairro.value);
    dados.append('complemento', complemento.value);
    const sucesso = await inserirEvento(dados);
}