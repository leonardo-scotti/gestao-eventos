/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL da Categoria
 * Data: 03/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os categorias do banco de dados
const getSelectAllCategories = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_categoria order by id_categoria desc`

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

//Retorna um categoria filtrando pelo ID do banco de dados
const getSelectByIdCategory = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_categoria where id_categoria=${id}`

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

const getSelectLastIdCategory = async function () {
    try {
        //Script SQL
        let sql = `select id_categoria from tbl_categoria order by id_categoria desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_categoria) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um categoria no banco de dados
const setInsertCategory = async function (categoria) {
    try {
        let sql = `INSERT INTO tbl_categoria (nome) 
        VALUES('${categoria.nome}');`

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

//Atualiza um categoria no banco de dados filtrando pelo ID
const setUpdateCategory = async function (categoria) {
    try {
        let sql = `UPDATE tbl_categoria SET 
                        nome            = '${categoria.nome}'
                    WHERE id_categoria = ${categoria.id}`

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

//Apaga um categoria no banco de dados filtrando pelo ID
const setDeleteCategory = async function (id) {
    try {
        let sql = `DELETE FROM tbl_categoria WHERE id_categoria = ${id}`

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
    getSelectAllCategories,
    getSelectByIdCategory,
    getSelectLastIdCategory,
    setInsertCategory,
    setUpdateCategory,
    setDeleteCategory
}