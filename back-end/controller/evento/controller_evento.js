/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model - do Evento
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 03/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const eventoDAO = require('../../model/DAO/evento.js')

//Import da controller que faz o upload da foto
const UPLOAD = require('../upload/controller_upload_azure.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de eventos
const listarEventos = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de evento
        let result = await eventoDAO.getSelectAllEvents()

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
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Retorna um evento filtrando pelo ID
const buscarEventoId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await eventoDAO.getSelectByIdEvent(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        evento: result
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

//Insere um nova evento
const inserirEvento = async function (evento, contentType, banner) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toLowerCase().includes('multipart/form-data')) {


            let urlFoto = await UPLOAD.uploadFiles(banner)
            if (urlFoto) {

                let urlLimpa = urlFoto.split('?')[0];
                evento.banner = urlLimpa;
                let validarDados = await validarDadosEvento(evento)

                if (!validarDados) {




                    //Chama a função do DAO para inserir um novo filme
                    let result = await eventoDAO.setInsertEvent(evento)

                    if (result) {

                        //Chama a função para receber o ID gerado no BD
                        let lastIdEvento = await eventoDAO.getSelectLastIdEvent()

                        if (lastIdEvento) {

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
                return MESSAGE.ERROR_UPLOADED_FILE
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//Atualiza um evento filtrando pelo ID
const atualizarEvento = async function (evento, id, contentType, banner) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toLowerCase().includes('multipart/form-data')) {

            let urlFoto = await UPLOAD.uploadFiles(banner)
            if (urlFoto) {

                let urlLimpa = urlFoto.split('?')[0];
                evento.banner = urlLimpa;

                //Chama a função de validação dos dados de cadastro
                let validarDados = await validarDadosEvento(evento)

                if (!validarDados) {

                    //Chama a função para validar a consistencia do ID e verificar se existe no BD
                    let validarID = await buscarEventoId(id)

                    //Verifica se o ID existe no BD, caso exista teremos o status 200
                    if (validarID.status_code == 200) {

                        //Adicionando o ID no JSON com os dados do evento
                        evento.id = parseInt(id)

                        //Chama a função do DAO para atualizar um evento
                        let result = await eventoDAO.setUpdateEvent(evento)

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
                        return validarID //Retorno da função de buscareventoId (400 ou 404 ou 500)
                    }
                } else {
                    return validarDados //Retorno da função de validar dados do Gênero 400
                }
            } else {
                return MESSAGE.ERROR_UPLOADED_FILE
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga uma evento filtrando pelo ID
const excluirEvento = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarEventoId(id)

        if (validarID.status_code == 200) {

            let result = await eventoDAO.setDeleteEvent(id)

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

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do Evento
const validarDadosEvento = async function (evento) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (evento.nome == '' || evento.nome == null || evento.nome == undefined || evento.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.descricao == '' || evento.descricao == null || evento.descricao == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DESCRICAO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.data_inicio == '' || evento.data_inicio == null || evento.data_inicio == undefined || evento.data_inicio.length > 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA_INICIO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.hora_inicio == '' || evento.hora_inicio == null || evento.hora_inicio == undefined || evento.hora_inicio.length > 8) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [HORA_INICIO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.data_termino == '' || evento.data_termino == null || evento.data_termino == undefined || evento.data_termino.length > 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA_TERMINO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.hora_termino == '' || evento.hora_termino == null || evento.hora_termino == undefined || evento.hora_termino.length > 8) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [HORA_TERMINO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.banner == '' || evento.banner == null || evento.banner == undefined || evento.banner.length > 255) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [BANNER] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.quantidade_ingresso == '' || evento.quantidade_ingresso == null || evento.quantidade_ingresso == undefined || isNaN(evento.quantidade_ingresso)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [QUANTIDADE_INGRESSO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (isNaN(evento.quantidade_ingresso_comprado)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [QUANTIDADE_INGRESSO_COMPRADO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.is_visible == '' || evento.is_visible == null || evento.is_visible == undefined || evento.is_visible != true && evento.is_visible != false) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IS_VISIBLE] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.id_categoria == '' || evento.id_categoria == null || evento.id_categoria == undefined || isNaN(evento.id_categoria)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_CATEGORIA] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (evento.id_assunto == '' || evento.id_assunto == null || evento.id_assunto == undefined || isNaN(evento.id_assunto)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ASSUNTO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }

}

module.exports = {
    listarEventos,
    buscarEventoId,
    inserirEvento,
    atualizarEvento,
    excluirEvento
}