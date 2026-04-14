"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [moradores, setMoradores] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [form, setForm] = useState({ morador: "", areaComum: "", dataReserva: "", hrInicio: "", hrFim: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarReservas();
    carregarMoradores();
    carregarAreas();
  }, []);

  const carregarReservas = async () => {
    const res = await api.get("/reservas");
    setReservas(res.data);
  };

  const carregarMoradores = async () => {
    const res = await api.get("/moradores");
    setMoradores(res.data);
  };

  const carregarAreas = async () => {
    const res = await api.get("/areas-comuns");
    setAreas(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      morador: { idMorador: Number(form.morador) },
      areaComum: { idAreaComum: Number(form.areaComum) },
      dataReserva: form.dataReserva || null,
      hrInicio: form.hrInicio || null,
      hrFim: form.hrFim || null,
    };
    if (editId) {
      await api.patch(`/reservas/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/reservas", payload);
    }
    setForm({ morador: "", areaComum: "", dataReserva: "", hrInicio: "", hrFim: "" });
    carregarReservas();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/reservas/${id}`);
    carregarReservas();
  };

  const handleEdit = (r: any) => {
    setForm({
      morador: r.morador?.idMorador || "",
      areaComum: r.areaComum?.idAreaComum || "",
      dataReserva: r.dataReserva || "",
      hrInicio: r.hrInicio || "",
      hrFim: r.hrFim || "",
    });
    setEditId(r.idReserva);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Reservas</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
        <select
          value={form.morador}
          onChange={e => setForm({ ...form, morador: e.target.value })}
          className="border p-2"
        >
          <option value="">Selecione Morador</option>
          {moradores.map((m: any) => (
            <option key={m.idMorador} value={m.idMorador}>
              {m.pessoa?.nome || `Morador ${m.idMorador}`}
            </option>
          ))}
        </select>
        <select
          value={form.areaComum}
          onChange={e => setForm({ ...form, areaComum: e.target.value })}
          className="border p-2"
        >
          <option value="">Selecione Área Comum</option>
          {areas.map((a: any) => (
            <option key={a.idAreaComum} value={a.idAreaComum}>
              {a.nomeArea}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.dataReserva}
          onChange={e => setForm({ ...form, dataReserva: e.target.value })}
          className="border p-2"
        />
        <input
          type="time"
          value={form.hrInicio}
          placeholder="Hora Início"
          onChange={e => setForm({ ...form, hrInicio: e.target.value })}
          className="border p-2"
        />
        <input
          type="time"
          value={form.hrFim}
          placeholder="Hora Fim"
          onChange={e => setForm({ ...form, hrFim: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {reservas.map((r: any) => (
          <li key={r.idReserva} className="flex gap-2 my-2 items-center">
            {r.morador?.pessoa?.nome || `Morador ${r.morador?.idMorador}`} - {r.areaComum?.nomeArea || "Área N/A"} - {r.dataReserva} ({r.hrInicio} - {r.hrFim})
            <button onClick={() => handleEdit(r)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(r.idReserva)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
