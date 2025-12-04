/***********************************************************************************************
 * Objetivo: Arquivo responsável pela padronização de todas as mensagens da API do projeto de Filmes
 * Data: 07/10/2025
 * Autor: Marcel
 * Versão: 1.0
 ***********************************************************************************************/

const dataAtual = new Date()

/************************* MENSAGENS DE PADRONIZAÇÃO DO PROJETO ************************** */
const HEADER    =   {
                                status:             Boolean,
                                status_code:        Number,
                                developments:       'Vitor Miguel e João Blesa',
}


/************************* MENSAGENS DE ERRO DO PROJETO *********************************** */
const ERROR_NOT_FOUND                   =   {status: false, status_code: 404, message: 'Não foram encontrados dados de retorno!!!'}
const ERROR_INTERNAL_SERVER_MODEL       =   {status: false, status_code: 500, message: 'Não foi possível processar a requisição, devido a problemas na camada da MODELAGEM de dados !!!'}
const ERROR_INTERNAL_SERVER_CONTROLLER  =   {status: false, status_code: 500, message: 'Não foi possível processar a requisição, devido a problemas na camada de CONTROLE de dados !!!'}
const ERROR_REQUIRED_FIELDS             =   {status: false, status_code: 400, message: 'Não foi possível processar a requisição, devido a campos obrigatórios que não foram enviados corretamente, conforme a documentação da API !!!'}
const ERROR_CONTENT_TYPE                =   {status: false, status_code: 415, message: 'Não foi possível processar a requisição, pois o tipo de conteúdo enviado no body não é permitido!!!'}
const ERROR_UPLOADED_FILE               =   {status: false, status_code: 400, message: 'Não foi possível processar a requisição, pois o arquivo de imagem enviado está com problemas, encaminhe novamente  !!!'}

/************************* MENSAGENS DE SUCESSO DO PROJETO ******************************** */
const SUCCESS_REQUEST           =   {status: true, status_code: 200, message: 'Requisição bem sucedida!!!' }
const SUCCESS_CREATED_ITEM      =   {status: true, status_code: 201, message: 'Requisição bem sucedida, objeto criado com sucesso !!!'}
const SUCCESS_UPDATED_ITEM      =   {status: true, status_code: 200, message: 'Requisição bem sucedida, objeto atualizado com sucesso !!!'}
const SUCCESS_DELETED_ITEM      =   {status: true, status_code: 200, message: 'Item excluído com sucesso!!!'}

module.exports = {
                    HEADER,
                    SUCCESS_REQUEST,
                    SUCCESS_CREATED_ITEM,
                    SUCCESS_UPDATED_ITEM,
                    ERROR_NOT_FOUND,
                    SUCCESS_DELETED_ITEM,
                    ERROR_INTERNAL_SERVER_CONTROLLER,
                    ERROR_INTERNAL_SERVER_MODEL,
                    ERROR_REQUIRED_FIELDS,
                    ERROR_CONTENT_TYPE,
                    ERROR_UPLOADED_FILE,
                    
}