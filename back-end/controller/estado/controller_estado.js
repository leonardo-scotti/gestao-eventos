/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model - da estado
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 04/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const estadoDAO = require('../../model/DAO/estado.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de estados
const listarEstados = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de estado
        let result = await estadoDAO.getSelectAllStates()

        if (result) {
            if (result.length > 0) {

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    estados: result
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

//Retorna um estado filtrando pelo ID
const buscarEstadoId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await estadoDAO.getSelectByIdState(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        estado: result
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

//Insere um nova estado
const inserirEstado = async function (estado, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosEstado(estado)

            if (!validarDados) {

                estado.sigla = estado.sigla.toUpperCase()

                //Chama a função do DAO para inserir um novo filme
                let result = await estadoDAO.setInsertState(estado)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdEstado = await estadoDAO.getSelectLastIdState()

                    if (lastIdEstado) {

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
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//Atualiza um estado filtrando pelo ID
const atualizarEstado = async function (estado, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosEstado(estado)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarEstadoId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do estado
                    estado.id = parseInt(id)

                    estado.sigla = estado.sigla.toUpperCase()

                    //Chama a função do DAO para atualizar um estado
                    let result = await estadoDAO.setUpdateState(estado)

                    if (result) {

                        const jsonResult = {
                            status: MESSAGE.SUCCESS_UPDATED_ITEM.status,
                            status_code: MESSAGE.SUCCESS_UPDATED_ITEM.status_code,
                            developments: MESSAGE.HEADER.developments,
                            message: MESSAGE.SUCCESS_UPDATED_ITEM.message,
                        }

                        return jsonResult //200

                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //Retorno da função de buscarestadoId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do Estado 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga uma estado filtrando pelo ID
const excluirEstado = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarEstadoId(id)

        if (validarID.status_code == 200) {

            let result = await estadoDAO.setDeleteState(id)

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
            return validarID //Retorno da função de buscarestadoId (400 ou 404 ou 500)
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do Estado
const validarDadosEstado = async function (estado) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (estado.sigla == '' || estado.sigla == null || estado.sigla == undefined || estado.sigla.length > 2) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ESTADO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }

}

module.exports = {
    listarEstados,
    buscarEstadoId,
    inserirEstado,
    atualizarEstado,
    excluirEstado
}