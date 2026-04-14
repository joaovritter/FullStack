"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [form, setForm] = useState({ pessoa: "", areaAtuacao: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarFornecedores();
    carregarPessoas();
  }, []);

  const carregarFornecedores = async () => {
    const res = await api.get("/fornecedores");
    setFornecedores(res.data);
  };

  const carregarPessoas = async () => {
    const res = await api.get("/pessoas");
    setPessoas(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      pessoa: { idPessoa: Number(form.pessoa) },
      areaAtuacao: form.areaAtuacao,
    };
    if (editId) {
      await api.patch(`/fornecedores/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/fornecedores", payload);
    }
    setForm({ pessoa: "", areaAtuacao: "" });
    carregarFornecedores();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/fornecedores/${id}`);
    carregarFornecedores();
  };

  const handleEdit = (f: any) => {
    setForm({
      pessoa: f.pessoa?.idPessoa || "",
      areaAtuacao: f.areaAtuacao || "",
    });
    setEditId(f.idFornecedor);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Fornecedores</h1>

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
          value={form.areaAtuacao}
          placeholder="Área de Atuação"
          onChange={e => setForm({ ...form, areaAtuacao: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {fornecedores.map((f: any) => (
          <li key={f.idFornecedor} className="flex gap-2 my-2 items-center">
            {f.pessoa?.nome || "Sem pessoa"} - {f.areaAtuacao}
            <button onClick={() => handleEdit(f)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(f.idFornecedor)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
