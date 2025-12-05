-- 1. Criação e Seleção do Banco de Dados
DROP DATABASE IF EXISTS eventos_unievent; -- Opcional: Garante que o banco está limpo
CREATE DATABASE eventos_unievent;
USE eventos_unievent;

-- 2. Tabelas Independentes (Dicionários/Auxiliares)

CREATE TABLE tbl_genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) NOT NULL
);

CREATE TABLE tbl_assunto (
    id_assunto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    icone VARCHAR(255) NOT NULL
);

ALTER TABLE tbl_categoria
ADD COLUMN icone VARCHAR(255) NOT NULL;

CREATE TABLE tbl_estado (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    sigla VARCHAR(2) NOT NULL
);

-- 3. Tabelas de Pessoas/Entidades

CREATE TABLE tbl_cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    cnpj VARCHAR(18) UNIQUE,
    telefone VARCHAR(11) NULL,
    data_nascimento DATE NULL,
    data_fundacao DATE NULL,
    id_genero INT NULL,
    FOREIGN KEY (id_genero) REFERENCES tbl_genero (id_genero)
);

ALTER TABLE tbl_cliente
ADD COLUMN cnpj VARCHAR(18) UNIQUE
AFTER cpf;

ALTER TABLE tbl_cliente
ADD COLUMN senha VARCHAR(150) NOT NULL
AFTER email;

CREATE TABLE tbl_organizador (
    id_organizador INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    cnpj VARCHAR(18) UNIQUE,
    telefone VARCHAR(11) NULL,
    data_nascimento DATE NULL,
    data_fundacao DATE NULL,
    id_genero INT NULL,
    FOREIGN KEY (id_genero) REFERENCES tbl_genero (id_genero)
);

ALTER TABLE tbl_organizador
ADD COLUMN senha VARCHAR(150) NOT NULL
AFTER email;

-- 4. Tabela Principal de Evento
-- (Precisa vir antes de Endereço e Ingresso)

CREATE TABLE tbl_evento (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    data_inicio DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    data_termino DATE NOT NULL,
    hora_termino TIME NOT NULL,
    banner VARCHAR(255) NOT NULL,
    quantidade_ingresso INT NOT NULL,
    quantidade_ingresso_comprado INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL,
    id_categoria INT NOT NULL,
    id_assunto INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES tbl_categoria (id_categoria),
    FOREIGN KEY (id_assunto) REFERENCES tbl_assunto (id_assunto)
);

-- 5. Tabelas Dependentes de Evento e Localização

CREATE TABLE tbl_endereco (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    complemento VARCHAR(100) NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(150) NOT NULL,
    cidade VARCHAR(150) NOT NULL,
    id_estado INT NOT NULL,
    id_evento INT NOT NULL,
    FOREIGN KEY (id_estado) REFERENCES tbl_estado (id_estado),
    FOREIGN KEY (id_evento) REFERENCES tbl_evento (id_evento)
);

CREATE TABLE tbl_ingresso (
    id_ingresso INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    is_ativo BOOLEAN NOT NULL, -- Corrigido de is_alive/is_ative para is_ativo
    id_evento INT NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES tbl_evento (id_evento)
);

-- 6. Tabelas de Transação (Pedidos)

CREATE TABLE tbl_pedido (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    data_pedido DATE NOT NULL,
    status_pedido ENUM('EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO') NOT NULL,
    valor_total DECIMAL(10, 2) NULL,
    id_cliente INT NOT NULL,
    id_organizador INT NULL,
    FOREIGN KEY (id_cliente) REFERENCES tbl_cliente (id_cliente),
    FOREIGN KEY (id_organizador) REFERENCES tbl_organizador (id_organizador)
);

CREATE TABLE tbl_item_pedido (
    id_item_pedido INT PRIMARY KEY AUTO_INCREMENT,
    quantidade INT NOT NULL,
    id_pedido INT NOT NULL,
    id_ingresso INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES tbl_pedido (id_pedido),
    FOREIGN KEY (id_ingresso) REFERENCES tbl_ingresso (id_ingresso)
);

-- 7. Tabelas de Relacionamento N:N

CREATE TABLE tbl_organizador_evento (
    id_organizador_evento INT PRIMARY KEY AUTO_INCREMENT,
    data_inscricao DATE NOT NULL, -- Mudei datetime para date para consistencia, ou mantenha datetime
    id_organizador INT NOT NULL,
    id_evento INT NOT NULL,
    FOREIGN KEY (id_organizador) REFERENCES tbl_organizador (id_organizador),
    FOREIGN KEY (id_evento) REFERENCES tbl_evento (id_evento)
);

CREATE TABLE tbl_cliente_evento (
    id_cliente_evento INT PRIMARY KEY AUTO_INCREMENT,
    data_inscricao DATETIME NOT NULL,
    id_cliente INT NOT NULL,
    id_evento INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES tbl_cliente (id_cliente),
    FOREIGN KEY (id_evento) REFERENCES tbl_evento (id_evento)
);

