"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function ContasPagarPage() {
  const [contas, setContas] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [form, setForm] = useState({ fornecedor: "", descricao: "", valor: "", dataVencimento: "", status: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarContas();
    carregarFornecedores();
  }, []);

  const carregarContas = async () => {
    const res = await api.get("/contas-pagar");
    setContas(res.data);
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
      valor: form.valor ? Number(form.valor) : null,
      dataVencimento: form.dataVencimento || null,
      status: form.status || null,
    };
    if (editId) {
      await api.patch(`/contas-pagar/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/contas-pagar", payload);
    }
    setForm({ fornecedor: "", descricao: "", valor: "", dataVencimento: "", status: "" });
    carregarContas();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/contas-pagar/${id}`);
    carregarContas();
  };

  const handleEdit = (c: any) => {
    setForm({
      fornecedor: c.fornecedor?.idFornecedor || "",
      descricao: c.descricao || "",
      valor: c.valor || "",
      dataVencimento: c.dataVencimento || "",
      status: c.status || "",
    });
    setEditId(c.idContaPagar);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Contas a Pagar</h1>

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
          <li key={c.idContaPagar} className="flex gap-2 my-2 items-center">
            {c.fornecedor?.pessoa?.nome || `Fornecedor ${c.fornecedor?.idFornecedor}`} - {c.descricao} - R$ {c.valor} - Venc: {c.dataVencimento} - {c.status}
            <button onClick={() => handleEdit(c)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(c.idContaPagar)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
