/********************************************************************************************************************
 * Objetivo: Arquivo responsavel pelas requisições 
 * Data: 03/12/2025
 * Autores: Vitor Miguel  e João Blesa
 * Versão: 1.0
 ********************************************************************************************************************/

//Import das dependencias
const express       = require('express')
const cors          = require('cors')
const bodyParser    = require('body-parser')
const multer        = require('multer')  

//Configuração do diskmanager para o MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define o diretório onde os arquivos serão salvos.
        // Certifique-se de que o diretório 'uploads/' existe na raiz do seu projeto!
        cb(null, 'uploads/');
    
    }
});

// Inicializa o Multer com a configuração de armazenamento
const upload = multer();



//Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()


//Define a porta padrão da API, se for em um servidor de nuvem não temos acesso a porta
                // em execução local podemos definir uma porta livre
const PORT          = process.PORT || 8080

//Instancia na classe do express
const app = express()

//configurações do CORS
app.use((request, response, next)=>{
    response.header('Access-Control-Allow-Origin', '*') //IP de Origem
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') // Metodos (Verbos) do protocolo HTTP

    app.use(cors())
    next()  //Proximo
})

const controllerGenero = require('./controller/genero/controller_genero.js')

//Endpoint para o CRUD do Evento

//Retorna a lista de generos
app.get('/v1/unievent/genero', cors(), async function (request, response) {

    let genero = await controllerGenero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)
})

//Retorna a um genero filtrando pelo ID
app.get('/v1/unievent/genero/:id', cors(), async function (request, response) {

    let IdGenero    = request.params.id

    let genero      = await controllerGenero.buscarGeneroId(IdGenero)

    response.status(genero.status_code)
    response.json(genero)
    
})

//Insere um novo Genero no BD
app.post('/v1/unievent/genero', cors(), bodyParserJSON, async function (request, response) {
    
    let dadosBody   = request.body

    let contentType = request.headers['content-type']

    let genero      = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

app.put('/v1/unievent/genero/:id', cors(), bodyParserJSON, async function (request, response) {
    
    dadosBody   = request.body

    IdGenero    = request.params.id

    contentType = request.headers['content-type']

    genero      = await controllerGenero.atualizarGenero(dadosBody, IdGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

app.delete('/v1/unievent/genero/:id', cors(), async function (request,response) {

    IdGenero = request.params.id

    genero   = await controllerGenero.excluirGenero(IdGenero)

    response.status(genero.status_code)
    response.json(genero)
    
})






app.listen(PORT, function(){
    console.log('API aguardando requisições!!!')
})