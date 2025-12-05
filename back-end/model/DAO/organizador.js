/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do Organizador
 * Data: 04/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os organizadors do banco de dados
const getSelectAllOrganizers = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_organizador order by id_organizador desc`

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

//Retorna um organizador filtrando pelo ID do banco de dados
const getSelectByIdOrganizer = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_organizador where id_organizador=${id}`

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

const getSelectLastIdOrganizer = async function () {
    try {
        //Script SQL
        let sql = `select id_organizador from tbl_organizador order by id_organizador desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)) {
            return Number(result[0].id_organizador)
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um organizador no banco de dados
const setInsertOrganizer = async function (organizador) {
    try {

        if (organizador.cpf == null) {

            let sql = `INSERT INTO tbl_organizador (nome, email, senha, cpf, cnpj, telefone, data_nascimento, data_fundacao, id_genero) 
        VALUES('${organizador.nome}',
                '${organizador.email}',
                '${organizador.senha}',
                null,
                '${organizador.cnpj}',
                '${organizador.telefone}',
                null,
                '${organizador.data_fundacao}',
                null);`

            // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
            let result = await prisma.$executeRawUnsafe(sql)

            if (result)
                return true
            else
                return false
        } else {

              let sql = `INSERT INTO tbl_organizador (nome, email, senha, cpf, cnpj, telefone, data_nascimento, data_fundacao, id_genero) 
        VALUES('${organizador.nome}',
                '${organizador.email}',
                '${organizador.senha}',
                '${organizador.cpf}',
                null,
                '${organizador.telefone}',
                '${organizador.data_nascimento}',
                null,
                '${organizador.id_genero}');`

            // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
            let result = await prisma.$executeRawUnsafe(sql)

            if (result)
                return true
            else
                return false

        }
    } catch (error) {
        return false
    }
}

//Atualiza um organizador no banco de dados filtrando pelo ID
const setUpdateOrganizer = async function (organizador) {
    try {

        if (organizador.cpf == null) {

        let sql = `UPDATE tbl_organizador SET 
                        nome                = '${organizador.nome}',
                        email               = '${organizador.email}',
                        senha               = '${organizador.senha}',
                        cpf                 =  null,
                        cnpj                = '${organizador.cnpj}',
                        telefone            = '${organizador.telefone}',
                        data_nascimento     =  null,
                        data_fundacao       = '${organizador.data_fundacao}',
                        id_genero           = '${organizador.id_genero}'
                    WHERE id_organizador = ${organizador.id}`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
        } else {

             let sql = `UPDATE tbl_organizador SET 
                        nome                = '${organizador.nome}',
                        email               = '${organizador.email}',
                        senha               = '${organizador.senha}',
                        cpf                 = '${organizador.cpf}',
                        cnpj                =  null,
                        telefone            = '${organizador.telefone}',
                        data_nascimento     = '${organizador.data_nascimento}',
                        data_fundacao       =  null,
                        id_genero           = '${organizador.id_genero}'
                    WHERE id_organizador = ${organizador.id}`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

        }
    } catch (error) {
        return false
    }
}

//Apaga um organizador no banco de dados filtrando pelo ID
const setDeleteOrganizer = async function (id) {
    try {
        let sql = `DELETE FROM tbl_organizador WHERE id_organizador = ${id}`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const validCPF = async function (cpf) {
    try {
        //Script SQL
        let sql = `select * from tbl_organizador where cpf='${cpf}'`

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

const validCNPJ = async function (cnpj) {
    try {
        //Script SQL
        let sql = `select * from tbl_organizador where cnpj='${cnpj}'`

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

module.exports = {
    getSelectAllOrganizers,
    getSelectByIdOrganizer,
    getSelectLastIdOrganizer,
    setInsertOrganizer,
    setUpdateOrganizer,
    setDeleteOrganizer,
    validCPF,
    validCNPJ
}