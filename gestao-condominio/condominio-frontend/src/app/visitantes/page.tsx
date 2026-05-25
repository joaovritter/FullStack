"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import PageLayout from "../../components/PageLayout";

export default function VisitantesPage() {
  const [visitantes, setVisitantes] = useState<any[]>([]);
  const [form, setForm] = useState({ ID_PESSOA: "", DOCUMENTO: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/visitantes");
      setVisitantes(res.data);
    } catch (error) {
      console.error("Erro ao carregar visitantes:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/visitantes/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/visitantes", form);
      }
      setForm({ ID_PESSOA: "", DOCUMENTO: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar visitante:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este visitante?")) {
      try {
        await api.delete(`/visitantes/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir visitante:", error);
      }
    }
  };

  const handleEdit = (v: any) => {
    setForm({ ID_PESSOA: v.ID_PESSOA, DOCUMENTO: v.DOCUMENTO });
    setEditId(v.ID_VISITANTE);
  };

  return (
    <PageLayout
      title="Visitantes"
      description="Gestão de controle de acesso e cadastro de visitantes."
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          {editId ? "Editar Visitante" : "Novo Visitante"}
        </h3>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ ID_PESSOA: "", DOCUMENTO: "" });
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
            ID Pessoa <span className="text-[#A0006D]">*</span>
          </label>
          <input
            required
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            placeholder="Digite o ID da Pessoa..."
            value={form.ID_PESSOA}
            onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Documento Exclusivo <span className="text-[#A0006D]">*</span>
          </label>
          <input
            required
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            placeholder="RG, CNH ou Passaporte..."
            value={form.DOCUMENTO}
            onChange={e => setForm({ ...form, DOCUMENTO: e.target.value })}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full md:w-auto bg-[#4A8BDF] hover:bg-[#3a70b3] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[#4A8BDF]/20 transition-all transform hover:-translate-y-0.5"
          >
            {editId ? "Atualizar Registo" : "Salvar Visitante"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 rounded-tl-xl">
                ID Visitante
              </th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">
                Referência Pessoa
              </th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">
                Documento
              </th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 text-right rounded-tr-xl">
                Ações Rápidas
              </th>
            </tr>
          </thead>
          <tbody>
            {visitantes.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">
                  Nenhum visitante encontrado no sistema.
                </td>
              </tr>
            ) : (
              visitantes.map((v: any) => (
                <tr key={v.ID_VISITANTE} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-800">
                    #{v.ID_VISITANTE}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold w-fit">
                      ID {v.ID_PESSOA}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {v.DOCUMENTO}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(v)}
                        className="p-2 text-slate-400 hover:text-[#4A8BDF] hover:bg-[#4A8BDF]/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(v.ID_VISITANTE)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
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
