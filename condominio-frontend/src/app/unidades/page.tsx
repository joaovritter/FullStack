"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [form, setForm] = useState({ numUnidade: "", bloco: "", tipo: "", areaTotal: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarUnidades();
  }, []);

  const carregarUnidades = async () => {
    const res = await api.get("/unidades");
    setUnidades(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      numUnidade: Number(form.numUnidade),
      bloco: form.bloco,
      tipo: form.tipo,
      areaTotal: form.areaTotal ? Number(form.areaTotal) : null,
    };
    if (editId) {
      await api.patch(`/unidades/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/unidades", payload);
    }
    setForm({ numUnidade: "", bloco: "", tipo: "", areaTotal: "" });
    carregarUnidades();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/unidades/${id}`);
    carregarUnidades();
  };

  const handleEdit = (u: any) => {
    setForm({
      numUnidade: u.numUnidade || "",
      bloco: u.bloco || "",
      tipo: u.tipo || "",
      areaTotal: u.areaTotal || "",
    });
    setEditId(u.idUnidade);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Unidades</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="number"
          value={form.numUnidade}
          placeholder="Número"
          onChange={e => setForm({ ...form, numUnidade: e.target.value })}
          className="border p-2"
        />
        <input
          value={form.bloco}
          placeholder="Bloco"
          onChange={e => setForm({ ...form, bloco: e.target.value })}
          className="border p-2"
        />
        <input
          value={form.tipo}
          placeholder="Tipo"
          onChange={e => setForm({ ...form, tipo: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          step="0.01"
          value={form.areaTotal}
          placeholder="Área Total (m²)"
          onChange={e => setForm({ ...form, areaTotal: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {unidades.map((u: any) => (
          <li key={u.idUnidade} className="flex gap-2 my-2 items-center">
            Bloco {u.bloco} - Unidade {u.numUnidade} - {u.tipo} - {u.areaTotal} m²
            <button onClick={() => handleEdit(u)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(u.idUnidade)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
