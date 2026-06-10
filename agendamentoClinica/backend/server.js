// ============================================================================
//  server.js  —  Entrada da aplicação (Express)  •  Ritter&Co Centro Clínico
//
//    * CORS habilitado para o frontend React
//    * porta 3001
//    * rotas: agendamentos, procedimentos, horarios, pacientes
// ============================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const agendamentosRoutes = require('./routes/agendamentos');
const procedimentosRoutes = require('./routes/procedimentos');
const horariosRoutes = require('./routes/horarios');
const pacientesRoutes = require('./routes/pacientes');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());            // libera o acesso do frontend React
app.use(express.json());    // body parser JSON

// Registro das rotas
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/procedimentos', procedimentosRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota de saúde (health check)
app.get('/api', (req, res) => {
    res.json({ status: 'ok', servico: 'API Ritter&Co — Agendamento de Procedimentos' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
    console.log(`Servidor rodando na porta ${PORT}  ->  http://localhost:${PORT}/api`)
);
