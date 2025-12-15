'use strict'

export async function lerEnderecos() {
    const url = `http://localhost:8080/api/v1/unievent/endereco`;

    const response = await fetch(url);
    const events = await response.json();

    return events
}

export async function inserirEndereco(endereco) {
    const url = `http://localhost:8080/api/v1/unievent/endereco`;

    const options = {
        'method': 'POST',
        'body': endereco
    };

    const response = await fetch(url, options)
    console.log(response)

    return response.ok;
}

export async function atualizarEndereco(id, endereco) {
    const url = `http://localhost:8080/api/v1/unievent/endereco/${id}`;

    const options = {
        'method': 'PUT',
        'body': endereco
    };

    const response = await fetch(url, options)

    return response.ok;
}

export async function deletarEndereco(id) {
    const url = `https://localhost:8080/api/v1/unievent/endereco${id}`;

    const options = {
        method: 'DELETE'
    };

    const response = await fetch(url, options);

    return response.ok;
}