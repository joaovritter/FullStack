"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function AreasComunsPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [form, setForm] = useState({ nomeArea: "", descrArea: "", capacidade: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarAreas();
  }, []);

  const carregarAreas = async () => {
    const res = await api.get("/areas-comuns");
    setAreas(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      nomeArea: form.nomeArea,
      descrArea: form.descrArea,
      capacidade: form.capacidade ? Number(form.capacidade) : null,
    };
    if (editId) {
      await api.patch(`/areas-comuns/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/areas-comuns", payload);
    }
    setForm({ nomeArea: "", descrArea: "", capacidade: "" });
    carregarAreas();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/areas-comuns/${id}`);
    carregarAreas();
  };

  const handleEdit = (a: any) => {
    setForm({
      nomeArea: a.nomeArea || "",
      descrArea: a.descrArea || "",
      capacidade: a.capacidade || "",
    });
    setEditId(a.idAreaComum);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Áreas Comuns</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={form.nomeArea}
          placeholder="Nome"
          onChange={e => setForm({ ...form, nomeArea: e.target.value })}
          className="border p-2"
        />
        <input
          value={form.descrArea}
          placeholder="Descrição"
          onChange={e => setForm({ ...form, descrArea: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          value={form.capacidade}
          placeholder="Capacidade"
          onChange={e => setForm({ ...form, capacidade: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {areas.map((a: any) => (
          <li key={a.idAreaComum} className="flex gap-2 my-2 items-center">
            {a.nomeArea} - {a.descrArea} - Cap: {a.capacidade}
            <button onClick={() => handleEdit(a)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(a.idAreaComum)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
