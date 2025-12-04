/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model - da categoria
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 03/12/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const categoriaDAO = require('../../model/DAO/categoria.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Import da controller que faz o upload da foto
const UPLOAD = require('../upload/controller_upload_azure.js')

//Retorna uma lista de categorias
const listarCategorias = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de categoria
        let result = await categoriaDAO.getSelectAllCategories()

        if (result) {
            if (result.length > 0) {

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    categorias: result
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

//Retorna um categoria filtrando pelo ID
const buscarCategoriaId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await categoriaDAO.getSelectByIdCategory(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    const jsonResult = {
                        status: MESSAGE.SUCCESS_REQUEST.status,
                        status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                        developments: MESSAGE.HEADER.developments,
                        message: MESSAGE.SUCCESS_REQUEST.message,
                        categoria: result
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

//Insere um nova categoria
const inserirCategoria = async function (categoria, contentType, icone) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toLowerCase().includes('multipart/form-data')) {

            let validarDados = await validarDadosCategoria(categoria)

            if (!validarDados) {

                let urlFoto = await UPLOAD.uploadFiles(icone)
                if (urlFoto) {

                    let urlLimpa = urlFoto.split('?')[0];
                    categoria.icone = urlLimpa;

                    //Chama a função do DAO para inserir um novo filme
                    let result = await categoriaDAO.setInsertCategory(categoria)

                    if (result) {

                        //Chama a função para receber o ID gerado no BD
                        let lastIdCategoria = await categoriaDAO.getSelectLastIdCategory()

                        if (lastIdCategoria) {

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
                    return MESSAGE.ERROR_UPLOADED_FILE
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

//Atualiza um categoria filtrando pelo ID
const atualizarCategoria = async function (categoria, id, contentType, icone) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toLowerCase().includes('multipart/form-data')) {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosCategoria(categoria)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarCategoriaId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do categoria
                    categoria.id = parseInt(id)


                    let urlFoto = await UPLOAD.uploadFiles(icone)
                    if (urlFoto) {

                        let urlLimpa = urlFoto.split('?')[0];
                        categoria.icone = urlLimpa;

                        //Chama a função do DAO para atualizar um categoria
                        let result = await categoriaDAO.setUpdateCategory(categoria)

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
                        return MESSAGE.ERROR_UPLOADED_FILE
                    }
                } else {
                    return validarID //Retorno da função de buscarCategoriaId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do Gênero 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga uma categoria filtrando pelo ID
const excluirCategoria = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarCategoriaId(id)

        if (validarID.status_code == 200) {

            let result = await categoriaDAO.setDeleteCategory(id)

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
            return validarID //Retorno da função de buscarcategoriaId (400 ou 404 ou 500)
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Validação dos dados de cadastro do Gênero
const validarDadosCategoria = async function (categoria) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (categoria.nome == '' || categoria.nome == null || categoria.nome == undefined || categoria.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }

}

module.exports = {
    listarCategorias,
    buscarCategoriaId,
    inserirCategoria,
    atualizarCategoria,
    excluirCategoria
}