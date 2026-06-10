// ============================================================================
//  routes/agendamentos.js  —  Rotas de Agendamentos
//
//  As rotas consomem o OrquestradorAgendamento (igual o material usa o
//  OrquestradorSolicitacao). A lógica de transação fica no orquestrador.
// ============================================================================
const express = require('express');
const pool = require('../db');
const OrquestradorAgendamento = require('../OrquestradorAgendamento');
const AgendamentoService = require('../services/AgendamentoService');

const router = express.Router();

// GET /api/agendamentos/listar  -> lista todos (com JOINs)
router.get('/listar', async (req, res) => {
    try {
        const service = new AgendamentoService(pool); // leitura simples (sem transação)
        res.status(200).json(await service.listarAgendamentos());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// GET /api/agendamentos/proximo  -> próximo agendamento (para a tela Início)
router.get('/proximo', async (req, res) => {
    try {
        const service = new AgendamentoService(pool);
        res.status(200).json(await service.buscarProximo());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// POST /api/agendamentos/agendar  -> agenda (INSERT agendamento + UPDATE horário)
router.post('/agendar', async (req, res) => {
    const { id_paciente, id_procedimento, id_horario, observacoes } = req.body;
    try {
        const id = await OrquestradorAgendamento.agendar(
            id_paciente,
            id_procedimento,
            id_horario,
            observacoes
        );
        res.status(201).json({ mensagem: 'Agendamento criado com sucesso!', id });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// PUT /api/agendamentos/atualizar/:id  -> atualiza com CONTROLE OTIMISTA (versao)
router.put('/atualizar/:id', async (req, res) => {
    const idAgendamento = req.params.id;
    const { status, observacoes, versao } = req.body; // <== versao obrigatória
    try {
        if (versao === undefined || versao === null) {
            return res
                .status(400)
                .json({ erro: 'O campo "versao" é obrigatório (controle otimista).' });
        }
        await OrquestradorAgendamento.atualizar(
            idAgendamento,
            { status, observacoes },
            versao
        );
        res.status(200).json({ mensagem: 'Agendamento atualizado com sucesso!' });
    } catch (erro) {
        const conflito = erro.message.includes('Conflito de concorrência');
        res.status(conflito ? 409 : 500).json({ erro: erro.message });
    }
});

// PUT /api/agendamentos/concluir/:id  -> conclui + registra CAIXA (valor/forma)
router.put('/concluir/:id', async (req, res) => {
    const idAgendamento = req.params.id;
    const { valor, forma_pagamento, observacoes, versao } = req.body;
    try {
        if (versao === undefined || versao === null) {
            return res
                .status(400)
                .json({ erro: 'O campo "versao" é obrigatório (controle otimista).' });
        }
        if (valor === undefined || valor === null || Number(valor) < 0) {
            return res.status(400).json({ erro: 'Informe um "valor" válido para o caixa.' });
        }
        if (!forma_pagamento) {
            return res.status(400).json({ erro: 'Informe a "forma_pagamento".' });
        }
        await OrquestradorAgendamento.concluir(
            idAgendamento,
            { valor: Number(valor), forma_pagamento, observacoes },
            versao
        );
        res.status(200).json({ mensagem: 'Procedimento concluído e caixa registrado!' });
    } catch (erro) {
        const conflito = erro.message.includes('Conflito de concorrência');
        res.status(conflito ? 409 : 500).json({ erro: erro.message });
    }
});

// DELETE /api/agendamentos/cancelar/:id  -> cancela (otimista) + libera horário
router.delete('/cancelar/:id', async (req, res) => {
    const idAgendamento = req.params.id;
    const versao = req.body.versao ?? req.query.versao;
    try {
        if (versao === undefined || versao === null) {
            return res
                .status(400)
                .json({ erro: 'O campo "versao" é obrigatório (controle otimista).' });
        }
        await OrquestradorAgendamento.cancelar(idAgendamento, Number(versao));
        res.status(200).json({ mensagem: 'Agendamento cancelado com sucesso!' });
    } catch (erro) {
        const conflito = erro.message.includes('Conflito de concorrência');
        res.status(conflito ? 409 : 500).json({ erro: erro.message });
    }
});

module.exports = router;
