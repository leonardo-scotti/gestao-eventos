'use strict'

export async function lerEstados() {
    const url = `http://localhost:8080/api/v1/unievent/estado`;

    const response = await fetch(url);
    const estados = await response.json();

    return estados
}

export async function inserirEstado(estado) {
    const url = `http://localhost:8080/api/v1/unievent/estado`;

    const options = {
        'method': 'POST',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(estado)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function atualizarEstado(id, estado) {
    const url = `http://localhost:8080/api/v1/unievent/estado/${id}`;

    const options = {
        'method': 'PUT',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(estado)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function deletarEstado(id) {
    const url = `https://localhost:8080/api/v1/unievent/estado${id}`;

    const options = {
        method: 'DELETE'
    };

    const response = await fetch(url, options);

    return response.ok;
}