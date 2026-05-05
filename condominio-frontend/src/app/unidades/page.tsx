"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function UnidadesPage() {
 const [unidades, setUnidades] = useState<any[]>([]);
 const [form, setForm] = useState({ NUM_UNIDADE: "", BLOCO: "", TIPO: "", AREA_TOTAL: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/unidades");
     setUnidades(res.data);
   } catch (error) {
     console.error("Erro ao carregar unidades:", error);
   }
 };

 const handleSubmit = async (e: any) => {
   e.preventDefault();
   try {
     if (editId) {
       await api.put(`/unidades/${editId}`, form);
       setEditId(null);
     } else {
       await api.post("/unidades", form);
     }
     setForm({ NUM_UNIDADE: "", BLOCO: "", TIPO: "", AREA_TOTAL: "" });
     carregar();
   } catch (error) {
     console.error("Erro ao salvar unidade:", error);
   }
 };

 const handleDelete = async (id: number) => {
   if (confirm("Deseja excluir esta unidade?")) {
     try {
       await api.delete(`/unidades/${id}`);
       carregar();
     } catch (error) {
       console.error("Erro ao excluir unidade:", error);
     }
   }
 };

 const handleEdit = (u: any) => {
   setForm({ NUM_UNIDADE: u.NUM_UNIDADE, BLOCO: u.BLOCO, TIPO: u.TIPO, AREA_TOTAL: u.AREA_TOTAL });
   setEditId(u.ID_UNIDADE);
 };

 return (
   <div className="p-6">
     <h1 className="text-xl font-bold">Cadastro de Unidades</h1>
     <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
       <input className="border p-2" placeholder="Número" value={form.NUM_UNIDADE} onChange={e => setForm({ ...form, NUM_UNIDADE: e.target.value })}/>
       <input className="border p-2" placeholder="Bloco" value={form.BLOCO} onChange={e => setForm({ ...form, BLOCO: e.target.value })}/>
       <input className="border p-2" placeholder="Tipo" value={form.TIPO} onChange={e => setForm({ ...form, TIPO: e.target.value })}/>
       <input className="border p-2" type="number" placeholder="Área Total" value={form.AREA_TOTAL} onChange={e => setForm({ ...form, AREA_TOTAL: e.target.value })}/>
       <button className="bg-blue-500 text-white px-4 py-2 rounded">{editId ? "Atualizar" : "Salvar"}</button>
     </form>
     <ul className="mt-6">
       {unidades.map((u: any) => (
         <li key={u.ID_UNIDADE} className="flex gap-2 items-center border-b py-2">
           <span className="flex-1">{u.NUM_UNIDADE} - Bloco {u.BLOCO} - {u.TIPO} - Área {u.AREA_TOTAL}</span>
           <button onClick={() => handleEdit(u)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
           <button onClick={() => handleDelete(u.ID_UNIDADE)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
         </li>
       ))}
     </ul>
   </div>
 );
}
