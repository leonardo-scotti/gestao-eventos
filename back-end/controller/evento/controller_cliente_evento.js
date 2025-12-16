/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model 
 *              para o CRUD de Cliente e Evento
 * Data: 05/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO do cliente evento
const clienteEventoDAO = require('../../model/DAO/cliente_evento.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de clientes e eventos
const listarClientesEventos = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de clientes  evento
        let result = await clienteEventoDAO.getSelectAllCustomersEvents()

        if (result) {
            if (result.length > 0) {

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    clientes_eventos: result
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

//Retorna um cliente evento filtrando pelo ID
const buscarClienteEventoId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await clienteEventoDAO.getSelectByIdCustomerEvent(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        clientes_eventos: result
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

//Retorna os eventos filtrando pelo ID do cliente
const listarEventosIdCliente = async function (idCliente) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idCliente != '' && idCliente != null && idCliente != undefined && !isNaN(idCliente) && idCliente > 0) {
            //Chama a função para filtrar pelo ID
            let result = await clienteEventoDAO.getSelectEventsByIdCustomer(parseInt(idCliente))
            if (result) {
                if (result.length > 0) {
                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        eventos: result
                    }

                    return jsonResult //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_CLIENTE] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna os clientes filtrando pelo ID do evento
const listarClientesIdEvento = async function (idEvento) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idEvento != '' && idEvento != null && idEvento != undefined && !isNaN(idEvento) && idEvento > 0) {
            //Chama a função para filtrar pelo ID
            let result = await clienteEventoDAO.getSelectCustomersByIdEvent(parseInt(idEvento))
            if (result) {
                if (result.length > 0) {
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
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_CLIENTE] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo cliente evento
const inserirClienteEvento = async function (clienteEvento, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosclienteEvento(clienteEvento)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo cliente
                let result = await clienteEventoDAO.setInsertCustomerEvent(clienteEvento)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdClienteEvento = await clienteEventoDAO.getSelectLastIdCustomerEvent()

                    if (lastIdClienteEvento) {

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

//Atualiza um cliente evento filtrando pelo ID
const atualizarClienteEvento = async function (clienteEvento, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosClienteEvento(clienteEvento)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarClienteEventoId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do evento
                    clienteEvento.id = parseInt(id)

                    //Chama a função do DAO para atualizar um evento
                    let result = await clienteEventoDAO.setUpdateCustomerEvent(clienteEvento)

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
                    return validarID //Retorno da função de buscarClienteEventoId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do cliente evento 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um cliente evento filtrando pelo ID
const excluirClienteEvento = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarClienteEventoId(id)

            if (validarID.status_code == 200) {

                let result = await clienteEventoDAO.setDeleteCustomerEvent(parseInt(id))

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
                return validarID //Retorno da função de buscareventoId (400 ou 404 ou 500)
            }

        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um cliente evento filtrando pelo ID
const excluirEventoPorCliente = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarClienteEventoId(id)

            if (validarID.status_code == 200) {

                let result = await clienteEventoDAO.setDeleteByIdCustomersAndEventId(parseInt(id))

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
                return validarID //Retorno da função de buscareventoId (400 ou 404 ou 500)
            }

        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do cliente evento
const validarDadosclienteEvento = async function (clienteEvento) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (clienteEvento.id_cliente == '' || clienteEvento.id_cliente == null || clienteEvento.id_cliente == undefined || isNaN(clienteEvento.id_cliente) || clienteEvento.id_cliente <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_CLIENTE] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (clienteEvento.id_evento == '' || clienteEvento.id_evento == null || clienteEvento.id_evento == undefined || isNaN(clienteEvento.id_evento) || clienteEvento.id_evento <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_EVENTO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }

}

module.exports = {
    listarClientesEventos,
    buscarClienteEventoId,
    listarEventosIdCliente,
    listarClientesIdEvento,
    inserirClienteEvento,
    atualizarClienteEvento,
    excluirClienteEvento,
    excluirEventoPorCliente
}