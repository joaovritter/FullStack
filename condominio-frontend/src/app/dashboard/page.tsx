// src/app/dashboard/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import { dashboardService } from "../services/dashboardService";

interface Stats {
  moradores: number;
  funcionarios: number;
  comunicados: number;
  reservas: number;
  unidades: number;
  receita: number;
  despesa: number;
  saldo: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    moradores: 0,
    funcionarios: 0,
    comunicados: 0,
    reservas: 0,
    unidades: 0,
    receita: 0,
    despesa: 0,
    saldo: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const menuItems = [
    { name: "Pessoas", href: "/pessoas", color: "bg-blue-500" },
    { name: "Moradores", href: "/moradores", color: "bg-indigo-500" },
    { name: "Funcionários", href: "/funcionarios", color: "bg-orange-500" },
    { name: "Fornecedores", href: "/fornecedores", color: "bg-gray-600" },
    { name: "Visitantes", href: "/visitantes", color: "bg-green-500" },
    { name: "Unidades", href: "/unidades", color: "bg-purple-500" },
    { name: "Áreas Comuns", href: "/areas-comuns", color: "bg-emerald-500" },
    { name: "Reservas", href: "/reservas", color: "bg-rose-500" },
    { name: "Boletos", href: "/boletos", color: "bg-amber-500" },
    { name: "Comunicados", href: "/comunicados", color: "bg-sky-500" },
    { name: "Contratos", href: "/contratos", color: "bg-slate-600" },
    { name: "Contas a Pagar", color: "bg-red-500", href: "/contas-pagar" },
    { name: "Contas a Receber", color: "bg-teal-500", href: "/contas-receber" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
      loadStats();
    }
  }, [router]);

  const loadStats = async () => {
    setStatsLoading(true);
    const data = await dashboardService.getStats();
    setStats(data);
    setStatsLoading(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex bg-[#EFFAFD] font-sans">
      <Sidebar items={menuItems} />
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Gestor de Condomínio</h2>
            <p className="text-slate-500 mt-2 font-medium">
              Dashboard gerencial e relatórios de fluxo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadStats} className="bg-white border border-slate-200 text-[#4A8BDF] hover:bg-[#4A8BDF] hover:border-[#4A8BDF] hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#4A8BDF]/20 flex items-center gap-2">
              <svg className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Atualizar Dados
            </button>
          </div>
        </div>

        {/* Hero Section: Financeiro em Destaque */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Média de Receitas"
              value={statsLoading ? "" : formatCurrency(stats.receita)}
              color="green"
              loading={statsLoading}
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Despesas Projetadas"
              value={statsLoading ? "" : formatCurrency(stats.despesa)}
              color="red"
              loading={statsLoading}
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="h-full bg-gradient-to-br from-[#4A8BDF] to-[#3a70b3] rounded-3xl p-8 text-white shadow-xl shadow-[#4A8BDF]/20 relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
              <div className="absolute bottom-0 right-10 w-24 h-24 bg-[#A0006D]/30 rounded-full blur-2xl group-hover:bg-[#A0006D]/40 transition-all duration-700 mix-blend-overlay"></div>

              <div className="relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 mb-2">Balanço Atualizado</p>
                {statsLoading ? (
                  <div className="h-14 w-40 bg-white/20 animate-pulse rounded mt-2"></div>
                ) : (
                  <p className="text-4xl md:text-5xl font-black tracking-tight">{formatCurrency(stats.saldo)}</p>
                )}
              </div>
              <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-sm font-medium text-white/70">Saúde Financeira</p>
                  <p className="font-bold tracking-wide mt-0.5">{stats.saldo >= 0 ? 'Positiva' : 'Necessita Atenção'}</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-sm border border-white/10">
                  {stats.saldo >= 0 ? '✨' : '⚠️'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Operacional */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Visão Operacional</h3>
          <div className="h-px flex-1 bg-slate-200 ml-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Acessos / Moradores"
            value={stats.moradores}
            color="royal"
            loading={statsLoading}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatCard
            title="Funcionários Ativos"
            value={stats.funcionarios}
            color="indigo"
            loading={statsLoading}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <StatCard
            title="Reservas Agendadas"
            value={stats.reservas}
            color="berinjela"
            loading={statsLoading}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <StatCard
            title="Quadro de Avisos"
            value={stats.comunicados}
            color="amber"
            loading={statsLoading}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
          />
        </div>

        {/* Resumo Rápido & Atividades com Estilo Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Capacidade e Ocupação</h3>
              <span className="bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">Unidades Cadastradas</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-[12px] border-slate-50 flex items-center justify-center relative shadow-inner">
                  <svg className="absolute inset-0 w-full h-full text-[#4A8BDF] -rotate-90 transform drop-shadow-md" viewBox="0 0 36 36">
                    <path strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  {statsLoading ? (
                    <div className="h-8 w-12 bg-slate-100 animate-pulse rounded"></div>
                  ) : (
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">{stats.unidades}</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">Mapeamento total da infraestrutura registrada no banco de dados.</p>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                  <span className="text-sm font-semibold text-slate-600">Total Analisado</span>
                  <span className="text-sm font-bold text-slate-900">{statsLoading ? '-' : stats.unidades}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#A0006D] to-[#80005a] rounded-3xl p-8 shadow-xl shadow-[#A0006D]/20 text-white relative overflow-hidden group">
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-[#4A8BDF]/40 rounded-full blur-3xl group-hover:translate-x-4 transition-all duration-700"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Atalhos Operacionais</h3>
                <p className="text-white/80 mb-8 font-medium text-sm">Acesso rápido aos fluxos de rotina mais utilizados no controle da portaria e zeladoria.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md px-4 py-4 rounded-xl text-sm font-bold text-left transition-all shadow-sm flex flex-col gap-2 group/btn">
                  <span className="p-2 bg-white/10 rounded-lg group-hover/btn:bg-white/20 transition-colors w-fit">🛂</span>
                  <span>Controle de Portaria</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md px-4 py-4 rounded-xl text-sm font-bold text-left transition-all shadow-sm flex flex-col gap-2 group/btn">
                  <span className="p-2 bg-white/10 rounded-lg group-hover/btn:bg-white/20 transition-colors w-fit">📦</span>
                  <span>Gestão de Encomendas</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}