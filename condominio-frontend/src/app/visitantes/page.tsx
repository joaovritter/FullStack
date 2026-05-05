"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function VisitantesPage() {
 const [visitantes, setVisitantes] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_PESSOA: "", DOCUMENTO: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/visitantes");
     setVisitantes(res.data);
   } catch (error) {
     console.error("Erro ao carregar visitantes:", error);
   }
 };

 const handleSubmit = async (e: any) => {
   e.preventDefault();
   try {
     if (editId) {
       await api.put(`/visitantes/${editId}`, form);
       setEditId(null);
     } else {
       await api.post("/visitantes", form);
     }
     setForm({ ID_PESSOA: "", DOCUMENTO: "" });
     carregar();
   } catch (error) {
     console.error("Erro ao salvar visitante:", error);
   }
 };

 const handleDelete = async (id: number) => {
   if (confirm("Deseja excluir este visitante?")) {
     try {
       await api.delete(`/visitantes/${id}`);
       carregar();
     } catch (error) {
       console.error("Erro ao excluir visitante:", error);
     }
   }
 };

 const handleEdit = (v: any) => {
   setForm({ ID_PESSOA: v.ID_PESSOA, DOCUMENTO: v.DOCUMENTO });
   setEditId(v.ID_VISITANTE);
 };

 return (
   <div className="p-6">
     <h1 className="text-xl font-bold">Cadastro de Visitantes</h1>
     <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
       <input className="border p-2" placeholder="ID Pessoa" value={form.ID_PESSOA} onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}/>
       <input className="border p-2" placeholder="Documento" value={form.DOCUMENTO} onChange={e => setForm({ ...form, DOCUMENTO: e.target.value })}/>
       <button className="bg-blue-500 text-white px-4 py-2 rounded">{editId ? "Atualizar" : "Salvar"}</button>
     </form>
     <ul className="mt-6">
       {visitantes.map((v: any) => (
         <li key={v.ID_VISITANTE} className="flex gap-2 items-center border-b py-2">
           <span className="flex-1">Pessoa {v.ID_PESSOA} - Documento {v.DOCUMENTO}</span>
           <button onClick={() => handleEdit(v)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
           <button onClick={() => handleDelete(v.ID_VISITANTE)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
         </li>
       ))}
     </ul>
   </div>
 );
}
