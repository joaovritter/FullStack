"use client";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<any[]>([]);
  const [form, setForm] = useState({ titulo: "", mensagem: "", dtComunicado: "", hrComunicado: "", tipo: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarComunicados();
  }, []);

  const carregarComunicados = async () => {
    const res = await api.get("/comunicados");
    setComunicados(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      titulo: form.titulo,
      mensagem: form.mensagem,
      dtComunicado: form.dtComunicado || null,
      hrComunicado: form.hrComunicado || null,
      tipo: form.tipo || null,
    };
    if (editId) {
      await api.patch(`/comunicados/${editId}`, payload);
      setEditId(null);
    } else {
      await api.post("/comunicados", payload);
    }
    setForm({ titulo: "", mensagem: "", dtComunicado: "", hrComunicado: "", tipo: "" });
    carregarComunicados();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/comunicados/${id}`);
    carregarComunicados();
  };

  const handleEdit = (c: any) => {
    setForm({
      titulo: c.titulo || "",
      mensagem: c.mensagem || "",
      dtComunicado: c.dtComunicado || "",
      hrComunicado: c.hrComunicado || "",
      tipo: c.tipo || "",
    });
    setEditId(c.idComunicado);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cadastro de Comunicados</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
        <input
          value={form.titulo}
          placeholder="Título"
          onChange={e => setForm({ ...form, titulo: e.target.value })}
          className="border p-2"
        />
        <input
          value={form.mensagem}
          placeholder="Mensagem"
          onChange={e => setForm({ ...form, mensagem: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={form.dtComunicado}
          onChange={e => setForm({ ...form, dtComunicado: e.target.value })}
          className="border p-2"
        />
        <input
          type="time"
          value={form.hrComunicado}
          onChange={e => setForm({ ...form, hrComunicado: e.target.value })}
          className="border p-2"
        />
        <select
          value={form.tipo}
          onChange={e => setForm({ ...form, tipo: e.target.value })}
          className="border p-2"
        >
          <option value="">Tipo</option>
          <option value="AVISO">Aviso</option>
          <option value="COMUNICADO">Comunicado</option>
          <option value="NOTIFICAÇÃO">Notificação</option>
          <option value="URGENTE">Urgente</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Atualizar" : "Salvar"}
        </button>
      </form>

      <ul className="mt-6">
        {comunicados.map((c: any) => (
          <li key={c.idComunicado} className="flex gap-2 my-2 items-center">
            [{c.tipo}] {c.titulo} - {c.dtComunicado} {c.hrComunicado}
            <button onClick={() => handleEdit(c)} className="bg-yellow-500 px-2 py-1 text-white">Editar</button>
            <button onClick={() => handleDelete(c.idComunicado)} className="bg-red-500 px-2 py-1 text-white">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
