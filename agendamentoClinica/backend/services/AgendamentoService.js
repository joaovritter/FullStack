// ============================================================================
//  AgendamentoService.js  —  Classe de serviço do AGENDAMENTO
//  (equivalente ao ConsultaService; agora referencia PROCEDIMENTO)
//
//  Segue o padrão do material (PARTE 1): recebe a "conexao" no construtor e
//  usa ESSA mesma conexão em todas as queries (faz parte da transação do
//  Orquestrador). Placeholders do pg: $1, $2... (no material mysql2 eram "?").
// ============================================================================
class AgendamentoService {
    constructor(conexao) {
        this.conexao = conexao; // mesma conexão da transação
    }

    // Insere o agendamento e RETORNA o id gerado (RETURNING ID no pg).
    async inserirAgendamento(idPaciente, idProcedimento, idHorario, observacoes) {
        const query = `
            INSERT INTO AGENDAMENTOS (ID_PACIENTE, ID_PROCEDIMENTO, ID_HORARIO, OBSERVACOES)
            VALUES ($1, $2, $3, $4)
            RETURNING ID`;
        const result = await this.conexao.query(query, [
            idPaciente,
            idProcedimento,
            idHorario,
            observacoes || null,
        ]);
        return result.rows[0].id;
    }

    // -----------------------------------------------------------------------
    //  ATUALIZAÇÃO COM CONTROLE DE CONCORRÊNCIA OTIMISTA  (PARTE 2 do material)
    //
    //  Só atualiza se a VERSAO enviada ainda for igual à do banco.
    //  A cada atualização VERSAO = VERSAO + 1. Se rowCount === 0, outra
    //  transação já alterou o registro -> lança erro de conflito.
    // -----------------------------------------------------------------------
    async atualizarAgendamento(idAgendamento, dados, versao) {
        const { status, observacoes } = dados;
        const query = `
            UPDATE AGENDAMENTOS
               SET STATUS = $1,
                   OBSERVACOES = $2,
                   VERSAO = VERSAO + 1
             WHERE ID = $3
               AND VERSAO = $4`;                 // <== checagem da versão
        const result = await this.conexao.query(query, [
            status,
            observacoes || null,
            idAgendamento,
            versao,
        ]);

        if (result.rowCount === 0) {
            throw new Error(
                'Conflito de concorrência: os dados foram alterados por outra transação. Recarregue o agendamento e tente novamente.'
            );
        }
    }

    // -----------------------------------------------------------------------
    //  CONCLUIR  =  registra a realização do procedimento + entrada no CAIXA
    //  (status='concluido' + VALOR + FORMA_PAGAMENTO + DATA_CONCLUSAO),
    //  também com CONTROLE OTIMISTA (VERSAO).
    // -----------------------------------------------------------------------
    async concluirAgendamento(idAgendamento, dados, versao) {
        const { valor, forma_pagamento, observacoes } = dados;
        const query = `
            UPDATE AGENDAMENTOS
               SET STATUS = 'concluido',
                   VALOR = $1,
                   FORMA_PAGAMENTO = $2,
                   OBSERVACOES = COALESCE($3, OBSERVACOES),
                   DATA_CONCLUSAO = CURRENT_TIMESTAMP,
                   VERSAO = VERSAO + 1
             WHERE ID = $4
               AND VERSAO = $5`;
        const result = await this.conexao.query(query, [
            valor,
            forma_pagamento,
            observacoes || null,
            idAgendamento,
            versao,
        ]);

        if (result.rowCount === 0) {
            throw new Error(
                'Conflito de concorrência ao concluir: o agendamento foi alterado por outra transação.'
            );
        }
    }

    // Cancela o agendamento (também com controle de versão otimista).
    async cancelarAgendamento(idAgendamento, versao) {
        const query = `
            UPDATE AGENDAMENTOS
               SET STATUS = 'cancelado',
                   VERSAO = VERSAO + 1
             WHERE ID = $1
               AND VERSAO = $2`;
        const result = await this.conexao.query(query, [idAgendamento, versao]);

        if (result.rowCount === 0) {
            throw new Error(
                'Conflito de concorrência ao cancelar: o agendamento foi alterado por outra transação.'
            );
        }
    }

    // Busca um agendamento pelo id (usado para descobrir o horário ao cancelar).
    async buscarPorId(idAgendamento) {
        const result = await this.conexao.query(
            'SELECT * FROM AGENDAMENTOS WHERE ID = $1',
            [idAgendamento]
        );
        return result.rows[0] || null;
    }

    // Lista todos os agendamentos com paciente, procedimento e horário (JOIN).
    async listarAgendamentos() {
        const query = `
            SELECT a.ID, a.STATUS, a.OBSERVACOES, a.VERSAO, a.DATA_CRIACAO,
                   a.VALOR, a.FORMA_PAGAMENTO, a.DATA_CONCLUSAO,
                   a.ID_PACIENTE,     p.NOME AS PACIENTE_NOME, p.TELEFONE,
                   a.ID_PROCEDIMENTO, pr.NOME AS PROCEDIMENTO_NOME, pr.CATEGORIA,
                                      pr.DURACAO_MIN, pr.VALOR_REFERENCIA,
                   a.ID_HORARIO,      h.DATA_HORA
              FROM AGENDAMENTOS a
              JOIN PACIENTES p             ON p.ID  = a.ID_PACIENTE
              JOIN PROCEDIMENTOS pr        ON pr.ID = a.ID_PROCEDIMENTO
              JOIN HORARIOS_DISPONIVEIS h  ON h.ID  = a.ID_HORARIO
          ORDER BY h.DATA_HORA ASC`;
        const result = await this.conexao.query(query);
        return result.rows;
    }

    // Busca o PRÓXIMO agendamento (status 'agendado' a partir de agora).
    async buscarProximo() {
        const query = `
            SELECT a.ID, a.STATUS, a.OBSERVACOES, a.VERSAO,
                   p.NOME AS PACIENTE_NOME, p.TELEFONE,
                   pr.NOME AS PROCEDIMENTO_NOME, pr.CATEGORIA, pr.DURACAO_MIN,
                   h.DATA_HORA
              FROM AGENDAMENTOS a
              JOIN PACIENTES p             ON p.ID  = a.ID_PACIENTE
              JOIN PROCEDIMENTOS pr        ON pr.ID = a.ID_PROCEDIMENTO
              JOIN HORARIOS_DISPONIVEIS h  ON h.ID  = a.ID_HORARIO
             WHERE a.STATUS = 'agendado'
               AND h.DATA_HORA >= CURRENT_TIMESTAMP
          ORDER BY h.DATA_HORA ASC
             LIMIT 1`;
        const result = await this.conexao.query(query);
        return result.rows[0] || null;
    }
}

module.exports = AgendamentoService;
