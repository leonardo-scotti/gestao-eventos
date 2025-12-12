/********************************************************************************************************************
 * Objetivo: Arquivo responsavel pelas requisições 
 * Data: 03/12/2025
 * Autores: Vitor Miguel Rodrigues Cezario
 * Versão: 1.0
 ********************************************************************************************************************/

//Import das dependencias
const express = require('express')
const express_session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')

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

//Define a porta padrão da API, se for em um servidor de nuvem não temos acesso a porta
// em execução local podemos definir uma porta livre
const PORT = process.PORT || 8080

//Instancia na classe do express
const app = express()

// Configuração CORRETA do CORS para aceitar seu Front-end + Cookies
app.use(cors({
    origin: true, // O endereço exato que aparece no seu navegador
    credentials: true, // Permite os cookies de sessão
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With"
}));

//Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()


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
const controllerOrganizador = require('./controller/organizador/controller_organizador.js')
const controllerAssunto = require('./controller/assunto/controller_assunto.js')
const controllerEvento = require('./controller/evento/controller_evento.js')
const controllerEstado = require('./controller/estado/controller_estado.js')
const controllerEndereco = require('./controller/endereco/controller_endereco.js')
const controllerIngresso = require('./controller/ingresso/controller_ingresso.js')
const controllerPedido = require('./controller/pedido/controller_pedido.js')
const MESSAGE_DEFAULT = require('./controller/modulo/config_messages.js')

//Um objeto para validar a sintaxe do body
const validarBody = async function (err, req, res, next) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json(
           MESSAGE.ERROR_INVALID_BODY_SYNTAX 
        );
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json(
            MESSAGE.ERROR_INVALID_BODY_SYNTAX 
        );
    }
    next()
};

//Endpoint para o CRUD do Evento

//Retorna a lista de generos
app.get('/api/v1/unievent/genero', async function (request, response) {

    let genero = await controllerGenero.listarGeneros()

    response.status(genero.status_code)
    response.json(genero)
})

//Retorna a um genero filtrando pelo ID
app.get('/api/v1/unievent/genero/:id', async function (request, response) {

    let IdGenero = request.params.id

    let genero = await controllerGenero.buscarGeneroId(IdGenero)

    response.status(genero.status_code)
    response.json(genero)

})

