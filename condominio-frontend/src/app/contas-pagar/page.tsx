"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function ContasPagarPage() {
 const [contas, setContas] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_FORNECEDOR: "", DESCRICAO: "", VALOR: "", DATA_VENCIMENTO: "", STATUS: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/contas-pagar");
     setContas(res.data);
   } catch (error) {
     console.error("Erro ao carregar contas a pagar:", error);
   }
 };

 const handleSubmit = async (e: any) => {
   e.preventDefault();
   try {
     if (editId) {
       await api.put(`/contas-pagar/${editId}`, form);
       setEditId(null);
     } else {
       await api.post("/contas-pagar", form);
     }
     setForm({ ID_FORNECEDOR: "", DESCRICAO: "", VALOR: "", DATA_VENCIMENTO: "", STATUS: "" });
     carregar();
   } catch (error) {
     console.error("Erro ao salvar conta a pagar:", error);
   }
 };

 const handleDelete = async (id: number) => {
   if (confirm("Deseja excluir esta conta a pagar?")) {
     try {
       await api.delete(`/contas-pagar/${id}`);
       carregar();
     } catch (error) {
       console.error("Erro ao excluir conta a pagar:", error);
     }
   }
 };

 const handleEdit = (c: any) => {
   setForm({ ID_FORNECEDOR: c.ID_FORNECEDOR, DESCRICAO: c.DESCRICAO, VALOR: c.VALOR, DATA_VENCIMENTO: c.DATA_VENCIMENTO, STATUS: c.STATUS });
   setEditId(c.ID_CONTA_PAGAR);
 };

 return (
   <div className="p-6">
     <h1 className="text-xl font-bold">Contas a Pagar</h1>
     <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
       <input className="border p-2" placeholder="ID Fornecedor" value={form.ID_FORNECEDOR} onChange={e => setForm({ ...form, ID_FORNECEDOR: e.target.value })}/>
       <input className="border p-2" placeholder="Descrição" value={form.DESCRICAO} onChange={e => setForm({ ...form, DESCRICAO: e.target.value })}/>
       <input className="border p-2" type="number" placeholder="Valor" value={form.VALOR} onChange={e => setForm({ ...form, VALOR: e.target.value })}/>
       <input className="border p-2" type="date" value={form.DATA_VENCIMENTO} onChange={e => setForm({ ...form, DATA_VENCIMENTO: e.target.value })}/>
       <select className="border p-2" value={form.STATUS} onChange={e => setForm({ ...form, STATUS: e.target.value })}>
         <option value="">Selecione</option>
         <option value="ABERTO">Aberto</option>
         <option value="PAGO">Pago</option>
         <option value="ATRASADO">Atrasado</option>
       </select>
       <button className="bg-blue-500 text-white px-4 py-2 rounded">{editId ? "Atualizar" : "Salvar"}</button>
     </form>
     <ul className="mt-6">
       {contas.map((c: any) => (
         <li key={c.ID_CONTA_PAGAR} className="flex gap-2 items-center border-b py-2">
           <span className="flex-1">Fornecedor {c.ID_FORNECEDOR} - {c.DESCRICAO} - Valor R$ {c.VALOR} - {c.STATUS}</span>
           <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
           <button onClick={() => handleDelete(c.ID_CONTA_PAGAR)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
         </li>
       ))}
     </ul>
   </div>
 );
}
