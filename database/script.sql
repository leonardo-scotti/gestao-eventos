-- 1. CRIAÇÃO DO BANCO DE DADOS
DROP DATABASE IF EXISTS eventos_unievent;
CREATE DATABASE eventos_unievent;
USE eventos_unievent;

-- 2. CRIAÇÃO DAS TABELAS 

CREATE TABLE tbl_genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(15) NOT NULL
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

CREATE TABLE tbl_estado (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    sigla VARCHAR(2) NOT NULL
);

-- Tabelas Principais (Pessoas e Empresas)
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

-- Tabela de Eventos
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
    quantidade_ingresso_comprado INT NOT NULL DEFAULT 0, -- Adicionado Default 0
    is_visible BOOLEAN NOT NULL,
    id_categoria INT NOT NULL,
    id_assunto INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES tbl_categoria (id_categoria),
    FOREIGN KEY (id_assunto) REFERENCES tbl_assunto (id_assunto)
);

-- Tabelas Dependentes de Eventos
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
    is_ativo BOOLEAN NOT NULL,
    id_evento INT NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES tbl_evento (id_evento)
);

-- Tabelas de Relacionamento (N:N) e Transacionais
CREATE TABLE tbl_organizador_evento (
    id_organizador_evento INT PRIMARY KEY AUTO_INCREMENT,
    data_inscricao DATE NOT NULL,
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

CREATE TABLE tbl_pedido (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    data_pedido DATE NOT NULL,
    status_pedido ENUM('EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO') NOT NULL,
    valor_total DECIMAL(10, 2) NULL DEFAULT 0.00,
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

-- 3. VIEWS

CREATE VIEW views_eventos_ativos_simples AS
SELECT
    e.id_evento,
    e.nome AS evento_nome,
    e.data_inicio,
    e.hora_inicio,
    c.nome AS categoria_nome,
    a.nome AS assunto_nome,
    e.banner
FROM tbl_evento e
JOIN tbl_categoria c ON e.id_categoria = c.id_categoria
JOIN tbl_assunto a ON e.id_assunto = a.id_assunto
WHERE e.is_visible = TRUE;

CREATE VIEW views_ingressos_por_evento AS
SELECT
    i.id_ingresso,
    e.nome AS evento_nome,
    i.nome AS ingresso_nome,
    i.preco_unitario,
    i.is_ativo
FROM tbl_ingresso i
JOIN tbl_evento e ON i.id_evento = e.id_evento;

CREATE VIEW views_enderecos_eventos AS
SELECT
    ed.id_endereco,
    e.nome AS evento_nome,
    ed.logradouro,
    ed.numero,
    ed.bairro,
    ed.cidade,
    est.sigla AS estado
FROM tbl_endereco ed
JOIN tbl_evento e ON ed.id_evento = e.id_evento
JOIN tbl_estado est ON ed.id_estado = est.id_estado;

CREATE VIEW views_pedidos_resumo AS
SELECT
    p.id_pedido,
    c.nome AS cliente_nome,
    p.data_pedido,
    p.status_pedido,
    p.valor_total
FROM tbl_pedido p
JOIN tbl_cliente c ON p.id_cliente = c.id_cliente
ORDER BY p.data_pedido DESC;

CREATE VIEW views_itens_pedidos_detalhe AS
SELECT
    ip.id_item_pedido,
    ip.id_pedido,
    i.nome AS ingresso_nome,
    i.preco_unitario,
    ip.quantidade,
    (ip.quantidade * i.preco_unitario) AS subtotal
FROM tbl_item_pedido ip
JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso;

-- 4. TRIGGERS

DELIMITER $$

-- 4.1. Calcular total do pedido ao INSERIR item
CREATE TRIGGER trg_AI_item_pedido_calcular_total_pedido
AFTER INSERT ON tbl_item_pedido
FOR EACH ROW
BEGIN
    UPDATE tbl_pedido p
    SET p.valor_total = (
        SELECT IFNULL(SUM(ip.quantidade * i.preco_unitario), 0)
        FROM tbl_item_pedido ip
        JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso
        WHERE ip.id_pedido = NEW.id_pedido
    )
    WHERE p.id_pedido = NEW.id_pedido;
END$$

-- 4.2. Calcular total do pedido ao ATUALIZAR item
CREATE TRIGGER trg_AU_item_pedido_calcular_total_pedido
AFTER UPDATE ON tbl_item_pedido
FOR EACH ROW
BEGIN
    UPDATE tbl_pedido p
    SET p.valor_total = (
        SELECT IFNULL(SUM(ip.quantidade * i.preco_unitario), 0)
        FROM tbl_item_pedido ip
        JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso
        WHERE ip.id_pedido = NEW.id_pedido
    )
    WHERE p.id_pedido = NEW.id_pedido;
END$$

-- 4.3. Calcular total do pedido ao DELETAR item
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

-- 4.4. Setar valores padrão para Pedido
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

-- 4.5. Validar estoque ANTES de inserir item
CREATE TRIGGER trg_BI_item_pedido_validar_quantidade_estoque
BEFORE INSERT ON tbl_item_pedido
FOR EACH ROW
BEGIN
    DECLARE total_disponivel INT;
    DECLARE ingressos_comprados INT;
    DECLARE evento_id_do_ingresso INT;

    IF NEW.quantidade <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A quantidade do item deve ser maior que zero.';
    END IF;

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

-- 4.6. Atualizar contagem de estoque APÓS inserir item
CREATE TRIGGER trg_AI_item_pedido_atualizar_estoque
AFTER INSERT ON tbl_item_pedido
FOR EACH ROW
BEGIN
    UPDATE tbl_evento e
    JOIN tbl_ingresso i ON e.id_evento = i.id_evento
    SET e.quantidade_ingresso_comprado = e.quantidade_ingresso_comprado + NEW.quantidade
    WHERE i.id_ingresso = NEW.id_ingresso;
END$$

-- 4.7. Devolver estoque se pedido for CANCELADO
CREATE TRIGGER trg_AU_pedido_cancelado_devolver_estoque
AFTER UPDATE ON tbl_pedido
FOR EACH ROW
BEGIN
    IF OLD.status_pedido <> 'CANCELADO' AND NEW.status_pedido = 'CANCELADO' THEN
        UPDATE tbl_evento e
        JOIN tbl_ingresso i ON e.id_evento = i.id_evento
        JOIN tbl_item_pedido ip ON i.id_ingresso = ip.id_ingresso
        SET e.quantidade_ingresso_comprado = e.quantidade_ingresso_comprado - ip.quantidade
        WHERE ip.id_pedido = NEW.id_pedido;
    END IF;
END$$

-- 4.8. Validar data de início e fim do evento
CREATE TRIGGER trg_BI_evento_validar_data_fim
BEFORE INSERT ON tbl_evento
FOR EACH ROW
BEGIN
    IF TIMESTAMP(NEW.data_inicio, NEW.hora_inicio) >= TIMESTAMP(NEW.data_termino, NEW.hora_termino) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'A data/hora de término do evento deve ser posterior à data/hora de início.';
    END IF;
END$$

-- 4.9. Validações de Cliente (Nascimento e Documento)
CREATE TRIGGER trg_BI_cliente_validar_data_nascimento
BEFORE INSERT ON tbl_cliente
FOR EACH ROW
BEGIN
    IF NEW.data_fundacao IS NULL AND NEW.data_nascimento IS NOT NULL AND NEW.data_nascimento > CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'A data de nascimento não pode ser uma data futura.';
    END IF;
    
    IF NEW.data_fundacao IS NULL AND NEW.cpf IS NULL AND NEW.data_nascimento IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Para pessoa física, é necessário informar CPF ou Data de Nascimento.';
    END IF;
END$$

DELIMITER ;

-- ==========================================
-- 5. INSERTS (DADOS INICIAIS)
-- ==========================================

-- 5.1. Tabelas de Domínio (Lookups)
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
('Esportes e Lazer'),
('Gastronomia');

INSERT INTO tbl_categoria (nome) VALUES 
('Congressos e Seminários'),
('Shows e Festivais'),
('Workshops e Cursos'),
('Eventos Esportivos'),
('Feiras e Exposições');

INSERT INTO tbl_estado (sigla) VALUES 
('SP'), ('RJ'), ('MG'), ('BA'), ('RS');

-- 5.2. Clientes e Organizadores
INSERT INTO tbl_cliente (nome, email, senha, cpf, cnpj, telefone, data_nascimento, data_fundacao, id_genero) VALUES
('Ana Silva', 'ana.s@email.com', '123456', '11122233344', NULL, '11987654321', '1990-05-15', NULL, 1),
('Bruno Santos', 'bruno.s@email.com', '123456', '22233344455', NULL, '21998765432', '1985-11-20', NULL, 2),
('Carlos Souza', 'carlos.s@email.com', '123456', '33344455566', NULL, '31976543210', '1995-03-01', NULL, 2),
('Empresa A Marketing', 'empresa.a@email.com', '123456', NULL, '12345678000190', '41965432109', NULL, '2010-01-01', 5),
('Diana Ferreira', 'diana.f@email.com', '123456', '44455566677', NULL, '51954321098', '2000-08-25', NULL, 1);

INSERT INTO tbl_organizador (nome, email, senha, cpf, cnpj, telefone, data_nascimento, data_fundacao, id_genero) VALUES
('Eventos Prime Ltda', 'prime@eventos.com', '123456', NULL, '00011122233344', '1155551234', NULL, '2015-07-10', 5),
('Gerson Rodrigues', 'gerson@organiza.com', '123456', '55566677788', NULL, '2155555678', '1978-04-12', NULL, 2),
('União Cultural', 'cultura@uniaoc.com', '123456', NULL, '11100033344455', '3155559012', NULL, '2005-02-28', 5),
('Helena Costa', 'helena@eventos.net', '123456', '66677788899', NULL, '4155553456', '1992-09-03', NULL, 1),
('TechMasters Co', 'tech@masters.com', '123456', NULL, '22211144455566', '5155557890', NULL, '2018-11-11', 5);

-- 5.3. Eventos
INSERT INTO tbl_evento (nome, descricao, data_inicio, hora_inicio, data_termino, hora_termino, banner, quantidade_ingresso, quantidade_ingresso_comprado, is_visible, id_categoria, id_assunto) VALUES
('Tech Summit 2026', 'Conferência sobre IA e desenvolvimento.', '2026-03-10', '09:00:00', '2026-03-12', '18:00:00', 'banner_tech.jpg', 500, 50, TRUE, 1, 1),
('Festival de Rock', 'Três dias de rock e música alternativa.', '2026-07-20', '16:00:00', '2026-07-22', '23:00:00', 'banner_rock.jpg', 10000, 500, TRUE, 2, 2),
('Curso de Liderança', 'Desenvolva suas habilidades de gestão.', '2026-04-05', '08:30:00', '2026-04-05', '17:30:00', 'banner_curso.jpg', 50, 5, TRUE, 3, 3),
('Maratona da Cidade', 'Corrida de rua anual.', '2026-05-01', '07:00:00', '2026-05-01', '12:00:00', 'banner_maratona.jpg', 2000, 150, TRUE, 4, 5),
('Feira de Sustentabilidade', 'Exposição de produtos e serviços ecológicos.', '2026-06-15', '10:00:00', '2026-06-18', '20:00:00', 'banner_sustentavel.jpg', 3000, 100, FALSE, 5, 4);

-- 5.4. Ingressos e Endereços
INSERT INTO tbl_ingresso (nome, preco_unitario, is_ativo, id_evento) VALUES
('Passaporte 3 dias', 999.00, TRUE, 1), -- id 1
('Dia 1', 399.00, TRUE, 1),           -- id 2
('Acesso Workshop', 150.00, TRUE, 2), -- id 3 (Cuidado: Evento 2 é Rock, mas aqui é workshop. Mantive script original)
('Pista Comum', 80.00, TRUE, 2),      -- id 4
('VIP', 300.00, TRUE, 2),             -- id 5
('Acesso Geral', 45.00, TRUE, 4),     -- id 6
('Pacote 3 Dias', 450.00, TRUE, 1),   -- id 7
('Entrada Simples', 15.00, TRUE, 5);  -- id 8

INSERT INTO tbl_endereco (cep, logradouro, complemento, numero, bairro, cidade, id_estado, id_evento) VALUES
('01001000', 'Av. Paulista', 'Próximo ao metrô', '1500', 'Bela Vista', 'São Paulo', 1, 1),
('20040030', 'Rua da Assembleia', 'Sala 501', '10', 'Centro', 'Rio de Janeiro', 2, 2),
('30112000', 'Av. Afonso Pena', NULL, '3300', 'Serra', 'Belo Horizonte', 3, 3),
('40020000', 'Praça da Sé', 'Ao lado da Catedral', 'S/N', 'Sé', 'Salvador', 4, 4),
('90010000', 'Rua dos Andradas', 'Edifício Comercial', '123', 'Centro', 'Porto Alegre', 5, 5);

-- 5.5. Relacionamentos
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

-- 5.6. Pedidos
INSERT INTO tbl_pedido (data_pedido, status_pedido, valor_total, id_cliente, id_organizador) VALUES
('2025-11-28', 'FINALIZADO', 0.00, 1, 1), -- Valor será calculado pela trigger
('2025-11-29', 'EM_ANDAMENTO', 0.00, 2, 2),
('2025-11-30', 'CANCELADO', 0.00, 3, 3),
('2025-12-01', 'FINALIZADO', 0.00, 4, 4),
('2025-12-02', 'EM_ANDAMENTO', 0.00, 5, 5);

-- 5.7. Itens do Pedido (Isso disparará as triggers de cálculo e estoque)
-- Obs: Ajustei os IDs de ingresso baseado na ordem de inserção acima para evitar erros
INSERT INTO tbl_item_pedido (quantidade, id_pedido, id_ingresso) VALUES
(2, 1, 7),  -- Pedido 1 comprou 2x Pacote 3 Dias (ID 7)
(1, 2, 4),  -- Pedido 2 comprou 1x Pista Comum (ID 4)
(3, 3, 6),  -- Pedido 3 comprou 3x Acesso Geral (ID 6)
(1, 4, 5),  -- Pedido 4 comprou 1x VIP (ID 5)
(5, 5, 8);  -- Pedido 5 comprou 5x Entrada Simples (ID 8)
