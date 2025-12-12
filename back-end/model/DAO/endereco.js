/********************************************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL dos Endereços
 * Data: 04/11/2025
 * Autor: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os endereços do banco de dados
const getSelectAllAddresses = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_endereco order by id_endereco desc`

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

//Retorna um endereco filtrando pelo ID do banco de dados
const getSelectByIdAddress = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_endereco where id_endereco=${id}`

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

const getSelectAddressByIdEvent = async function (idEvent) {
    try {
        //Script SQL
        let sql = `select * from tbl_endereco where id_evento=${idEvent}`

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

const getSelectLastIdAddress = async function () {
    try {
        //Script SQL
        let sql = `select id_endereco from tbl_endereco order by id_endereco desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do BD é um ARRAY (vazio ou com dados)
        if (Array.isArray(result)){
            return Number(result[0].id_endereco) 
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Insere um endereco no banco de dados
const setInsertAddress = async function (endereco) {
    try {
        let sql = `INSERT INTO tbl_endereco (cep, 
                                        logradouro, 
                                        complemento, 
                                        numero,
                                        bairro,
                                        cidade,
                                        id_estado,
                                        id_evento) 
        VALUES('${endereco.cep}',
               '${endereco.logradouro}',
               '${endereco.complemento}',
               '${endereco.numero}',
               '${endereco.bairro}',
               '${endereco.cidade}',
               ${endereco.id_estado},
               ${endereco.id_evento});`

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

//Atualiza um endereco no banco de dados filtrando pelo ID
const setUpdateAddress = async function (endereco) {
    try {
        let sql = `UPDATE tbl_endereco SET 
                        cep            = '${endereco.cep}',
                        logradouro     = '${endereco.logradouro}',
                        complemento    = '${endereco.complemento}',
                        numero         = '${endereco.numero}',
                        bairro         = '${endereco.bairro}',
                        cidade         = '${endereco.cidade}',
                        id_estado      = ${endereco.id_estado},
                        id_evento      = ${endereco.id_evento}
                    WHERE id_endereco = ${endereco.id}`

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

//Apaga um endereco no banco de dados filtrando pelo ID
const setDeleteAddress = async function (id) {
    try {
        let sql = `DELETE FROM tbl_endereco WHERE id_endereco = ${id}`

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
    getSelectAllAddresses,
    getSelectByIdAddress,
    getSelectAddressByIdEvent,
    getSelectLastIdAddress,
    setInsertAddress,
    setUpdateAddress,
    setDeleteAddress
}