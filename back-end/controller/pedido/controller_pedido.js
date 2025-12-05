/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model - do pedido
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 04/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const pedidoDAO = require('../../model/DAO/pedido.js')

//Import da controller cliente 
const controllerCliente = require('../cliente/controller_cliente.js')

//Import da controller organizador 
const controllerOrganizador = require('../organizador/controller_organizador.js')

//Import da controller item_pedido 
const controllerItem_Pedido = require('../pedido/controller_item_pedido.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de pedidos
const listarPedidos = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de pedidos
        let result = await pedidoDAO.getSelectAllRequests()

        if (result) {
            if (result.length > 0) {

                for (let pedido of result) {
                    let resultOrganizador = await controllerOrganizador.buscarOrganizadorId(pedido.id_organizador)
                    if (resultOrganizador.status_code == 200 && resultOrganizador.organizador && resultOrganizador.organizador.length > 0) {
                        pedido.organizador = resultOrganizador.organizador
                        delete pedido.id_organizador
                    }
                    let resultCliente = await controllerCliente.buscarClienteId(pedido.id_cliente)
                    if (resultCliente.status_code == 200 && resultCliente.cliente && resultCliente.cliente.length > 0) {
                        pedido.cliente = resultCliente.cliente
                        delete pedido.id_cliente
                    }

                    let resultIngresso = await controllerItem_Pedido.listarIngressosIdPedido(pedido.id_pedido)
                    if (resultIngresso.status_code == 200) {
                        pedido.ingresso = resultIngresso.ingressos
                    }

                    if (pedido.data_pedido != null) {
                        pedido.data_pedido = new Date(pedido.data_pedido).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }
                }

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
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Retorna um pedido filtrando pelo ID
const buscarPedidoId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await pedidoDAO.getSelectByIdRequest(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    for (let pedido of result) {
                        let resultOrganizador = await controllerOrganizador.buscarOrganizadorId(pedido.id_organizador)
                        if (resultOrganizador.status_code == 200 && resultOrganizador.organizador && resultOrganizador.organizador.length > 0) {
                            pedido.organizador = resultOrganizador.organizador
                            delete pedido.id_organizador
                        }
                        let resultCliente = await controllerCliente.buscarClienteId(pedido.id_cliente)
                        if (resultCliente.status_code == 200 && resultCliente.cliente && resultCliente.cliente.length > 0) {
                            pedido.cliente = resultCliente.cliente
                            delete pedido.id_cliente
                        }

                        let resultIngresso = await controllerItem_Pedido.listarIngressosIdPedido(pedido.id_pedido)
                        if (resultIngresso.status_code == 200) {
                            pedido.ingresso = resultIngresso.ingressos
                        }

                        if (pedido.data_pedido != null) {
                            pedido.data_pedido = new Date(pedido.data_pedido).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                        }

                    }

                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        pedido: result
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

//Insere um novo pedido
const inserirPedido = async function (pedido, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosPedido(pedido)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo pedido
                let result = await pedidoDAO.setInsertRequest(pedido)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdPedido = await pedidoDAO.getSelectLastIdRequest()

                    if (lastIdPedido) {

                        for (let ingresso of pedido.ingresso) {

                            let itemPedido = {
                                id_pedido: lastIdPedido,
                                id_ingresso: ingresso.id,
                                quantidade: ingresso.quantidade
                            }

                            let resultItemPedido = await controllerItem_Pedido.inserirPedidoIngresso(itemPedido, contentType)

                            if (resultItemPedido.status_code != 201) {
                                return MESSAGE.ERROR_RELATION_TABLE //200, porém com problemas na tabela de relação
                            }
                        }

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

//Atualiza um pedido filtrando pelo ID
const atualizarPedido = async function (pedido, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosPedido(pedido)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarPedidoId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do pedido
                    pedido.id = parseInt(id)

                    //Chama a função do DAO para atualizar um pedido
                    let result = await pedidoDAO.setUpdateRequest(pedido)

                    if (result) {

                        for (let ingresso of pedido.ingresso) {

                            let itemPedido = {
                                id_pedido: pedido.id,
                                id_ingresso: ingresso.id,
                                quantidade: ingresso.quantidade
                            }

                            let resultItemPedido = await controllerItem_Pedido.inserirPedidoIngresso(itemPedido, contentType)

                            if (resultItemPedido.status_code != 201) {
                                return MESSAGE.ERROR_RELATION_TABLE //200, porém com problemas na tabela de relação
                            }
                        }

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
                    return validarID //Retorno da função de buscarPedidoId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do pedido 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um pedido filtrando pelo ID
const excluirPedido = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarPedidoId(id)

        if (validarID.status_code == 200) {

            let result = await pedidoDAO.setDeleteRequest(id)

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
            return validarID //Retorno da função de buscarpedidoId (400 ou 404 ou 500)
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do pedido
const validarDadosPedido = async function (pedido) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    const STATUS_PERMITIDOS = ['EM ANDAMENTO', 'FINALIZADO', 'CANCELADO'];

    if (pedido.data_pedido == '' || pedido.data_pedido == null || pedido.data_pedido == undefined || pedido.data_pedido.length > 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA_PEDIDO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!STATUS_PERMITIDOS.includes(pedido.status_pedido)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [STATUS_PEDIDO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (pedido.valor_total == '' || pedido.valor_total == null || pedido.valor_total == undefined || Number(pedido.valor_total) < 0 || Number(pedido.valor_total) > 9999999.99 || isNaN(pedido.valor_total)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [VALOR_TOTAL] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (pedido.id_organizador == '' || pedido.id_organizador == null || pedido.id_organizador == undefined || isNaN(pedido.id_organizador)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ORGANIZADOR] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (pedido.id_cliente == '' || pedido.id_cliente == null || pedido.id_cliente == undefined || isNaN(pedido.id_cliente)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ORGANIZADOR] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }

}

module.exports = {
    listarPedidos,
    buscarPedidoId,
    inserirPedido,
    atualizarPedido,
    excluirPedido
}