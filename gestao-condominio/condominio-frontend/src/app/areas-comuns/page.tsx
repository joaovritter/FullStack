"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import PageLayout from "../../components/PageLayout";

export default function AreasComunsPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [form, setForm] = useState({ NOME_AREA: "", DESCR_AREA: "", CAPACIDADE: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/areas-comuns");
      setAreas(res.data);
    } catch (error) {
      console.error("Erro ao carregar áreas comuns:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/areas-comuns/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/areas-comuns", form);
      }
      setForm({ NOME_AREA: "", DESCR_AREA: "", CAPACIDADE: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar área comum:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir esta área comum?")) {
      try {
        await api.delete(`/areas-comuns/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir área comum:", error);
      }
    }
  };

  const handleEdit = (a: any) => {
    setForm({ NOME_AREA: a.NOME_AREA, DESCR_AREA: a.DESCR_AREA, CAPACIDADE: a.CAPACIDADE });
    setEditId(a.ID_AREA_COMUM);
  };

  return (
    <PageLayout
      title="Áreas Comuns"
      description="Gestão de espaços compartilhados do condomínio (salão de festas, churrasqueiras, praças)."
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          {editId ? "Editar Área Comum" : "Nova Área Comum"}
        </h3>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ NOME_AREA: "", DESCR_AREA: "", CAPACIDADE: "" });
            }}
            className="text-sm font-bold text-slate-500 hover:text-[#A0006D] transition-colors"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Nome da Área <span className="text-[#A0006D]">*</span>
          </label>
          <input
            required
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            placeholder="Ex: Salão de Festas" value={form.NOME_AREA}
            onChange={e => setForm({ ...form, NOME_AREA: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Descrição Opcional
          </label>
          <input
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            placeholder="Detalhes ou regras de uso..." value={form.DESCR_AREA}
            onChange={e => setForm({ ...form, DESCR_AREA: e.target.value })}
          />
        </div>

        <div className="flex-[0.5] min-w-[120px]">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Capacidade
          </label>
          <input
            type="number"
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            placeholder="Ex: 50" value={form.CAPACIDADE}
            onChange={e => setForm({ ...form, CAPACIDADE: e.target.value })}
          />
        </div>

        <div className="flex items-end mt-4 md:mt-0">
          <button
            type="submit"
            className="w-full md:w-auto bg-[#4A8BDF] hover:bg-[#3a70b3] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[#4A8BDF]/20 transition-all transform hover:-translate-y-0.5"
          >
            {editId ? "Atualizar" : "Salvar Área"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 rounded-tl-xl">ID Área</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Nome do Espaço</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Descrição</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Capacidade</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 text-right rounded-tr-xl">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody>
            {areas.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">Nenhuma área comum encontrada.</td>
              </tr>
            ) : (
              areas.map((a: any) => (
                <tr key={a.ID_AREA_COMUM} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-800">#{a.ID_AREA_COMUM}</td>
                  <td className="py-4 px-6 font-medium text-slate-800">{a.NOME_AREA}</td>
                  <td className="py-4 px-6 text-slate-600 text-sm max-w-xs truncate" title={a.DESCR_AREA}>
                    {a.DESCR_AREA || "-"}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold w-fit">
                      {a.CAPACIDADE ? `${a.CAPACIDADE} Pessoas` : 'N/D'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(a)} className="p-2 text-slate-400 hover:text-[#4A8BDF] hover:bg-[#4A8BDF]/10 rounded-lg transition-colors" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(a.ID_AREA_COMUM)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
