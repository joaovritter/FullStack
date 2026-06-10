# 💆‍♀️ Ritter&Co — Centro Clínico (Sistema de Agendamento)

Sistema de agendamento e **gestão** de **procedimentos estéticos** da clínica da **Dra. Camila S. Ritter — Biomédica Esteta**.
Projeto da disciplina de **Desenvolvimento Fullstack**, aplicando de ponta a ponta:

- **Controle de Transações** (Parte 1 do material) — `TransacaoBanco`, *Services* e *Orquestrador*.
- **Controle de Concorrência Otimista** (Parte 2 do material) — campo **`versao`** na tabela `AGENDAMENTOS`.
- **CRUD completo** com **Node.js + Express + PostgreSQL** (sem ORM — apenas o driver `pg`).
- **Frontend React + Material UI** mobile-first, com tema estético Ritter&Co e animações (framer-motion).
- **Agenda em calendário**, **caixa/financeiro** e **dashboards de gestão** (estilo Power BI) com `@mui/x-charts`.

### ✨ Recursos de gestão
- **Agenda (calendário)** — calendário mensal com marcação dos dias que têm atendimentos + detalhe do dia.
- **Próximo agendamento** em destaque na tela Início.
- **Concluir procedimento** — registra **valor + forma de pagamento** (entrada no caixa), na mesma transação e com controle de versão.
- **Gestão (Power BI)** — KPIs (faturamento total, do mês, ticket médio, concluídos) + gráficos (faturamento por mês, por procedimento, por forma de pagamento, agendamentos por status) + **extrato do caixa**.

> Domínio: clínica com **uma profissional** (Dra. Camila). O que se agenda é um **procedimento** (não um médico), num **horário** da clínica. O padrão de classes do material foi mantido, apenas **adaptado de `mysql2` para `pg`**.

> 💰 Valores: os procedimentos são **"valor sob consulta"** — não há campo de preço no sistema.

---

## 📁 Estrutura do projeto

```
agendamentoClinica/
├── backend/
│   ├── db.js                       # Pool de conexão PostgreSQL (pg)
│   ├── TransacaoBanco.js           # Classe de transação: iniciar / commit / rollback
│   ├── OrquestradorAgendamento.js  # Orquestra a transação entre os services
│   ├── server.js                   # App Express (porta 3001) + CORS
│   ├── services/
│   │   ├── AgendamentoService.js   # inserir / atualizar / concluir / cancelar / listar / proximo
│   │   ├── ProcedimentoService.js  # catálogo dos 12 tratamentos
│   │   ├── HorarioService.js       # buscar / marcar indisponível / liberar
│   │   ├── PacienteService.js      # CRUD de pacientes
│   │   └── EstatisticaService.js   # consultas agregadas dos dashboards (gestão)
│   ├── routes/
│   │   ├── agendamentos.js         # /agendar /atualizar/:id /concluir/:id /cancelar/:id /listar /proximo
│   │   ├── procedimentos.js        # /listar  /:id
│   │   ├── horarios.js             # /disponiveis
│   │   ├── pacientes.js            # GET / POST / PUT / DELETE
│   │   └── dashboard.js            # /resumo /faturamento-mensal /por-procedimento /por-forma-pagamento /por-status /caixa
│   ├── scripts/
│   │   ├── setupDb.js              # cria o banco + roda o schema.sql
│   │   └── testeConcorrencia.js    # simula conflito de versão (controle otimista)
│   └── sql/
│       └── schema.sql              # tabelas + carga inicial (12 procedimentos)
└── frontend/                       # React + Vite + MUI
    └── src/
        ├── pages/                  # Dashboard, Agenda, Agendar, Gestao, Procedimentos, Pacientes
        ├── components/             # Layout (sidebar/bottom-nav), PaginaAnimada
        ├── context/                # FeedbackContext (Snackbar global)
        ├── clinica.js              # identidade da clínica (marca)
        ├── api.js                  # cliente axios (porta da API via VITE_API_PORT, padrão 3001)
        └── theme.js                # tema nude/rosé/dourado
```

---

## 🗄️ 1. Banco de dados (PostgreSQL)

Configuração em `backend/.env`:

```
DB_USER=postgres
DB_PASSWORD=postgres        # <-- ajuste para a SUA senha local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinica_db
```

