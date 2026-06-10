// ============================================================================
//  TransacaoBanco.js  —  Gerenciador de Transações
//
//  classe do material da aula, adaptada de mysql para pg
//
//  A ideia central permanece: iniciar a transação cria uma conexão EXCLUSIVA,
//  que é compartilhada por todos os services para que tudo execute como UMA
//  única transação (ou tudo é confirmado com commit, ou tudo é desfeito com
//  rollback).
// ============================================================================
const pool = require('./db');

class TransacaoBanco {
    constructor() {
        // "connection" é o client exclusivo desta transação.
        // Mantemos o nome do material para ficar fiel ao padrão da aula.
        this.connection = null;
    }

    // Inicia a transação: obtém uma conexão específica e executa BEGIN.
    async iniciarTransacao() {
        this.connection = await pool.connect(); // conexão exclusiva do pool
        await this.connection.query('BEGIN');   // inicia a transação
    }

    // Confirma a transação (commit) e devolve a conexão ao pool.
    async commit() {
        if (this.connection) {
            await this.connection.query('COMMIT');
            this.connection.release(); // libera a conexão
            this.connection = null;
        }
    }

    // Reverte a transação (rollback) e devolve a conexão ao pool.
    async rollback() {
        if (this.connection) {
            await this.connection.query('ROLLBACK');
            this.connection.release(); // libera a conexão
            this.connection = null;
        }
    }
}

module.exports = TransacaoBanco;
