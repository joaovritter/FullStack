"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function BoletosPage() {
  const [boletos, setBoletos] = useState<any[]>([]);
  const [moradores, setMoradores] = useState<any[]>([]);
  const [form, setForm] = useState({ morador: "", vlBoleto: "", dtVencimento: "", status: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarBoletos();
    carregarMoradores();
  }, []);

  const carregarBoletos = async () => {
    const res = await api.get("/boletos");
    setBoletos(res.data);
  };

  const carregarMoradores = async () => {
    const res = await api.get("/moradores");
    setMoradores(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      morador: { idMorador: Number(form.morador) },
      vlBoleto: form.vlBoleto ? Number(form.vlBoleto) : null,
      dtVencimento: form.dtVencimento || null,
      status: form.status || null,
    };
    if (editId) {
      await api.patch(`/boletos/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/boletos", payload);
    }
    setForm({ morador: "", vlBoleto: "", dtVencimento: "", status: "" });
    carregarBoletos();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/boletos/${id}`);
    carregarBoletos();
  };

  const handleEdit = (b: any) => {
    setForm({
      morador: b.morador?.idMorador || "",
      vlBoleto: b.vlBoleto || "",
      dtVencimento: b.dtVencimento || "",
      status: b.status || "",
    });
    setEditId(b.idBoleto);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Boletos</h1>

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
        <input
          type="number"
          step="0.01"
          value={form.vlBoleto}
          placeholder="Valor"
          onChange={e => setForm({ ...form, vlBoleto: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={form.dtVencimento}
          onChange={e => setForm({ ...form, dtVencimento: e.target.value })}
          className="border p-2"
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="border p-2"
        >
          <option value="">Status</option>
          <option value="Pago">Pago</option>
          <option value="Pendente">Pendente</option>
          <option value="Atrasado">Atrasado</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {boletos.map((b: any) => (
          <li key={b.idBoleto} className="flex gap-2 my-2 items-center">
            {b.morador?.pessoa?.nome || `Morador ${b.morador?.idMorador}`} - R$ {b.vlBoleto} - Venc: {b.dtVencimento} - {b.status}
            <button onClick={() => handleEdit(b)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(b.idBoleto)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
