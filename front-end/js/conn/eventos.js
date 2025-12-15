'use strict'

export async function lerEventos() {
    const url = `http://localhost:8080/api/v1/unievent/evento`;

    const response = await fetch(url);
    const events = await response.json();

    return events
}

export async function inserirEvento(event) {
    const url = `http://localhost:8080/api/v1/unievent/evento`;

    const options = {
        'method': 'POST',
        'body': event
    };

    const response = await fetch(url, options)
    const evento = await response.json();

    return evento;
}

export async function atualizarEvento(id, event) {
    const url = `http://localhost:8080/api/v1/unievent/evento/${id}`;

    const options = {
        'method': 'PUT',
        'body': event
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function deletarEvento(id) {
    const url = `https://localhost:8080/api/v1/unievent/evento${id}`;

    const options = {
        method: 'DELETE'
    };

    const response = await fetch(url, options);

    return response.ok;
}