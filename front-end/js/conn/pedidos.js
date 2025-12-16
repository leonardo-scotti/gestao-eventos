'use strict'

export async function lerPedidos() {
    const url = `http://localhost:8080/api/v1/unievent/pedido`;

    const response = await fetch(url);
    const events = await response.json();

    return events
}

export async function inserirPedido(pedido) {
    const url = `http://localhost:8080/api/v1/unievent/pedido`;

    const options = {
        'method': 'POST',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(pedido)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function atualizarPedido(id, pedido) {
    const url = `http://localhost:8080/api/v1/unievent/pedido/${id}`;

    const options = {
        'method': 'PUT',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(pedido)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function deletarPedido(id) {
    const url = `https://localhost:8080/api/v1/unievent/pedido${id}`;

    const options = {
        method: 'DELETE'
    };

    const response = await fetch(url, options);

    return response.ok;
}