// src/services/dashboardService.ts
import api from "./api";

interface ContaReceber {
    VALOR?: number;
}

interface ContaPagar {
    VALOR?: number;
}

export const dashboardService = {
    async getStats() {
        try {
            // Buscar dados em paralelo
            const [moradores, funcionarios, comunicados, reservas, unidades, contasReceber, contasPagar] =
                await Promise.all([
                    api.get("/moradores").catch(() => ({ data: [] })),
                    api.get("/funcionarios").catch(() => ({ data: [] })),
                    api.get("/comunicados").catch(() => ({ data: [] })),
                    api.get("/reservas").catch(() => ({ data: [] })),
                    api.get("/unidades").catch(() => ({ data: [] })),
                    api.get("/contas-receber").catch(() => ({ data: [] })),
                    api.get("/contas-pagar").catch(() => ({ data: [] })),
                ]);

            // Helper para garantir que temos um array e calcular o total
            const sumValor = (res: any) => {
                const data = res?.data;
                if (Array.isArray(data)) {
                    return data.reduce((sum: number, item: any) => sum + (Number(item.VALOR) || 0), 0);
                }
                return 0;
            };

            const receita = sumValor(contasReceber);
            const despesa = sumValor(contasPagar);

            return {
                moradores: Array.isArray(moradores.data) ? moradores.data.length : 0,
                funcionarios: Array.isArray(funcionarios.data) ? funcionarios.data.length : 0,
                comunicados: Array.isArray(comunicados.data) ? comunicados.data.length : 0,
                reservas: Array.isArray(reservas.data) ? reservas.data.length : 0,
                unidades: Array.isArray(unidades.data) ? unidades.data.length : 0,
                receita,
                despesa,
                saldo: receita - despesa,
            };
        } catch (error) {
            console.error("Erro ao buscar estatísticas:", error);
            return {
                moradores: 0,
                funcionarios: 0,
                comunicados: 0,
                reservas: 0,
                unidades: 0,
                receita: 0,
                despesa: 0,
                saldo: 0,
            };
        }
    },
};
