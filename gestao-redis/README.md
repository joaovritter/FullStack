# 🛒 Atacado Sul · Portal Interno (ERP com Redis na nuvem)

Portal interno de uma **distribuidora** onde o colaborador faz login e acessa o
**fechamento consolidado** (faturamento, ticket médio, top produtos, vendas por
categoria/mês) calculado a partir de **~8.000 pedidos**.

Projeto da disciplina de **Desenvolvimento Fullstack**. Stack: **Node.js + Express**
no backend, **React + Vite + Tailwind** no frontend, e **Redis (Upstash Cloud)** como
espinha dorsal — com três papéis:

| Papel do Redis | Onde aparece | Missão do material |
|---|---|---|
| **Rate limiting** | login bloqueia o IP após 4 tentativas (HTTP 429) | Missão 2 |
| **Cache** | o fechamento consolidado é cacheado por 60s | Missão 1 |
| **Sessão** | o login gera um token guardado no Redis com TTL de 1h | — |

## 🔁 Fluxo do sistema

```
Login (rate-limited)  →  token salvo no Redis  →  Dashboard (fechamento cacheado)
```

A 1ª abertura do dashboard "vai ao banco" (agrega os 8.000 pedidos, ~1,5s 🐢).
As próximas vêm do Redis em milissegundos (⚡), até o cache expirar em 60s.

## 📁 Estrutura

```
gestao-redis/
├── backend/
│   ├── index.js      # Express: /api/login, /api/logout, /api/dashboard
│   ├── dados.js      # "banco" em memória: colaboradores + 8.000 pedidos + agregação
│   └── .env          # REDIS_URL do Upstash (não versionado)
└── frontend/
    └── src/
        ├── App.jsx               # controla a sessão (login ↔ dashboard)
        └── components/
            ├── Login.jsx         # tela de acesso (rate limit visível)
            └── Dashboard.jsx     # KPIs, gráficos de barra e top produtos
```

## ▶️ Como rodar

```bash
# terminal 1 — backend
cd backend
npm install
# cole sua Connection String do Upstash no arquivo .env (REDIS_URL=rediss://...)
npm run dev

# terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173. O Vite encaminha `/api/*` para o backend (porta 8080).

## 👤 Colaboradores de teste

| Matrícula | Senha | Cargo |
|---|---|---|
| `12345` | `senha_segura` | Gerente Comercial |
| `20001` | `atacado2026` | Analista Financeiro |
| `30007` | `logistica#1` | Supervisor de Logística |

## 🧪 Roteiro de demonstração

1. **Rate limit:** erre a senha 5× — na 5ª o portal devolve `429` e bloqueia o IP por 60s.
2. **Sessão:** logue com credencial válida → token guardado no Redis libera o dashboard.
3. **Cache:** a 1ª carga do dashboard demora ~1,5s (🐢 banco); clique em *Recarregar* e a
   resposta é instantânea (⚡ Redis) até expirar em 60s.
4. **Logout:** encerra a sessão (apaga o token do Redis).

## 🔧 Decisões de implementação

- URL do Upstash em `.env` (não hardcoded) — não vaza a senha no Git.
- O dashboard agrega pedidos **reais** em memória; o cache existe para não repetir essa
  varredura a cada acesso (representa o alívio sobre o banco relacional).
- Login bem-sucedido apaga o contador de tentativas (`DEL`) para não punir o usuário legítimo.
- Sessões ficam no Redis com TTL — se expirar, o frontend volta sozinho para o login.
- Em testes locais o IP é sempre `::1`, então o bloqueio se comporta como global.
