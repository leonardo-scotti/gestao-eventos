/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model - do endereco
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 04/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const enderecoDAO = require('../../model/DAO/endereco.js')

//Import da controller estado 
const controllerEstado = require('../estado/controller_estado.js')

//Import da controller evento 
const controllerEvento = require('../evento/controller_evento.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de enderecos
const listarEnderecos = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de enderecos
        let result = await enderecoDAO.getSelectAllAddresses()

        if (result) {
            if (result.length > 0) {

                for (let endereco of result) {
                    let resultEndereco = await controllerEstado.buscarEstadoId(endereco.id_estado)
                    if (resultEndereco.status_code == 200 && resultEndereco.estado && resultEndereco.estado.length > 0) {
                        endereco.estado = resultEndereco.estado[0].sigla
                        delete endereco.id_estado
                    }

                    let resultEvento = await controllerEvento.buscarEventoId(endereco.id_evento)
                    if (resultEvento.status_code == 200 && resultEvento.evento && resultEvento.evento.length > 0) {
                        endereco.evento = resultEvento.evento[0]
                        delete endereco.id_evento
                    }

                    if (endereco.cep) {
                        let ultimos3digitos = endereco.cep.slice(-3)
                        let primeiros5digitos = endereco.cep.slice(0, 5)

                        endereco.cep = primeiros5digitos + "-" + ultimos3digitos
                    }
                }

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    enderecos: result
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

//Retorna um endereco filtrando pelo ID
const buscarEnderecoId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await enderecoDAO.getSelectByIdAddress(parseInt(id))
            if (result) {
                if (result.length > 0) {

                    for (let endereco of result) {

                        let resultEndereco = await controllerEstado.buscarEstadoId(endereco.id_estado)

                        if (resultEndereco.status_code == 200 && resultEndereco.estado && resultEndereco.estado.length > 0) {
                            endereco.estado = resultEndereco.estado[0].sigla
                            delete endereco.id_estado
                        }

                        let resultEvento = await controllerEvento.buscarEventoId(endereco.id_evento)

                        if (resultEvento.status_code == 200 && resultEvento.evento && resultEvento.evento.length > 0) {
                            endereco.evento = resultEvento.evento[0]
                            delete endereco.id_evento
                        }

                        if (endereco.cep) {
                            let ultimos3digitos = endereco.cep.slice(-3)
                            let primeiros5digitos = endereco.cep.slice(0, 5)

                            endereco.cep = primeiros5digitos + "-" + ultimos3digitos
                        }

                    }


                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        endereco: result
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

//Insere um novo endereco
const inserirEndereco = async function (endereco, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosEndereco(endereco)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme
                let result = await enderecoDAO.setInsertAddress(endereco)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdEndereco = await enderecoDAO.getSelectLastIdAddress()

                    if (lastIdEndereco) {

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

//Atualiza um endereco filtrando pelo ID
const atualizarEndereco = async function (endereco, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosEndereco(endereco)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarEnderecoId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do endereco
                    endereco.id = parseInt(id)

                    //Chama a função do DAO para atualizar um endereco
                    let result = await enderecoDAO.setUpdateAddress(endereco)

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
                    return validarID //Retorno da função de buscarEnderecoId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do endereco 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um endereco filtrando pelo ID
const excluirEndereco = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarEnderecoId(id)

        if (validarID.status_code == 200) {

            let result = await enderecoDAO.setDeleteAddress(id)

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
            return validarID //Retorno da função de buscarEnderecoId (400 ou 404 ou 500)
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do endereco
const validarDadosEndereco = async function (endereco) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (endereco.cep.length == 9) {
        let ultimos3digitos = endereco.cep.slice(-3)
        let primeiros5digitos = endereco.cep.slice(0, 5)

        endereco.cep = primeiros5digitos + ultimos3digitos
    }

    if (endereco.cep == '' || endereco.cep == null || endereco.cep == undefined || endereco.cep.length > 9) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CEP] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (endereco.logradouro == '' || endereco.logradouro == null || endereco.logradouro == undefined || endereco.logradouro.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [LOGRADOURO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (endereco.complemento == '' || endereco.complemento == null || endereco.complemento == undefined || endereco.complemento.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [COMPLEMENTO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (endereco.numero == '' || endereco.numero == null || endereco.numero == undefined || endereco.numero.length > 20) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NUMERO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (endereco.bairro == '' || endereco.bairro == null || endereco.bairro == undefined || endereco.bairro.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [BAIRRO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (endereco.cidade == '' || endereco.cidade == null || endereco.cidade == undefined || endereco.cidade.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [BAIRRO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (endereco.id_estado == '' || endereco.id_estado == null || endereco.id_estado == undefined || isNaN(endereco.id_estado)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ESTADO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (endereco.id_evento == '' || endereco.id_evento == null || endereco.id_evento == undefined || isNaN(endereco.id_evento)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_EVENTO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {

        let validarid_estado = await controllerEstado.buscarEstadoId(endereco.id_estado)

        let validarid_evento = await controllerEvento.buscarEventoId(endereco.id_evento)

        if (validarid_estado.status_code !== 200) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ESTADO] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
        
        if (validarid_evento.status_code !== 200) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_EVENTO] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

        return false
    }

}

module.exports = {
    listarEnderecos,
    buscarEnderecoId,
    inserirEndereco,
    atualizarEndereco,
    excluirEndereco
}