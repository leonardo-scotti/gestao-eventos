
create table tbl_genero (
    id_genero int primary key auto_increment,
    nome varchar(15) not null
);

create table tbl_assunto (
    id_assunto int primary key auto_increment,
    nome varchar(100) not null
);

create table tbl_categoria (
    id_categoria int primary key auto_increment,
    nome varchar(100) not null
);

create table tbl_estado (
    id_estado int primary key auto_increment,
    sigla varchar(2) not null
);

create table tbl_cliente (
    id_cliente int primary key auto_increment,
    nome varchar(100) not null,
    email varchar(100) not null unique,
    cpf varchar(14) unique,
    telefone varchar(11) null,
    data_nascimento date null,
    data_fundacao date null,
    id_genero int null,
    foreign key (id_genero) references tbl_genero (id_genero)
);

create table tbl_organizador (
    id_organizador int primary key auto_increment,
    nome varchar(100) not null,
    email varchar(100) not null unique,
    cpf varchar(14) unique,
    cnpj varchar(18) unique,
    telefone varchar(11) null,
    data_nascimento date null,
    data_fundacao date null,
    id_genero int null,
    foreign key (id_genero) references tbl_genero (id_genero)
);

create table tbl_endereco (
    id_endereco int primary key auto_increment,
    cep varchar(8) not null,
    logradouro varchar(100) not null,
    complemento varchar(100) null,
    numero varchar(20) not null,
    bairro varchar(150) not null,
    cidade varchar(150) not null,
    id_estado int not null,
    foreign key (id_estado) references tbl_estado (id_estado),
    foreign key (id_evento) references tbl_evento (id_evento)
);

create table tbl_evento (
    id_evento int primary key auto_increment,
    nome varchar(100) not null,
    descricao text not null,
    data_inicio date not null,
    hora_inicio time not null,
    data_termino date not null,
    hora_termino time not null,
    banner varchar(255) not null,
    quantidade_ingresso int not null,
    quantidade_ingresso_comprado int not null,
    is_visible boolean not null,
    id_categoria int not null,
    id_assunto int not null,
    foreign key (id_categoria) references tbl_categoria (id_categoria),
    foreign key (id_assunto) references tbl_assunto (id_assunto)
);

create table tbl_ingresso (
    id_ingresso int primary key auto_increment,
    nome varchar(100) not null,
    preco_unitario decimal(10, 2) not null,
    is_alive boolean not null,
    id_evento int not null,
    foreign key (id_evento) references tbl_evento (id_evento)
);

create table tbl_pedido (
    id_pedido int primary key auto_increment,
    data_pedido date not null,
    status_pedido enum('EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO') not null,
    valor_total decimal(10, 2) null,
    id_cliente int not null,
    id_organizador int null,
    foreign key (id_cliente) references tbl_cliente (id_cliente),
    foreign key (id_organizador) references tbl_organizador (id_organizador)
);

create table tbl_organizador_evento (
    id_organizador_evento int primary key auto_increment,
    data_inscricao date not null,
    id_organizador int not null,
    id_evento int not null,
    foreign key (id_organizador) references tbl_organizador (id_organizador),
    foreign key (id_evento) references tbl_evento (id_evento)
);

create table tbl_cliente_evento (
    id_cliente_evento int primary key auto_increment,
    data_inscricao datetime not null,
    id_cliente int not null,
    id_evento int not null,
    foreign key (id_cliente) references tbl_cliente (id_cliente),
    foreign key (id_evento) references tbl_evento (id_evento)
);

create table tbl_item_pedido (
    id_item_pedido int primary key auto_increment,
    quantidade int not null,
    id_pedido int not null,
    id_ingresso int not null,
    foreign key (id_pedido) references tbl_pedido (id_pedido),
    foreign key (id_ingresso) references tbl_ingresso (id_ingresso)
);





-- inserts

INSERT INTO tbl_assunto (nome) VALUES 
('Música Eletrônica'),
('Gastronomia'),
('Tecnologia e Inovação'),
('Arte e Cultura');

INSERT INTO tbl_categoria (nome) VALUES 
('Festival'),
('Workshop'),
('Feira'),
('Palestra');

INSERT INTO tbl_endereco (cep, logradouro, complemento, numero, bairro, cidade, id_estado, id_evento) VALUES
('01310100', 'Av. Paulista', 'Cj 10', '1000', 'Bela Vista', 'São Paulo', 1, 2),
('20040030', 'Rua da Assembleia', NULL, '50', 'Centro', 'Rio de Janeiro', 2, 2);

INSERT INTO tbl_ingresso (nome, preco_unitario, is_ative, id_evento) VALUES
('Passaporte 3 dias', 999.00, TRUE, 1),
('Dia 1', 399.00, TRUE, 1),
('Acesso Workshop', 150.00, TRUE, 2);