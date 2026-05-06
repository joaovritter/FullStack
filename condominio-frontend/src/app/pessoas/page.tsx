"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [form, setForm] = useState({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
  const [editId, setEditId] = useState<number | null>(null);

  // Carregar lista
  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      const res = await api.get("/pessoas");
      setPessoas(res.data);
    } catch (error) {
      console.error("Erro ao carregar pessoas:", error);
    }
  };

  // Criar ou editar
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Formatar data para YYYY-MM-DD (formato DATE do MySQL)
      const hoje = new Date();
      const dataCadastro = hoje.toISOString().split('T')[0];

      if (editId) {
        await api.put(`/pessoas/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/pessoas", { ...form, DATA_CADASTRO: dataCadastro });
      }
      setForm({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
      carregarPessoas();
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
    }
  };

  // Excluir
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      try {
        await api.delete(`/pessoas/${id}`);
        carregarPessoas();
      } catch (error) {
        console.error("Erro ao excluir pessoa:", error);
      }
    }
  };

  // Preparar edição
  const handleEdit = (p: any) => {
    setForm({ NOME: p.NOME, TIPO_PESSOA: p.TIPO_PESSOA, CPF_CNPJ: p.CPF_CNPJ });
    setEditId(p.ID_PESSOA);
  };

  return (
    <PageLayout
      title="Pessoas"
      description="Cadastro geral de pessoas físicas e jurídicas relacionadas ao condomínio."
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          {editId ? "Editar Pessoa" : "Nova Pessoa"}
        </h3>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
            }}
            className="text-sm font-bold text-slate-500 hover:text-[#A0006D] transition-colors"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Nome / Razão Social <span className="text-[#A0006D]">*</span>
          </label>
          <input
            required
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            value={form.NOME} placeholder="Nome..."
            onChange={e => setForm({ ...form, NOME: e.target.value })}
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Tipo de Pessoa <span className="text-[#A0006D]">*</span>
          </label>
          <select
            required
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800"
            value={form.TIPO_PESSOA}
            onChange={e => setForm({ ...form, TIPO_PESSOA: e.target.value })}
          >
            <option value="" disabled>Selecione</option>
            <option value="FISICA">Física</option>
            <option value="JURIDICA">Jurídica</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            CPF/CNPJ <span className="text-[#A0006D]">*</span>
          </label>
          <input
            required
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            value={form.CPF_CNPJ} placeholder="000.000.000-00"
            onChange={e => setForm({ ...form, CPF_CNPJ: e.target.value })}
          />
        </div>

        <div className="flex items-end">
          <button type="submit" className="w-full md:w-auto bg-[#4A8BDF] hover:bg-[#3a70b3] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[#4A8BDF]/20 transition-all transform hover:-translate-y-0.5">
            {editId ? "Atualizar Registo" : "Salvar Pessoa"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 rounded-tl-xl">ID Pessoa</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Nome</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Tipo</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Documento</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 text-right rounded-tr-xl">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">Nenhuma pessoa encontrada no sistema.</td>
              </tr>
            ) : (
              pessoas.map((p: any) => (
                <tr key={p.ID_PESSOA} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-800">#{p.ID_PESSOA}</td>
                  <td className="py-4 px-6 font-medium text-slate-800">{p.NOME}</td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold w-fit ${p.TIPO_PESSOA === 'JURIDICA' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      {p.TIPO_PESSOA}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{p.CPF_CNPJ}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-[#4A8BDF] hover:bg-[#4A8BDF]/10 rounded-lg transition-colors" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(p.ID_PESSOA)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}
