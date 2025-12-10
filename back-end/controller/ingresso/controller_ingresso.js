/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model - do Ingresso
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 04/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const ingressoDAO = require('../../model/DAO/ingresso.js')

//Import da controller evento 
const controllerEvento = require('../evento/controller_evento.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de ingressos
const listarIngressos = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de ingressos
        let result = await ingressoDAO.getSelectAllTickets()

        if (result) {
            if (result.length > 0) {

                for (let ingresso of result) {

                    if (ingresso.preco_unitario != null) {
                        ingresso.valor_liquido = ingresso.preco_unitario
                        ingresso.valor_bruto = ingresso.preco_unitario / 0.97
                        delete ingresso.preco_unitario
                    }

                    let resultIngresso = await controllerEvento.buscarEventoId(ingresso.id_evento)
                    if (resultIngresso.status_code == 200 && resultIngresso.evento && resultIngresso.evento.length > 0) {
                        ingresso.evento = resultIngresso.evento
                        delete ingresso.id_evento
                    }
                }

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    ingressos: result
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

//Retorna um ingresso filtrando pelo ID
const buscarIngressoId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await ingressoDAO.getSelectByIdTicket(parseInt(id))
            if (result) {
                if (result.length > 0) {

                    for (let ingresso of result) {

                        if (ingresso.preco_unitario != null) {
                            ingresso.valor_liquido = ingresso.preco_unitario
                            ingresso.valor_bruto = ingresso.preco_unitario / 0.97
                            delete ingresso.preco_unitario
                        }

                        let resultIngresso = await controllerEvento.buscarEventoId(ingresso.id_evento)
                        if (resultIngresso.status_code == 200 && resultIngresso.evento && resultIngresso.evento.length > 0) {
                            ingresso.evento = resultIngresso.evento
                            delete ingresso.id_evento
                        }
                    }

                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        ingressos: result
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

//Insere um novo ingresso
const inserirIngresso = async function (ingresso, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosIngresso(ingresso)

            if (!validarDados) {

                let valor_bruto = ingresso.preco_unitario
                let valor_liquido = valor_bruto - (valor_bruto * 0.03)
                ingresso.preco_unitario = valor_liquido

                //Chama a função do DAO para inserir um novo ingresso
                let result = await ingressoDAO.setInsertTicket(ingresso)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdIngresso = await ingressoDAO.getSelectLastIdTicket()

                    if (lastIdIngresso) {

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
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//Atualiza um ingresso filtrando pelo ID
const atualizarIngresso = async function (ingresso, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosIngresso(ingresso)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarIngressoId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do ingresso
                    ingresso.id = parseInt(id)

                    //Chama a função do DAO para atualizar um ingresso
                    let result = await ingressoDAO.setUpdateTicket(ingresso)

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
                    return validarID //Retorno da função de buscaringressoId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do ingresso 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um ingresso filtrando pelo ID
const excluirIngresso = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarIngressoId(id)

        if (validarID.status_code == 200) {

            let result = await ingressoDAO.setDeleteTicket(id)

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
            return validarID //Retorno da função de buscaringressoId (400 ou 404 ou 500)
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do ingresso
const validarDadosIngresso = async function (ingresso) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (ingresso.nome == '' || ingresso.nome == null || ingresso.nome == undefined || ingresso.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ingresso.preco_unitario == '' || ingresso.preco_unitario == null || ingresso.preco_unitario == undefined || Number(ingresso.preco_unitario) < 0 || Number(ingresso.preco_unitario) > 9999999.99 || isNaN(ingresso.preco_unitario)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [PRECO_UNITARIO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (typeof ingresso.is_ativo !== 'boolean') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IS_ATIVO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ingresso.id_evento == '' || ingresso.id_evento == null || ingresso.id_evento == undefined || isNaN(ingresso.id_evento)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_EVENTO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }

}

module.exports = {
    listarIngressos,
    buscarIngressoId,
    inserirIngresso,
    atualizarIngresso,
    excluirIngresso
}