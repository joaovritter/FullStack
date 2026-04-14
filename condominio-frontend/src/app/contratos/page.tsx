"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function ContratosPage() {
  const [contratos, setContratos] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [form, setForm] = useState({ fornecedor: "", descricao: "", dataInicio: "", dataFim: "", valor: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarContratos();
    carregarFornecedores();
  }, []);

  const carregarContratos = async () => {
    const res = await api.get("/contratos");
    setContratos(res.data);
  };

  const carregarFornecedores = async () => {
    const res = await api.get("/fornecedores");
    setFornecedores(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      fornecedor: { idFornecedor: Number(form.fornecedor) },
      descricao: form.descricao,
      dataInicio: form.dataInicio || null,
      dataFim: form.dataFim || null,
      valor: form.valor ? Number(form.valor) : null,
    };
    if (editId) {
      await api.patch(`/contratos/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/contratos", payload);
    }
    setForm({ fornecedor: "", descricao: "", dataInicio: "", dataFim: "", valor: "" });
    carregarContratos();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/contratos/${id}`);
    carregarContratos();
  };

  const handleEdit = (c: any) => {
    setForm({
      fornecedor: c.fornecedor?.idFornecedor || "",
      descricao: c.descricao || "",
      dataInicio: c.dataInicio || "",
      dataFim: c.dataFim || "",
      valor: c.valor || "",
    });
    setEditId(c.idContrato);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Contratos</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
        <select
          value={form.fornecedor}
          onChange={e => setForm({ ...form, fornecedor: e.target.value })}
          className="border p-2"
        >
          <option value="">Selecione Fornecedor</option>
          {fornecedores.map((f: any) => (
            <option key={f.idFornecedor} value={f.idFornecedor}>
              {f.pessoa?.nome || `Fornecedor ${f.idFornecedor}`}
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
          type="date"
          value={form.dataInicio}
          onChange={e => setForm({ ...form, dataInicio: e.target.value })}
          className="border p-2"
          title="Data Início"
        />
        <input
          type="date"
          value={form.dataFim}
          onChange={e => setForm({ ...form, dataFim: e.target.value })}
          className="border p-2"
          title="Data Fim"
        />
        <input
          type="number"
          step="0.01"
          value={form.valor}
          placeholder="Valor"
          onChange={e => setForm({ ...form, valor: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {contratos.map((c: any) => (
          <li key={c.idContrato} className="flex gap-2 my-2 items-center">
            {c.fornecedor?.pessoa?.nome || `Fornecedor ${c.fornecedor?.idFornecedor}`} - {c.descricao} - R$ {c.valor} ({c.dataInicio} a {c.dataFim})
            <button onClick={() => handleEdit(c)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(c.idContrato)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
