"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [form, setForm] = useState({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
  const [editId, setEditId] = useState<number | null>(null);

  // Carregar lista
  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    const res = await api.get("/pessoas");
    setPessoas(res.data);
  };

  // Criar ou editar
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/pessoas/${editId}`, form);
      setEditId(null);
    } else {
      await api.post("/pessoas", { ...form, DATA_CADASTRO: new Date() });
    }
    setForm({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
    carregarPessoas();
  };

  // Excluir
  const handleDelete = async (id: number) => {
    await api.delete(`/pessoas/${id}`);
    carregarPessoas();
  };

  // Preparar edição
  const handleEdit = (p: any) => {
    setForm({ NOME: p.NOME, TIPO_PESSOA: p.TIPO_PESSOA, CPF_CNPJ: p.CPF_CNPJ });
    setEditId(p.ID_PESSOA);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Pessoas</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input 
          value={form.NOME} 
          placeholder="Nome"
          onChange={e => setForm({ ...form, NOME: e.target.value })} 
          className="border p-2"
        />
        <select 
          value={form.TIPO_PESSOA}
          onChange={e => setForm({ ...form, TIPO_PESSOA: e.target.value })}
          className="border p-2"
        >
          <option value="">Selecione</option>
          <option value="FISICA">Física</option>
          <option value="JURIDICA">Jurídica</option>
        </select>
        <input 
          value={form.CPF_CNPJ} 
          placeholder="CPF/CNPJ"
          onChange={e => setForm({ ...form, CPF_CNPJ: e.target.value })} 
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-4">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {pessoas.map((p: any) => (
          <li key={p.ID_PESSOA} className="flex gap-2 my-2 items-center">
            {p.NOME} - {p.TIPO_PESSOA}
            <button onClick={() => handleEdit(p)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(p.ID_PESSOA)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
