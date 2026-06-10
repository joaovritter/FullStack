// ============================================================================
//  scripts/testeConcorrencia.js  —  Teste do CONTROLE DE CONCORRÊNCIA OTIMISTA
//
//  Simula DOIS usuários atualizando o MESMO agendamento usando a MESMA versão
//  inicial. O primeiro vence (incrementa a versão); o segundo detecta o
//  conflito e é rejeitado — comportamento esperado da PARTE 2 do material.
//
//  Uso:  npm run test:concorrencia   (requer db:setup já executado)
// ============================================================================
const pool = require('../db');
const OrquestradorAgendamento = require('../OrquestradorAgendamento');

async function main() {
    console.log('=== TESTE DE CONTROLE DE CONCORRÊNCIA OTIMISTA ===\n');

    // 1. Pega um agendamento existente e sua versão atual.
    const { rows } = await pool.query(
        "SELECT ID, VERSAO FROM AGENDAMENTOS WHERE STATUS = 'agendado' ORDER BY ID LIMIT 1"
    );
    if (rows.length === 0) {
        console.log('Nenhum agendamento para testar. Rode o db:setup.');
        await pool.end();
        return;
    }

    const idAgendamento = rows[0].id;
    const versaoInicial = rows[0].versao;
    console.log(`Agendamento #${idAgendamento} | versão atual = ${versaoInicial}`);
    console.log('Duas atualizações vão usar a MESMA versão inicial:\n');

    // 2. USUÁRIO A — atualiza usando a versão inicial (deve PASSAR).
    try {
        await OrquestradorAgendamento.atualizar(
            idAgendamento,
            { status: 'agendado', observacoes: 'Alteração feita pela RECEPÇÃO (Usuário A)' },
            versaoInicial
        );
        console.log('✅ USUÁRIO A: atualização CONFIRMADA (versão era válida).');
    } catch (e) {
        console.log('❌ USUÁRIO A falhou inesperadamente:', e.message);
    }

    // 3. USUÁRIO B — tenta atualizar com a MESMA versão inicial (deve FALHAR).
    try {
        await OrquestradorAgendamento.atualizar(
            idAgendamento,
            { status: 'concluido', observacoes: 'Alteração feita pela DRA. CAMILA (Usuário B)' },
            versaoInicial // versão já desatualizada!
        );
        console.log('❌ USUÁRIO B: NÃO deveria ter passado!');
    } catch (e) {
        console.log('✅ USUÁRIO B: conflito detectado corretamente.');
        console.log('   Mensagem:', e.message);
    }

    // 4. Mostra a versão final.
    const final = await pool.query(
        'SELECT VERSAO, OBSERVACOES FROM AGENDAMENTOS WHERE ID = $1',
        [idAgendamento]
    );
    console.log(
        `\nVersão final do agendamento #${idAgendamento} = ${final.rows[0].versao}`
    );
    console.log(`Observação salva: "${final.rows[0].observacoes}"`);
    console.log('\n=== FIM DO TESTE ===');

    await pool.end();
}

main().catch((err) => {
    console.error('Erro no teste:', err);
    process.exit(1);
});
