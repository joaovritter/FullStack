"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function MoradoresPage() {
  const [moradores, setMoradores] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [form, setForm] = useState({ pessoa: "", unidade: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarMoradores();
    carregarPessoas();
    carregarUnidades();
  }, []);

  const carregarMoradores = async () => {
    const res = await api.get("/moradores");
    setMoradores(res.data);
  };

  const carregarPessoas = async () => {
    const res = await api.get("/pessoas");
    setPessoas(res.data);
  };

  const carregarUnidades = async () => {
    const res = await api.get("/unidades");
    setUnidades(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      pessoa: { idPessoa: Number(form.pessoa) },
      unidade: { idUnidade: Number(form.unidade) },
    };
    if (editId) {
      await api.patch(`/moradores/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/moradores", payload);
    }
    setForm({ pessoa: "", unidade: "" });
    carregarMoradores();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/moradores/${id}`);
    carregarMoradores();
  };

  const handleEdit = (m: any) => {
    setForm({
      pessoa: m.pessoa?.idPessoa || "",
      unidade: m.unidade?.idUnidade || "",
    });
    setEditId(m.idMorador);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Moradores</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <select
          value={form.pessoa}
          onChange={e => setForm({ ...form, pessoa: e.target.value })}
          className="border p-2"
        >
          <option value="">Selecione Pessoa</option>
          {pessoas.map((p: any) => (
            <option key={p.idPessoa} value={p.idPessoa}>
              {p.nome}
            </option>
          ))}
        </select>
        <select
          value={form.unidade}
          onChange={e => setForm({ ...form, unidade: e.target.value })}
          className="border p-2"
        >
          <option value="">Selecione Unidade</option>
          {unidades.map((u: any) => (
            <option key={u.idUnidade} value={u.idUnidade}>
              Bloco {u.bloco} - Unidade {u.numUnidade}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {moradores.map((m: any) => (
          <li key={m.idMorador} className="flex gap-2 my-2 items-center">
            {m.pessoa?.nome || "Sem pessoa"} - Unidade {m.unidade?.numUnidade || "N/A"} (Bloco {m.unidade?.bloco || "N/A"})
            <button onClick={() => handleEdit(m)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(m.idMorador)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
