/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do organizador_evento
 * Data: 04/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os organizador_eventos do banco de dados
const getSelectAllOrganizersEvents = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_organizador_evento order by id_organizador_evento desc`

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

//Retorna um organizador_evento filtrando pelo ID do banco de dados
const getSelectByIdOrganizerEvent = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_organizador_evento where id_organizador_evento=${id}`

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

//Retorna os organizadors filtrando pelo ID do evento do banco de dados
const getSelectOrganizersByIdEvent = async function (idEvento) {
    try {
        //Script SQL
        let sql = `select tbl_organizador.id_organizador, tbl_organizador.nome
                        from tbl_evento
                                inner join tbl_organizador_evento
                                    on tbl_evento.id_evento = tbl_organizador_evento.id_evento
                                inner join tbl_organizador
                                    on tbl_organizador.id_organizador = tbl_organizador_evento.id_organizador
                        where tbl_evento.id_evento=${idEvento}`

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

//Retorna os eventos filtrando pelo ID do organizador do banco de dados
const getSelectEventsByIdOrganizer = async function (idorganizador) {
    try {
        //Script SQL
        let sql = `select tbl_evento.id_evento, tbl_evento.nome
                        from tbl_evento
                                inner join tbl_organizador_evento
                                    on tbl_evento.id_evento = tbl_organizador_evento.id_evento
                                inner join tbl_organizador
                                    on tbl_organizador.id_organizador = tbl_organizador_evento.id_organizador
                        where tbl_organizador.id_organizador=${idorganizador}`

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


const getSelectLastIdOrganizerEvent = async function () {
    try {
        //Script SQL
        let sql = `select id_organizador_evento from tbl_organizador_evento order by id_organizador_evento desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_organizador_evento) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um organizador_evento no banco de dados
const setInsertOrganizerEvent = async function (organizador_evento) {
    try {
        let sql = `INSERT INTO tbl_organizador_evento (data_inscricao,
                                                id_organizador,
                                                id_evento) 
        VALUES(NOW(),
                '${organizador_evento.id_organizador}',
                '${organizador_evento.id_evento}');`

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

//Atualiza um organizador_evento no banco de dados filtrando pelo ID
const setUpdateOrganizerEvent = async function (organizador_evento) {
    try {
        let sql = `UPDATE tbl_organizador_evento SET 
                        data_inscricao          = '${organizador_evento.data_inscricao}',
                        id_organizador              = '${organizador_evento.id_organizador}',
                        id_evento               = '${organizador_evento.id_evento}'
                    WHERE id_organizador_evento = ${organizador_evento.id}`

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

//Apaga um organizador_evento no banco de dados filtrando pelo ID
const setDeleteOrganizerEvent = async function (id) {
    try {
        let sql = `DELETE FROM tbl_organizador_evento WHERE id_organizador_evento = ${id}`

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

//Apaga um evento organizador existente no banco de dados filtrando pelo ID
const setDeleteByIdOrganizersAndEventId = async function (idEvento) {
    try {
        let sql = `DELETE FROM tbl_organizador_evento WHERE id_evento=${idEvento}`

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
    getSelectAllOrganizersEvents,
    getSelectByIdOrganizerEvent,
    getSelectOrganizersByIdEvent,
    getSelectEventsByIdOrganizer,
    getSelectLastIdOrganizerEvent,
    setInsertOrganizerEvent,
    setUpdateOrganizerEvent,
    setDeleteOrganizerEvent,
    setDeleteByIdOrganizersAndEventId
}