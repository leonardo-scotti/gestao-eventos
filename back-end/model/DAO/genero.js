/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do Gênero
 * Data: 03/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os gêneros do banco de dados
const getSelectAllGenre = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_genero order by id_genero desc`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Retorna um gênero filtrando pelo ID do banco de dados
const getSelectByIdGenre = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_genero where id_genero=${id}`

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

const getSelectLastIdGenre = async function () {
    try {
        //Script SQL
        let sql = `select id_genero from tbl_genero order by id_genero desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_genero) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um gênero no banco de dados
const setInsertGenre = async function (genero) {
    try {
        let sql = `INSERT INTO tbl_genero (nome) 
        VALUES('${genero.nome}');`

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

//Atualiza um gênero no banco de dados filtrando pelo ID
const setUpdateGenre = async function (genero) {
    try {
        let sql = `UPDATE tbl_genero SET 
                        nome            = '${genero.nome}'
                    WHERE id_genero = ${genero.id}`

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

//Apaga um gênero no banco de dados filtrando pelo ID
const setDeleteGenre = async function (id) {
    try {
        let sql = `DELETE FROM tbl_genero WHERE id_genero = ${id}`

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
    getSelectAllGenre,
    getSelectByIdGenre,
    getSelectLastIdGenre,
    setInsertGenre,
    setUpdateGenre,
    setDeleteGenre
}