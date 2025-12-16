'use strict'

export async function lerIngressos() {
    const url = `http://localhost:8080/api/v1/unievent/ingresso`;

    const response = await fetch(url);
    const events = await response.json();

    return events
}

export async function inserirIngresso(ingresso) {
    const url = `http://localhost:8080/api/v1/unievent/ingresso`;

    const options = {
        'method': 'POST',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(ingresso)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function atualizarIngresso(id, ingresso) {
    const url = `http://localhost:8080/api/v1/unievent/ingresso/${id}`;

    const options = {
        'method': 'PUT',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(ingresso)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function deletarIngresso(id) {
    const url = `https://localhost:8080/api/v1/unievent/ingresso${id}`;

    const options = {
        method: 'DELETE'
    };

    const response = await fetch(url, options);

    return response.ok;
}