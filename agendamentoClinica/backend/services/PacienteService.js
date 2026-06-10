// ============================================================================
//  PacienteService.js  —  Classe de serviço do PACIENTE (CRUD)
//
//  Mesmo padrão da aula: recebe "conexao" no construtor.
//  Como "pool.query" e "client.query" do pg têm a MESMA interface, esta classe
//  funciona tanto com o pool (leituras simples) quanto com a conexão de uma
//  transação (escritas controladas pelo Orquestrador).
// ============================================================================
class PacienteService {
    constructor(conexao) {
        this.conexao = conexao;
    }

    async listar() {
        const result = await this.conexao.query(
            'SELECT * FROM PACIENTES ORDER BY NOME ASC'
        );
        return result.rows;
    }

    async buscarPorId(id) {
        const result = await this.conexao.query(
            'SELECT * FROM PACIENTES WHERE ID = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async inserir({ nome, email, telefone, data_nascimento }) {
        const query = `
            INSERT INTO PACIENTES (NOME, EMAIL, TELEFONE, DATA_NASCIMENTO)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const result = await this.conexao.query(query, [
            nome,
            email,
            telefone || null,
            data_nascimento || null,
        ]);
        return result.rows[0];
    }

    async atualizar(id, { nome, email, telefone, data_nascimento }) {
        const query = `
            UPDATE PACIENTES
               SET NOME = $1, EMAIL = $2, TELEFONE = $3, DATA_NASCIMENTO = $4
             WHERE ID = $5
            RETURNING *`;
        const result = await this.conexao.query(query, [
            nome,
            email,
            telefone || null,
            data_nascimento || null,
            id,
        ]);
        if (result.rowCount === 0) {
            throw new Error('Paciente não encontrado.');
        }
        return result.rows[0];
    }

    async excluir(id) {
        const result = await this.conexao.query(
            'DELETE FROM PACIENTES WHERE ID = $1',
            [id]
        );
        if (result.rowCount === 0) {
            throw new Error('Paciente não encontrado.');
        }
    }
}

module.exports = PacienteService;
