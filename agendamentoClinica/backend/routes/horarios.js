// ============================================================================
//  routes/horarios.js  —  Horários disponíveis da clínica
// ============================================================================
const express = require('express');
const pool = require('../db');
const HorarioService = require('../services/HorarioService');

const router = express.Router();

// GET /api/horarios/disponiveis  -> horários livres para agendar
router.get('/disponiveis', async (req, res) => {
    try {
        const service = new HorarioService(pool);
        res.status(200).json(await service.listarDisponiveis());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
