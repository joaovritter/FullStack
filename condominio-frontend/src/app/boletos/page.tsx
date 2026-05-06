"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import PageLayout from "../../components/PageLayout";

export default function BoletosPage() {
  const [boletos, setBoletos] = useState<any[]>([]);
  const [form, setForm] = useState({ ID_MORADOR: "", VL_BOLETO: "", DT_VENCIMENTO: "", STATUS: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/boletos");
      setBoletos(res.data);
    } catch (error) {
      console.error("Erro ao carregar boletos:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/boletos/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/boletos", form);
      }
      setForm({ ID_MORADOR: "", VL_BOLETO: "", DT_VENCIMENTO: "", STATUS: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar boleto:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este boleto?")) {
      try {
        await api.delete(`/boletos/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir boleto:", error);
      }
    }
  };

  const handleEdit = (b: any) => {
    setForm({ ID_MORADOR: b.ID_MORADOR, VL_BOLETO: b.VL_BOLETO, DT_VENCIMENTO: b.DT_VENCIMENTO, STATUS: b.STATUS });
    setEditId(b.ID_BOLETO);
  };

  return (
    <PageLayout
      title="Boletos"
      description="Gestão de arrecadação, taxas condominiais e controle de inadimplência."
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          {editId ? "Editar Boleto" : "Novo Boleto"}
        </h3>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ ID_MORADOR: "", VL_BOLETO: "", DT_VENCIMENTO: "", STATUS: "" });
            }}
            className="text-sm font-bold text-slate-500 hover:text-[#A0006D] transition-colors"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex-wrap">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            ID Morador <span className="text-[#A0006D]">*</span>
          </label>
          <input
            required
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            placeholder="ID" value={form.ID_MORADOR}
            onChange={e => setForm({ ...form, ID_MORADOR: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Valor (R$) <span className="text-[#A0006D]">*</span>
          </label>
          <input
            required type="number" step="0.01"
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
            placeholder="Ex: 550.00" value={form.VL_BOLETO}
            onChange={e => setForm({ ...form, VL_BOLETO: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Vencimento <span className="text-[#A0006D]">*</span>
          </label>
          <input
            required type="date"
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800"
            value={form.DT_VENCIMENTO}
            onChange={e => setForm({ ...form, DT_VENCIMENTO: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Status <span className="text-[#A0006D]">*</span>
          </label>
          <select
            required
            className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 cursor-pointer"
            value={form.STATUS}
            onChange={e => setForm({ ...form, STATUS: e.target.value })}
          >
            <option value="">Selecione Status</option>
            <option value="ABERTO">Aberto</option>
            <option value="PAGO">Pago</option>
            <option value="ATRASADO">Atrasado</option>
          </select>
        </div>

        <div className="flex items-end w-full md:w-auto mt-4 md:mt-0">
          <button
            type="submit"
            className="w-full md:w-auto bg-[#4A8BDF] hover:bg-[#3a70b3] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[#4A8BDF]/20 transition-all transform hover:-translate-y-0.5"
          >
            {editId ? "Atualizar" : "Gerar Boleto"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 rounded-tl-xl">Boleto</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Morador</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Valor</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Status / Vencimento</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 text-right rounded-tr-xl">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody>
            {boletos.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">Nenhum boleto registrado.</td>
              </tr>
            ) : (
              boletos.map((b: any) => (
                <tr key={b.ID_BOLETO} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-800">#{b.ID_BOLETO}</td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold w-fit">
                      ID {b.ID_MORADOR}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[#A0006D]">
                    R$ {Number(b.VL_BOLETO).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.STATUS === 'PAGO' ? 'bg-emerald-100 text-emerald-700' :
                        b.STATUS === 'ATRASADO' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                      }`}>
                      {b.STATUS}
                    </span>
                    <span className="text-slate-400 text-xs">Venc: {b.DT_VENCIMENTO}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(b)} className="p-2 text-slate-400 hover:text-[#4A8BDF] hover:bg-[#4A8BDF]/10 rounded-lg transition-colors" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(b.ID_BOLETO)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
