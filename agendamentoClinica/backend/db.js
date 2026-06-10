// ============================================================================
//  db.js  —  Pool de conexão com o PostgreSQL (node-postgres / "pg")
//
//  No material de aula o pool era criado com mysql2. Aqui ADAPTAMOS para "pg".
//  O pool gerencia várias conexões reutilizáveis. Para uma transação,
//  pegamos UMA conexão específica do pool (pool.connect()) — é isso que a
//  classe TransacaoBanco faz.
// ============================================================================
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
});

// Log simples para confirmar que o pool conectou na subida do servidor.
pool.on('error', (err) => {
    console.error('Erro inesperado no pool do PostgreSQL:', err);
});

module.exports = pool;
