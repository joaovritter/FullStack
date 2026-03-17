import sequelize from './db.js';
import { DataTypes } from 'sequelize';

//definir modelo
const Usuario = sequelize.define('Usuario', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


//Funcoes CRUD
async function criarUsuario(nome, email) {
    const usuario = await Usuario.create({ nome, email });
    console.log(`Usuario ${usuario} criado`)
}

async function listarUsuarios() {
    const listaUsuarios = await Usuario.findAll();
    console.log(`Lista de Usuarios: ${listaUsuarios}`)
}

async function atualizarUsuario(id, novosDados) {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
        await usuario.update(novosDados);
        console.log(`Usuario ${usuario} atualizado`)
    }
}

async function excluirUsuario(id) {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
        await usuario.destroy();
        console.log(`Usuario ${usuario} excluido`)
    }
}

(async () => {
    try {
        // force: false = cria se não existir
        await sequelize.sync({ force: false });
        console.log('Banco sincronizado!');

        await criarUsuario('João Vitor', 'joao@vitor.com');
        await listarUsuarios();
        await atualizarUsuario(1, { nome: 'Joao Ritter' });
        // await excluirUsuario(1);
    } catch (erro) {
        console.error('Erro ao executar:', erro);
    } finally {
        await sequelize.close();
    }
})();

