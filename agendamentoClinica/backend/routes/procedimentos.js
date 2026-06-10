// ============================================================================
//  routes/procedimentos.js  —  Rotas de Procedimentos (catálogo) + Horários
// ============================================================================
const express = require('express');
const pool = require('../db');
const ProcedimentoService = require('../services/ProcedimentoService');
const HorarioService = require('../services/HorarioService');

const router = express.Router();

// GET /api/procedimentos/listar  -> catálogo de tratamentos
router.get('/listar', async (req, res) => {
    try {
        const service = new ProcedimentoService(pool);
        res.status(200).json(await service.listar());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// GET /api/procedimentos/:id  -> detalhe de um procedimento
router.get('/:id', async (req, res) => {
    try {
        const service = new ProcedimentoService(pool);
        const proc = await service.buscarPorId(req.params.id);
        if (!proc) return res.status(404).json({ erro: 'Procedimento não encontrado.' });
        res.status(200).json(proc);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
