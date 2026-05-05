"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function ContratosPage() {
 const [contratos, setContratos] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_FORNECEDOR: "", DESCRICAO: "", DATA_INICIO: "", DATA_FIM: "", VALOR: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/contratos");
     setContratos(res.data);
   } catch (error) {
     console.error("Erro ao carregar contratos:", error);
   }
 };

 const handleSubmit = async (e: any) => {
   e.preventDefault();
   try {
     if (editId) {
       await api.put(`/contratos/${editId}`, form);
       setEditId(null);
     } else {
       await api.post("/contratos", form);
     }
     setForm({ ID_FORNECEDOR: "", DESCRICAO: "", DATA_INICIO: "", DATA_FIM: "", VALOR: "" });
     carregar();
   } catch (error) {
     console.error("Erro ao salvar contrato:", error);
   }
 };

 const handleDelete = async (id: number) => {
   if (confirm("Deseja excluir este contrato?")) {
     try {
       await api.delete(`/contratos/${id}`);
       carregar();
     } catch (error) {
       console.error("Erro ao excluir contrato:", error);
     }
   }
 };

 const handleEdit = (c: any) => {
   setForm({ ID_FORNECEDOR: c.ID_FORNECEDOR, DESCRICAO: c.DESCRICAO, DATA_INICIO: c.DATA_INICIO, DATA_FIM: c.DATA_FIM, VALOR: c.VALOR });
   setEditId(c.ID_CONTRATO);
 };

 return (
   <div className="p-6">
     <h1 className="text-xl font-bold">Contratos</h1>
     <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
       <input className="border p-2" placeholder="ID Fornecedor" value={form.ID_FORNECEDOR} onChange={e => setForm({ ...form, ID_FORNECEDOR: e.target.value })}/>
       <input className="border p-2" placeholder="Descrição" value={form.DESCRICAO} onChange={e => setForm({ ...form, DESCRICAO: e.target.value })}/>
       <input className="border p-2" type="date" value={form.DATA_INICIO} onChange={e => setForm({ ...form, DATA_INICIO: e.target.value })}/>
       <input className="border p-2" type="date" value={form.DATA_FIM} onChange={e => setForm({ ...form, DATA_FIM: e.target.value })}/>
       <input className="border p-2" type="number" placeholder="Valor" value={form.VALOR} onChange={e => setForm({ ...form, VALOR: e.target.value })}/>
       <button className="bg-blue-500 text-white px-4 py-2 rounded">{editId ? "Atualizar" : "Salvar"}</button>
     </form>
     <ul className="mt-6">
       {contratos.map((c: any) => (
         <li key={c.ID_CONTRATO} className="flex gap-2 items-center border-b py-2">
           <span className="flex-1">Fornecedor {c.ID_FORNECEDOR} - {c.DESCRICAO} - Valor R$ {c.VALOR}</span>
           <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
           <button onClick={() => handleDelete(c.ID_CONTRATO)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
         </li>
       ))}
     </ul>
   </div>
 );
}
