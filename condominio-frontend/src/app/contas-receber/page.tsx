"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function ContasReceberPage() {
  const [contas, setContas] = useState<any[]>([]);
  const [moradores, setMoradores] = useState<any[]>([]);
  const [form, setForm] = useState({ morador: "", descricao: "", valor: "", dataVencimento: "", status: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarContas();
    carregarMoradores();
  }, []);

  const carregarContas = async () => {
    const res = await api.get("/contas-receber");
    setContas(res.data);
  };

  const carregarMoradores = async () => {
    const res = await api.get("/moradores");
    setMoradores(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      morador: { idMorador: Number(form.morador) },
      descricao: form.descricao,
      valor: form.valor ? Number(form.valor) : null,
      dataVencimento: form.dataVencimento || null,
      status: form.status || null,
    };
    if (editId) {
      await api.patch(`/contas-receber/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/contas-receber", payload);
    }
    setForm({ morador: "", descricao: "", valor: "", dataVencimento: "", status: "" });
    carregarContas();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/contas-receber/${id}`);
    carregarContas();
  };

  const handleEdit = (c: any) => {
    setForm({
      morador: c.morador?.idMorador || "",
      descricao: c.descricao || "",
      valor: c.valor || "",
      dataVencimento: c.dataVencimento || "",
      status: c.status || "",
    });
    setEditId(c.idContaReceber);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Contas a Receber</h1>

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
          value={form.descricao}
          placeholder="Descrição"
          onChange={e => setForm({ ...form, descricao: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          step="0.01"
          value={form.valor}
          placeholder="Valor"
          onChange={e => setForm({ ...form, valor: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={form.dataVencimento}
          onChange={e => setForm({ ...form, dataVencimento: e.target.value })}
          className="border p-2"
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="border p-2"
        >
          <option value="">Status</option>
          <option value="PAGO">Pago</option>
          <option value="PENDENTE">Pendente</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="EXPIRADO">Expirado</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {contas.map((c: any) => (
          <li key={c.idContaReceber} className="flex gap-2 my-2 items-center">
            {c.morador?.pessoa?.nome || `Morador ${c.morador?.idMorador}`} - {c.descricao} - R$ {c.valor} - Venc: {c.dataVencimento} - {c.status}
            <button onClick={() => handleEdit(c)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(c.idContaReceber)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
