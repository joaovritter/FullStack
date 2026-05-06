"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import PageLayout from "../../components/PageLayout";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [form, setForm] = useState({ ID_MORADOR: "", ID_AREA_COMUM: "", DATA_RESERVA: "", HR_INICIO: "", HR_FIM: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/reservas");
      setReservas(res.data);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/reservas/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/reservas", form);
      }
      setForm({ ID_MORADOR: "", ID_AREA_COMUM: "", DATA_RESERVA: "", HR_INICIO: "", HR_FIM: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir esta reserva?")) {
      try {
        await api.delete(`/reservas/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir reserva:", error);
      }
    }
  };

  const handleEdit = (r: any) => {
    setForm({ ID_MORADOR: r.ID_MORADOR, ID_AREA_COMUM: r.ID_AREA_COMUM, DATA_RESERVA: r.DATA_RESERVA, HR_INICIO: r.HR_INICIO, HR_FIM: r.HR_FIM });
    setEditId(r.ID_RESERVA);
  };

  return (
    <PageLayout
      title="Reservas"
      description="Agendamento de áreas comuns para uso dos moradores."
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          {editId ? "Editar Reserva" : "Nova Reserva"}
        </h3>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ ID_MORADOR: "", ID_AREA_COMUM: "", DATA_RESERVA: "", HR_INICIO: "", HR_FIM: "" });
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
              ID Morador <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
              placeholder="Ex: 1" value={form.ID_MORADOR}
              onChange={e => setForm({ ...form, ID_MORADOR: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              ID Área Comum <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800 placeholder-slate-400"
              placeholder="Ex: 5" value={form.ID_AREA_COMUM}
              onChange={e => setForm({ ...form, ID_AREA_COMUM: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Data <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required type="date"
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800"
              value={form.DATA_RESERVA}
              onChange={e => setForm({ ...form, DATA_RESERVA: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Hora Início <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required type="time"
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800"
              value={form.HR_INICIO}
              onChange={e => setForm({ ...form, HR_INICIO: e.target.value })}
            />
          </div>
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Hora Fim <span className="text-[#A0006D]">*</span>
            </label>
            <input
              required type="time"
              className="w-full border border-slate-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4A8BDF] focus:ring-4 focus:ring-[#4A8BDF]/10 transition-all font-medium text-slate-800"
              value={form.HR_FIM}
              onChange={e => setForm({ ...form, HR_FIM: e.target.value })}
            />
          </div>
          <div className="md:ml-auto w-full md:w-auto mt-4 md:mt-0">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#4A8BDF] hover:bg-[#3a70b3] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[#4A8BDF]/20 transition-all transform hover:-translate-y-0.5"
            >
              {editId ? "Atualizar" : "Salvar Reserva"}
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 rounded-tl-xl">ID Reserva</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Local</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Morador Solicitante</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50">Data/Horário</th>
              <th className="py-4 px-6 text-xs font-bold text-[#A0006D] uppercase tracking-widest bg-slate-50 text-right rounded-tr-xl">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">Nenhuma reserva cadastrada no calendário.</td>
              </tr>
            ) : (
              reservas.map((r: any) => (
                <tr key={r.ID_RESERVA} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-800">#{r.ID_RESERVA}</td>
                  <td className="py-4 px-6 font-medium text-slate-800">
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold w-fit">
                      Área {r.ID_AREA_COMUM}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold w-fit">
                      Morador {r.ID_MORADOR}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    <span className="font-bold">{r.DATA_RESERVA}</span>
                    <span className="text-slate-400 text-sm ml-2">{r.HR_INICIO} - {r.HR_FIM}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(r)} className="p-2 text-slate-400 hover:text-[#4A8BDF] hover:bg-[#4A8BDF]/10 rounded-lg transition-colors" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(r.ID_RESERVA)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
