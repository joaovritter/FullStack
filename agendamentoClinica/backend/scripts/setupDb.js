// ============================================================================
//  scripts/setupDb.js  —  Cria o banco clinica_db (se não existir) e roda o
//  schema.sql (tabelas + carga inicial).
//
//  Uso:  npm run db:setup
// ============================================================================
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const cfg = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
};
const DB_NAME = process.env.DB_NAME || 'clinica_db';

async function main() {
    // 1. Conecta no banco "postgres" para poder criar o clinica_db.
    const admin = new Client({ ...cfg, database: 'postgres' });
    await admin.connect();

    const existe = await admin.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [DB_NAME]
    );
    if (existe.rowCount === 0) {
        await admin.query(`CREATE DATABASE ${DB_NAME}`);
        console.log(`Banco "${DB_NAME}" criado.`);
    } else {
        console.log(`Banco "${DB_NAME}" já existe.`);
    }
    await admin.end();

    // 2. Conecta no clinica_db e executa o schema.sql.
    const db = new Client({ ...cfg, database: DB_NAME });
    await db.connect();
    const sql = fs.readFileSync(
        path.join(__dirname, '..', 'sql', 'schema.sql'),
        'utf8'
    );
    await db.query(sql);
    console.log('Schema e carga inicial aplicados com sucesso!');
    await db.end();
}

main().catch((err) => {
    console.error('Falha no setup do banco:', err.message);
    process.exit(1);
});
