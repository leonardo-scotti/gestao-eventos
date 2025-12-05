/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model 
 *              para o CRUD de pedido e ingresso
 * Data: 05/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO do pedido ingresso
const pedidoIngressoDAO = require('../../model/DAO/item-pedido.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de pedidos e ingressos
const listarPedidosIngressos = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de pedidos  ingresso
        let result = await pedidoIngressoDAO.getSelectAllRequestsTickets()

        if (result) {
            if (result.length > 0) {

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    pedidos_ingressos: result
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

//Retorna um pedido ingresso filtrando pelo ID
const buscarPedidoIngressoId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await pedidoIngressoDAO.getSelectByIdRequestTicket(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        pedido_ingresso: result
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

//Retorna os ingressos filtrando pelo ID do pedido
const listarIngressosIdPedido = async function (IdPedido) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (IdPedido != '' && IdPedido != null && IdPedido != undefined && !isNaN(IdPedido) && IdPedido > 0) {
            
            let result = await pedidoIngressoDAO.getSelectTicketsByIdRequest(parseInt(IdPedido)) 

            if (result) {
                if (result.length > 0) {
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
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_pedido] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna os pedidos filtrando pelo ID do ingresso
const listarPedidosIdIngresso = async function (idIngresso) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idIngresso != '' && idIngresso != null && idIngresso != undefined && !isNaN(idIngresso) && idIngresso > 0) {
            //Chama a função para filtrar pelo ID
            let result = await pedidoIngressoDAO.getSelectOrganizersByIdEvent(parseInt(idIngresso))
            if (result) {
                if (result.length > 0) {
                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        pedidos: result
                    }

                    return jsonResult //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_pedido] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo pedido ingresso
const inserirPedidoIngresso = async function (pedidoIngresso, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosPedidoIngresso(pedidoIngresso)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo pedido
                let result = await pedidoIngressoDAO.setInsertRequestTicket(pedidoIngresso)

                if (result) {
                    //Chama a função para receber o ID gerado no BD
                    let lastIdPedidoIngresso = await pedidoIngressoDAO.getSelectLastIdRequestTicket()

                    if (lastIdPedidoIngresso) {

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

//Atualiza um pedido ingresso filtrando pelo ID
const atualizarPedidoIngresso = async function (pedidoIngresso, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosPedidoIngresso(pedidoIngresso)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarPedidoIngressoId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do ingresso
                    pedidoIngresso.id = parseInt(id)

                    //Chama a função do DAO para atualizar um ingresso
                    let result = await pedidoIngressoDAO.setUpdateRequestTicket(pedidoIngresso)

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
                    return validarID //Retorno da função de buscarPedidoIngressoId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do pedido ingresso 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um pedido ingresso filtrando pelo ID
const excluirPedidoIngresso = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarPedidoIngressoId(id)

            if (validarID.status_code == 200) {

                let result = await pedidoIngressoDAO.setDeleteRequestTicket(parseInt(id))

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

        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um pedido ingresso filtrando pelo ID
const excluirIngressoPorPedido = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarPedidoIngressoId(id)

            if (validarID.status_code == 200) {

                let result = await pedidoIngressoDAO.setDeleteByIdRequestsAndTicketId(parseInt(id))

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

        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do pedido ingresso
const validarDadosPedidoIngresso = async function (pedidoIngresso) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (pedidoIngresso.id_pedido == '' || pedidoIngresso.id_pedido == null || pedidoIngresso.id_pedido == undefined || isNaN(pedidoIngresso.id_pedido) || pedidoIngresso.id_pedido <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_PEDIDO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (pedidoIngresso.id_ingresso == '' || pedidoIngresso.id_ingresso == null || pedidoIngresso.id_ingresso == undefined || isNaN(pedidoIngresso.id_ingresso) || pedidoIngresso.id_ingresso <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_INGRESSO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (pedidoIngresso.quantidade == '' || pedidoIngresso.quantidade == null || pedidoIngresso.quantidade == undefined || isNaN(pedidoIngresso.quantidade) || pedidoIngresso.quantidade <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [QUANTIDADE] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }

}

module.exports = {
    listarPedidosIngressos,
    buscarPedidoIngressoId,
    listarIngressosIdPedido,
    listarPedidosIdIngresso,
    inserirPedidoIngresso,
    atualizarPedidoIngresso,
    excluirPedidoIngresso,
    excluirIngressoPorPedido
}