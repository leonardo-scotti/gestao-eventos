/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do cliente_evento
 * Data: 04/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os cliente_eventos do banco de dados
const getSelectAllCustomersEvents = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_cliente_evento order by id_cliente_evento desc`

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

//Retorna um cliente_evento filtrando pelo ID do banco de dados
const getSelectByIdCustomerEvent = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_cliente_evento where id_cliente_evento=${id}`

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

//Retorna os clientes filtrando pelo ID do evento do banco de dados
const getSelectCustomersByIdEvent = async function (idEvento) {
    try {
        //Script SQL
        let sql = `select tbl_cliente.id_cliente, tbl_cliente.nome
                        from tbl_evento
                                inner join tbl_cliente_evento
                                    on tbl_evento.id_evento = tbl_cliente_evento.id_evento
                                inner join tbl_cliente
                                    on tbl_cliente.id_cliente = tbl_cliente_evento.id_cliente
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

//Retorna os eventos filtrando pelo ID do cliente do banco de dados
const getSelectEventsByIdCustomer = async function (idCliente) {
    try {
        //Script SQL
        let sql = `select tbl_evento.id_evento, tbl_evento.nome
                        from tbl_evento
                                inner join tbl_cliente_evento
                                    on tbl_evento.id_evento = tbl_cliente_evento.id_evento
                                inner join tbl_cliente
                                    on tbl_cliente.id_cliente = tbl_cliente_evento.id_cliente
                        where tbl_cliente.id_cliente=${idCliente}`

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


const getSelectLastIdCustomerEvent = async function () {
    try {
        //Script SQL
        let sql = `select id_cliente_evento from tbl_cliente_evento order by id_cliente_evento desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_cliente_evento) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um cliente_evento no banco de dados
const setInsertCustomerEvent = async function (cliente_evento) {
    try {
        let sql = `INSERT INTO tbl_cliente_evento (data_inscricao,
                                                id_cliente,
                                                id_evento) 
        VALUES(NOW(),
                '${cliente_evento.id_cliente}',
                '${cliente_evento.id_evento}');`

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

//Atualiza um cliente_evento no banco de dados filtrando pelo ID
const setUpdateCustomerEvent = async function (cliente_evento) {
    try {
        let sql = `UPDATE tbl_cliente_evento SET 
                        data_inscricao          = '${cliente_evento.data_inscricao}',
                        id_cliente              = '${cliente_evento.id_cliente}',
                        id_evento               = '${cliente_evento.id_evento}'
                    WHERE id_cliente_evento = ${cliente_evento.id}`

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

//Apaga um cliente_evento no banco de dados filtrando pelo ID
const setDeleteCustomerEvent = async function (id) {
    try {
        let sql = `DELETE FROM tbl_cliente_evento WHERE id_cliente_evento = ${id}`

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

//Apaga um evento cliente existente no banco de dados filtrando pelo ID
const setDeleteByIdCustomersAndEventId = async function (idEvento) {
    try {
        let sql = `DELETE FROM tbl_cliente_evento WHERE id_evento=${idEvento}`

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
    getSelectAllCustomersEvents,
    getSelectByIdCustomerEvent,
    getSelectCustomersByIdEvent,
    getSelectEventsByIdCustomer,
    getSelectLastIdCustomerEvent,
    setInsertCustomerEvent,
    setUpdateCustomerEvent,
    setDeleteCustomerEvent,
    setDeleteByIdCustomersAndEventId
}