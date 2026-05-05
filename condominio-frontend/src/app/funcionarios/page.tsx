"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function FuncionariosPage() {
 const [funcionarios, setFuncionarios] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_PESSOA: "", FUNCAO: "", DATA_ADMISSAO: "", SALARIO: "" });
 const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => { carregar(); }, []);

 const carregar = async () => {
   try {
     const res = await api.get("/funcionarios");
     setFuncionarios(res.data);
   } catch (error) {
     console.error("Erro ao carregar funcionários:", error);
   }
 };

 const handleSubmit = async (e: any) => {
 e.preventDefault();
 try {
   if (editId) {
     await api.put(`/funcionarios/${editId}`, form);
     setEditId(null);
   } else {
     await api.post("/funcionarios", form);
   }
   setForm({ ID_PESSOA: "", FUNCAO: "", DATA_ADMISSAO: "", SALARIO: "" });
   carregar();
 } catch (error) {
   console.error("Erro ao salvar funcionário:", error);
 }
 };

 const handleDelete = async (id: number) => {
 if (confirm("Deseja excluir este funcionário?")) {
   try {
     await api.delete(`/funcionarios/${id}`);
     carregar();
   } catch (error) {
     console.error("Erro ao excluir funcionário:", error);
   }
 }
 };

 const handleEdit = (f: any) => {
 setForm({ ID_PESSOA: f.ID_PESSOA, FUNCAO: f.FUNCAO, DATA_ADMISSAO: f.DATA_ADMISSAO, SALARIO: f.SALARIO });
 setEditId(f.ID_FUNCIONARIO);
 };

 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Cadastro de Funcionários</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4 flex-wrap">
 <input className="border p-2" placeholder="ID Pessoa" value={form.ID_PESSOA} onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}/>
 <input className="border p-2" placeholder="Função" value={form.FUNCAO} onChange={e => setForm({ ...form, FUNCAO: e.target.value })}/>
 <input className="border p-2" type="date" value={form.DATA_ADMISSAO} onChange={e => setForm({ ...form, DATA_ADMISSAO: e.target.value })}/>
 <input className="border p-2" type="number" placeholder="Salário" value={form.SALARIO} onChange={e => setForm({ ...form, SALARIO: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4 py-2 rounded">{editId ? "Atualizar" : "Salvar"}</button>
 </form>
 <ul className="mt-6">
 {funcionarios.map((f: any) => (
 <li key={f.ID_FUNCIONARIO} className="flex gap-2 items-center border-b py-2">
 <span className="flex-1">Pessoa {f.ID_PESSOA} - {f.FUNCAO} - Salário R$ {f.SALARIO}</span>
 <button onClick={() => handleEdit(f)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
 <button onClick={() => handleDelete(f.ID_FUNCIONARIO)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