-- ==========================================================
-- INSERÇÃO DE DADOS (DML)
-- ==========================================================

-- 1. Gêneros
INSERT INTO tbl_genero (nome) VALUES 
('Homem'),
('Mulher'),
('Prefiro não dizer');

-- 2. Assuntos
INSERT INTO tbl_assunto (nome) VALUES 
('Música Eletrônica'),
('Gastronomia'),
('Tecnologia e Inovação'),
('Arte e Cultura');

-- 3. Categorias
INSERT INTO tbl_categoria (nome) VALUES 
('Festival'),
('Workshop'),
('Feira'),
('Palestra');

-- 4. Estados (Necessário criar pois tbl_endereco depende deles)
INSERT INTO tbl_estado (sigla) VALUES 
('SP'), -- ID 1
('RJ'); -- ID 2

-- 5. Eventos (Necessário criar pois tbl_endereco e tbl_ingresso dependem deles)
-- Criando eventos fictícios para os IDs 1 e 2 funcionarem nos inserts abaixo
INSERT INTO tbl_evento (nome, descricao, data_inicio, hora_inicio, data_termino, hora_termino, banner, quantidade_ingresso, is_visible, id_categoria, id_assunto) VALUES 
('Tomorrowland Brasil', 'Festival de música', '2023-10-12', '14:00:00', '2023-10-14', '02:00:00', 'banner1.jpg', 10000, TRUE, 1, 1), -- ID 1
('Rio Gastronomia', 'Workshop de Culinária', '2023-11-20', '10:00:00', '2023-11-20', '18:00:00', 'banner2.jpg', 500, TRUE, 2, 2);  -- ID 2

-- 6. Endereços
INSERT INTO tbl_endereco (cep, logradouro, complemento, numero, bairro, cidade, id_estado, id_evento) VALUES
('01310100', 'Av. Paulista', 'Cj 10', '1000', 'Bela Vista', 'São Paulo', 1, 2),
('20040030', 'Rua da Assembleia', NULL, '50', 'Centro', 'Rio de Janeiro', 2, 2);

-- 7. Ingressos
INSERT INTO tbl_ingresso (nome, preco_unitario, is_ativo, id_evento) VALUES
('Passaporte 3 dias', 999.00, TRUE, 1),
('Dia 1', 399.00, TRUE, 1),
('Acesso Workshop', 150.00, TRUE, 2);

INSERT INTO tbl_cliente_evento (data_inscricao, id_cliente, id_evento) VALUES
(NOW(), 24, 2)
;

INSERT INTO tbl_item_pedido (quantidade, id_pedido, id_ingresso) VALUES
(20, 10, 4);

-- ==========================================================
-- CONSULTAS DE VERIFICAÇÃO
-- ==========================================================

select * from tbl_assunto;
select * from tbl_categoria;
select * from tbl_genero;
select * from tbl_estado;
select * from tbl_evento;
select * from tbl_endereco;
select * from tbl_ingresso;
select * from tbl_cliente;
select * from tbl_organizador;
select * from tbl_pedido;
select * from tbl_cliente_evento;
select * from tbl_organizador_evento;
select * from tbl_item_pedido;

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

CREATE TRIGGER trg_AI_item_pedido_diminuir_estoque
AFTER INSERT ON tbl_item_pedido
FOR EACH ROW
BEGIN
    DECLARE evento_id INT;
    SELECT id_evento INTO evento_id FROM tbl_ingresso WHERE id_ingresso = NEW.id_ingresso;

    UPDATE tbl_evento
    SET quantidade_ingressos_comprado = quantidade_ingressos_comprado + NEW.quantidade
    WHERE id_evento = evento_id;
END$$

DELIMITER ;

drop trigger trg_AI_item_pedido_diminuir_estoque;

DELIMITER $$

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

CREATE TRIGGER trg_delete_evento
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

CREATE TRIGGER trg_delete_evento
BEFORE DELETE ON tbl_evento
FOR EACH ROW
BEGIN
    -- Isso é destrutivo e irreversível
    DELETE FROM tbl_cliente_evento WHERE id_evento = OLD.id_evento;
    DELETE FROM tbl_organizador_evento WHERE id_evento = OLD.id_evento;
    DELETE FROM tbl_ingresso WHERE id_evento = OLD.id_evento;
    DELETE FROM tbl_endereco WHERE id_evento = OLD.id_evento;
END$$

DELIMITER ;


DROP TRIGGER IF EXISTS trg_BI_item_pedido_validar_quantidade_estoque;

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
        e.capacidade, -- <--- SUBSTITUA PELO NOME CORRETO QUE VC ACHOU NO 'DESCRIBE'
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


select * from tbl_item_pedido;

INSERT INTO tbl_item_pedido (quantidade, id_pedido, id_ingresso)
        VALUES( 10,'31',
                '4');
