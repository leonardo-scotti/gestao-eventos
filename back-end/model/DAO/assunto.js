/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do Assunto
 * Data: 03/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os assuntos do banco de dados
const getSelectAllMatters = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_assunto order by id_assunto desc`

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

//Retorna um assunto filtrando pelo ID do banco de dados
const getSelectByIdSubject = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_assunto where id_assunto=${id}`

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

const getSelectLastIdSubject = async function () {
    try {
        //Script SQL
        let sql = `select id_assunto from tbl_assunto order by id_assunto desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_assunto) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um assunto no banco de dados
const setInsertSubject = async function (assunto) {
    try {
        let sql = `INSERT INTO tbl_assunto (nome) 
        VALUES('${assunto.nome}');`

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

//Atualiza um assunto no banco de dados filtrando pelo ID
const setUpdateSubject = async function (assunto) {
    try {
        let sql = `UPDATE tbl_assunto SET 
                        nome            = '${assunto.nome}'
                    WHERE id_assunto = ${assunto.id}`

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

//Apaga um assunto no banco de dados filtrando pelo ID
const setDeleteSubject = async function (id) {
    try {
        let sql = `DELETE FROM tbl_assunto WHERE id_assunto = ${id}`

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
    getSelectAllMatters,
    getSelectByIdSubject,
    getSelectLastIdSubject,
    setInsertSubject,
    setUpdateSubject,
    setDeleteSubject
}