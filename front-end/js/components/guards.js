'use strict';

import { verificarLogin, getAuth } from '../auth.js';

export function protegerPagina() {
    verificarLogin();
}

export function apenasCliente() {
    const auth = JSON.parse(sessionStorage.getItem('auth'));

    if (!auth || auth.tipo !== 'cliente') {
        window.location.replace('./login.html');
    }
}

export function apenasOrganizador() {
    const auth = JSON.parse(sessionStorage.getItem('auth'));

    if (!auth || auth.tipo !== 'organizador') {
        window.location.replace('./login.html');
    }
}