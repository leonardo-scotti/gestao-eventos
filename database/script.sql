CREATE DATABASE eventos_unievent;

USE eventos_unievent;

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
    id_evento int not null,
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

select * from tbl_assunto;
select * from tbl_categoria;
select * from tbl_cliente;
select * from tbl_cliente_evento;
select * from tbl_endereco;
select * from tbl_estado;
select * from tbl_evento;
select * from tbl_genero;
select * from tbl_ingresso;
select * from tbl_item_pedido;
select * from tbl_organizador;
select * from tbl_pedido;

create table tbl_organizador_evento (
id_organizador_evento int primary key auto_increment,
data_inscricao datetime not null,
id_organizador int not null,
id_evento int not null,
foreign key (id_organizador) references tbl_organizador (id_organizador),
foreign key (id_evento) references tbl_evento (id_evento)
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






INSERT INTO tbl_genero (nome) VALUES 
('Feminino'),
('Masculino'),
('Não Binário'),
('Outro'),
('Não Informado');

INSERT INTO tbl_assunto (nome) VALUES 
('Tecnologia e Inovação'),
('Música e Artes'),
('Educação e Carreira'),
('Saúde e Bem-Estar'),
('Esportes e Lazer');

INSERT INTO tbl_categoria (nome) VALUES 
('Congressos e Seminários'),
('Shows e Festivais'),
('Workshops e Cursos'),
('Eventos Esportivos'),
('Feiras e Exposições');

INSERT INTO tbl_estado (sigla) VALUES 
('SP'),
('RJ'),
('MG'),
('BA'),
('RS');


INSERT INTO tbl_cliente (nome, email, cpf, telefone, data_nascimento, data_fundacao, id_genero) VALUES
('Ana Silva', 'ana.s@email.com', '11122233344', '11987654321', '1990-05-15', NULL, 1),
('Bruno Santos', 'bruno.s@email.com', '22233344455', '21998765432', '1985-11-20', NULL, 2),
('Carlos Souza', 'carlos.s@email.com', '33344455566', '31976543210', '1995-03-01', NULL, 2),
('Empresa A Marketing', 'empresa.a@email.com', NULL, '41965432109', NULL, '2010-01-01', 5),
('Diana Ferreira', 'diana.f@email.com', '44455566677', '51954321098', '2000-08-25', NULL, 1);

INSERT INTO tbl_organizador (nome, email, cpf, cnpj, telefone, data_nascimento, data_fundacao, id_genero) VALUES
('Eventos Prime Ltda', 'prime@eventos.com', NULL, '00011122233344', '1155551234', NULL, '2015-07-10', 5),
('Gerson Rodrigues', 'gerson@organiza.com', '55566677788', NULL, '2155555678', '1978-04-12', NULL, 2),
('União Cultural', 'cultura@uniaoc.com', NULL, '11100033344455', '3155559012', NULL, '2005-02-28', 5),
('Helena Costa', 'helena@eventos.net', '66677788899', NULL, '4155553456', '1992-09-03', NULL, 1),
('TechMasters Co', 'tech@masters.com', NULL, '22211144455566', '5155557890', NULL, '2018-11-11', 5);

INSERT INTO tbl_evento (nome, descricao, data_inicio, hora_inicio, data_termino, hora_termino, banner, quantidade_ingresso, quantidade_ingresso_comprado, is_visible, id_categoria, id_assunto) VALUES
('Tech Summit 2026', 'Conferência sobre IA e desenvolvimento.', '2026-03-10', '09:00:00', '2026-03-12', '18:00:00', 'banner_tech.jpg', 500, 50, TRUE, 1, 1),
('Festival de Rock', 'Três dias de rock e música alternativa.', '2026-07-20', '16:00:00', '2026-07-22', '23:00:00', 'banner_rock.jpg', 10000, 500, TRUE, 2, 2),
('Curso de Liderança', 'Desenvolva suas habilidades de gestão.', '2026-04-05', '08:30:00', '2026-04-05', '17:30:00', 'banner_curso.jpg', 50, 5, TRUE, 3, 3),
('Maratona da Cidade', 'Corrida de rua anual.', '2026-05-01', '07:00:00', '2026-05-01', '12:00:00', 'banner_maratona.jpg', 2000, 150, TRUE, 4, 5),
('Feira de Sustentabilidade', 'Exposição de produtos e serviços ecológicos.', '2026-06-15', '10:00:00', '2026-06-18', '20:00:00', 'banner_sustentavel.jpg', 3000, 100, FALSE, 5, 4);

INSERT INTO tbl_ingresso (nome, preco_unitario, is_alive, id_evento) VALUES
('Pista Comum', 80.00, TRUE, 2),
('VIP', 300.00, TRUE, 2),
('Acesso Geral', 45.00, TRUE, 4),
('Pacote 3 Dias', 450.00, TRUE, 1),
('Entrada Simples', 15.00, TRUE, 5);

INSERT INTO tbl_endereco (cep, logradouro, complemento, numero, bairro, cidade, id_estado, id_evento) VALUES
('01001000', 'Av. Paulista', 'Próximo ao metrô', '1500', 'Bela Vista', 'São Paulo', 1, 1),
('20040030', 'Rua da Assembleia', 'Sala 501', '10', 'Centro', 'Rio de Janeiro', 2, 2),
('30112000', 'Av. Afonso Pena', NULL, '3300', 'Serra', 'Belo Horizonte', 3, 3),
('40020000', 'Praça da Sé', 'Ao lado da Catedral', 'S/N', 'Sé', 'Salvador', 4, 4),
('90010000', 'Rua dos Andradas', 'Edifício Comercial', '123', 'Centro', 'Porto Alegre', 5, 5);

INSERT INTO tbl_pedido (data_pedido, status_pedido, valor_total, id_cliente, id_organizador) VALUES
('2025-11-28', 'FINALIZADO', 900.00, 1, 1),
('2025-11-29', 'EM_ANDAMENTO', 160.00, 2, 2),
('2025-11-30', 'CANCELADO', 45.00, 3, 3),
('2025-12-01', 'FINALIZADO', 300.00, 4, 4),
('2025-12-02', 'EM_ANDAMENTO', 80.00, 5, 5);


INSERT INTO tbl_organizador_evento (data_inscricao, id_organizador, id_evento) VALUES
('2025-10-01', 1, 1),
('2025-10-05', 2, 2),
('2025-10-10', 3, 3),
('2025-10-15', 4, 4),
('2025-10-20', 5, 5);

INSERT INTO tbl_cliente_evento (data_inscricao, id_cliente, id_evento) VALUES
('2025-11-01 10:00:00', 1, 1),
('2025-11-05 11:30:00', 2, 2),
('2025-11-10 14:00:00', 3, 3),
('2025-11-15 16:30:00', 4, 4),
('2025-11-20 09:00:00', 5, 5);

INSERT INTO tbl_item_pedido (quantidade, id_pedido, id_ingresso) VALUES
(2, 1, 4),  -- Pedido 1 comprou 2x Pacote 3 Dias
(1, 2, 1),  -- Pedido 2 comprou 1x Pista Comum
(3, 3, 3),  -- Pedido 3 comprou 3x Acesso Geral
(1, 4, 2),  -- Pedido 4 comprou 1x VIP
(5, 5, 5);  -- Pedido 5 comprou 5x Entrada Simples



-- TRIGGERS 

DELIMITER $$
CREATE TRIGGER trg_AI_item_pedido_calcular_total_pedido
AFTER INSERT ON tbl_item_pedido
FOR EACH ROW
BEGIN
    UPDATE tbl_pedido p
    SET p.valor_total = (
        SELECT SUM(ip.quantidade * i.preco_unitario)
        FROM tbl_item_pedido ip
        JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso
        WHERE ip.id_pedido = NEW.id_pedido
    )
    WHERE p.id_pedido = NEW.id_pedido;
END$$
DELIMITER ;



DELIMITER $$
CREATE TRIGGER trg_AU_item_pedido_calcular_total_pedido
AFTER UPDATE ON tbl_item_pedido
FOR EACH ROW
BEGIN
    UPDATE tbl_pedido p
    SET p.valor_total = (
        SELECT SUM(ip.quantidade * i.preco_unitario)
        FROM tbl_item_pedido ip
        JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso
        WHERE ip.id_pedido = NEW.id_pedido
    )
    WHERE p.id_pedido = NEW.id_pedido;
END$$
DELIMITER ;



DELIMITER $$
CREATE TRIGGER trg_AD_item_pedido_calcular_total_pedido
AFTER DELETE ON tbl_item_pedido
FOR EACH ROW
BEGIN
    UPDATE tbl_pedido p
    SET p.valor_total = (
        SELECT IFNULL(SUM(ip.quantidade * i.preco_unitario), 0) 
        FROM tbl_item_pedido ip
        JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso
        WHERE ip.id_pedido = OLD.id_pedido
    )
    WHERE p.id_pedido = OLD.id_pedido;
END$$
DELIMITER ;




DELIMITER $$
CREATE TRIGGER trg_BI_pedido_setar_valores_padrao
BEFORE INSERT ON tbl_pedido
FOR EACH ROW
BEGIN

    IF NEW.data_pedido IS NULL THEN
        SET NEW.data_pedido = NOW();
    END IF;
    
    IF NEW.status_pedido IS NULL THEN
        SET NEW.status_pedido = 'EM_ANDAMENTO';
    END IF;
END$$
DELIMITER ;



DELIMITER $$
CREATE TRIGGER trg_BI_item_pedido_validar_quantidade_estoque
BEFORE INSERT ON tbl_item_pedido
FOR EACH ROW
BEGIN
    DECLARE total_vagas INT;
    DECLARE vagas_compradas INT;
    DECLARE vagas_disponiveis INT;
    
    IF NEW.quantidade <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A quantidade do item deve ser maior que zero.';
    END IF;

    SELECT 
        e.quantidade_ingressos, 
        e.quantidade_ingressos_comprado
    INTO 
        total_vagas, 
        vagas_compradas
    FROM tbl_evento e
    JOIN tbl_ingresso i ON e.id_evento = i.id_evento
    WHERE i.id_ingresso = NEW.id_ingresso;

    SET vagas_disponiveis = total_vagas - vagas_compradas;

    IF NEW.quantidade > vagas_disponiveis THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estoque insuficiente para este ingresso/evento.';
    END IF;
END$$
DELIMITER ;



DELIMITER $$
CREATE TRIGGER trg_AU_pedido_cancelado_devolver_estoque
AFTER UPDATE ON tbl_pedido
FOR EACH ROW
BEGIN
    IF OLD.status_pedido <> 'CANCELADO' AND NEW.status_pedido = 'CANCELADO' THEN
        
        UPDATE tbl_evento e
        JOIN tbl_ingresso i ON e.id_evento = i.id_evento
        JOIN tbl_item_pedido ip ON i.id_ingresso = ip.id_ingresso
        SET e.quantidade_ingressos_comprado = e.quantidade_ingressos_comprado - ip.quantidade
        WHERE ip.id_pedido = NEW.id_pedido;
        
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_BI_item_pedido_validar_quantidade_estoque
BEFORE INSERT ON tbl_item_pedido
FOR EACH ROW
BEGIN
    DECLARE total_disponivel INT;
    DECLARE ingressos_comprados INT;
    DECLARE evento_id_do_ingresso INT;

    SELECT id_evento INTO evento_id_do_ingresso FROM tbl_ingresso WHERE id_ingresso = NEW.id_ingresso;
    
    SELECT quantidade_ingresso, quantidade_ingresso_comprado
    INTO total_disponivel, ingressos_comprados
    FROM tbl_evento
    WHERE id_evento = evento_id_do_ingresso;

    IF ingressos_comprados + NEW.quantidade > total_disponivel THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Estoque insuficiente para a quantidade solicitada.';
    END IF;
END$$

DELIMITER ;