require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');
const { colaboradores, calcularFechamento } = require('./dados');

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', true); // captura o IP real (rate limiting por IP)

// ----------------------------------------------------------------------------
// Redis na nuvem (Upstash). A URL fica no .env para nao expor a senha no Git.
// ----------------------------------------------------------------------------
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err) => console.log('Erro de Conexao Redis:', err));

// Parametros de negocio
const TTL_CACHE = 60;          // segundos que o fechamento fica cacheado
const TTL_SESSAO = 3600;       // 1h de validade do token de login
const MAX_TENTATIVAS = 4;      // tentativas de login por IP
const JANELA_BLOQUEIO = 60;    // segundos de bloqueio apos estourar
const CHAVE_FECHAMENTO = 'erp:fechamento_consolidado';
const LATENCIA_BANCO = 1500;   // simula o tempo de consultar o banco relacional

// ----------------------------------------------------------------------------
// Middleware: exige um token de sessao valido (guardado no Redis).
// ----------------------------------------------------------------------------
async function exigirSessao(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ erro: 'Sessao nao informada' });

  const dados = await redisClient.get(`sessao:${token}`);
  if (!dados) return res.status(401).json({ erro: 'Sessao expirada ou invalida' });

  req.colaborador = JSON.parse(dados);
  next();
}

// ============================================================================
// LOGIN  ->  Missao 2 (rate limit) + criacao de sessao no Redis
// ============================================================================
app.post('/api/login', async (req, res) => {
  const { matricula, senha } = req.body || {};
  const chaveTentativas = `tentativas_login:${req.ip}`;

  try {
    const tentativas = await redisClient.incr(chaveTentativas);
    if (tentativas === 1) await redisClient.expire(chaveTentativas, JANELA_BLOQUEIO);

    if (tentativas > MAX_TENTATIVAS) {
      const ttl = await redisClient.ttl(chaveTentativas);
      return res.status(429).json({
        erro: 'Muitas tentativas. Acesso temporariamente bloqueado.',
        desbloqueioEmSegundos: ttl,
      });
    }

    const colaborador = colaboradores.find(
      (c) => c.matricula === matricula && c.senha === senha
    );

    if (!colaborador) {
      return res.status(401).json({
        erro: 'Matricula ou senha invalidos',
        tentativasRestantes: Math.max(0, MAX_TENTATIVAS - tentativas),
      });
    }

    // Login correto: zera o contador e cria a sessao no Redis
    await redisClient.del(chaveTentativas);
    const token = crypto.randomUUID();
    const sessao = { matricula: colaborador.matricula, nome: colaborador.nome, cargo: colaborador.cargo };
    await redisClient.setEx(`sessao:${token}`, TTL_SESSAO, JSON.stringify(sessao));

    return res.json({ token, colaborador: sessao });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro no servidor de autenticacao' });
  }
});

// ============================================================================
// LOGOUT  ->  invalida a sessao no Redis
// ============================================================================
app.post('/api/logout', exigirSessao, async (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  await redisClient.del(`sessao:${token}`);
  res.json({ mensagem: 'Sessao encerrada' });
});

// ============================================================================
// DASHBOARD  ->  Missao 1 (cache do fechamento consolidado)
// Protegido: so acessa quem tem sessao valida.
// ============================================================================
app.get('/api/dashboard', exigirSessao, async (req, res) => {
  try {
    const inicio = Date.now();
    const emCache = await redisClient.get(CHAVE_FECHAMENTO);

    // HIT: veio do Redis em milissegundos
    if (emCache) {
      return res.json({ origem: 'cache', tempoMs: Date.now() - inicio, fechamento: JSON.parse(emCache) });
    }

    // MISS: simula a latencia do banco relacional + agrega milhares de pedidos
    await new Promise((r) => setTimeout(r, LATENCIA_BANCO));
    const fechamento = calcularFechamento();
    await redisClient.setEx(CHAVE_FECHAMENTO, TTL_CACHE, JSON.stringify(fechamento));

    return res.json({ origem: 'banco', tempoMs: Date.now() - inicio, fechamento });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Falha ao gerar o fechamento' });
  }
});

// ----------------------------------------------------------------------------
async function iniciarServidor() {
  await redisClient.connect();
  console.log('Conectado ao Redis na Nuvem (Upstash)!');
  const porta = process.env.PORT || 8080;
  app.listen(porta, () => console.log(`ERP Atacado Sul rodando na porta ${porta}`));
}

iniciarServidor();
