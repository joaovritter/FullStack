-- ============================================================================
--  CLINICA_DB  —  Ritter&Co Centro Clínico (Agendamento + Gestão)
--  Dra. Camila S. Ritter — Biomédica Esteta
--  Banco: PostgreSQL
--
--  Conceitos da aula aplicados:
--   * A tabela AGENDAMENTOS possui a coluna VERSAO (Parte 2 - Controle de
--     Concorrência Otimista).
--   * Agendar / concluir / cancelar mexem em AGENDAMENTOS e HORARIOS na MESMA
--     transação (Parte 1 - Transações), via OrquestradorAgendamento.
--
--  Gestão/Caixa: ao CONCLUIR um procedimento, registra-se VALOR + FORMA de
--  pagamento + DATA_CONCLUSAO. Esses dados alimentam os dashboards (faturamento,
--  ticket médio, por procedimento, por forma de pagamento, etc.).
-- ============================================================================

DROP TABLE IF EXISTS AGENDAMENTOS CASCADE;
DROP TABLE IF EXISTS HORARIOS_DISPONIVEIS CASCADE;
DROP TABLE IF EXISTS PROCEDIMENTOS CASCADE;
DROP TABLE IF EXISTS PACIENTES CASCADE;

-- ---------------------------------------------------------------------------
-- PACIENTES  (as clientes da clínica)
-- ---------------------------------------------------------------------------
CREATE TABLE PACIENTES (
    ID              SERIAL PRIMARY KEY,
    NOME            VARCHAR(120) NOT NULL,
    EMAIL           VARCHAR(120) UNIQUE NOT NULL,
    TELEFONE        VARCHAR(20),
    DATA_NASCIMENTO DATE,
    DATA_CRIACAO    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- PROCEDIMENTOS  (os tratamentos oferecidos)
--   VALOR_REFERENCIA -> preço interno sugerido (usado para prefill do caixa;
--                       o catálogo público continua "valor sob consulta").
-- ---------------------------------------------------------------------------
CREATE TABLE PROCEDIMENTOS (
    ID               SERIAL PRIMARY KEY,
    NOME             VARCHAR(120) NOT NULL,
    CATEGORIA        VARCHAR(80)  NOT NULL,
    DESCRICAO        TEXT         NOT NULL,
    DETALHE_TECNICO  TEXT,
    DURACAO_MIN      INT,
    BENEFICIOS       TEXT[]       DEFAULT '{}',
    VALOR_REFERENCIA NUMERIC(10,2),
    ATIVO            BOOLEAN      NOT NULL DEFAULT TRUE,
    DATA_CRIACAO     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- HORARIOS_DISPONIVEIS  (vagas da clínica - uma só profissional)
-- ---------------------------------------------------------------------------
CREATE TABLE HORARIOS_DISPONIVEIS (
    ID         SERIAL PRIMARY KEY,
    DATA_HORA  TIMESTAMP NOT NULL,
    DISPONIVEL BOOLEAN NOT NULL DEFAULT TRUE
);

-- ---------------------------------------------------------------------------
-- AGENDAMENTOS
--   VERSAO          -> controle de concorrência otimista (Parte 2).
--   STATUS          -> 'agendado' | 'cancelado' | 'concluido'
--   VALOR           -> valor cobrado (preenchido ao concluir) -> CAIXA
--   FORMA_PAGAMENTO -> 'Dinheiro' | 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito'
--   DATA_CONCLUSAO  -> quando o procedimento foi concluído (para os gráficos)
-- ---------------------------------------------------------------------------
CREATE TABLE AGENDAMENTOS (
    ID              SERIAL PRIMARY KEY,
    ID_PACIENTE     INT NOT NULL,
    ID_PROCEDIMENTO INT NOT NULL,
    ID_HORARIO      INT NOT NULL,
    STATUS          VARCHAR(20) NOT NULL DEFAULT 'agendado',
    OBSERVACOES     TEXT,
    VALOR           NUMERIC(10,2),
    FORMA_PAGAMENTO VARCHAR(40),
    DATA_CONCLUSAO  TIMESTAMP,
    VERSAO          INT NOT NULL DEFAULT 0,          -- <== controle otimista
    DATA_CRIACAO    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_PACIENTE)     REFERENCES PACIENTES(ID),
    FOREIGN KEY (ID_PROCEDIMENTO) REFERENCES PROCEDIMENTOS(ID),
    FOREIGN KEY (ID_HORARIO)      REFERENCES HORARIOS_DISPONIVEIS(ID)
);

-- ===========================================================================
--  CARGA INICIAL DE DADOS
-- ===========================================================================

-- Pacientes -----------------------------------------------------------------
INSERT INTO PACIENTES (NOME, EMAIL, TELEFONE, DATA_NASCIMENTO) VALUES
('Ana Beatriz Souza',   'ana.souza@email.com',      '(55) 99911-0001', '1992-03-14'),
('Carla Eduarda Lima',  'carla.lima@email.com',     '(55) 99911-0002', '1985-07-22'),
('Mariana Oliveira',    'mariana.oliveira@email.com','(55) 99911-0003', '1998-11-30'),
('Juliana Alves',       'juliana.alves@email.com',  '(55) 99911-0004', '1990-01-05'),
('Patrícia Fontes',     'patricia.fontes@email.com','(55) 99911-0005', '1995-09-18');

-- Procedimentos (os 12 tratamentos) — com VALOR_REFERENCIA interno -----------
INSERT INTO PROCEDIMENTOS (NOME, CATEGORIA, DESCRICAO, DETALHE_TECNICO, DURACAO_MIN, BENEFICIOS, VALOR_REFERENCIA) VALUES
('Toxina Botulínica', 'Harmonização Facial',
 'Suavização de linhas de expressão com resultado natural e harmonioso, preservando a autenticidade do seu sorriso e dos seus movimentos faciais.',
 'A toxina botulínica atua bloqueando temporariamente a contração muscular nas regiões tratadas. O resultado é uma aparência mais jovem, descansada e equilibrada, sem perder a expressividade natural do rosto. Tempo de aplicação: 30 a 40 minutos.',
 40, ARRAY['Resultado natural','Sem downtime','Efeito até 6 meses','Sem cirurgia'], 900.00),

('Bioestimulador de Colágeno', 'Rejuvenescimento',
 'Estimula a produção natural de colágeno facial e corporal, restaurando firmeza e redefinindo contornos de forma progressiva e duradoura.',
 'Substâncias bioestimulantes incentivam o organismo a produzir seu próprio colágeno, melhorando progressivamente a qualidade, firmeza e elasticidade da pele. Resultados se intensificam ao longo dos meses e podem durar até 2 anos.',
 60, ARRAY['Estímulo natural','Resultado progressivo','Longa duração','Face e corpo'], 1500.00),

('Skinbooster', 'Hidratação Profunda',
 'Hidratação profunda e luminosidade imediata que devolvem o viço, a saúde e o brilho da pele de dentro para fora.',
 'Ácido hialurônico de baixa densidade injetado diretamente na derme para hidratar as camadas profundas. Resultado: pele visivelmente mais luminosa, firme e com textura refinada logo após as primeiras sessões.',
 45, ARRAY['Hidratação profunda','Luminosidade imediata','Textura refinada','Rosto e colo'], 600.00),

('Preenchimento de Glúteos', 'Contorno Corporal',
 'Volumização estratégica e contorno corporal para resultados harmônicos e proporcionais, respeitando as curvas naturais do seu biotipo.',
 'Ácido hialurônico de alta densidade permite volumizar, projetar e redesenhar os glúteos sem cirurgia. Protocolo personalizado por anatomia e desejo de cada paciente.',
 60, ARRAY['Sem cirurgia','Resultado imediato','Alta segurança','Resultado personalizado'], 3500.00),

('Lipoenzimática', 'Redução de Gordura',
 'Redução de gordura localizada através de enzimas específicas, remodelando o contorno corporal com precisão e sem intervenção cirúrgica.',
 'Fosfatidilcolina e deoxicolato de sódio destroem adipócitos nas regiões tratadas. Indicada para abdômen, flancos, papada, braços e outras áreas. Resultados visíveis a partir da segunda sessão.',
 45, ARRAY['Sem cirurgia','Múltiplas regiões','Resultados progressivos','Seguro e eficaz'], 400.00),

('Intradermoterapia Capilar', 'Saúde Capilar',
 'Protocolo de nutrientes injetáveis que fortalece os fios, reduz a queda e estimula o crescimento capilar saudável e vigoroso.',
 'Vitaminas, minerais, aminoácidos e fatores de crescimento aplicados diretamente no couro cabeludo, nutrindo os folículos pilosos na raiz. Pode ser associado ao PRP para resultados ainda mais expressivos.',
 40, ARRAY['Reduz queda','Nutre folículos','Fios mais fortes','Crescimento ativo'], 350.00),

('Intradermoterapia Corporal', 'Remodelamento Corporal',
 'Ativos potentes aplicados diretamente na região, promovendo melhora visível da textura, firmeza e uniformidade da pele corporal.',
 'Microinjeções de vitaminas, aminoácidos e ativos lipolíticos tratam flacidez, celulite e irregularidades da pele. Protocolo individualizado por região e necessidade.',
 50, ARRAY['Trata flacidez','Melhora celulite','Textura uniforme','Protocolo sob medida'], 450.00),

('Microagulhamento', 'Renovação Celular',
 'Estímulo controlado da renovação celular para tratar cicatrizes, manchas e rejuvenescer profundamente a textura da pele.',
 'Microcanais ativam a cascata de cicatrização natural, estimulando produção de colágeno e elastina. Pode ser associado a vitamina C, PDRN ou fatores de crescimento para potencializar resultados.',
 50, ARRAY['Colágeno natural','Trata cicatrizes','Poros refinados','Pele renovada'], 500.00),

('Peeling Químico', 'Uniformização',
 'Renovação celular acelerada que uniformiza o tom da pele, trata manchas e refina a textura facial com precisão científica.',
 'Ácidos em concentrações controladas removem camadas superficiais da pele. Profundidades superficial, médio ou profundo tratam manchas, melasma, linhas finas e irregularidades de textura.',
 40, ARRAY['Uniformiza o tom','Trata manchas','Textura refinada','Vários tipos'], 300.00),

('PEIM — Microvasos', 'Tratamento Vascular',
 'Tratamento minimamente invasivo para microvasos e telangiectasias, devolvendo uniformidade e leveza à pele das pernas e rosto.',
 'Escleroterapia química com microagulha injeta substâncias esclerosantes diretamente nos microvasos, promovendo fechamento e reabsorção gradual. Alta precisão para vasos de diferentes calibres.',
 40, ARRAY['Alta precisão','Sem laser','Mínima dor','Resultado progressivo'], 350.00),

('Subcisão de Celulite', 'Tratamento de Celulite',
 'Técnica precisa que libera as traves fibróticas responsáveis pela celulite, promovendo uma pele visivelmente mais lisa e uniforme.',
 'Agulha especializada corta as traves fibrosas que puxam a pele para baixo. Pode ser combinada com bioestimuladores e ácido hialurônico para potencializar resultados.',
 60, ARRAY['Libera traves','Pele mais lisa','Combinável','Alta eficácia'], 1200.00),

('Prescrição Domiciliar', 'Skincare Personalizado',
 'Protocolo personalizado de skincare e ativos para potencializar seus resultados clínicos no conforto e rotina da sua casa.',
 'Avaliação da pele, objetivos e rotina de cada paciente para formular protocolo com os ativos certos, nas concentrações ideais e na sequência correta de aplicação.',
 30, ARRAY['Protocolo sob medida','Potencializa resultados','Retarda o envelhecimento','Rotina eficiente'], 200.00);

-- ===========================================================================
--  HORÁRIOS
-- ===========================================================================

-- (A) Horários FUTUROS disponíveis (ids 1..15) ------------------------------
INSERT INTO HORARIOS_DISPONIVEIS (DATA_HORA, DISPONIVEL) VALUES
('2026-06-10 08:00:00', TRUE),
('2026-06-10 09:30:00', TRUE),
('2026-06-10 11:00:00', TRUE),
('2026-06-10 14:00:00', TRUE),
('2026-06-10 16:00:00', TRUE),
('2026-06-11 08:30:00', TRUE),
('2026-06-11 10:00:00', TRUE),
('2026-06-11 14:30:00', TRUE),
('2026-06-11 18:00:00', TRUE),
('2026-06-12 09:00:00', TRUE),
('2026-06-12 13:00:00', TRUE),
('2026-06-12 15:30:00', TRUE),
('2026-06-12 19:00:00', TRUE),
('2026-06-13 08:00:00', TRUE),
('2026-06-13 10:30:00', TRUE);

-- (B) Horários PASSADOS (ids 16..31) já usados por agendamentos concluídos ---
--     (servem de base p/ o histórico do caixa; ficam indisponíveis)
INSERT INTO HORARIOS_DISPONIVEIS (DATA_HORA, DISPONIVEL) VALUES
('2026-01-12 09:00:00', FALSE), -- 16
('2026-01-20 14:00:00', FALSE), -- 17
('2026-02-05 10:00:00', FALSE), -- 18
('2026-02-16 15:00:00', FALSE), -- 19
('2026-02-24 11:00:00', FALSE), -- 20
('2026-03-03 09:30:00', FALSE), -- 21
('2026-03-14 16:00:00', FALSE), -- 22
('2026-03-25 13:00:00', FALSE), -- 23
('2026-04-07 10:00:00', FALSE), -- 24
('2026-04-18 14:30:00', FALSE), -- 25
('2026-04-28 09:00:00', FALSE), -- 26
('2026-05-06 11:00:00', FALSE), -- 27
('2026-05-15 15:30:00', FALSE), -- 28
('2026-05-22 10:00:00', FALSE), -- 29
('2026-05-29 16:00:00', FALSE), -- 30
('2026-06-04 14:00:00', FALSE); -- 31

-- ===========================================================================
--  AGENDAMENTOS
-- ===========================================================================

-- (A) Um agendamento FUTURO já marcado (exemplo) ----------------------------
INSERT INTO AGENDAMENTOS (ID_PACIENTE, ID_PROCEDIMENTO, ID_HORARIO, STATUS, OBSERVACOES)
VALUES (1, 1, 1, 'agendado', 'Primeira sessão - avaliação facial');
UPDATE HORARIOS_DISPONIVEIS SET DISPONIVEL = FALSE WHERE ID = 1;

-- (B) Histórico de agendamentos CONCLUÍDOS (alimenta os dashboards/caixa) ----
--     status='concluido' com VALOR, FORMA_PAGAMENTO e DATA_CONCLUSAO.
INSERT INTO AGENDAMENTOS
    (ID_PACIENTE, ID_PROCEDIMENTO, ID_HORARIO, STATUS, VALOR, FORMA_PAGAMENTO, DATA_CONCLUSAO, OBSERVACOES) VALUES
(2,  1, 16, 'concluido',  900.00, 'Pix',                '2026-01-12 09:40:00', 'Toxina - terço superior'),
(3,  3, 17, 'concluido',  600.00, 'Cartão de Crédito',  '2026-01-20 14:45:00', 'Skinbooster facial'),
(4,  8, 18, 'concluido',  500.00, 'Dinheiro',           '2026-02-05 10:50:00', 'Microagulhamento'),
(1,  2, 19, 'concluido', 1500.00, 'Cartão de Crédito',  '2026-02-16 16:00:00', 'Bioestimulador facial'),
(5,  9, 20, 'concluido',  300.00, 'Pix',                '2026-02-24 11:40:00', 'Peeling de manchas'),
(2,  5, 21, 'concluido',  400.00, 'Cartão de Débito',   '2026-03-03 10:15:00', 'Lipoenzimática papada'),
(3,  4, 22, 'concluido', 3500.00, 'Cartão de Crédito',  '2026-03-14 17:00:00', 'Preenchimento de glúteos'),
(4,  6, 23, 'concluido',  350.00, 'Pix',                '2026-03-25 13:40:00', 'Intradermo capilar'),
(1,  3, 24, 'concluido',  600.00, 'Dinheiro',           '2026-04-07 10:45:00', 'Skinbooster colo'),
(5, 11, 25, 'concluido', 1200.00, 'Cartão de Crédito',  '2026-04-18 15:20:00', 'Subcisão de celulite'),
(2,  1, 26, 'concluido',  900.00, 'Pix',                '2026-04-28 09:40:00', 'Toxina manutenção'),
(3,  7, 27, 'concluido',  450.00, 'Cartão de Débito',   '2026-05-06 11:50:00', 'Intradermo corporal'),
(4, 10, 28, 'concluido',  350.00, 'Dinheiro',           '2026-05-15 16:10:00', 'PEIM microvasos'),
(1,  2, 29, 'concluido', 1500.00, 'Cartão de Crédito',  '2026-05-22 10:50:00', 'Bioestimulador 2ª sessão'),
(5,  3, 30, 'concluido',  600.00, 'Pix',                '2026-05-29 16:40:00', 'Skinbooster facial'),
(2,  8, 31, 'concluido',  500.00, 'Cartão de Crédito',  '2026-06-04 14:45:00', 'Microagulhamento');

-- ===========================================================================
--  Verificação rápida
-- ===========================================================================
-- SELECT STATUS, COUNT(*), SUM(VALOR) FROM AGENDAMENTOS GROUP BY STATUS;
