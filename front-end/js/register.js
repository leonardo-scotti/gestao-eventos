'use strict';

import { lerEventos } from "./conn/eventos.js";
import { criarCardEvento } from "./DOM/eventoDOM.js";
import { protegerPagina, apenasCliente } from './components/guards.js';
import { logout, getAuth, registerCustomer, registerEnterprise } from "./auth.js";

const customerRadio = document.getElementById('customer');
const organizerRadio = document.getElementById('organizer');

const personForm = document.getElementById('person');
const enterpriseForm = document.getElementById('enterprise');

customerRadio.addEventListener('change', () => {
    personForm.style.display = 'flex';
    enterpriseForm.style.display = 'none';
});

organizerRadio.addEventListener('change', () => {
    personForm.style.display = 'none';
    enterpriseForm.style.display = 'flex';
});

const form = document.getElementById('formRegister')
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const selected = document.querySelector('input[name="account-type"]:checked');

    if (!selected) {
        alert('Selecione Cliente ou Organizador');
        return;
    }

    const genero = document.getElementById('genero');
    const generoInt = genero.value

    if (selected.value === "customer") {
        const customer = {
            "nome": document.getElementById('nome').value,
            "email": document.getElementById('email-customer').value,
            "senha": document.getElementById('password-customer').value,
            "cpf": document.getElementById('cpf').value,
            "cnpj": null,
            "telefone": document.getElementById('telefone-customer').value,
            "data_nascimento": document.getElementById('data_nascimento').value,
            "data_fundacao": null,
            "id_genero": generoInt
        }
        console.log(customer)
        await registerCustomer(customer);
    } else if (selected.value === "organizer") {
        const organizer = {
            "nome": document.getElementById('razao').value,
            "email": document.getElementById('email-enterprise').value,
            "senha": document.getElementById('password-enterprise').value,
            "cpf": null,
            "cnpj": document.getElementById('cnpj').value,
            "telefone": document.getElementById('telefone-enterprise').value,
            "data_nascimento": null,
            "data_fundacao": document.getElementById('data_fundacao').value,
            "id_genero": null
        }

        await registerEnterprise(organizer);
    }
});
