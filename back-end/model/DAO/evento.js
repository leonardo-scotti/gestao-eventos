/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do Evento
 * Data: 03/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os eventos do banco de dados
const getSelectAllEvents = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_evento order by id_evento desc`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Retorna um evento filtrando pelo ID do banco de dados
const getSelectByIdEvent = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_evento where id_evento=${id}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastIdEvent = async function () {
    try {
        //Script SQL
        let sql = `select id_evento from tbl_evento order by id_evento desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_evento) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um evento no banco de dados
const setInsertEvent = async function (evento) {
    try {
        let sql = `INSERT INTO tbl_evento (nome,
                                        descricao,
                                        data_inicio,
                                        hora_inicio,
                                        data_termino,
                                        hora_termino,
                                        banner, 
                                        quantidade_ingresso, 
                                        quantidade_ingresso_comprado,
                                        is_visible,
                                        id_categoria,
                                        id_assunto) 
        VALUES('${evento.nome}', 
            '${evento.descricao}',
            '${evento.data_inicio}', 
            '${evento.hora_inicio}',
            '${evento.data_termino}',
            '${evento.hora_termino}',
            '${evento.banner}',
            '${evento.quantidade_ingresso}',
            '${evento.quantidade_ingresso_comprado}',
            ${evento.is_visible},
            ${evento.id_categoria},
            ${evento.id_assunto});`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza um evento no banco de dados filtrando pelo ID
const setUpdateEvent = async function (evento) {
    try {
        let sql = `UPDATE tbl_evento SET 
                        nome                            = '${evento.nome}',
                        descricao                       = '${evento.descricao}',
                        data_inicio                     = '${evento.data_inicio}',
                        hora_inicio                     = '${evento.hora_inicio}',
                        data_termino                    = '${evento.data_termino}',
                        hora_termino                    = '${evento.hora_termino}',
                        banner                          = '${evento.banner}',
                        quantidade_ingresso             = '${evento.quantidade_ingresso}',
                        quantidade_ingresso_comprado    = '${evento.quantidade_ingresso_comprado}',
                        is_visible                      = ${evento.is_visible},
                        id_categoria                    = ${evento.id_categoria},
                        id_assunto                      = ${evento.id_assunto}

                    WHERE id_evento = ${evento.id}`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Apaga um evento no banco de dados filtrando pelo ID
const setDeleteEvent = async function (id) {
    try {
        let sql = `DELETE FROM tbl_evento WHERE id_evento = ${id}`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllEvents,
    getSelectByIdEvent,
    getSelectLastIdEvent,
    setInsertEvent,
    setUpdateEvent,
    setDeleteEvent
}