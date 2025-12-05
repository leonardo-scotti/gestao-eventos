/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do Estado
 * Data: 04/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os estados do banco de dados
const getSelectAllStates = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_estado order by id_estado desc`

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

//Retorna um estado filtrando pelo ID do banco de dados
const getSelectByIdState = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_estado where id_estado=${id}`

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

const getSelectLastIdState = async function () {
    try {
        //Script SQL
        let sql = `select id_estado from tbl_estado order by id_estado desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_estado) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um estado no banco de dados
const setInsertState = async function (estado) {
    try {
        let sql = `INSERT INTO tbl_estado (sigla) 
        VALUES('${estado.sigla}');`

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

//Atualiza um estado no banco de dados filtrando pelo ID
const setUpdateState = async function (estado) {
    try {
        let sql = `UPDATE tbl_estado SET 
                        sigla            = '${estado.sigla}'
                    WHERE id_estado = ${estado.id}`

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

//Apaga um estado no banco de dados filtrando pelo ID
const setDeleteState = async function (id) {
    try {
        let sql = `DELETE FROM tbl_estado WHERE id_estado = ${id}`

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
    getSelectAllStates,
    getSelectByIdState,
    getSelectLastIdState,
    setInsertState,
    setUpdateState,
    setDeleteState
}