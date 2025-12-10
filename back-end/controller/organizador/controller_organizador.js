/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model - do organizador
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 03/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const organizadorDAO = require('../../model/DAO/organizador.js')

//Import da controller genero 
const controllerGenero = require('../genero/controller_genero.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

// Importa o módulo nativo de criptografia do Node.js (Crypto)
const crypto = require('crypto');

//Retorna uma lista de organizadores
const listarOrganizadores = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de gêneros
        let result = await organizadorDAO.getSelectAllOrganizers()

        if (result) {
            if (result.length > 0) {

                for (let organizador of result) {
                    let resultOrganizadores = await controllerGenero.buscarGeneroId(organizador.id_genero)
                    if (resultOrganizadores.status_code == 200) {
                        organizador.genero = resultOrganizadores.generos[0].nome
                        delete organizador.id_genero
                    }

                    if (organizador.data_nascimento != null) {
                        organizador.data_nascimento = new Date(organizador.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }

                    if (organizador.data_fundacao != null) {
                        organizador.data_fundacao = new Date(organizador.data_fundacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }

                }

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    organizadores: result
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

//Retorna um organizador filtrando pelo ID
const buscarOrganizadorId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await organizadorDAO.getSelectByIdOrganizer(parseInt(id))
            if (result) {
                if (result.length > 0) {

                    for (let organizador of result) {
                        let resultOrganizadores = await controllerGenero.buscarGeneroId(organizador.id_genero)
                        if (resultOrganizadores.status_code == 200) {
                            organizador.genero = resultOrganizadores.generos[0].nome
                            delete organizador.id_genero
                        }

                        if (organizador.data_nascimento != null) {
                            organizador.data_nascimento = new Date(organizador.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                        }

                        if (organizador.data_fundacao != null) {
                            organizador.data_fundacao = new Date(organizador.data_fundacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                        }

                    }

                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        organizador: result
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

//Insere um novo organizador
const inserirOrganizador = async function (organizador, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosOrganizador(organizador)

            if (!validarDados) {
                if (await organizadorDAO.validCNPJ(organizador.cnpj) == false) {

                    if (await organizadorDAO.validCPF(organizador.cpf) == false) {
                        let validarGenero = await controllerGenero.buscarGeneroId(organizador.id_genero)

                        if (validarGenero.status_code == 200) {

                            organizador.senha = gerarSha1(organizador.senha)

                            if (organizador.cpf != null) {
                                if (organizador.cpf.length == 11) {

                                    primeiros3_digitos = organizador.cpf.slice(0, 3)
                                    segundos3_digitos = organizador.cpf.slice(3, 6)
                                    terceiros3_digitos = organizador.cpf.slice(6, 9)
                                    dois_digitos = organizador.cpf.slice(9, 11)

                                    organizador.cpf = primeiros3_digitos + "." + segundos3_digitos + "." + terceiros3_digitos + "-" + dois_digitos
                                }
                                if (organizador.cpf.length <= 11) {
                                    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CPF] invalido!!!'
                                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                                }
                            }

                            if (organizador.cnpj != null) {
                                if (organizador.cnpj.length == 14) {

                                    primeiros2_digitos = organizador.cnpj.slice(0, 2)
                                    segundos3_digitos = organizador.cnpj.slice(2, 5)
                                    terceiros3_digitos = organizador.cnpj.slice(5, 8)
                                    quatro_digitos = organizador.cnpj.slice(8, 12)
                                    dois_digitos = organizador.cnpj.slice(12, 14)

                                    organizador.cnpj = primeiros2_digitos + "." + segundos3_digitos + "." + terceiros3_digitos + "/" + quatro_digitos + "-" + dois_digitos
                                }
                                if (organizador.cpf.length <= 14) {
                                    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CNPJ] invalido!!!'
                                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                                }

                            }

                            //Chama a função do DAO para inserir um novo organizador
                            let result = await organizadorDAO.setInsertOrganizer(organizador)

                            if (result) {

                                //Chama a função para receber o ID gerado no BD
                                let lastIdorganizador = await organizadorDAO.getSelectLastIdOrganizer()

                                if (lastIdorganizador) {

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
                            return validarGenero //400
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

//Atualiza um organizador filtrando pelo ID
const atualizarOrganizador = async function (organizador, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosOrganizador(organizador)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarOrganizadorId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    let validarGenero = await controllerGenero.buscarGeneroId(organizador.id_genero)

                    if (validarGenero.status_code == 200) {

                        //Adicionando o ID no JSON com os dados do organizador
                        organizador.id = parseInt(id)

                        if (organizador.cpf != null) {
                            if (organizador.cpf.length == 11) {

                                primeiros3_digitos = organizador.cpf.slice(0, 3)
                                segundos3_digitos = organizador.cpf.slice(3, 6)
                                terceiros3_digitos = organizador.cpf.slice(6, 9)
                                dois_digitos = organizador.cpf.slice(9, 11)

                                organizador.cpf = primeiros3_digitos + "." + segundos3_digitos + "." + terceiros3_digitos + "-" + dois_digitos
                            }
                            if (organizador.cpf.length <= 11) {
                                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CPF] invalido!!!'
                                return MESSAGE.ERROR_REQUIRED_FIELDS //400
                            }
                        }

                        if (organizador.cnpj != null) {
                            if (organizador.cnpj.length == 14) {

                                primeiros2_digitos = organizador.cnpj.slice(0, 2)
                                segundos3_digitos = organizador.cnpj.slice(2, 5)
                                terceiros3_digitos = organizador.cnpj.slice(5, 8)
                                quatro_digitos = organizador.cnpj.slice(8, 12)
                                dois_digitos = organizador.cnpj.slice(12, 14)

                                organizador.cnpj = primeiros2_digitos + "." + segundos3_digitos + "." + terceiros3_digitos + "/" + quatro_digitos + "-" + dois_digitos
                            }
                            if (organizador.cpf.length <= 14) {
                                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CNPJ] invalido!!!'
                                return MESSAGE.ERROR_REQUIRED_FIELDS //400
                            }

                        }

                        //Chama a função do DAO para atualizar um organizador
                        let result = await organizadorDAO.setUpdateOrganizer(organizador)

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
                        return validarGenero
                    }
                } else {
                    return validarID //Retorno da função de buscarorganizadorId (400 ou 404 ou 500)
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

//Apaga um organizador filtrando pelo ID
const excluirOrganizador = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarOrganizadorId(id)

        if (validarID.status_code == 200) {

            let result = await organizadorDAO.setDeleteOrganizer(id)

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
            return validarID //Retorno da função de buscarorganizadorId (400 ou 404 ou 500)
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do organizador
const validarDadosOrganizador = async function (organizador) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (organizador.nome == '' || organizador.nome == null || organizador.nome == undefined || organizador.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (organizador.telefone.length > 11 || organizador.telefone == '' || organizador.telefone == null || organizador.telefone == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [TELEFONE] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (organizador.id_genero < 0 && organizador.id_genero != null) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!organizador.cpf && !organizador.cnpj) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CPF/CNPJ] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }

}

//Função para criptografar informações
function gerarSha1(texto) {
    return crypto.createHash('sha1').update(texto).digest('hex');
}

//Função para autenticar o login
const AutenticarLoginOrganizador = async function (email, senha) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let dadosOrganizadores = await listarOrganizadores();

        if (dadosOrganizadores.status_code === 200) {
            let listaReal = dadosOrganizadores.organizadores;

            let senhaCriptografada = gerarSha1(senha);

            let organizadorEncontrado = listaReal.find(organizador =>
                organizador.email == email &&
                organizador.senha == senhaCriptografada
            );

            if (organizadorEncontrado) {
                return {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    organizador: organizadorEncontrado
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
    listarOrganizadores,
    buscarOrganizadorId,
    inserirOrganizador,
    atualizarOrganizador,
    excluirOrganizador,
    AutenticarLoginOrganizador
}