"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function MoradoresPage() {
 const [moradores, setMoradores] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_PESSOA: "", ID_UNIDADE: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/moradores");
     setMoradores(res.data);
   } catch (error) {
     console.error("Erro ao carregar moradores:", error);
   }
 };

 const handleSubmit = async (e: any) => {
 e.preventDefault();
 try {
   if (editId) {
     await api.put(`/moradores/${editId}`, form);
     setEditId(null);
   } else {
     await api.post("/moradores", form);
   }
   setForm({ ID_PESSOA: "", ID_UNIDADE: "" });
   carregar();
 } catch (error) {
   console.error("Erro ao salvar morador:", error);
 }
 };

 const handleDelete = async (id: number) => {
 if (confirm("Deseja excluir este morador?")) {
   try {
     await api.delete(`/moradores/${id}`);
     carregar();
   } catch (error) {
     console.error("Erro ao excluir morador:", error);
   }
 }
 };

 const handleEdit = (m: any) => {
 setForm({ ID_PESSOA: m.ID_PESSOA, ID_UNIDADE: m.ID_UNIDADE });
 setEditId(m.ID_MORADOR);
 };

 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Cadastro de Moradores</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input 
   className="border p-2"
   placeholder="ID Pessoa" value={form.ID_PESSOA}
   onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}
 />
 <input 
   className="border p-2"
   placeholder="ID Unidade" value={form.ID_UNIDADE}
   onChange={e => setForm({ ...form, ID_UNIDADE: e.target.value })}
 />
 <button className="bg-blue-500 text-white px-4 py-2 rounded">
 {editId ? "Atualizar" : "Salvar"}
 </button>
 </form>
 <ul className="mt-6">
 {moradores.map((m: any) => (
 <li key={m.ID_MORADOR} className="flex gap-2 items-center border-b py-2">
 <span className="flex-1">Pessoa {m.ID_PESSOA} - Unidade {m.ID_UNIDADE}</span>
 <button onClick={() => handleEdit(m)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
 <button onClick={() => handleDelete(m.ID_MORADOR)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
