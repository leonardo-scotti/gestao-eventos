'use strict'

export async function lerAssuntos() {
    const url = `http://localhost:8080/api/v1/unievent/assunto`;

    const response = await fetch(url);
    const assuntos = await response.json();

    return assuntos
}

export async function inserirAssunto(assunto) {
    const url = `http://localhost:8080/api/v1/unievent/assunto`;

    const options = {
        'method': 'POST',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(assunto)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function atualizarAssunto(id, assunto) {
    const url = `http://localhost:8080/api/v1/unievent/assunto/${id}`;

    const options = {
        'method': 'PUT',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(assunto)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function deletarAssunto(id) {
    const url = `https://localhost:8080/api/v1/unievent/assunto${id}`;

    const options = {
        method: 'DELETE'
    };

    const response = await fetch(url, options);

    return response.ok;
}