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

//Import da controller assunto 
const controllerAssunto = require('../assunto/controller_assunto.js')

//Import da controller categoria 
const controllerCategoria = require('../categoria/controller_categoria.js')

//Import da controller clienteEvento 
const controllerClienteEvento = require('../evento/controller_cliente_evento.js')

//Import da controller organizadorEvento 
const controllerOrganizadorEvento = require('../evento/controller_organizador_evento.js')

//Import da controller endereco
const controllerEndereco = require('../endereco/controller_endereco.js')

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

                for (let evento of result) {

                    const dataInicioOriginal = evento.data_inicio;
                    const dataTerminoOriginal = evento.data_termino;

                    if (evento.data_inicio) {
                        evento.data_inicio = new Date(evento.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }
                    if (evento.data_termino) {
                        evento.data_termino = new Date(evento.data_termino).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }
                    if (evento.hora_inicio) {
                        evento.hora_inicio = new Date(evento.hora_inicio).toISOString().substring(11, 16);
                    }
                    if (evento.hora_termino) {
                        evento.hora_termino = new Date(evento.hora_termino).toISOString().substring(11, 16);
                    }

                    let resultCategoria = await controllerCategoria.buscarCategoriaId(evento.id_categoria)

                    if (resultCategoria.status_code == 200 && resultCategoria.categoria && resultCategoria.categoria.length > 0) {
                        evento.categoria = resultCategoria.categoria[0].nome
                        delete evento.id_categoria
                    }

                    let resultAssunto = await controllerAssunto.buscarAssuntoId(evento.id_assunto)
                    if (resultAssunto.status_code == 200 && resultAssunto.assunto && resultAssunto.assunto.length > 0) {
                        evento.assunto = resultAssunto.assunto[0].nome
                        delete evento.id_assunto
                    }

                    let resultCliente = await controllerClienteEvento.listarClientesIdEvento(evento.id_evento)
                    if (resultCliente.status_code == 200 && resultCliente.clientes && resultCliente.clientes.length > 0) {
                        evento.clientes = resultCliente.clientes
                    }

                    let resultOrganizador = await controllerOrganizadorEvento.listarOrganizadoresIdEvento(evento.id_evento)
                    if (resultOrganizador.status_code == 200 && resultOrganizador.organizadores && resultOrganizador.organizadores.length > 0) {
                        evento.organizadores = resultOrganizador.organizadores
                    }

                    if (dataInicioOriginal && dataTerminoOriginal) {

                        let dataInicioObj = new Date(dataInicioOriginal);
                        let dataTerminoObj = new Date(dataTerminoOriginal);

                        const opcoes = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' };

                        let textoInicio = dataInicioObj.toLocaleDateString('pt-BR', opcoes);
                        let textoFim = dataTerminoObj.toLocaleDateString('pt-BR', opcoes);

                        evento.dataRealizacao = {
                            "data_inicio": textoInicio.charAt(0).toUpperCase() + textoInicio.slice(1),
                            "data_termino": textoFim.charAt(0).toUpperCase() + textoFim.slice(1)
                        };
                    }

                    let resultEndereco = await controllerEndereco.buscarEnderecoByIdEvento(evento.id_evento)
                    if (resultEndereco.status_code == 200) {
                        evento.endereco = resultEndereco.endereco
                    }
                }

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

                    for (let evento of result) {

                        const dataInicioOriginal = evento.data_inicio;
                        const dataTerminoOriginal = evento.data_termino;

                        if (evento.data_inicio) {
                            evento.data_inicio = new Date(evento.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                        }
                        if (evento.data_termino) {
                            evento.data_termino = new Date(evento.data_termino).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                        }
                        if (evento.hora_inicio) {
                            evento.hora_inicio = new Date(evento.hora_inicio).toISOString().substring(11, 16);
                        }
                        if (evento.hora_termino) {
                            evento.hora_termino = new Date(evento.hora_termino).toISOString().substring(11, 16);
                        }

                        let resultCategoria = await controllerCategoria.buscarCategoriaId(evento.id_categoria)

                        if (resultCategoria.status_code == 200 && resultCategoria.categoria && resultCategoria.categoria.length > 0) {
                            evento.categoria = resultCategoria.categoria[0].nome
                            delete evento.id_categoria
                        }

                        let resultAssunto = await controllerAssunto.buscarAssuntoId(evento.id_assunto)
                        if (resultAssunto.status_code == 200 && resultAssunto.assunto && resultAssunto.assunto.length > 0) {
                            evento.assunto = resultAssunto.assunto[0].nome
                            delete evento.id_assunto
                        }

                        let resultCliente = await controllerClienteEvento.listarClientesIdEvento(evento.id_evento)
                        if (resultCliente.status_code == 200 && resultCliente.clientes && resultCliente.clientes.length > 0) {
                            evento.clientes = resultCliente.clientes
                        }

                        let resultOrganizador = await controllerOrganizadorEvento.listarOrganizadoresIdEvento(evento.id_evento)
                        if (resultOrganizador.status_code == 200 && resultOrganizador.organizadores && resultOrganizador.organizadores.length > 0) {
                            evento.organizadores = resultOrganizador.organizadores
                        }

                        if (dataInicioOriginal && dataTerminoOriginal) {

                            let dataInicioObj = new Date(dataInicioOriginal);
                            let dataTerminoObj = new Date(dataTerminoOriginal);

                            const opcoes = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' };

                            let textoInicio = dataInicioObj.toLocaleDateString('pt-BR', opcoes);
                            let textoFim = dataTerminoObj.toLocaleDateString('pt-BR', opcoes);

                            evento.dataRealizacao = {
                                "data_inicio": textoInicio.charAt(0).toUpperCase() + textoInicio.slice(1),
                                "data_termino": textoFim.charAt(0).toUpperCase() + textoFim.slice(1)
                            };
                        }

                        let resultEndereco = await controllerEndereco.buscarEnderecoByIdEvento(evento.id_evento)
                        if (resultEndereco.status_code == 200) {
                            evento.endereco = resultEndereco.endereco
                        }
                    }

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

const buscarEventosPelaCidade = async function (cidade) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (cidade != '' && cidade != null && cidade != undefined) {


            if (cidade) {
                cidade = cidade.replace(/['"]/g, '');
            }

            let result = await eventoDAO.getSelectEventByCity(cidade)

            if (result == null) {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ESTADO] invalido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }

            if (result) {

                for (let evento of result) {

                    const dataInicioOriginal = evento.data_inicio;
                    const dataTerminoOriginal = evento.data_termino;

                    if (evento.data_inicio) {
                        evento.data_inicio = new Date(evento.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }
                    if (evento.data_termino) {
                        evento.data_termino = new Date(evento.data_termino).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    }
                    if (evento.hora_inicio) {
                        evento.hora_inicio = evento.hora_inicio.substring(0, 5);
                    }
                    if (evento.hora_termino) {
                        evento.hora_termino = evento.hora_termino.substring(0, 5);
                    }

                    let idParaBusca = evento.id || evento.id_evento;

                    let resultCliente = await controllerClienteEvento.listarClientesIdEvento(idParaBusca)
                    if (resultCliente.status_code == 200 && resultCliente.clientes && resultCliente.clientes.length > 0) {
                        evento.clientes = resultCliente.clientes
                    }

                    let resultOrganizador = await controllerOrganizadorEvento.listarOrganizadoresIdEvento(idParaBusca)
                    if (resultOrganizador.status_code == 200 && resultOrganizador.organizadores && resultOrganizador.organizadores.length > 0) {
                        evento.organizadores = resultOrganizador.organizadores
                    }

                    if (dataInicioOriginal && dataTerminoOriginal) {

                        let dataInicioObj = new Date(dataInicioOriginal);
                        let dataTerminoObj = new Date(dataTerminoOriginal);

                        const opcoes = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' };

                        let textoInicio = dataInicioObj.toLocaleDateString('pt-BR', opcoes);
                        let textoFim = dataTerminoObj.toLocaleDateString('pt-BR', opcoes);

                        evento.dataRealizacao = {
                            "data_inicio": textoInicio.charAt(0).toUpperCase() + textoInicio.slice(1),
                            "data_termino": textoFim.charAt(0).toUpperCase() + textoFim.slice(1)
                        };
                    }

                    let resultEndereco = await controllerEndereco.buscarEnderecoByIdEvento(idParaBusca)
                    if (resultEndereco.status_code == 200) {
                        evento.endereco = resultEndereco.endereco
                    }
                }

                const jsonResult = {
                    status: MESSAGE.SUCCESS_REQUEST.status,
                    status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                    developments: MESSAGE.HEADER.developments,
                    message: MESSAGE.SUCCESS_REQUEST.message,
                    evento: result
                }
                return jsonResult //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CIDADE] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const buscarEventosDeHoje = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let result = await eventoDAO.getSelectAllEventsToday()
        console.log(result)
        if (result) {
            for (let evento of result) {

                const dataInicioOriginal = evento.data_inicio;
                const dataTerminoOriginal = evento.data_termino;

                if (evento.data_inicio) {
                    evento.data_inicio = new Date(evento.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                }
                if (evento.data_termino) {
                    evento.data_termino = new Date(evento.data_termino).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                }
                if (evento.hora_inicio) {
                    evento.hora_inicio = new Date(evento.hora_inicio).toISOString().substring(11, 16);
                }
                if (evento.hora_termino) {
                    evento.hora_termino = new Date(evento.hora_termino).toISOString().substring(11, 16);
                }

                let resultCategoria = await controllerCategoria.buscarCategoriaId(evento.id_categoria)

                if (resultCategoria.status_code == 200 && resultCategoria.categoria && resultCategoria.categoria.length > 0) {
                    evento.categoria = resultCategoria.categoria[0].nome
                    delete evento.id_categoria
                }

                let resultAssunto = await controllerAssunto.buscarAssuntoId(evento.id_assunto)
                if (resultAssunto.status_code == 200 && resultAssunto.assunto && resultAssunto.assunto.length > 0) {
                    evento.assunto = resultAssunto.assunto[0].nome
                    delete evento.id_assunto
                }

                let resultCliente = await controllerClienteEvento.listarClientesIdEvento(evento.id_evento)
                if (resultCliente.status_code == 200 && resultCliente.clientes && resultCliente.clientes.length > 0) {
                    evento.clientes = resultCliente.clientes
                }

                let resultOrganizador = await controllerOrganizadorEvento.listarOrganizadoresIdEvento(evento.id_evento)
                if (resultOrganizador.status_code == 200 && resultOrganizador.organizadores && resultOrganizador.organizadores.length > 0) {
                    evento.organizadores = resultOrganizador.organizadores
                }

                if (dataInicioOriginal && dataTerminoOriginal) {

                    let dataInicioObj = new Date(dataInicioOriginal);
                    let dataTerminoObj = new Date(dataTerminoOriginal);

                    const opcoes = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' };

                    let textoInicio = dataInicioObj.toLocaleDateString('pt-BR', opcoes);
                    let textoFim = dataTerminoObj.toLocaleDateString('pt-BR', opcoes);

                    evento.dataRealizacao = {
                        "data_inicio": textoInicio.charAt(0).toUpperCase() + textoInicio.slice(1),
                        "data_termino": textoFim.charAt(0).toUpperCase() + textoFim.slice(1)
                    };
                }

                let resultEndereco = await controllerEndereco.buscarEnderecoByIdEvento(evento.id_evento)
                if (resultEndereco.status_code == 200) {
                    evento.endereco = resultEndereco.endereco
                }
            }

            const jsonResult = {
                status: MESSAGE.SUCCESS_REQUEST.status,
                status_code: MESSAGE.SUCCESS_REQUEST.status_code,
                developments: MESSAGE.HEADER.developments,
                message: MESSAGE.SUCCESS_REQUEST.message,
                evento: result
            }
            return jsonResult //200
        } else {
            console.log(result)
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo evento
const inserirEvento = async function (evento, contentType, banner) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        // Validação de Content-Type
        if (String(contentType).toLowerCase().includes('multipart/form-data')) {

            // Converte IDs e Números
            if (evento.id_assunto) evento.id_assunto = Number(evento.id_assunto);
            if (evento.id_categoria) evento.id_categoria = Number(evento.id_categoria);
            if (evento.quantidade_ingresso) evento.quantidade_ingresso = Number(evento.quantidade_ingresso);
            if (evento.quantidade_ingresso_comprado) evento.quantidade_ingresso_comprado = Number(evento.quantidade_ingresso_comprado);

            if (evento.is_visible === 'true') evento.is_visible = true;
            if (evento.is_visible === 'false') evento.is_visible = false;

            if (evento.cliente) {
                if (typeof evento.cliente === 'string') {
                    try {
                        evento.cliente = JSON.parse(evento.cliente);
                    } catch (e) {
                        evento.cliente = [];
                    }
                }
            } else {
                evento.cliente = []; // Garante array vazio se não vier nada
            }

            if (evento.organizador) {
                if (typeof evento.organizador === 'string') {
                    try {
                        evento.organizador = JSON.parse(evento.organizador);
                    } catch (e) {
                        evento.organizador = [];
                    }
                }
            } else {
                evento.organizador = []; // Garante array vazio se não vier nada
            }

            //Upload da Imagem
            let urlFoto = await UPLOAD.uploadFiles(banner)

            if (urlFoto) {
                let urlLimpa = urlFoto.split('?')[0];
                evento.banner = urlLimpa;

                let validarDados = await validarDadosEvento(evento)

                if (!validarDados) {

                    // Insere o Evento Principal no Banco
                    let result = await eventoDAO.setInsertEvent(evento)

                    if (result) {
                        let lastIdEvento = await eventoDAO.getSelectLastIdEvent()

                        if (lastIdEvento) {

                            if (Array.isArray(evento.cliente) && evento.cliente.length > 0) {
                                for (let cliente of evento.cliente) {
                                    if (cliente.id) {
                                        let clienteEvento = {
                                            id_evento: lastIdEvento,
                                            id_cliente: cliente.id
                                        }
                                        let resultCliente = await controllerClienteEvento.inserirClienteEvento(clienteEvento, 'application/json');

                                    }
                                }
                            }

                            if (Array.isArray(evento.organizador) && evento.organizador.length > 0) {
                                for (let organizador of evento.organizador) {
                                    if (organizador.id) {
                                        let organizadorEvento = {
                                            id_evento: lastIdEvento,
                                            id_organizador: organizador.id
                                        }
                                        let resultOrganizador = await controllerOrganizadorEvento.inserirOrganizadorEvento(organizadorEvento, 'application/json');

                                    }
                                }
                            }

                            evento.id = lastIdEvento

                            const jsonResult = {
                                status: MESSAGE.SUCCESS_CREATED_ITEM.status,
                                status_code: MESSAGE.SUCCESS_CREATED_ITEM.status_code,
                                developments: MESSAGE.HEADER.developments,
                                message: MESSAGE.SUCCESS_CREATED_ITEM.message,
                                evento: evento
                            }
                            return jsonResult // Retorna 201 Created

                        } else {
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                        }
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                } else {
                    return validarDados // Retorna 400 (Erro de validação)
                }
            } else {
                return MESSAGE.ERROR_UPLOADED_FILE // 415 ou erro de arquivo
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
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

            // Converte IDs e Números
            if (evento.id_assunto) evento.id_assunto = Number(evento.id_assunto);
            if (evento.id_categoria) evento.id_categoria = Number(evento.id_categoria);
            if (evento.quantidade_ingresso) evento.quantidade_ingresso = Number(evento.quantidade_ingresso);
            if (evento.quantidade_ingresso_comprado) evento.quantidade_ingresso_comprado = Number(evento.quantidade_ingresso_comprado);

            if (evento.is_visible === 'true') evento.is_visible = true;
            if (evento.is_visible === 'false') evento.is_visible = false;

            if (evento.cliente) {
                if (typeof evento.cliente === 'string') {
                    try {
                        evento.cliente = JSON.parse(evento.cliente);
                    } catch (e) {
                        evento.cliente = [];
                    }
                }
            } else {
                evento.cliente = []; // Garante array vazio se não vier nada
            }

            if (evento.organizador) {
                if (typeof evento.organizador === 'string') {
                    try {
                        evento.organizador = JSON.parse(evento.organizador);
                    } catch (e) {
                        evento.organizador = [];
                    }
                }
            } else {
                evento.organizador = []; // Garante array vazio se não vier nada
            }

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

                            if (Array.isArray(evento.cliente) && evento.cliente.length > 0) {
                                for (let cliente of evento.cliente) {
                                    if (cliente.id) {
                                        let clienteEvento = {
                                            id_evento: evento.id,
                                            id_cliente: cliente.id
                                        }
                                        let resultCliente = await controllerClienteEvento.inserirClienteEvento(clienteEvento, 'application/json');

                                    }
                                }
                            }
                            if (Array.isArray(evento.organizador) && evento.organizador.length > 0) {
                                for (let organizador of evento.organizador) {
                                    if (organizador.id) {
                                        let organizadorEvento = {
                                            id_evento: evento.id,
                                            id_organizador: organizador.id
                                        }
                                        let resultOrganizador = await controllerOrganizadorEvento.inserirOrganizadorEvento(organizadorEvento, 'application/json');

                                    }
                                }
                            }

                            const jsonResult = {
                                status: MESSAGE.SUCCESS_UPDATED_ITEM.status,
                                status_code: MESSAGE.SUCCESS_UPDATED_ITEM.status_code,
                                developments: MESSAGE.HEADER.developments,
                                message: MESSAGE.SUCCESS_UPDATED_ITEM.message,
                                evento: evento
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
        let banner = validarID.evento[0].banner
        await UPLOAD.deleteFileByUrl(banner)

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

    if (evento.is_visible == 1) {
        evento.is_visible = true
    }

    if (evento.is_visible == 0) {
        evento.is_visible = false
    }

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
    } else if (typeof evento.is_visible !== 'boolean') {
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
    buscarEventosPelaCidade,
    buscarEventosDeHoje,
    inserirEvento,
    atualizarEvento,
    excluirEvento
}