//Insere um novo Genero no BD
app.post('/api/v1/unievent/genero', bodyParserJSON, validarBody, async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

app.put('/api/v1/unievent/genero/:id', bodyParserJSON, validarBody, async function (request, response) {

    dadosBody = request.body

    IdGenero = request.params.id

    contentType = request.headers['content-type']

    genero = await controllerGenero.atualizarGenero(dadosBody, IdGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

app.delete('/api/v1/unievent/genero/:id', async function (request, response) {

    IdGenero = request.params.id

    genero = await controllerGenero.excluirGenero(IdGenero)

    response.status(genero.status_code)
    response.json(genero)

})

//Retorna a lista de categorias
app.get('/api/v1/unievent/categoria', async function (request, response) {

    let categoria = await controllerCategoria.listarCategorias()

    response.status(categoria.status_code)
    response.json(categoria)
})

//Retorna a um categoria filtrando pelo ID
app.get('/api/v1/unievent/categoria/:id', async function (request, response) {

    let IdCategoria = request.params.id

    let categoria = await controllerCategoria.buscarCategoriaId(IdCategoria)

    response.status(categoria.status_code)
    response.json(categoria)

})

//Insere um novo Categoria no BD
app.post('/api/v1/unievent/categoria', validarBody, upload.single('icone'), async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let icone = request.file

    let categoria = await controllerCategoria.inserirCategoria(dadosBody, contentType, icone)

    response.status(categoria.status_code)
    response.json(categoria)

})

app.put('/api/v1/unievent/categoria/:id', validarBody, upload.single('icone'), async function (request, response) {

    dadosBody = request.body

    IdCategoria = request.params.id

    contentType = request.headers['content-type']

    let icone = request.file

    categoria = await controllerCategoria.atualizarCategoria(dadosBody, IdCategoria, contentType, icone)

    response.status(categoria.status_code)
    response.json(categoria)

})

app.delete('/api/v1/unievent/categoria/:id', async function (request, response) {

    IdCategoria = request.params.id

    categoria = await controllerCategoria.excluirCategoria(IdCategoria)

    response.status(categoria.status_code)
    response.json(categoria)

})

//Retorna a lista de clientes
app.get('/api/v1/unievent/cliente', async function (request, response) {

    let cliente = await controllerCliente.listarClientes()

    response.status(cliente.status_code)
    response.json(cliente)
})

//Retorna a um cliente filtrando pelo ID
app.get('/api/v1/unievent/cliente/:id', async function (request, response) {

    let IdCliente = request.params.id

    let cliente = await controllerCliente.buscarClienteId(IdCliente)

    response.status(cliente.status_code)
    response.json(cliente)

})

//Insere um novo cliente no BD
app.post('/api/v1/unievent/cliente', bodyParserJSON, validarBody, async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let cliente = await controllerCliente.inserirCliente(dadosBody, contentType)

    response.status(cliente.status_code)
    response.json(cliente)

})

app.put('/api/v1/unievent/cliente/:id', bodyParserJSON, validarBody, async function (request, response) {

    dadosBody = request.body

    IdCliente = request.params.id

    contentType = request.headers['content-type']

    cliente = await controllerCliente.atualizarCliente(dadosBody, IdCliente, contentType)

    response.status(cliente.status_code)
    response.json(cliente)

})

app.delete('/api/v1/unievent/cliente/:id', async function (request, response) {

    IdCliente = request.params.id

    cliente = await controllerCliente.excluirCliente(IdCliente)

    response.status(cliente.status_code)
    response.json(cliente)

})

// Rota de Login (Autenticação) Cliente
app.post('/api/v1/unievent/login/cliente', bodyParserJSON, validarBody, async function (request, response) {

    let { email, senha } = request.body

    let resultadoLogin = await controllerCliente.AutenticarLoginCliente(email, senha);

    if (resultadoLogin.status) {
        // Salva os dados do usuário na sessão do servidor
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
app.post('/api/v1/unievent/logout/cliente', async function (request, response) {

    request.session.destroy(function (erro) {
        if (erro) {
            return response.status(500).json({ message: "Erro ao fazer logout" });
        }
        response.status(200).json({ message: "Logout realizado com sucesso" });
    });
})

//Retorna a lista de assuntos
app.get('/api/v1/unievent/assunto', async function (request, response) {

    let assunto = await controllerAssunto.listarAssuntos()

    response.status(assunto.status_code)
    response.json(assunto)
})

//Retorna a um assunto filtrando pelo ID
app.get('/api/v1/unievent/assunto/:id', async function (request, response) {

    let IdAssunto = request.params.id

    let assunto = await controllerAssunto.buscarAssuntoId(IdAssunto)

    response.status(assunto.status_code)
    response.json(assunto)

})

//Insere um novo Assunto no BD
app.post('/api/v1/unievent/assunto', bodyParserJSON, validarBody, async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let assunto = await controllerAssunto.inserirAssunto(dadosBody, contentType)

    response.status(assunto.status_code)
    response.json(assunto)

})

app.put('/api/v1/unievent/assunto/:id', bodyParserJSON, validarBody, async function (request, response) {

    dadosBody = request.body

    IdAssunto = request.params.id

    contentType = request.headers['content-type']

    assunto = await controllerAssunto.atualizarAssunto(dadosBody, IdAssunto, contentType)

    response.status(assunto.status_code)
    response.json(assunto)

})

app.delete('/api/v1/unievent/assunto/:id', async function (request, response) {

    IdAssunto = request.params.id

    assunto = await controllerAssunto.excluirAssunto(IdAssunto)

    response.status(assunto.status_code)
    response.json(assunto)

})

//Retorna a lista de eventos
app.get('/api/v1/unievent/evento', async function (request, response) {

    let evento = await controllerEvento.listarEventos()

    response.status(evento.status_code)
    response.json(evento)
})

//Retorna a um evento filtrando pelo ID
app.get('/api/v1/unievent/evento/:id', async function (request, response) {

    let IdEvento = request.params.id

    let evento = await controllerEvento.buscarEventoId(IdEvento)

    response.status(evento.status_code)
    response.json(evento)

})

//Insere um novo Evento no BD
app.post('/api/v1/unievent/evento', validarBody, upload.single('banner'), async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let banner = request.file

    let evento = await controllerEvento.inserirEvento(dadosBody, contentType, banner)

    response.status(evento.status_code)
    response.json(evento)

})

app.put('/api/v1/unievent/evento/:id', validarBody, upload.single('banner'), async function (request, response) {

    dadosBody = request.body

    IdEvento = request.params.id

    contentType = request.headers['content-type']

    let banner = request.file

    evento = await controllerEvento.atualizarEvento(dadosBody, IdEvento, contentType, banner)

    response.status(evento.status_code)
    response.json(evento)

})

app.delete('/api/v1/unievent/evento/:id', async function (request, response) {

    IdEvento = request.params.id

    evento = await controllerEvento.excluirEvento(IdEvento)

    response.status(evento.status_code)
    response.json(evento)

})

//Retorna a lista de estados
app.get('/api/v1/unievent/estado', async function (request, response) {

    let estado = await controllerEstado.listarEstados()

    response.status(estado.status_code)
    response.json(estado)
})

//Retorna a um estado filtrando pelo ID
app.get('/api/v1/unievent/estado/:id', async function (request, response) {

    let IdEstado = request.params.id

    let estado = await controllerEstado.buscarEstadoId(IdEstado)

    response.status(estado.status_code)
    response.json(estado)

})

//Insere um novo Estado no BD
app.post('/api/v1/unievent/estado', bodyParserJSON, validarBody, async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let estado = await controllerEstado.inserirEstado(dadosBody, contentType)

    response.status(estado.status_code)
    response.json(estado)

})

app.put('/api/v1/unievent/estado/:id', bodyParserJSON, validarBody, async function (request, response) {

    dadosBody = request.body

    IdEstado = request.params.id

    contentType = request.headers['content-type']

    estado = await controllerEstado.atualizarEstado(dadosBody, IdEstado, contentType)

    response.status(estado.status_code)
    response.json(estado)

})

app.delete('/api/v1/unievent/estado/:id', async function (request, response) {

    IdEstado = request.params.id

    estado = await controllerEstado.excluirEstado(IdEstado)

    response.status(estado.status_code)
    response.json(estado)

})

//Retorna a lista de endereco
app.get('/api/v1/unievent/endereco', async function (request, response) {

    let endereco = await controllerEndereco.listarEnderecos()

    response.status(endereco.status_code)
    response.json(endereco)
})

//Retorna a um endereco filtrando pelo ID
app.get('/api/v1/unievent/endereco/:id', async function (request, response) {

    let IdEndereco = request.params.id

    let endereco = await controllerEndereco.buscarEnderecoId(IdEndereco)

    response.status(endereco.status_code)
    response.json(endereco)

})

//Retorna a lista de cidades
app.get('/api/v1/unievent/cidade', async function (request, response) {

    let endereco = await controllerEndereco.listarCidades()

    response.status(endereco.status_code)
    response.json(endereco)
})

//Insere um novo Endereco no BD
app.post('/api/v1/unievent/endereco', bodyParserJSON, validarBody, async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let endereco = await controllerEndereco.inserirEndereco(dadosBody, contentType)

    response.status(endereco.status_code)
    response.json(endereco)

})

app.put('/api/v1/unievent/endereco/:id', bodyParserJSON, validarBody, async function (request, response) {

    dadosBody = request.body

    IdEndereco = request.params.id

    contentType = request.headers['content-type']

    endereco = await controllerEndereco.atualizarEndereco(dadosBody, IdEndereco, contentType)

    response.status(endereco.status_code)
    response.json(endereco)

})

app.delete('/api/v1/unievent/endereco/:id', async function (request, response) {

    IdEndereco = request.params.id

    endereco = await controllerEndereco.excluirEndereco(IdEndereco)

    response.status(endereco.status_code)
    response.json(endereco)

})

//Retorna a lista de ingresso
app.get('/api/v1/unievent/ingresso', async function (request, response) {

    let ingresso = await controllerIngresso.listarIngressos()

    response.status(ingresso.status_code)
    response.json(ingresso)
})

//Retorna a um ingresso filtrando pelo ID
app.get('/api/v1/unievent/ingresso/:id', async function (request, response) {

    let IdIngresso = request.params.id

    let ingresso = await controllerIngresso.buscarIngressoId(IdIngresso)

    response.status(ingresso.status_code)
    response.json(ingresso)

})

//Insere um novo Ingresso no BD
app.post('/api/v1/unievent/ingresso', bodyParserJSON, validarBody, async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let ingresso = await controllerIngresso.inserirIngresso(dadosBody, contentType)

    response.status(ingresso.status_code)
    response.json(ingresso)

})

