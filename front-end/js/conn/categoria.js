'use strict'

export async function lerCategorias() {
    const url = `http://localhost:8080/api/v1/unievent/categoria`;

    const response = await fetch(url);
    const categorias = await response.json();

    return categorias
}

export async function inserirCategoria(categoria) {
    const url = `http://localhost:8080/api/v1/unievent/categoria`;

    const options = {
        'method': 'POST',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(categoria)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function atualizarCategoria(id, categoria) {
    const url = `http://localhost:8080/api/v1/unievent/categoria/${id}`;

    const options = {
        'method': 'PUT',
        'headers': {
            'content-type': 'application/json'
        },
        'body': JSON.stringify(categoria)
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function deletarCategoria(id) {
    const url = `https://localhost:8080/api/v1/unievent/categoria${id}`;

    const options = {
        method: 'DELETE'
    };

    const response = await fetch(url, options);

    return response.ok;
}