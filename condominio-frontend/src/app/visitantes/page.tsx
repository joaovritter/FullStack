"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function VisitantesPage() {
  const [visitantes, setVisitantes] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [form, setForm] = useState({ pessoa: "", documento: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarVisitantes();
    carregarPessoas();
  }, []);

  const carregarVisitantes = async () => {
    const res = await api.get("/visitantes");
    setVisitantes(res.data);
  };

  const carregarPessoas = async () => {
    const res = await api.get("/pessoas");
    setPessoas(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      pessoa: { idPessoa: Number(form.pessoa) },
      documento: form.documento,
    };
    if (editId) {
      await api.patch(`/visitantes/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/visitantes", payload);
    }
    setForm({ pessoa: "", documento: "" });
    carregarVisitantes();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/visitantes/${id}`);
    carregarVisitantes();
  };

  const handleEdit = (v: any) => {
    setForm({
      pessoa: v.pessoa?.idPessoa || "",
      documento: v.documento || "",
    });
    setEditId(v.idVisitante);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Visitantes</h1>

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
        <input
          value={form.documento}
          placeholder="Documento"
          onChange={e => setForm({ ...form, documento: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {visitantes.map((v: any) => (
          <li key={v.idVisitante} className="flex gap-2 my-2 items-center">
            {v.pessoa?.nome || "Sem pessoa"} - Doc: {v.documento}
            <button onClick={() => handleEdit(v)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(v.idVisitante)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
