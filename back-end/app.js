/********************************************************************************************************************
 * Objetivo: Arquivo responsavel pelas requisições 
 * Data: 03/12/2025
 * Autores: Vitor Miguel  e João Blesa
 * Versão: 1.0
 ********************************************************************************************************************/

//Import das dependencias
const express           = require('express')
const express_session   = require('express-session')
const cors              = require('cors')
const bodyParser        = require('body-parser')
const multer            = require('multer')  

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


app.use(express_session({
    secret: 'segredo_super_secreto_unievent', // Chave para assinar o cookie (em prod, use variável de ambiente)
    resave: false, // Evita regravar a sessão se nada mudou
    saveUninitialized: false, // Só cria a sessão se houver dados salvos (login efetuado)
    cookie: { 
        secure: false, // Use 'true' se estiver usando HTTPS
        maxAge: 1000 * 60 * 60 * 24 // Sessão expira em 24 horas
    }
}))

const controllerGenero = require('./controller/genero/controller_genero.js')
const controllerCategoria = require('./controller/categoria/controller_categoria.js')
const controllerCliente = require('./controller/cliente/controller_cliente.js')
const controllerAssunto = require('./controller/assunto/controller_assunto.js')
const controllerEvento = require('./controller/evento/controller_evento.js')

//Endpoint para o CRUD do Evento

//Retorna a lista de generos
app.get('/api/v1/unievent/genero', cors(), async function (request, response) {

    let genero = await controllerGenero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)
})

//Retorna a um genero filtrando pelo ID
app.get('/api/v1/unievent/genero/:id', cors(), async function (request, response) {

    let IdGenero    = request.params.id

    let genero      = await controllerGenero.buscarGeneroId(IdGenero)

    response.status(genero.status_code)
    response.json(genero)
    
})