app.put('/api/v1/unievent/ingresso/:id', bodyParserJSON, validarBody, async function (request, response) {

    dadosBody = request.body

    IdIngresso = request.params.id

    contentType = request.headers['content-type']

    ingresso = await controllerIngresso.atualizarIngresso(dadosBody, IdIngresso, contentType)

    response.status(ingresso.status_code)
    response.json(ingresso)

})

app.delete('/api/v1/unievent/ingresso/:id', async function (request, response) {

    IdIngresso = request.params.id

    ingresso = await controllerIngresso.excluirIngresso(IdIngresso)

    response.status(ingresso.status_code)
    response.json(ingresso)

})


//Retorna a lista de organizadores
app.get('/api/v1/unievent/organizador', async function (request, response) {

    let organizador = await controllerOrganizador.listarOrganizadores()

    response.status(organizador.status_code)
    response.json(organizador)
})

//Retorna a um organizador filtrando pelo ID
app.get('/api/v1/unievent/organizador/:id', async function (request, response) {

    let IdOrganizador = request.params.id

    let organizador = await controllerOrganizador.buscarOrganizadorId(IdOrganizador)

    response.status(organizador.status_code)
    response.json(organizador)

})

//Insere um novo organizador no BD
app.post('/api/v1/unievent/organizador', bodyParserJSON, validarBody, async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let organizador = await controllerOrganizador.inserirOrganizador(dadosBody, contentType)

    response.status(organizador.status_code)
    response.json(organizador)

})

