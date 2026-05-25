"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import PageLayout from "../../components/PageLayout";

export default function ContasPagarPage() {
  const [contas, setContas] = useState<any[]>([]);
  const [form, setForm] = useState({ ID_FORNECEDOR: "", DESCRICAO: "", VALOR: "", DATA_VENCIMENTO: "", STATUS: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/contas-pagar");
      setContas(res.data);
    } catch (error) {
      console.error("Erro ao carregar contas a pagar:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/contas-pagar/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/contas-pagar", form);
      }
      setForm({ ID_FORNECEDOR: "", DESCRICAO: "", VALOR: "", DATA_VENCIMENTO: "", STATUS: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar conta a pagar:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir esta conta a pagar?")) {
      try {
        await api.delete(`/contas-pagar/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir conta a pagar:", error);
      }
    }
  };

  const handleEdit = (c: any) => {
    setForm({ ID_FORNECEDOR: c.ID_FORNECEDOR, DESCRICAO: c.DESCRICAO, VALOR: c.VALOR, DATA_VENCIMENTO: c.DATA_VENCIMENTO, STATUS: c.STATUS });
    setEditId(c.ID_CONTA_PAGAR);
  };

  return (
    <PageLayout
      title="Contas a Pagar"
      description="Gestão de despesas, pagamentos a fornecedores e obrigações do condomínio."
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          {editId ? "Editar Despesa" : "Nova Despesa"}
        </h3>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ ID_FORNECEDOR: "", DESCRICAO: "", VALOR: "", DATA_VENCIMENTO: "", STATUS: "" });
            }}
            className="text-sm font-bold text-slate-500 hover:text-[#A0006D] transition-colors"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              ID Fornecedor <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
              placeholder="Ex: 2" value={form.ID_FORNECEDOR}
              onChange={e => setForm({ ...form, ID_FORNECEDOR: e.target.value })}
            />
          </div>
          <div className="flex-[2]">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Descrição da Despesa <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
              placeholder="Ex: Manutenção dos Elevadores" value={form.DESCRICAO}
              onChange={e => setForm({ ...form, DESCRICAO: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Valor (R$) <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required type="number" step="0.01"
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
              placeholder="Ex: 1200.00" value={form.VALOR}
              onChange={e => setForm({ ...form, VALOR: e.target.value })}
            />
          </div>
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Vencimento <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required type="date"
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800"
              value={form.DATA_VENCIMENTO}
              onChange={e => setForm({ ...form, DATA_VENCIMENTO: e.target.value })}
            />
          </div>
          <div className="flex-1 w-full relative">
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
          <div className="md:ml-auto w-full md:w-auto mt-4 md:mt-0">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#4A8BDF] hover:bg-[#3a70b3] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[#4A8BDF]/20 transition-all transform hover:-translate-y-0.5"
            >
              {editId ? "Atualizar" : "Salvar Despesa"}
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 rounded-tl-xl">ID Despesa</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Descrição / Fornecedor</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Valor</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Status / Vencimento</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 text-right rounded-tr-xl">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody>
            {contas.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">Nenhuma conta a pagar registrada.</td>
              </tr>
            ) : (
              contas.map((c: any) => (
                <tr key={c.ID_CONTA_PAGAR} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-800">#{c.ID_CONTA_PAGAR}</td>
                  <td className="py-4 px-6 font-medium text-slate-800">
                    <span className="block">{c.DESCRICAO}</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold w-fit mt-1 block">
                      Fornecedor {c.ID_FORNECEDOR}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800">
                    R$ {Number(c.VALOR).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium flex flex-col gap-1 items-start mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.STATUS === 'PAGO' ? 'bg-emerald-100 text-emerald-700' :
                        c.STATUS === 'ATRASADO' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                      }`}>
                      {c.STATUS}
                    </span>
                    <span className="text-slate-400 text-xs">Venc: {c.DATA_VENCIMENTO}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-[#4A8BDF] hover:bg-[#4A8BDF]/10 rounded-lg transition-colors" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(c.ID_CONTA_PAGAR)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
