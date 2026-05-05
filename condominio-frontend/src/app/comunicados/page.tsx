"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function ComunicadosPage() {
 const [comunicados, setComunicados] = useState<any[]>([]);
 const [form, setForm] = useState({ TITULO: "", MENSAGEM: "", DT_COMUNICADO: "", HR_COMUNICADO: "", TIPO: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/comunicados");
     setComunicados(res.data);
   } catch (error) {
     console.error("Erro ao carregar comunicados:", error);
   }
 };

 const handleSubmit = async (e: any) => {
   e.preventDefault();
   try {
     if (editId) {
       await api.put(`/comunicados/${editId}`, form);
       setEditId(null);
     } else {
       await api.post("/comunicados", form);
     }
     setForm({ TITULO: "", MENSAGEM: "", DT_COMUNICADO: "", HR_COMUNICADO: "", TIPO: "" });
     carregar();
   } catch (error) {
     console.error("Erro ao salvar comunicado:", error);
   }
 };

 const handleDelete = async (id: number) => {
   if (confirm("Deseja excluir este comunicado?")) {
     try {
       await api.delete(`/comunicados/${id}`);
       carregar();
     } catch (error) {
       console.error("Erro ao excluir comunicado:", error);
     }
   }
 };

 const handleEdit = (c: any) => {
   setForm({ TITULO: c.TITULO, MENSAGEM: c.MENSAGEM, DT_COMUNICADO: c.DT_COMUNICADO, HR_COMUNICADO: c.HR_COMUNICADO, TIPO: c.TIPO });
   setEditId(c.ID_COMUNICADO);
 };

 return (
   <div className="p-6">
     <h1 className="text-xl font-bold">Comunicados</h1>
     <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
       <input className="border p-2" placeholder="Título" value={form.TITULO} onChange={e => setForm({ ...form, TITULO: e.target.value })}/>
       <textarea className="border p-2" placeholder="Mensagem" value={form.MENSAGEM} onChange={e => setForm({ ...form, MENSAGEM: e.target.value })}/>
       <div className="flex gap-2">
         <input className="border p-2" type="date" value={form.DT_COMUNICADO} onChange={e => setForm({ ...form, DT_COMUNICADO: e.target.value })}/>
         <input className="border p-2" type="time" value={form.HR_COMUNICADO} onChange={e => setForm({ ...form, HR_COMUNICADO: e.target.value })}/>
         <input className="border p-2" placeholder="Tipo" value={form.TIPO} onChange={e => setForm({ ...form, TIPO: e.target.value })}/>
       </div>
       <button className="bg-blue-500 text-white px-4 py-2 rounded w-fit">{editId ? "Atualizar" : "Salvar"}</button>
     </form>
     <ul className="mt-6">
       {comunicados.map((c: any) => (
         <li key={c.ID_COMUNICADO} className="flex gap-2 items-center border-b py-2">
           <span className="flex-1">{c.TITULO} - {c.TIPO}</span>
           <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
           <button onClick={() => handleDelete(c.ID_COMUNICADO)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
         </li>
       ))}
     </ul>
   </div>
 );
}
