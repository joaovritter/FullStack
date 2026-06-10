// ============================================================================
//  OrquestradorAgendamento.js  —  Serviço que ORQUESTRA a transação
//
//  Responsabilidades:
//    1. Iniciar a transação (cria uma conexão exclusiva).
//    2. Instanciar os services com ESSA MESMA conexão.
//    3. Chamar os métodos dos services.
//    4. commit se tudo der certo / rollback se algo falhar.
//
//  Regra crítica: ao AGENDAR, a inserção em AGENDAMENTOS e o UPDATE em
//  HORARIOS_DISPONIVEIS acontecem na MESMA transação.
// ============================================================================
const TransacaoBanco = require('./TransacaoBanco');
const AgendamentoService = require('./services/AgendamentoService');
const HorarioService = require('./services/HorarioService');

class OrquestradorAgendamento {
    // -----------------------------------------------------------------------
    //  AGENDAR  =  INSERT em AGENDAMENTOS  +  UPDATE em HORARIOS_DISPONIVEIS
    // -----------------------------------------------------------------------
    static async agendar(idPaciente, idProcedimento, idHorario, observacoes) {
        const transacao = new TransacaoBanco();
        try {
            // 1. Inicia a transação
            await transacao.iniciarTransacao();
            const conexao = transacao.connection; // conexão da transação

            // 2. Instancia os services com a MESMA conexão
            const agendamentoService = new AgendamentoService(conexao);
            const horarioService = new HorarioService(conexao);

            // 3a. Garante que o horário existe e ainda está disponível
            //     (buscarHorario usa FOR UPDATE -> trava a linha)
            const horario = await horarioService.buscarHorario(idHorario);
            if (!horario) {
                throw new Error('Horário não encontrado.');
            }
            if (!horario.disponivel) {
                throw new Error('Este horário já está ocupado. Escolha outro.');
            }

            // 3b. Insere o agendamento
            const idAgendamento = await agendamentoService.inserirAgendamento(
                idPaciente,
                idProcedimento,
                idHorario,
                observacoes
            );

            // 3c. Marca o horário como indisponível (MESMA transação!)
            await horarioService.marcarIndisponivel(idHorario);

            // 4. Confirma a transação
            await transacao.commit();
            console.log('Agendamento criado com sucesso! ID:', idAgendamento);
            return idAgendamento;
        } catch (erro) {
            // Qualquer falha desfaz TUDO (rollback automático)
            await transacao.rollback();
            throw new Error('Erro ao criar o agendamento: ' + erro.message);
        }
    }

    // -----------------------------------------------------------------------
    //  ATUALIZAR  =  usa CONTROLE DE CONCORRÊNCIA OTIMISTA (campo versao)
    // -----------------------------------------------------------------------
    static async atualizar(idAgendamento, dados, versao) {
        const transacao = new TransacaoBanco();
        try {
            await transacao.iniciarTransacao();
            const conexao = transacao.connection;
            const agendamentoService = new AgendamentoService(conexao);

            // Se a versão divergir, o service lança erro de conflito (cai no catch).
            await agendamentoService.atualizarAgendamento(idAgendamento, dados, versao);

            await transacao.commit();
            console.log('Agendamento atualizado com sucesso! ID:', idAgendamento);
        } catch (erro) {
            await transacao.rollback();
            throw new Error('Erro ao atualizar o agendamento: ' + erro.message);
        }
    }

    // -----------------------------------------------------------------------
    //  CONCLUIR  =  marca o procedimento como realizado e registra o CAIXA
    //              (valor + forma de pagamento), com controle otimista.
    // -----------------------------------------------------------------------
    static async concluir(idAgendamento, dados, versao) {
        const transacao = new TransacaoBanco();
        try {
            await transacao.iniciarTransacao();
            const conexao = transacao.connection;
            const agendamentoService = new AgendamentoService(conexao);

            await agendamentoService.concluirAgendamento(idAgendamento, dados, versao);

            await transacao.commit();
            console.log('Agendamento concluído (caixa registrado)! ID:', idAgendamento);
        } catch (erro) {
            await transacao.rollback();
            throw new Error('Erro ao concluir o agendamento: ' + erro.message);
        }
    }

    // -----------------------------------------------------------------------
    //  CANCELAR  =  UPDATE status='cancelado' (otimista)  +  libera o horário
    //              (tudo na MESMA transação)
    // -----------------------------------------------------------------------
    static async cancelar(idAgendamento, versao) {
        const transacao = new TransacaoBanco();
        try {
            await transacao.iniciarTransacao();
            const conexao = transacao.connection;
            const agendamentoService = new AgendamentoService(conexao);
            const horarioService = new HorarioService(conexao);

            // Descobre o horário associado antes de cancelar
            const agendamento = await agendamentoService.buscarPorId(idAgendamento);
            if (!agendamento) {
                throw new Error('Agendamento não encontrado.');
            }

            // Cancela com checagem de versão (otimista)
            await agendamentoService.cancelarAgendamento(idAgendamento, versao);

            // Libera o horário novamente (MESMA transação)
            await horarioService.marcarDisponivel(agendamento.id_horario);

            await transacao.commit();
            console.log('Agendamento cancelado com sucesso! ID:', idAgendamento);
        } catch (erro) {
            await transacao.rollback();
            throw new Error('Erro ao cancelar o agendamento: ' + erro.message);
        }
    }
}

module.exports = OrquestradorAgendamento;