### Criar o banco e carregar os dados

```bash
cd backend
npm install
npm run db:setup            # cria clinica_db (se não existir) + roda schema.sql
```

Ou manual via psql:

```bash
psql -U postgres -h localhost -c "CREATE DATABASE clinica_db;"
psql -U postgres -h localhost -d clinica_db -f sql/schema.sql
```

### Tabelas

| Tabela                 | Campos principais                                                                                                  |
|------------------------|-------------------------------------------------------------------------------------------------------------------|
| `PACIENTES`            | id, nome, email, telefone, data_nascimento, data_criacao                                                          |
| `PROCEDIMENTOS`        | id, nome, categoria, descricao, detalhe_tecnico, duracao_min, **beneficios[]**, **valor_referencia**, ativo       |
| `HORARIOS_DISPONIVEIS` | id, data_hora, **disponivel**                                                                                      |
| `AGENDAMENTOS`         | id, id_paciente, id_procedimento, id_horario, status, observacoes, **valor**, **forma_pagamento**, **data_conclusao**, **versao**, data_criacao |

> O seed já inclui **16 agendamentos concluídos históricos** (jan–jun) com valores, para os dashboards nascerem populados.

> **Regra crítica:** ao agendar, `AGENDAMENTOS` (INSERT) e `HORARIOS_DISPONIVEIS` (UPDATE `disponivel=false`) são atualizados na **mesma transação** — feito pelo `OrquestradorAgendamento`.

---

## 🔧 2. Backend (Node + Express)

```bash
cd backend
npm install
npm start          # http://localhost:3001
# ou:  npm run dev  (com --watch)
```

### Como o padrão da aula é aplicado

1. **`TransacaoBanco`** abre uma conexão exclusiva do pool e executa `BEGIN`; `commit()` faz `COMMIT` + `release()`; `rollback()` faz `ROLLBACK` + `release()`.
2. Os **Services** recebem essa **mesma conexão** no construtor → todas as queries entram na mesma transação.
3. O **`OrquestradorAgendamento`** inicia a transação, instancia os services, chama os métodos e decide entre `commit` (sucesso) e `rollback` (erro).
4. As **rotas** apenas consomem o orquestrador.

### Controle otimista (campo `versao`)

No `AgendamentoService.atualizarAgendamento`:

```sql
UPDATE AGENDAMENTOS
   SET STATUS = $1, OBSERVACOES = $2, VERSAO = VERSAO + 1
 WHERE ID = $3 AND VERSAO = $4;     -- só atualiza se a versão não mudou
```

Se `rowCount === 0`, outra transação já alterou o registro → lança **erro de conflito** (a rota responde **HTTP 409**).

---

## 🔌 3. Endpoints da API (exemplos)

Base: `http://localhost:3001/api`

### Procedimentos / Horários
```http
GET /api/procedimentos/listar       # catálogo dos 12 tratamentos
GET /api/procedimentos/1            # detalhe de um procedimento
GET /api/horarios/disponiveis        # horários livres para agendar
```

### Gestão / Dashboards
```http
GET /api/dashboard/resumo               # KPIs (faturamento, ticket médio, contagens)
GET /api/dashboard/faturamento-mensal   # faturamento por mês
GET /api/dashboard/por-procedimento     # faturamento/qtd por procedimento
GET /api/dashboard/por-forma-pagamento  # faturamento por forma de pagamento
GET /api/dashboard/por-status           # agendamentos por status
GET /api/dashboard/caixa                # extrato financeiro (concluídos)
```

### Pacientes (CRUD)
```http
GET    /api/pacientes/listar
GET    /api/pacientes/1
POST   /api/pacientes
       { "nome": "Nova Cliente", "email": "nova@email.com",
         "telefone": "(55) 99999-0000", "data_nascimento": "2000-05-20" }
PUT    /api/pacientes/1
       { "nome": "Nome Editado", "email": "edit@email.com" }
DELETE /api/pacientes/1
```

