/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL dos Ingressos
 * Data: 04/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os ingressos do banco de dados
const getSelectAllTickets = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_ingresso order by id_ingresso desc`

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

//Retorna um ingresso filtrando pelo ID do banco de dados
const getSelectByIdTicket = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_ingresso where id_ingresso=${id}`

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

const getSelectLastIdTicket = async function () {
    try {
        //Script SQL
        let sql = `select id_ingresso from tbl_ingresso order by id_ingresso desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_ingresso) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um ingresso no banco de dados
const setInsertTicket = async function (ingresso) {
    try {
        let sql = `INSERT INTO tbl_ingresso (nome,
                                            preco_unitario,
                                            is_ativo,
                                            id_evento) 
        VALUES('${ingresso.nome}',
                ${ingresso.preco_unitario},
                ${ingresso.is_ativo},
                ${ingresso.id_evento});`

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

//Atualiza um ingresso no banco de dados filtrando pelo ID
const setUpdateTicket = async function (ingresso) {
    try {
        let sql = `UPDATE tbl_ingresso SET 
                        nome            = '${ingresso.nome}',
                        preco_unitario  =  ${ingresso.preco_unitario},
                        is_ativo        =  ${ingresso.is_ativo},
                        id_evento       =  ${ingresso.id_evento}
                    WHERE id_ingresso = ${ingresso.id}`

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

//Apaga um ingresso no banco de dados filtrando pelo ID
const setDeleteTicket = async function (id) {
    try {
        let sql = `DELETE FROM tbl_ingresso WHERE id_ingresso = ${id}`

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
    getSelectAllTickets,
    getSelectByIdTicket,
    getSelectLastIdTicket,
    setInsertTicket,
    setUpdateTicket,
    setDeleteTicket
}