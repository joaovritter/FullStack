// ============================================================================
//  EstatisticaService.js  —  Consultas agregadas para os DASHBOARDS (gestão)
//
//  Mesmo padrão da aula: recebe "conexao" no construtor. São apenas LEITURAS
//  (SELECT com agregações), então no geral é usado com o pool diretamente.
//
//  Alimenta a tela "Gestão" (estilo Power BI): faturamento, ticket médio,
//  faturamento por mês / por procedimento / por forma de pagamento, e a
//  contagem de agendamentos por status.
// ============================================================================
class EstatisticaService {
    constructor(conexao) {
        this.conexao = conexao;
    }

    // KPIs principais (cards do topo).
    async resumo() {
        const q = `
            SELECT
                COUNT(*)                                              AS total_agendamentos,
                COUNT(*) FILTER (WHERE STATUS = 'agendado')           AS agendados,
                COUNT(*) FILTER (WHERE STATUS = 'concluido')          AS concluidos,
                COUNT(*) FILTER (WHERE STATUS = 'cancelado')          AS cancelados,
                COALESCE(SUM(VALOR) FILTER (WHERE STATUS = 'concluido'), 0) AS faturamento_total,
                COALESCE(AVG(VALOR) FILTER (WHERE STATUS = 'concluido'), 0) AS ticket_medio,
                COALESCE(SUM(VALOR) FILTER (
                    WHERE STATUS = 'concluido'
                      AND date_trunc('month', DATA_CONCLUSAO) = date_trunc('month', CURRENT_DATE)
                ), 0)                                                 AS faturamento_mes
            FROM AGENDAMENTOS`;
        const { rows } = await this.conexao.query(q);
        const r = rows[0];
        // pg devolve NUMERIC como string -> converte para number
        return {
            total_agendamentos: Number(r.total_agendamentos),
            agendados: Number(r.agendados),
            concluidos: Number(r.concluidos),
            cancelados: Number(r.cancelados),
            faturamento_total: Number(r.faturamento_total),
            ticket_medio: Number(r.ticket_medio),
            faturamento_mes: Number(r.faturamento_mes),
        };
    }

    // Faturamento por mês (gráfico de linha/barra).
    async faturamentoMensal() {
        const q = `
            SELECT to_char(date_trunc('month', DATA_CONCLUSAO), 'YYYY-MM') AS mes,
                   SUM(VALOR) AS total,
                   COUNT(*)   AS qtd
              FROM AGENDAMENTOS
             WHERE STATUS = 'concluido' AND DATA_CONCLUSAO IS NOT NULL
          GROUP BY 1
          ORDER BY 1`;
        const { rows } = await this.conexao.query(q);
        return rows.map((r) => ({ mes: r.mes, total: Number(r.total), qtd: Number(r.qtd) }));
    }

    // Faturamento e quantidade por procedimento (ranking).
    async porProcedimento() {
        const q = `
            SELECT pr.NOME AS procedimento,
                   COUNT(*)   AS qtd,
                   SUM(a.VALOR) AS total
              FROM AGENDAMENTOS a
              JOIN PROCEDIMENTOS pr ON pr.ID = a.ID_PROCEDIMENTO
             WHERE a.STATUS = 'concluido'
          GROUP BY pr.NOME
          ORDER BY total DESC`;
        const { rows } = await this.conexao.query(q);
        return rows.map((r) => ({ procedimento: r.procedimento, qtd: Number(r.qtd), total: Number(r.total) }));
    }

    // Faturamento por forma de pagamento (gráfico de pizza).
    async porFormaPagamento() {
        const q = `
            SELECT COALESCE(FORMA_PAGAMENTO, 'Não informado') AS forma,
                   COUNT(*)   AS qtd,
                   SUM(VALOR) AS total
              FROM AGENDAMENTOS
             WHERE STATUS = 'concluido'
          GROUP BY 1
          ORDER BY total DESC`;
        const { rows } = await this.conexao.query(q);
        return rows.map((r) => ({ forma: r.forma, qtd: Number(r.qtd), total: Number(r.total) }));
    }

    // Contagem de agendamentos por status (gráfico de pizza/donut).
    async porStatus() {
        const q = `
            SELECT STATUS AS status, COUNT(*) AS qtd
              FROM AGENDAMENTOS
          GROUP BY STATUS
          ORDER BY qtd DESC`;
        const { rows } = await this.conexao.query(q);
        return rows.map((r) => ({ status: r.status, qtd: Number(r.qtd) }));
    }

    // Lista do CAIXA (agendamentos concluídos com valor) — extrato financeiro.
    async caixa() {
        const q = `
            SELECT a.ID, a.VALOR, a.FORMA_PAGAMENTO, a.DATA_CONCLUSAO,
                   p.NOME  AS paciente_nome,
                   pr.NOME AS procedimento_nome, pr.CATEGORIA
              FROM AGENDAMENTOS a
              JOIN PACIENTES p      ON p.ID  = a.ID_PACIENTE
              JOIN PROCEDIMENTOS pr ON pr.ID = a.ID_PROCEDIMENTO
             WHERE a.STATUS = 'concluido'
          ORDER BY a.DATA_CONCLUSAO DESC`;
        const { rows } = await this.conexao.query(q);
        return rows.map((r) => ({ ...r, valor: Number(r.valor) }));
    }
}

module.exports = EstatisticaService;
