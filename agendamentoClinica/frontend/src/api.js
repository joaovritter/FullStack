// ============================================================================
//  api.js  —  Cliente HTTP (axios) para o backend Express (porta 3001)
//  Ritter&Co — Agendamento de Procedimentos
// ============================================================================
import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_API_PORT || 3001}/api`,
});

// -------- Procedimentos (catálogo) -----------------------------------------
export const listarProcedimentos = () => api.get('/procedimentos/listar');
export const buscarProcedimento = (id) => api.get(`/procedimentos/${id}`);

// -------- Horários ---------------------------------------------------------
export const horariosDisponiveis = () => api.get('/horarios/disponiveis');

// -------- Pacientes (CRUD) -------------------------------------------------
export const listarPacientes = () => api.get('/pacientes/listar');
export const criarPaciente = (dados) => api.post('/pacientes', dados);
export const atualizarPaciente = (id, dados) => api.put(`/pacientes/${id}`, dados);
export const excluirPaciente = (id) => api.delete(`/pacientes/${id}`);

// -------- Agendamentos -----------------------------------------------------
export const listarAgendamentos = () => api.get('/agendamentos/listar');
export const proximoAgendamento = () => api.get('/agendamentos/proximo');
export const agendar = (dados) => api.post('/agendamentos/agendar', dados);
// Importante: estas operações enviam a "versao" (controle otimista).
export const atualizarAgendamento = (id, dados) =>
  api.put(`/agendamentos/atualizar/${id}`, dados);
export const concluirAgendamento = (id, dados) =>
  api.put(`/agendamentos/concluir/${id}`, dados);
export const cancelarAgendamento = (id, versao) =>
  api.delete(`/agendamentos/cancelar/${id}`, { data: { versao } });

// -------- Dashboard / Gestão (análises) ------------------------------------
export const dashResumo = () => api.get('/dashboard/resumo');
export const dashFaturamentoMensal = () => api.get('/dashboard/faturamento-mensal');
export const dashPorProcedimento = () => api.get('/dashboard/por-procedimento');
export const dashPorFormaPagamento = () => api.get('/dashboard/por-forma-pagamento');
export const dashPorStatus = () => api.get('/dashboard/por-status');
export const dashCaixa = () => api.get('/dashboard/caixa');

// Formas de pagamento aceitas (usado no diálogo de conclusão/caixa)
export const FORMAS_PAGAMENTO = ['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito'];

export default api;