//Insere um novo Genero no BD
app.post('/api/v1/unievent/genero', cors(), bodyParserJSON, async function (request, response) {
    
    let dadosBody   = request.body

    let contentType = request.headers['content-type']

    let genero      = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

app.put('/api/v1/unievent/genero/:id', cors(), bodyParserJSON, async function (request, response) {
    
    dadosBody   = request.body

    IdGenero    = request.params.id

    contentType = request.headers['content-type']

    genero      = await controllerGenero.atualizarGenero(dadosBody, IdGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

app.delete('/api/v1/unievent/genero/:id', cors(), async function (request,response) {

    IdGenero = request.params.id

    genero   = await controllerGenero.excluirGenero(IdGenero)

    response.status(genero.status_code)
    response.json(genero)
    
})

//Retorna a lista de categorias
app.get('/api/v1/unievent/categoria', cors(), async function (request, response) {

    let categoria = await controllerCategoria.listarCategorias()

    response.status(categoria.status_code)
    response.json(categoria)
})

//Retorna a um categoria filtrando pelo ID
app.get('/api/v1/unievent/categoria/:id', cors(), async function (request, response) {

    let IdCategoria    = request.params.id

    let categoria      = await controllerCategoria.buscarCategoriaId(IdCategoria)

    response.status(categoria.status_code)
    response.json(categoria)
    
})

//Insere um novo Categoria no BD
app.post('/api/v1/unievent/categoria', cors(), bodyParserJSON, upload.single('icone'), async function (request, response) {
    
    let dadosBody       = request.body

    let contentType     = request.headers['content-type']

    let icone            = request.file

    let categoria      = await controllerCategoria.inserirCategoria(dadosBody, contentType, icone)

    response.status(categoria.status_code)
    response.json(categoria)

})

app.put('/api/v1/unievent/categoria/:id', cors(), bodyParserJSON, upload.single('icone'), async function (request, response) {
    
    dadosBody   = request.body

    IdCategoria    = request.params.id

    contentType = request.headers['content-type']

    let icone            = request.file

    categoria      = await controllerCategoria.atualizarCategoria(dadosBody, IdCategoria, contentType, icone)

    response.status(categoria.status_code)
    response.json(categoria)

})

app.delete('/api/v1/unievent/categoria/:id', cors(), async function (request,response) {

    IdCategoria = request.params.id

    categoria   = await controllerCategoria.excluirCategoria(IdCategoria)

    response.status(categoria.status_code)
    response.json(categoria)
    
})

//Retorna a lista de clientes
app.get('/api/v1/unievent/cliente', cors(), async function (request, response) {

    let cliente = await controllerCliente.listarClientes()

    response.status(cliente.status_code)
    response.json(cliente)
})

//Retorna a um clinete filtrando pelo ID
app.get('/api/v1/unievent/cliente/:id', cors(), async function (request, response) {

    let IdCliente    = request.params.id

    let cliente      = await controllerCliente.buscarClienteId(IdCliente)

    response.status(cliente.status_code)
    response.json(cliente)
    
})

//Insere um novo cliente no BD
app.post('/api/v1/unievent/cliente', cors(), bodyParserJSON, async function (request, response) {
    
    let dadosBody   = request.body

    let contentType = request.headers['content-type']

    let cliente      = await controllerCliente.inserirCliente(dadosBody, contentType)

    response.status(cliente.status_code)
    response.json(cliente)

})

app.put('/api/v1/unievent/cliente/:id', cors(), bodyParserJSON, async function (request, response) {
    
    dadosBody   = request.body

    IdCliente    = request.params.id

    contentType = request.headers['content-type']

    cliente      = await controllerCliente.atualizarCliente(dadosBody, IdCliente, contentType)

    response.status(cliente.status_code)
    response.json(cliente)

})

app.delete('/api/v1/unievent/cliente/:id', cors(), async function (request,response) {

    IdCliente = request.params.id

    cliente   = await controllerCliente.excluirCliente(IdCliente)

    response.status(cliente.status_code)
    response.json(cliente)
    
})

// Rota de Login (Autenticação) Cliente
app.post('/api/v1/unievent/login', cors(), bodyParserJSON, async function (request, response) {

    let {email, senha}  = request.body

    let resultadoLogin = await controllerCliente.AutenticarLogin(email, senha);

    if (resultadoLogin.status) {
        // SUCESSO: Salva os dados do usuário na sessão do servidor
        request.session.user = {
            id: resultadoLogin.cliente.id,
            nome: resultadoLogin.cliente.nome,
            email: resultadoLogin.cliente.email
        };
        response.status(200).json({ 
            message: "Login realizado com sucesso", 
            cliente: request.session.user 
        });

    } else {
        response.status(401).json({ message: "Usuário ou senha inválidos" });
    }
})

// Rota de Logout (Autenticação) Cliente
app.post('/api/v1/unievent/logout', cors(), async function (request, response) {

   request.session.destroy(function (erro) {
        if (erro) {
            return response.status(500).json({ message: "Erro ao fazer logout" });
        }
        response.status(200).json({ message: "Logout realizado com sucesso" });
    });
})

//Retorna a lista de assuntos
app.get('/api/v1/unievent/assunto', cors(), async function (request, response) {

    let assunto = await controllerAssunto.listarAssuntos()

    response.status(assunto.status_code)
    response.json(assunto)
})

//Retorna a um assunto filtrando pelo ID
app.get('/api/v1/unievent/assunto/:id', cors(), async function (request, response) {

    let IdAssunto    = request.params.id

    let assunto      = await controllerAssunto.buscarAssuntoId(IdAssunto)

    response.status(assunto.status_code)
    response.json(assunto)
    
})

//Insere um novo Assunto no BD
app.post('/api/v1/unievent/assunto', cors(), bodyParserJSON, async function (request, response) {
    
    let dadosBody   = request.body

    let contentType = request.headers['content-type']

    let assunto      = await controllerAssunto.inserirAssunto(dadosBody, contentType)

    response.status(assunto.status_code)
    response.json(assunto)

})

app.put('/api/v1/unievent/assunto/:id', cors(), bodyParserJSON, async function (request, response) {
    
    dadosBody   = request.body

    IdAssunto    = request.params.id

    contentType = request.headers['content-type']

    assunto      = await controllerAssunto.atualizarAssunto(dadosBody, IdAssunto, contentType)

    response.status(assunto.status_code)
    response.json(assunto)

})

app.delete('/api/v1/unievent/assunto/:id', cors(), async function (request,response) {

    IdAssunto = request.params.id

    assunto   = await controllerAssunto.excluirAssunto(IdAssunto)

    response.status(assunto.status_code)
    response.json(assunto)
    
})

//Retorna a lista de eventos
app.get('/api/v1/unievent/evento', cors(), async function (request, response) {

    let evento = await controllerEvento.listarEventos()

    response.status(evento.status_code)
    response.json(evento)
})

//Retorna a um evento filtrando pelo ID
app.get('/api/v1/unievent/evento/:id', cors(), async function (request, response) {

    let IdEvento   = request.params.id

    let evento      = await controllerEvento.buscarEventoId(IdEvento)

    response.status(evento.status_code)
    response.json(evento)
    
})

//Insere um novo Evento no BD
app.post('/api/v1/unievent/evento', cors(), bodyParserJSON, upload.single('banner'), async function (request, response) {
    
    let dadosBody   = request.body

    let contentType = request.headers['content-type']

    let banner            = request.file

    let evento      = await controllerEvento.inserirEvento(dadosBody, contentType, banner)

    response.status(evento.status_code)
    response.json(evento)

})

app.put('/api/v1/unievent/evento/:id', cors(), bodyParserJSON, upload.single('banner'), async function (request, response) {
    
    dadosBody   = request.body

    IdEvento    = request.params.id

    contentType = request.headers['content-type']

    let banner            = request.file

    evento      = await controllerEvento.atualizarEvento(dadosBody, IdEvento, contentType, banner)

    response.status(evento.status_code)
    response.json(evento)

})

app.delete('/api/v1/unievent/evento/:id', cors(), async function (request,response) {

    IdEvento = request.params.id

    evento   = await controllerEvento.excluirEvento(IdEvento)

    response.status(evento.status_code)
    response.json(evento)
    
})

app.listen(PORT, function(){
    console.log('API aguardando requisições!!!')
})