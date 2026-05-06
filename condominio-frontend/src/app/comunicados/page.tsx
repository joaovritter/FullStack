"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import PageLayout from "../../components/PageLayout";

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<any[]>([]);
  const [form, setForm] = useState({ TITULO: "", MENSAGEM: "", DT_COMUNICADO: "", HR_COMUNICADO: "", TIPO: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/comunicados");
      setComunicados(res.data);
    } catch (error) {
      console.error("Erro ao carregar comunicados:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/comunicados/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/comunicados", form);
      }
      setForm({ TITULO: "", MENSAGEM: "", DT_COMUNICADO: "", HR_COMUNICADO: "", TIPO: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar comunicado:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este comunicado?")) {
      try {
        await api.delete(`/comunicados/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir comunicado:", error);
      }
    }
  };

  const handleEdit = (c: any) => {
    setForm({ TITULO: c.TITULO, MENSAGEM: c.MENSAGEM, DT_COMUNICADO: c.DT_COMUNICADO, HR_COMUNICADO: c.HR_COMUNICADO, TIPO: c.TIPO });
    setEditId(c.ID_COMUNICADO);
  };

  return (
    <PageLayout
      title="Mural de Avisos"
      description="Comunicados oficias da administração para os moradores."
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          {editId ? "Editar Comunicado" : "Novo Comunicado"}
        </h3>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ TITULO: "", MENSAGEM: "", DT_COMUNICADO: "", HR_COMUNICADO: "", TIPO: "" });
            }}
            className="text-sm font-bold text-slate-500 hover:text-[#A0006D] transition-colors"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-[2]">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Título do Comunicado <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
              placeholder="Ex: Manutenção da Piscina" value={form.TITULO}
              onChange={e => setForm({ ...form, TITULO: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Classificação / Tipo
            </label>
            <input
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
              placeholder="Ex: Urgente, Informativo" value={form.TIPO}
              onChange={e => setForm({ ...form, TIPO: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Mensagem Completa <span className="text-[#A0006D]">*</span>
          </label>
          <textarea
            required rows={3}
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400 resize-none"
            placeholder="Detalhes do aviso..." value={form.MENSAGEM}
            onChange={e => setForm({ ...form, MENSAGEM: e.target.value })}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Data de Publicação <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required type="date"
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800"
              value={form.DT_COMUNICADO}
              onChange={e => setForm({ ...form, DT_COMUNICADO: e.target.value })}
            />
          </div>
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Horário <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required type="time"
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800"
              value={form.HR_COMUNICADO}
              onChange={e => setForm({ ...form, HR_COMUNICADO: e.target.value })}
            />
          </div>
          <div className="md:ml-auto w-full md:w-auto mt-4 md:mt-0">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#4A8BDF] hover:bg-[#3a70b3] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[#4A8BDF]/20 transition-all transform hover:-translate-y-0.5"
            >
              {editId ? "Atualizar" : "Publicar Aviso"}
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comunicados.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">Nenhum comunicado publicado no momento.</p>
          </div>
        ) : (
          comunicados.map((c: any) => (
            <div key={c.ID_COMUNICADO} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {c.TIPO || 'Geral'}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {c.DT_COMUNICADO} às {c.HR_COMUNICADO}
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#A0006D] mb-2 leading-tight">{c.TITULO}</h4>
              <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                {c.MENSAGEM}
              </p>

              <div className="absolute bottom-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-[#4A8BDF] hover:bg-[#4A8BDF]/10 rounded-md transition-colors" title="Editar">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button onClick={() => handleDelete(c.ID_COMUNICADO)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Excluir">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
