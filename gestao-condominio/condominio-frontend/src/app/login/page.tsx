"use client";
import { useState } from "react";
import api from "../../services/api"; 
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ CPF_CNPJ: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const { access_token } = res.data;

      localStorage.setItem("token", access_token);
      router.push("/dashboard");
    } catch (error) {
      alert("Falha no login. Verifique CPF e Senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      {/* Card de Login */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Banner Superior com Logo */}
        <div className="bg-white px-8 pt-10 pb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              C
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Condo<span className="text-blue-600">Admin</span>
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Bem-vindo de volta</h2>
          <p className="text-slate-500 mt-2 text-sm">Insira suas credenciais para acessar o painel.</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">CPF ou CNPJ</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
              placeholder="000.000.000-00" 
              onChange={e => setForm({...form, CPF_CNPJ: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Senha</label>
            <input 
              required
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" 
              placeholder="••••••••" 
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? "Autenticando..." : "Entrar no Sistema"}
          </button>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Sistema de Gestão Condominial
            </p>
          </div>
        </form>
      </div>

      {/* Detalhe Decorativo de Fundo */}
      <div className="fixed -bottom-32 -left-32 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="fixed -top-32 -right-32 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>
  );
}