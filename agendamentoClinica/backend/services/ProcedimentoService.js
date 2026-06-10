// ============================================================================
//  ProcedimentoService.js  —  Classe de serviço do PROCEDIMENTO
//  (substitui o MedicoService)
//
//  Mesmo padrão da aula: recebe "conexao" no construtor.
// ============================================================================
class ProcedimentoService {
    constructor(conexao) {
        this.conexao = conexao;
    }

    // Lista os procedimentos ativos (catálogo de tratamentos).
    async listar() {
        const result = await this.conexao.query(
            'SELECT * FROM PROCEDIMENTOS WHERE ATIVO = TRUE ORDER BY NOME ASC'
        );
        return result.rows;
    }

    async buscarPorId(id) {
        const result = await this.conexao.query(
            'SELECT * FROM PROCEDIMENTOS WHERE ID = $1',
            [id]
        );
        return result.rows[0] || null;
    }
}

module.exports = ProcedimentoService;
