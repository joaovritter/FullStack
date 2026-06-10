// ============================================================================
//  HorarioService.js  —  Classe de serviço do HORÁRIO DISPONÍVEL
//
//  Como a clínica tem UMA profissional (Dra. Camila), os horários são da
//  clínica (sem id_medico). Mesmo padrão da aula: recebe a "conexao" no
//  construtor. Junto com o AgendamentoService participa da MESMA transação.
// ============================================================================
class HorarioService {
    constructor(conexao) {
        this.conexao = conexao; // mesma conexão da transação
    }

    // Busca um horário pelo id (com FOR UPDATE para evitar que dois
    // agendamentos peguem o mesmo horário ao mesmo tempo — reforço pessimista
    // citado na PARTE 2 do material).
    async buscarHorario(idHorario) {
        const result = await this.conexao.query(
            'SELECT * FROM HORARIOS_DISPONIVEIS WHERE ID = $1 FOR UPDATE',
            [idHorario]
        );
        return result.rows[0] || null;
    }

    // Marca o horário como INDISPONÍVEL (ao agendar).
    async marcarIndisponivel(idHorario) {
        await this.conexao.query(
            'UPDATE HORARIOS_DISPONIVEIS SET DISPONIVEL = FALSE WHERE ID = $1',
            [idHorario]
        );
    }

    // Volta o horário para DISPONÍVEL (ao cancelar o agendamento).
    async marcarDisponivel(idHorario) {
        await this.conexao.query(
            'UPDATE HORARIOS_DISPONIVEIS SET DISPONIVEL = TRUE WHERE ID = $1',
            [idHorario]
        );
    }

    // Lista os horários disponíveis da clínica (futuros primeiro).
    async listarDisponiveis() {
        const result = await this.conexao.query(
            'SELECT * FROM HORARIOS_DISPONIVEIS WHERE DISPONIVEL = TRUE ORDER BY DATA_HORA ASC'
        );
        return result.rows;
    }
}

module.exports = HorarioService;
