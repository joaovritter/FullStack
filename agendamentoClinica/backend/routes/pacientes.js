// ============================================================================
//  routes/pacientes.js  —  CRUD completo de Pacientes
//
//  As leituras usam o pool direto. As escritas (inserir/atualizar/excluir)
//  são envolvidas numa transação via TransacaoBanco para seguir o padrão da
//  aula (PARTE 1) — garantindo commit/rollback.
// ============================================================================
const express = require('express');
const pool = require('../db');
const TransacaoBanco = require('../TransacaoBanco');
const PacienteService = require('../services/PacienteService');

const router = express.Router();

// GET /api/pacientes/listar  -> lista todos
router.get('/listar', async (req, res) => {
    try {
        const service = new PacienteService(pool);
        res.status(200).json(await service.listar());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// GET /api/pacientes/:id  -> busca um
router.get('/:id', async (req, res) => {
    try {
        const service = new PacienteService(pool);
        const paciente = await service.buscarPorId(req.params.id);
        if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado.' });
        res.status(200).json(paciente);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// POST /api/pacientes  -> cria (dentro de transação)
router.post('/', async (req, res) => {
    const transacao = new TransacaoBanco();
    try {
        await transacao.iniciarTransacao();
        const service = new PacienteService(transacao.connection);
        const novo = await service.inserir(req.body);
        await transacao.commit();
        res.status(201).json(novo);
    } catch (erro) {
        await transacao.rollback();
        res.status(500).json({ erro: erro.message });
    }
});

// PUT /api/pacientes/:id  -> atualiza (dentro de transação)
router.put('/:id', async (req, res) => {
    const transacao = new TransacaoBanco();
    try {
        await transacao.iniciarTransacao();
        const service = new PacienteService(transacao.connection);
        const atualizado = await service.atualizar(req.params.id, req.body);
        await transacao.commit();
        res.status(200).json(atualizado);
    } catch (erro) {
        await transacao.rollback();
        res.status(500).json({ erro: erro.message });
    }
});

// DELETE /api/pacientes/:id  -> exclui (dentro de transação)
router.delete('/:id', async (req, res) => {
    const transacao = new TransacaoBanco();
    try {
        await transacao.iniciarTransacao();
        const service = new PacienteService(transacao.connection);
        await service.excluir(req.params.id);
        await transacao.commit();
        res.status(200).json({ mensagem: 'Paciente excluído com sucesso!' });
    } catch (erro) {
        await transacao.rollback();
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
