"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function FornecedoresPage() {
 const [fornecedores, setFornecedores] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_PESSOA: "", AREA_ATUACAO: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/fornecedores");
     setFornecedores(res.data);
   } catch (error) {
     console.error("Erro ao carregar fornecedores:", error);
   }
 };

 const handleSubmit = async (e: any) => {
 e.preventDefault();
 try {
   if (editId) {
     await api.put(`/fornecedores/${editId}`, form);
     setEditId(null);
   } else {
     await api.post("/fornecedores", form);
   }
   setForm({ ID_PESSOA: "", AREA_ATUACAO: "" });
   carregar();
 } catch (error) {
   console.error("Erro ao salvar fornecedor:", error);
 }
 };

 const handleDelete = async (id: number) => {
 if (confirm("Deseja excluir este fornecedor?")) {
   try {
     await api.delete(`/fornecedores/${id}`);
     carregar();
   } catch (error) {
     console.error("Erro ao excluir fornecedor:", error);
   }
 }
 };

 const handleEdit = (f: any) => {
 setForm({ ID_PESSOA: f.ID_PESSOA, AREA_ATUACAO: f.AREA_ATUACAO });
 setEditId(f.ID_FORNECEDOR);
 };

 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Cadastro de Fornecedores</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input className="border p-2" placeholder="ID Pessoa" value={form.ID_PESSOA} onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}/>
 <input className="border p-2" placeholder="Área de Atuação" value={form.AREA_ATUACAO} onChange={e => setForm({ ...form, AREA_ATUACAO: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4 py-2 rounded">{editId ? "Atualizar" : "Salvar"}</button>
 </form>
 <ul className="mt-6">
 {fornecedores.map((f: any) => (
 <li key={f.ID_FORNECEDOR} className="flex gap-2 items-center border-b py-2">
 <span className="flex-1">Pessoa {f.ID_PESSOA} - Área {f.AREA_ATUACAO}</span>
 <button onClick={() => handleEdit(f)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
 <button onClick={() => handleDelete(f.ID_FORNECEDOR)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
