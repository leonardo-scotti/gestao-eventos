/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model - do cliente
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 03/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const clienteDAO = require('../../model/DAO/cliente.js')

//Import da controller genero 
const controllerGenero = require('../genero/controller_genero.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

// Importa o módulo nativo de criptografia do Node.js (Crypto)
const crypto = require('crypto');

//Retorna uma lista de clientes
const listarClientes = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de clientes
        let result = await clienteDAO.getSelectAllCustomers()

        if (result) {
            if (result.length > 0) {

                for (cliente of result) {

                    let resultClientes = await controllerGenero.buscarGeneroId(cliente.id_genero)
                    if (resultClientes.status_code == 200) {
                        cliente.genero = resultClientes.generos[0].nome
                        delete cliente.id_genero
                    } else {
                        delete cliente.id_genero
                    }

                    if (cliente.data_nascimento != null) {
                        cliente.data_nascimento = new Date(cliente.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }

                    if (cliente.data_fundacao != null) {
                        cliente.data_fundacao = new Date(cliente.data_fundacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }

                    if (cliente.telefone.length === 11) {
                        let ddd = cliente.telefone.slice(0, 2)
                        let parte1 = cliente.telefone.slice(2, 7)
                        let parte2 = cliente.telefone.slice(7)

                        cliente.telefone = `(${ddd}) ${parte1}-${parte2}`
                    }

                    if (cliente.cpf == null && cliente.data_nascimento == null) {
                        delete cliente.cpf
                        delete cliente.data_nascimento
                    }
                    if (cliente.cnpj == null && cliente.data_fundacao == null) {
                        delete cliente.cnpj
                        delete cliente.data_fundacao
                    }

                }

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    clientes: result
                }

                return jsonResult //200

            } else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Retorna um cliente filtrando pelo ID
const buscarClienteId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await clienteDAO.getSelectByIdCustomer(parseInt(id))
            if (result) {
                if (result.length > 0) {

                    for (cliente of result) {

                        let resultClientes = await controllerGenero.buscarGeneroId(cliente.id_genero)
                        if (resultClientes.status_code == 200) {
                            cliente.genero = resultClientes.generos[0].nome
                            delete cliente.id_genero
                        } else {
                            delete cliente.id_genero
                        }

                        if (cliente.data_nascimento != null) {
                            cliente.data_nascimento = new Date(cliente.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                        }

                        if (cliente.data_fundacao != null) {
                            cliente.data_fundacao = new Date(cliente.data_fundacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                        }

                        if (cliente.telefone.length === 11) {
                            let ddd = cliente.telefone.slice(0, 2)
                            let parte1 = cliente.telefone.slice(2, 7)
                            let parte2 = cliente.telefone.slice(7)

                            cliente.telefone = `(${ddd}) ${parte1}-${parte2}`
                        }

                        if (cliente.cpf == null && cliente.data_nascimento == null) {
                            delete cliente.cpf
                            delete cliente.data_nascimento
                        }
                        if (cliente.cnpj == null && cliente.data_fundacao == null) {
                            delete cliente.cnpj
                            delete cliente.data_fundacao
                        }
                        if(cliente.genero == null) {
                            delete cliente.genero
                        }

                    }

                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        cliente: result
                    }

                    return jsonResult //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo cliente
const inserirCliente = async function (cliente, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosCliente(cliente)

            if (!validarDados) {
                if (await clienteDAO.validCNPJ(cliente.cnpj) == false) {

                    if (await clienteDAO.validCPF(cliente.cpf) == false) {
                        let validarGenero = await controllerGenero.buscarGeneroId(cliente.id_genero)

                        if (validarGenero.status_code == 200) {

                            cliente.senha = gerarSha1(cliente.senha)

                            let email = cliente.email
                            let partes = email.split('@')

                            let usuario = partes[0]
                            let dominio = partes[1].toLowerCase()

                            cliente.email = usuario + dominio

                            let validaremail = await clienteDAO.getSelectAllCustomers()

                            for (let item of validaremail) {
                                if (item.email == cliente.email) {
                                    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'O [EMAIL] já está em uso!!!'
                                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                                }
                            }

                            //Chama a função do DAO para inserir um novo cliente
                            let result = await clienteDAO.setInsertCustomer(cliente)

                            if (result) {

                                //Chama a função para receber o ID gerado no BD
                                let lastIdCliente = await clienteDAO.getSelectLastIdCustomer()

                                if (lastIdCliente) {

                                    const jsonResult = {
                                        status: MESSAGE.SUCCESS_CREATED_ITEM.status,
                                        status_code: MESSAGE.SUCCESS_CREATED_ITEM.status_code,
                                        developments: MESSAGE.HEADER.developments,
                                        message: MESSAGE.SUCCESS_CREATED_ITEM.message
                                    }

                                    return jsonResult //201

                                } else {
                                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                                }
                            } else {
                                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                            }
                        } else {
                            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_GENERO] invalido!!!'
                            return MESSAGE.ERROR_REQUIRED_FIELDS //400
                        }
                    } else {
                        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Este [CPF] já está em uso!!!'
                        return MESSAGE.ERROR_REQUIRED_FIELDS //400
                    }
                } else {
                    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Este [CNPJ] já está em uso!!!'
                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//Atualiza um cliente filtrando pelo ID
const atualizarCliente = async function (cliente, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosCliente(cliente)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarClienteId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    let validarGenero = await controllerGenero.buscarGeneroId(cliente.id_genero)

                    if (validarGenero.status_code == 200) {

                        cliente.senha = gerarSha1(cliente.senha)

                        let email = cliente.email
                        let partes = email.split('@')

                        let usuario = partes[0]
                        let dominio = partes[1].toLowerCase()

                        cliente.email = usuario + dominio

                        let validaremail = await clienteDAO.getSelectAllCustomers()

                        for (let item of validaremail) {
                            if (item.email == cliente.email) {
                                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'O [EMAIL] já está em uso!!!'
                                return MESSAGE.ERROR_REQUIRED_FIELDS //400
                            }
                        }

                        //Adicionando o ID no JSON com os dados do cliente
                        cliente.id = parseInt(id)

                        //Chama a função do DAO para atualizar um cliente
                        let result = await clienteDAO.setUpdateCustomer(cliente)

                        if (result) {

                            const jsonResult = {
                                status: MESSAGE.SUCCESS_UPDATED_ITEM.status,
                                status_code: MESSAGE.SUCCESS_UPDATED_ITEM.status_code,
                                developments: MESSAGE.HEADER.developments,
                                message: MESSAGE.SUCCESS_UPDATED_ITEM.message
                            }

                            return jsonResult //200

                        } else {
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    } else {
                        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_GENERO] invalido!!!'
                        return MESSAGE.ERROR_REQUIRED_FIELDS //400
                    }
                } else {
                    return validarID //Retorno da função de buscarclienteId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do Gênero 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um cliente filtrando pelo ID
const excluirCliente = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarClienteId(id)

        if (validarID.status_code == 200) {

            let result = await clienteDAO.setDeleteCustomer(id)

            if (result) {

                const jsonResult = {
                    status: MESSAGE.SUCCESS_DELETED_ITEM.status,
                    status_code: MESSAGE.SUCCESS_DELETED_ITEM.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_DELETED_ITEM.message,
                }

                return jsonResult //200

            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return validarID //Retorno da função de buscarclienteId (400 ou 404 ou 500)
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do Cliente
const validarDadosCliente = async function (cliente) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (cliente.cpf != null) {
        if (cliente.cpf.length == 11) {

            primeiros3_digitos = cliente.cpf.slice(0, 3)
            segundos3_digitos = cliente.cpf.slice(3, 6)
            terceiros3_digitos = cliente.cpf.slice(6, 9)
            dois_digitos = cliente.cpf.slice(9, 11)

            cliente.cpf = primeiros3_digitos + "." + segundos3_digitos + "." + terceiros3_digitos + "-" + dois_digitos
        }
        if (cliente.cpf.length <= 11) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CPF] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    }

    if (cliente.cnpj != null) {
        if (cliente.cnpj.length == 14) {

            primeiros2_digitos = cliente.cnpj.slice(0, 2)
            segundos3_digitos = cliente.cnpj.slice(2, 5)
            terceiros3_digitos = cliente.cnpj.slice(5, 8)
            quatro_digitos = cliente.cnpj.slice(8, 12)
            dois_digitos = cliente.cnpj.slice(12, 14)

            cliente.cnpj = primeiros2_digitos + "." + segundos3_digitos + "." + terceiros3_digitos + "/" + quatro_digitos + "-" + dois_digitos
        }
        if (cliente.cnpj.length <= 14) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CNPJ] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    }

    if (cliente.telefone.length === 15) {
        cliente.telefone = cliente.telefone.replace("(", "")
        cliente.telefone = cliente.telefone.replace(") ", "")
        cliente.telefone = cliente.telefone.replace("-", "")
    } else if (cliente.telefone.length === 14) {
        cliente.telefone = cliente.telefone.replace("(", "")
        cliente.telefone = cliente.telefone.replace(")", "")
        cliente.telefone = cliente.telefone.replace("-", "")
    }

    if (cliente.cpf != null && cliente.cnpj != null) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Você só pode inserir ou um [CPF] ou [CNPJ] !!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }

    if (cliente.data_fundacao != null && cliente.data_nascimento != null) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Você só pode inserir ou um [DATA_FUNDACAO] ou [DATA_NASCIMENTO] !!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }

    if (cliente.data_fundacao != null && cliente.cpf != null) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Você não pode inserir uma [DATA_FUNDACAO] e um [CPF] simultaneamente !!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }

    if (cliente.data_nascimento != null && cliente.cnpj != null) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Você não pode inserir uma [DATA_NASCIMENTO] e um [CNPJ] simultaneamente !!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }

    if (cliente.nome == '' || cliente.nome == null || cliente.nome == undefined || cliente.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (cliente.telefone.length > 11 || cliente.telefone == '' || cliente.telefone == null || cliente.telefone == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [TELEFONE] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (cliente.id_genero < 0 && cliente.id_genero != null) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!cliente.cpf && !cliente.cnpj) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CPF/CNPJ] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (cliente.senha == null || cliente.senha == undefined || cliente.senha == '' || cliente.senha > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SENHA] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }  else if (cliente.email == null || cliente.email == undefined || cliente.email == '' || cliente.email > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [EMAIL] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (cliente.email) {
        cliente.email = cliente.email.trim()

        if (cliente.email.indexOf("@") !== -1) {
            let email = cliente.email
            let partes = email.split('@')

            if (partes.length == 2) {

                let usuario = partes[0]
                let dominio = partes[1]

                if (usuario.length === 0 || dominio.length === 0 || !dominio.includes('.') || dominio.startsWith('.') || dominio.endsWith('.')) {
                    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [EMAIL] invalido!!!'
                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                } else {
                    return false
                }

            } else {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [EMAIL] invalido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [EMAIL] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    }

}

//Função para criptografar informações
function gerarSha1(texto) {
    return crypto.createHash('sha1').update(texto).digest('hex');
}

//Função para autenticar o login
const AutenticarLoginCliente = async function (email, senha) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let dadosClientes = await listarClientes();

        if (dadosClientes.status_code === 200) {
            let listaReal = dadosClientes.clientes;

            let senhaCriptografada = gerarSha1(senha);

            let partes = email.split('@')
            let usuario = partes[0]
            let dominio = partes[1].toLowerCase()

            email = usuario + dominio

            let clienteEncontrado = listaReal.find(cliente =>
                cliente.email == email &&
                cliente.senha == senhaCriptografada
            );

            if (clienteEncontrado) {
                return {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    cliente: clienteEncontrado
                }
            } else {
                return MESSAGE.ERROR_NOT_FOUND; //404 
            }

        } else {
            return MESSAGE.ERROR_NOT_FOUND;
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    listarClientes,
    buscarClienteId,
    inserirCliente,
    atualizarCliente,
    excluirCliente,
    AutenticarLoginCliente
}