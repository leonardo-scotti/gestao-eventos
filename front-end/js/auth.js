'use strict'

export async function loginCustomer(email, senha) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, senha })
    }
    const response = await fetch('http://localhost:8080/api/v1/unievent/login/cliente', options);

    if (!response.ok) {
        alert('Login inválido');
        return;
    }

    const data = await response.json();

    sessionStorage.setItem('auth', JSON.stringify({
        logado: true,
        tipo: 'cliente',
        usuario: data.cliente
    }));

    window.location.href = './index.html';
}

export async function loginOrganizer(email, senha) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, senha })
    }
    const response = await fetch('http://localhost:8080/api/v1/unievent/login/organizador', options);

    if (!response.ok) {
        alert('Login inválido');
        return;
    }

    const data = await response.json();

    sessionStorage.setItem('auth', JSON.stringify({
        logado: true,
        tipo: 'organizador',
        usuario: data.organizador
    }));

    window.location.href = './organizer.html';
}

export async function registerCustomer(customer) {
    const url = `http://localhost:8080/api/v1/unievent/cliente`
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(customer)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
        alert('Informações inválidas')
        return
    } else {
        window.location.href = "./login.html"
    }
}

export async function logout(type) {
    try {
        await fetch(`http://localhost:8080/api/v1/unievent/${type}/logout`, {
            method: 'POST',
            credentials: 'include' // MUITO IMPORTANTE (cookie da sessão)
        });

        // Limpa os dados do usuário no front
        sessionStorage.clear();

        // Redireciona para o login
        window.location.href = '../login.html';

    } catch (error) {
        console.error('Erro ao fazer logout', error);
        alert('Erro ao sair da conta');
    }
}

export function verificarLogin() {
    const auth = JSON.parse(sessionStorage.getItem('auth'));

    if (!auth || !auth.logado) {
        if (!window.location.pathname.includes('login.html')) {
            window.location.replace('/login.html');
        }
    }
}