### Agendamentos
```http
GET    /api/agendamentos/listar

POST   /api/agendamentos/agendar
       { "id_paciente": 2, "id_procedimento": 3, "id_horario": 2,
         "observacoes": "Primeira sessão" }

GET    /api/agendamentos/proximo         # próximo agendamento (tela Início)

PUT    /api/agendamentos/atualizar/1     # versao OBRIGATÓRIA (controle otimista)
       { "status": "agendado", "observacoes": "Reagendado", "versao": 0 }

PUT    /api/agendamentos/concluir/1      # conclui + registra CAIXA (versao obrigatória)
       { "valor": 900, "forma_pagamento": "Pix", "observacoes": "ok", "versao": 0 }

DELETE /api/agendamentos/cancelar/1      # versao obrigatória
       { "versao": 1 }
```

Exemplos com `curl` (PowerShell):

```powershell
# Agendar (Skinbooster para a paciente 2 no horário 2)
curl -X POST http://localhost:3001/api/agendamentos/agendar `
  -H "Content-Type: application/json" `
  -d '{ "id_paciente": 2, "id_procedimento": 3, "id_horario": 2 }'

# Atualizar (informando a versão atual)
curl -X PUT http://localhost:3001/api/agendamentos/atualizar/1 `
  -H "Content-Type: application/json" `
  -d '{ "status": "concluido", "observacoes": "ok", "versao": 0 }'
```

---

## 🧪 4. Teste do Controle de Concorrência (conflito de versão)

Script que **simula dois usuários** atualizando o **mesmo agendamento** com a **mesma versão inicial**:

```bash
cd backend
npm run test:concorrencia
```

Saída esperada:

```
=== TESTE DE CONTROLE DE CONCORRÊNCIA OTIMISTA ===

Agendamento #1 | versão atual = 0
Duas atualizações vão usar a MESMA versão inicial:

✅ USUÁRIO A: atualização CONFIRMADA (versão era válida).
✅ USUÁRIO B: conflito detectado corretamente.
   Mensagem: Erro ao atualizar o agendamento: Conflito de concorrência...

Versão final do agendamento #1 = 1
Observação salva: "Alteração feita pela RECEPÇÃO (Usuário A)"
```

> O **Usuário A** vence e incrementa a versão para `1`. O **Usuário B**, que ainda usava a versão `0`, é **bloqueado** — exatamente o comportamento do controle otimista da Parte 2 do material.

**Pela interface:** abra *Agendamentos* em duas abas. Edite o mesmo agendamento na aba 1 (salve). Ao tentar salvar na aba 2 (versão antiga), o backend responde **409** e o app mostra "Conflito de versão".

---

## 🎨 5. Frontend (React + MUI)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

> Deixe o **backend rodando na porta 3001** antes de abrir o frontend.

### Telas
- **Início** — hero com slogan, **próximo agendamento** em destaque, cards de totais e bio da Dra. Camila + contato.
- **Agenda** — **calendário mensal** com dias marcados; ao clicar num dia, lista os atendimentos com detalhe e ações **Concluir** (valor + forma de pagamento), Editar e Cancelar.
- **Agendar** — seleção de paciente, procedimento e horário disponível.
- **Gestão** — KPIs financeiros + **gráficos** (faturamento por mês, por procedimento, por forma de pagamento, status) + aba **Caixa / Extrato**.
- **Procedimentos** — catálogo dos 12 tratamentos, com filtro por categoria e detalhe técnico.
- **Pacientes** — CRUD completo com diálogos de confirmação.

UX: tema nude/rosé/dourado (tipografia Playfair Display + Jost), sidebar (desktop) + bottom navigation (mobile), loading **skeletons**, **Snackbar** de feedback e **diálogos de confirmação**.

> A porta da API no frontend é configurável por `VITE_API_PORT` (padrão **3001**). Ex.: `VITE_API_PORT=4099 npm run dev`.

---

## ▶️ Resumo para rodar tudo

```bash
# 1) Banco + backend
cd backend
npm install
npm run db:setup
npm start            # http://localhost:3001

# 2) Frontend (em outro terminal)
cd frontend
npm install
npm run dev          # http://localhost:5173

# 3) (Opcional) testar o controle de concorrência
cd backend
npm run test:concorrencia
```

---

## 🏥 Identidade da clínica

- **Ritter&Co — Centro Clínico** · Dra. Camila S. Ritter (Biomédica Esteta)
- R. Duque de Caxias, 40 — Palmitinho, RS · Seg–Sex 08:00–21:00
- WhatsApp (55) 99627-7363 · Instagram @camilaritterbiomedica
- *"A ciência de revelar sua melhor versão."*
