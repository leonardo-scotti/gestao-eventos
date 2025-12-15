'use strict'

export async function loginCustomer(email, senha) {
    const response = await fetch(
        'http://localhost:3000/api/v1/unievent/login/cliente',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, senha })
        }
    );

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

    window.location.href = '../index.html';
}

export async function loginOrganizer(email, senha) {
    const response = await fetch('http://localhost:3000/api/v1/unievent/login/organizador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
        sessionStorage.setItem('logado', 'true');
        window.location.href = '/dashboard.html';
    } else {
        alert('Login inválido');
    }
}

export async function logout(type) {
    try {
        await fetch('http://localhost:3000/api/v1/unievent/cliente/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.warn('Erro ao encerrar sessão no backend');
    }

    // Remove controle visual do front
    sessionStorage.removeItem('logado');

    // Redireciona
    window.location.assign('./login.html');
}

function verificarLogin() {
    const logado = sessionStorage.getItem('logado');
    console.log('logado:', logado)
    if (!logado) {
        window.location.href = '../login.html';
    }
}

verificarLogin();