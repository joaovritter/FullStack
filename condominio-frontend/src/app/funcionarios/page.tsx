"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [form, setForm] = useState({ pessoa: "", funcao: "", dataAdmissao: "", salario: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarFuncionarios();
    carregarPessoas();
  }, []);

  const carregarFuncionarios = async () => {
    const res = await api.get("/funcionarios");
    setFuncionarios(res.data);
  };

  const carregarPessoas = async () => {
    const res = await api.get("/pessoas");
    setPessoas(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      pessoa: { idPessoa: Number(form.pessoa) },
      funcao: form.funcao,
      dataAdmissao: form.dataAdmissao || null,
      salario: form.salario ? Number(form.salario) : null,
    };
    if (editId) {
      await api.patch(`/funcionarios/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/funcionarios", payload);
    }
    setForm({ pessoa: "", funcao: "", dataAdmissao: "", salario: "" });
    carregarFuncionarios();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/funcionarios/${id}`);
    carregarFuncionarios();
  };

  const handleEdit = (f: any) => {
    setForm({
      pessoa: f.pessoa?.idPessoa || "",
      funcao: f.funcao || "",
      dataAdmissao: f.dataAdmissao || "",
      salario: f.salario || "",
    });
    setEditId(f.idFuncionario);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Funcionários</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
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
          value={form.funcao}
          placeholder="Função"
          onChange={e => setForm({ ...form, funcao: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={form.dataAdmissao}
          placeholder="Data Admissão"
          onChange={e => setForm({ ...form, dataAdmissao: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          step="0.01"
          value={form.salario}
          placeholder="Salário"
          onChange={e => setForm({ ...form, salario: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {funcionarios.map((f: any) => (
          <li key={f.idFuncionario} className="flex gap-2 my-2 items-center">
            {f.pessoa?.nome || "Sem pessoa"} - {f.funcao} - R$ {f.salario}
            <button onClick={() => handleEdit(f)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(f.idFuncionario)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
