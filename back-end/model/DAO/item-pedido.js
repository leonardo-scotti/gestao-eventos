/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do item_pedido
 * Data: 04/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os item_pedidos do banco de dados
const getSelectAllRequestsTickets = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_item_pedido order by id_item_pedido desc`

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

//Retorna um item_pedido filtrando pelo ID do banco de dados
const getSelectByIdRequestTicket = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_item_pedido where id_item_pedido=${id}`

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

//Retorna os organizadors filtrando pelo ID do Ticketo do banco de dados
const getSelectRequestsByIdTicket = async function (IdIngresso) {
    try {
        //Script SQL
        let sql = `select tbl_organizador.id_pedido, tbl_organizador.nome
                        from tbl_ingresso
                                inner join tbl_item_pedido
                                    on tbl_ingresso.id_ingresso = tbl_item_pedido.id_ingresso
                                inner join tbl_organizador
                                    on tbl_organizador.id_pedido = tbl_item_pedido.id_pedido
                        where tbl_ingresso.id_ingresso=${IdIngresso}`

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

//Retorna os ingressos filtrando pelo ID do pedido do banco de dados
const getSelectTicketsByIdRequest = async function (idPedido) {
    try {
        //Script SQL CORRIGIDO
        // Removemos o join com organizador que estava quebrando a busca se a relação não fosse perfeita
        // Adicionamos a quantidade que vem da tabela item_pedido
        let sql = `select 
                        tbl_ingresso.id_ingresso, 
                        tbl_ingresso.nome,
                        tbl_item_pedido.quantidade
                    from tbl_ingresso
                        inner join tbl_item_pedido
                            on tbl_ingresso.id_ingresso = tbl_item_pedido.id_ingresso
                    where tbl_item_pedido.id_pedido = ${idPedido}`

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


const getSelectLastIdRequestTicket = async function () {
    try {
        //Script SQL
        let sql = `select id_item_pedido from tbl_item_pedido order by id_item_pedido desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_item_pedido) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um item_pedido no banco de dados
const setInsertRequestTicket = async function (item_pedido) {
    try {
        let sql = `INSERT INTO tbl_item_pedido (quantidade,
                                                id_pedido,
                                                id_ingresso) 
        VALUES( ${item_pedido.quantidade},
                ${item_pedido.id_pedido},
                ${item_pedido.id_ingresso});`

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

//Atualiza um item_pedido no banco de dados filtrando pelo ID
const setUpdateRequestTicket = async function (item_pedido) {
    try {
        let sql = `UPDATE tbl_item_pedido SET 
                        quantidade          = '${item_pedido.quantidade}',
                        id_pedido           = '${item_pedido.id_pedido}',
                        id_ingresso         = '${item_pedido.id_ingresso}'
                    WHERE id_item_pedido = ${item_pedido.id}`

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

//Apaga um item_pedido no banco de dados filtrando pelo ID
const setDeleteRequestTicket = async function (id) {
    try {
        let sql = `DELETE FROM tbl_item_pedido WHERE id_item_pedido = ${id}`

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

//Apaga um ingresso pedido existente no banco de dados filtrando pelo ID
const setDeleteByIdRequestsAndTicketId = async function (IdIngresso) {
    try {
        let sql = `DELETE FROM tbl_item_pedido WHERE id_ingresso=${IdIngresso}`

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
    getSelectAllRequestsTickets,
    getSelectByIdRequestTicket,
    getSelectRequestsByIdTicket,
    getSelectTicketsByIdRequest,
    getSelectLastIdRequestTicket,
    setInsertRequestTicket,
    setUpdateRequestTicket,
    setDeleteRequestTicket,
    setDeleteByIdRequestsAndTicketId
}