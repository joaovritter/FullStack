"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AreasComunsPage() {
 const [areas, setAreas] = useState<any[]>([]);
 const [form, setForm] = useState({ NOME_AREA: "", DESCR_AREA: "", CAPACIDADE: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/areas-comuns");
     setAreas(res.data);
   } catch (error) {
     console.error("Erro ao carregar áreas comuns:", error);
   }
 };

 const handleSubmit = async (e: any) => {
   e.preventDefault();
   try {
     if (editId) {
       await api.put(`/areas-comuns/${editId}`, form);
       setEditId(null);
     } else {
       await api.post("/areas-comuns", form);
     }
     setForm({ NOME_AREA: "", DESCR_AREA: "", CAPACIDADE: "" });
     carregar();
   } catch (error) {
     console.error("Erro ao salvar área comum:", error);
   }
 };

 const handleDelete = async (id: number) => {
   if (confirm("Deseja excluir esta área comum?")) {
     try {
       await api.delete(`/areas-comuns/${id}`);
       carregar();
     } catch (error) {
       console.error("Erro ao excluir área comum:", error);
     }
   }
 };

 const handleEdit = (a: any) => {
   setForm({ NOME_AREA: a.NOME_AREA, DESCR_AREA: a.DESCR_AREA, CAPACIDADE: a.CAPACIDADE });
   setEditId(a.ID_AREA_COMUM);
 };

 return (
   <div className="p-6">
     <h1 className="text-xl font-bold">Áreas Comuns</h1>
     <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
       <input className="border p-2" placeholder="Nome" value={form.NOME_AREA} onChange={e => setForm({ ...form, NOME_AREA: e.target.value })}/>
       <input className="border p-2" placeholder="Descrição" value={form.DESCR_AREA} onChange={e => setForm({ ...form, DESCR_AREA: e.target.value })}/>
       <input className="border p-2" type="number" placeholder="Capacidade" value={form.CAPACIDADE} onChange={e => setForm({ ...form, CAPACIDADE: e.target.value })}/>
       <button className="bg-blue-500 text-white px-4 py-2 rounded">{editId ? "Atualizar" : "Salvar"}</button>
     </form>
     <ul className="mt-6">
       {areas.map((a: any) => (
         <li key={a.ID_AREA_COMUM} className="flex gap-2 items-center border-b py-2">
           <span className="flex-1">{a.NOME_AREA} - Capacidade {a.CAPACIDADE}</span>
           <button onClick={() => handleEdit(a)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
           <button onClick={() => handleDelete(a.ID_AREA_COMUM)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
         </li>
       ))}
     </ul>
   </div>
 );
}