app.put('/api/v1/unievent/organizador/:id', bodyParserJSON, validarBody, async function (request, response) {

    dadosBody = request.body

    IdOrganizador = request.params.id

    contentType = request.headers['content-type']

    organizador = await controllerOrganizador.atualizarOrganizador(dadosBody, IdOrganizador, contentType)

    response.status(organizador.status_code)
    response.json(organizador)

})

app.delete('/api/v1/unievent/organizador/:id', async function (request, response) {

    IdOrganizador = request.params.id

    organizador = await controllerOrganizador.excluirOrganizador(IdOrganizador)

    response.status(organizador.status_code)
    response.json(organizador)

})

// Rota de Login (Autenticação) Organizador
app.post('/api/v1/unievent/login/organizador', bodyParserJSON, validarBody, async function (request, response) {

    let { email, senha } = request.body

    let resultadoLogin = await controllerOrganizador.AutenticarLoginOrganizador(email, senha)

    if (resultadoLogin.status) {
        // SUCESSO: Salva os dados do usuário na sessão do servidor
        request.session.user = {
            id: resultadoLogin.organizador.id,
            nome: resultadoLogin.organizador.nome,
            email: resultadoLogin.organizador.email
        };
        response.status(200).json({
            message: "Login realizado com sucesso",
            organizador: request.session.user
        });

    } else {
        response.status(401).json({ message: "Usuário ou senha inválidos" });
    }
})

// Rota de Logout (Autenticação) Organizador
app.post('/api/v1/unievent/logout/organizador', async function (request, response) {

    request.session.destroy(function (erro) {
        if (erro) {
            return response.status(500).json({ message: "Erro ao fazer logout" });
        }
        response.status(200).json({ message: "Logout realizado com sucesso" });
    });
})

//Retorna a lista de pedidos
app.get('/api/v1/unievent/pedido', async function (request, response) {

    let pedido = await controllerPedido.listarPedidos()

    response.status(pedido.status_code)
    response.json(pedido)
})

//Retorna a um pedido filtrando pelo ID
app.get('/api/v1/unievent/pedido/:id', async function (request, response) {

    let IdPedido = request.params.id

    let pedido = await controllerPedido.buscarPedidoId(IdPedido)

    response.status(pedido.status_code)
    response.json(pedido)

})

//Insere um novo Pedido no BD
app.post('/api/v1/unievent/pedido', bodyParserJSON, validarBody, async function (request, response) {

        let dadosBody = request.body

        let contentType = request.headers['content-type']

        let pedido = await controllerPedido.inserirPedido(dadosBody, contentType)

        response.status(pedido.status_code)
        response.json(pedido)

})

app.put('/api/v1/unievent/pedido/:id', bodyParserJSON, validarBody, async function (request, response) {

    dadosBody = request.body

    IdPedido = request.params.id

    contentType = request.headers['content-type']

    pedido = await controllerPedido.atualizarPedido(dadosBody, IdPedido, contentType)

    response.status(pedido.status_code)
    response.json(pedido)

})

app.delete('/api/v1/unievent/pedido/:id', async function (request, response) {

    IdPedido = request.params.id

    pedido = await controllerPedido.excluirPedido(IdPedido)

    response.status(pedido.status_code)
    response.json(pedido)

})



app.listen(PORT, function () {
    console.log('API aguardando requisições!!!')
})