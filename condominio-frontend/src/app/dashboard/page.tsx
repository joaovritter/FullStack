"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link"; // Importe o Link

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // PROTEÇÃO DE ROTA: Executa assim que abre a página
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Se não tem token, manda para o login imediatamente
      router.replace("/login");
    } else {
      setLoading(false); // Se tem token, libera o visual da página
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Usamos o window.location para garantir que o estado do browser seja limpo
    window.location.href = "/login";
  };

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

  // Enquanto verifica o token, não mostra nada (evita o "piscar" da dashboard)
  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Condo<span className="text-blue-600">Admin</span>
          </h1>
        </div>
        
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          Sair da conta
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Painel de Controle</h2>
          <p className="text-slate-500 mt-1">Gerencie as operações do condomínio.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all overflow-hidden"
            >
              <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10 ${item.color} group-hover:scale-[3] transition-transform duration-500`}></div>
              <div className="relative z-10">
                <div className={`w-10 h-1 rounded-full mb-4 ${item.color}`}></div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Acessar módulo</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}