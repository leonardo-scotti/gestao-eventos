'use strict'

import { inserirEvento } from "./conn/eventos.js"
import { inserirEndereco } from "./conn/endereco.js"
import { inserirIngresso, lerIngressos } from "./conn/ingresso.js"
import { lerEstados } from "./conn/estado.js"
import { lerAssuntos } from "./conn/assunto.js"
import { lerCategorias } from "./conn/categoria.js"
import { lerPedidos } from "./conn/pedidos.js"
import { protegerPagina, apenasOrganizador } from './components/guards.js';
import { logout } from "./auth.js";
import { getAuth } from "./auth.js"

const inicio_organizador = document.getElementById('inicio-organizador')
const dashboard_organizador = document.getElementById('dashboard-organizador')
const criar_evento_organizador = document.getElementById('criar-evento-organizador')
const criar_ingresso_evento_organizador = document.getElementById('criar-ingresso-evento-organizador')
const main = document.querySelector('main')

const side_bar = document.querySelector('.side-bar')
const events_container = document.querySelector('.events')

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
const cidade = document.getElementById('cidade')
const numero_do_endereco = document.getElementById('numero_do_endereco')
const bairro = document.getElementById('bairro')
const complemento = document.getElementById('complemento')
const categoria = document.getElementById('categoria')
const assunto = document.getElementById('assunto')
const banner = document.getElementById('banner')

const nome_ingresso = document.getElementById('nome_ingresso')
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


async function PublicarEvento() {

    const dados = new FormData();

    //Evento
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

    const evento = await inserirEvento(dados);

    const idEvento = evento.evento.id_evento;

    //Endereço

    let endereco = {
        "cep": `${cep.value}`,
        "logradouro": `${rua.value}`,
        "complemento": `${complemento.value}`,
        "numero": `${numero_do_endereco.value}`,
        "bairro": `${bairro.value}`,
        "cidade": `${cidade.value}`,
        "id_estado": estado.value,
        "id_evento": idEvento
    }

    let enderecoInserido = await inserirEndereco(endereco)

    //Ingresso

    let ingresso = {
        "nome": `${nome_ingresso.value}`,
        "preco_unitario": `${valor_ingresso.value}`,
        "is_ativo": true,
        "id_evento": idEvento
    }

    let ingressoInserido = await inserirIngresso(ingresso)

}

async function BuscarEstados() {
    let resposta = await lerEstados()
    let estados = resposta.estados

    if (Array.isArray(estados)) {
        estados.forEach(element => {
            if (element != null) {
                let options = document.createElement('option')
                options.value = element.id_estado
                options.textContent = element.sigla
                estado.appendChild(options)
            }
        });
    }
}

async function BuscarAssuntos() {
    let resposta = await lerAssuntos()
    let assuntos = resposta.assuntos

    if (Array.isArray(assuntos)) {
        assuntos.forEach(element => {
            if (element != null) {
                let options = document.createElement('option')
                options.value = element.id_assunto
                options.textContent = element.nome
                assunto.appendChild(options)
            }
        });
    }
}

async function BuscarCategorias() {
    let resposta = await lerCategorias()
    let categorias = resposta.categorias

    if (Array.isArray(categorias)) {
        categorias.forEach(element => {
            if (element != null) {
                let options = document.createElement('option')
                options.value = element.id_categoria
                options.textContent = element.nome
                categoria.appendChild(options)
            }
        });
    }
}

async function ExibirMeusEventos() {

    const respostaIngressos = await lerIngressos();
    const respostaPedidos = await lerPedidos();

    let ingressos = respostaIngressos.ingressos || [];
    let pedidos = respostaPedidos.pedidos || [];

    const login = getAuth();

    const events_container = document.querySelector('.events');

    if (events_container) {
        events_container.textContent = '';
    }

    const ingressosMap = Object.fromEntries(
        ingressos.map(ingresso => [ingresso.id_ingresso, ingresso])
    );

    if (login && login.logado && login.usuario && login.usuario.email) {

        pedidos.forEach(element => {

            const emailOrganizadorPedido = element.organizador?.[0]?.email;
            const idIngressoDoPedido = element.ingresso?.[0]?.id_ingresso;
            const ingressoRelacionado = ingressosMap[idIngressoDoPedido];

            if (login.usuario.email === emailOrganizadorPedido && ingressoRelacionado) {

                const eventoData = ingressoRelacionado.evento?.[0];
                
                if (!eventoData) return; 

                const enderecoData = eventoData.endereco?.[0];
                
                if (!enderecoData) return;

                const nomeEvento = eventoData.nome;
                const urlImagem = eventoData.banner;
                const dataInicio = eventoData.dataRealizacao?.data_inicio;
                const estadoSigla = enderecoData.estado;
                const statusPedido = element.status_pedido;

                let event = document.createElement('div');
                let img = document.createElement('img');
                let info = document.createElement('div');
                let name_event = document.createElement('h4');
                let status = document.createElement('div');
                let icon_status = document.createElement('div');
                let visilite = document.createElement('h2');
                let date = document.createElement('div');
                let states = document.createElement('p');
                let day_event_realizing = document.createElement('p');

                event.classList.add('event');
                info.classList.add('info');
                status.classList.add('status');
                icon_status.classList.add('icon-status');
                date.classList.add('date');

                img.src = urlImagem || '';
                name_event.textContent = nomeEvento || 'Evento Desconhecido';

                visilite.textContent = statusPedido ? statusPedido.replace('_', ' ') : 'Status Indefinido';
                
                if (statusPedido === 'FINALIZADO') {
                    icon_status.style.backgroundColor = '#4CAF50'; 
                } else if (statusPedido === 'EM_ANDAMENTO') {
                    icon_status.style.backgroundColor = '#FFC107'; 
                } else {
                    icon_status.style.backgroundColor = '#F44336'; 
                }
                
                states.textContent = estadoSigla || 'Estado Indefinido';
                day_event_realizing.textContent = dataInicio || 'Data Indefinida';

                event.appendChild(img);
                event.appendChild(info);

                info.appendChild(name_event);

                info.appendChild(status);
                status.appendChild(icon_status);
                status.appendChild(visilite);

                info.appendChild(date);
                date.appendChild(states);
                date.appendChild(day_event_realizing);

                if (events_container) {
                    events_container.appendChild(event);
                }
            }
        });
    }
}

ExibirMeusEventos()
BuscarEstados()
BuscarCategorias()
BuscarAssuntos()


const sair = document.getElementById('logout')
sair.addEventListener('click', async (event) => {
    await logout('cliente')
})

protegerPagina()
apenasOrganizador()