/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL do Cliente
 * Data: 03/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os clientes do banco de dados
const getSelectAllCustomers = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_cliente order by id_cliente desc`

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

//Retorna um cliente filtrando pelo ID do banco de dados
const getSelectByIdCustomer = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_cliente where id_cliente=${id}`

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

const getSelectLastIdCustomer = async function () {
    try {
        //Script SQL
        let sql = `select id_cliente from tbl_cliente order by id_cliente desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)) {
            return Number(result[0].id_cliente)
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um cliente no banco de dados
const setInsertCustomer = async function (cliente) {
    try {

        if (cliente.cpf == null) {

            let sql = `INSERT INTO tbl_cliente (nome, email, senha, cpf, cnpj, telefone, data_nascimento, data_fundacao, id_genero) 
        VALUES('${cliente.nome}',
                '${cliente.email}',
                '${cliente.senha}',
                null,
                '${cliente.cnpj}',
                '${cliente.telefone}',
                null,
                '${cliente.data_fundacao}',
                null);`

            // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
            let result = await prisma.$executeRawUnsafe(sql)

            if (result)
                return true
            else
                return false
        } else if (cliente.cnpj == null) {

            let sql = `INSERT INTO tbl_cliente (nome, email, senha, cpf, cnpj, telefone, data_nascimento, data_fundacao, id_genero) 
        VALUES('${cliente.nome}',
                '${cliente.email}',
                '${cliente.senha}',
                '${cliente.cpf}',
                null,
                '${cliente.telefone}',
                '${cliente.data_nascimento}',
                null,
                '${cliente.id_genero}');`

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

//Atualiza um cliente no banco de dados filtrando pelo ID
const setUpdateCustomer = async function (cliente) {
    try {

        if (cliente.cpf == null) {

            let sql = `UPDATE tbl_cliente SET 
                        nome                = '${cliente.nome}',
                        email               = '${cliente.email}',
                        senha               = '${cliente.senha}',
                        cpf                 =  null,
                        cnpj                = '${cliente.cnpj}',
                        telefone            = '${cliente.telefone}',
                        data_nascimento     =  null,
                        data_fundacao       = '${cliente.data_fundacao}',
                        id_genero           = '${cliente.id_genero}'
                    WHERE id_cliente = ${cliente.id}`

            // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE, DELETE)
            let result = await prisma.$executeRawUnsafe(sql)

            if (result)
                return true
            else
                return false
        } else if (cliente.cnpj == null) {

            let sql = `UPDATE tbl_cliente SET 
                        nome                = '${cliente.nome}',
                        email               = '${cliente.email}',
                        senha               = '${cliente.senha}',
                        cpf                 = '${cliente.cpf}',
                        cnpj                =  null,
                        telefone            = '${cliente.telefone}',
                        data_nascimento     = '${cliente.data_nascimento}',
                        data_fundacao       =  null,
                        id_genero           = '${cliente.id_genero}'
                    WHERE id_cliente = ${cliente.id}`

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

//Apaga um cliente no banco de dados filtrando pelo ID
const setDeleteCustomer = async function (id) {
    try {
        let sql = `DELETE FROM tbl_cliente WHERE id_cliente = ${id}`

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
        let sql = `select * from tbl_cliente where cpf='${cpf}'`

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
        let sql = `select * from tbl_cliente where cnpj='${cnpj}'`

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
    getSelectAllCustomers,
    getSelectByIdCustomer,
    getSelectLastIdCustomer,
    setInsertCustomer,
    setUpdateCustomer,
    setDeleteCustomer,
    validCPF,
    validCNPJ
}