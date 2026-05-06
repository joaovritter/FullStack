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

            // Calcular totais de receita e despesa
            const receita = (contasReceber.data || []).reduce(
                (sum: number, item: ContaReceber) => sum + (item.VALOR || 0),
                0
            );

            const despesa = (contasPagar.data || []).reduce(
                (sum: number, item: ContaPagar) => sum + (item.VALOR || 0),
                0
            );

            return {
                moradores: (moradores.data || []).length,
                funcionarios: (funcionarios.data || []).length,
                comunicados: (comunicados.data || []).length,
                reservas: (reservas.data || []).length,
                unidades: (unidades.data || []).length,
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