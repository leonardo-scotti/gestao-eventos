/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL dos Pedidos
 * Data: 04/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os pedido do banco de dados
const getSelectAllRequests = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_pedido order by id_pedido desc`

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

//Retorna um pedido filtrando pelo ID do banco de dados
const getSelectByIdRequest = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_pedido where id_pedido=${id}`

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

const getSelectLastIdRequest = async function () {
    try {
        //Script SQL
        let sql = `select id_pedido from tbl_pedido order by id_pedido desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_pedido) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um pedido no banco de dados
const setInsertRequest = async function (pedido) {
    try {
        let sql = `INSERT INTO tbl_pedido (data_pedido,
                                            status_pedido,
                                            id_organizador,
                                            id_cliente) 
        VALUES('${pedido.data_pedido}',
                '${pedido.status_pedido}',
                ${pedido.id_organizador},
                ${pedido.id_cliente});`

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

//Atualiza um pedido no banco de dados filtrando pelo ID
const setUpdateRequest = async function (pedido) {
    try {
        let sql = `UPDATE tbl_pedido SET 
                        data_pedido         = '${pedido.data_pedido}',
                        status_pedido       =  '${pedido.status_pedido}',
                        id_organizador      =  ${pedido.id_organizador},
                        id_cliente          =  ${pedido.id_cliente}
                    WHERE id_pedido = ${pedido.id}`

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

//Apaga um pedido no banco de dados filtrando pelo ID
const setDeleteRequest = async function (id) {
    try {
        let sql = `DELETE FROM tbl_pedido WHERE id_pedido = ${id}`

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
    getSelectAllRequests,
    getSelectByIdRequest,
    getSelectLastIdRequest,
    setInsertRequest,
    setUpdateRequest,
    setDeleteRequest
}