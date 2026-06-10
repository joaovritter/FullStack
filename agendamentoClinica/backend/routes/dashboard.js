// ============================================================================
//  routes/dashboard.js  —  Endpoints de análise/gestão (estilo Power BI)
// ============================================================================
const express = require('express');
const pool = require('../db');
const EstatisticaService = require('../services/EstatisticaService');

const router = express.Router();

// GET /api/dashboard/resumo            -> KPIs principais
// GET /api/dashboard/faturamento-mensal
// GET /api/dashboard/por-procedimento
// GET /api/dashboard/por-forma-pagamento
// GET /api/dashboard/por-status
// GET /api/dashboard/caixa             -> extrato financeiro (concluídos)

router.get('/resumo', async (req, res) => {
    try {
        const service = new EstatisticaService(pool);
        res.json(await service.resumo());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/faturamento-mensal', async (req, res) => {
    try {
        const service = new EstatisticaService(pool);
        res.json(await service.faturamentoMensal());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/por-procedimento', async (req, res) => {
    try {
        const service = new EstatisticaService(pool);
        res.json(await service.porProcedimento());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/por-forma-pagamento', async (req, res) => {
    try {
        const service = new EstatisticaService(pool);
        res.json(await service.porFormaPagamento());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/por-status', async (req, res) => {
    try {
        const service = new EstatisticaService(pool);
        res.json(await service.porStatus());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/caixa', async (req, res) => {
    try {
        const service = new EstatisticaService(pool);
        res.json(await service.caixa());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
