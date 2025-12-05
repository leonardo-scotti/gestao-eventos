/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model 
 *              para o CRUD de Organizador e Evento
 * Data: 05/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO do organizador evento
const organizadorEventoDAO = require('../../model/DAO/organizador_evento.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de organizadors e eventos
const listarOrganizadorsEventos = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de organizadors  evento
        let result = await organizadorEventoDAO.getSelectAllOrganizersEvents()

        if (result) {
            if (result.length > 0) {

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    organizadores_eventos: result
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

//Retorna um organizador evento filtrando pelo ID
const buscarOrganizadorEventoId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await organizadorEventoDAO.getSelectByIdOrganizerEvent(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        organizador_evento: result
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

//Retorna os eventos filtrando pelo ID do organizador
const listarEventosIdOrganizador = async function (idOrganizador) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idOrganizador != '' && idOrganizador != null && idOrganizador != undefined && !isNaN(idOrganizador) && idOrganizador > 0) {
            //Chama a função para filtrar pelo ID
            let result = await organizadorEventoDAO.getSelectEventsByIdOrganizer(parseInt(idOrganizador))
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
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_organizador] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna os organizadors filtrando pelo ID do evento
const listarOrganizadoresIdEvento = async function (idEvento) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idEvento != '' && idEvento != null && idEvento != undefined && !isNaN(idEvento) && idEvento > 0) {
            //Chama a função para filtrar pelo ID
            let result = await organizadorEventoDAO.getSelectOrganizersByIdEvent(parseInt(idEvento))
            if (result) {
                if (result.length > 0) {
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
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_organizador] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo organizador evento
const inserirOrganizadorEvento = async function (organizadorEvento, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosOrganizadorEvento(organizadorEvento)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo organizador
                let result = await organizadorEventoDAO.setInsertOrganizerEvent(organizadorEvento)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdOrganizadorEvento = await organizadorEventoDAO.getSelectLastIdOrganizerEvent()

                    if (lastIdOrganizadorEvento) {

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

//Atualiza um organizador evento filtrando pelo ID
const atualizarOrganizadorEvento = async function (organizadorEvento, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosOrganizadorEvento(organizadorEvento)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarOrganizadorEventoId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do evento
                    organizadorEvento.id = parseInt(id)

                    //Chama a função do DAO para atualizar um evento
                    let result = await organizadorEventoDAO.setUpdateOrganizerEvent(organizadorEvento)

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
                    return validarID //Retorno da função de buscarOrganizadorEventoId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do organizador evento 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um organizador evento filtrando pelo ID
const excluirOrganizadorEvento = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarOrganizadorEventoId(id)

            if (validarID.status_code == 200) {

                let result = await organizadorEventoDAO.setDeleteOrganizerEvent(parseInt(id))

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

//Apaga um organizador evento filtrando pelo ID
const excluirEventoPorOrganizador = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarOrganizadorEventoId(id)

            if (validarID.status_code == 200) {

                let result = await organizadorEventoDAO.setDeleteByIdOrganizersAndEventId(parseInt(id))

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

//Validação dos dados de cadastro do organizador evento
const validarDadosOrganizadorEvento = async function (organizadorEvento) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (organizadorEvento.id_organizador == '' || organizadorEvento.id_organizador == null || organizadorEvento.id_organizador == undefined || isNaN(organizadorEvento.id_organizador) || organizadorEvento.id_organizador <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_organizador] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (organizadorEvento.id_evento == '' || organizadorEvento.id_evento == null || organizadorEvento.id_evento == undefined || isNaN(organizadorEvento.id_evento) || organizadorEvento.id_evento <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_EVENTO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }

}

module.exports = {
    listarOrganizadorsEventos,
    buscarOrganizadorEventoId,
    listarEventosIdOrganizador,
    listarOrganizadoresIdEvento,
    inserirOrganizadorEvento,
    atualizarOrganizadorEvento,
    excluirOrganizadorEvento,
    excluirEventoPorOrganizador
}