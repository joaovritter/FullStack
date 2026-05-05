"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function PessoasPage() {
 const [pessoas, setPessoas] = useState<any[]>([]);
 const [form, setForm] = useState({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
 const [editId, setEditId] = useState<number | null>(null);

 // Carregar lista
 useEffect(() => {
 carregarPessoas();
 }, []);

 const carregarPessoas = async () => {
 try {
   const res = await api.get("/pessoas");
   setPessoas(res.data);
 } catch (error) {
   console.error("Erro ao carregar pessoas:", error);
 }
 };

 // Criar ou editar
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 try {
   // Formatar data para YYYY-MM-DD (formato DATE do MySQL)
   const hoje = new Date();
   const dataCadastro = hoje.toISOString().split('T')[0];
   
   if (editId) {
     await api.put(`/pessoas/${editId}`, form);
     setEditId(null);
   } else {
     await api.post("/pessoas", { ...form, DATA_CADASTRO: dataCadastro });
   }
   setForm({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
   carregarPessoas();
 } catch (error) {
   console.error("Erro ao salvar pessoa:", error);
 }
 };

 // Excluir
 const handleDelete = async (id: number) => {
 if (confirm("Tem certeza que deseja excluir?")) {
   try {
     await api.delete(`/pessoas/${id}`);
     carregarPessoas();
   } catch (error) {
     console.error("Erro ao excluir pessoa:", error);
   }
 }
 };

 // Preparar edição
 const handleEdit = (p: any) => {
 setForm({ NOME: p.NOME, TIPO_PESSOA: p.TIPO_PESSOA, CPF_CNPJ: p.CPF_CNPJ });
 setEditId(p.ID_PESSOA);
 };

 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Cadastro de Pessoas</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input 
   className="border p-2"
   value={form.NOME} placeholder="Nome"
   onChange={e => setForm({ ...form, NOME: e.target.value })} 
 />
 <select 
   className="border p-2"
   value={form.TIPO_PESSOA}
   onChange={e => setForm({ ...form, TIPO_PESSOA: e.target.value })}
 >
 <option value="">Selecione</option>
 <option value="FISICA">Física</option>
 <option value="JURIDICA">Jurídica</option>
 </select>
 <input 
   className="border p-2"
   value={form.CPF_CNPJ} placeholder="CPF/CNPJ"
   onChange={e => setForm({ ...form, CPF_CNPJ: e.target.value })} 
 />
 <button className="bg-blue-500 text-white px-4 py-2 rounded">
 {editId ? "Atualizar" : "Salvar"}
 </button>
 </form>

 <ul className="mt-6">
 {pessoas.map((p: any) => (
 <li key={p.ID_PESSOA} className="flex gap-2 items-center border-b py-2">
 <span className="flex-1">{p.NOME} - {p.TIPO_PESSOA}</span>
 <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
 <button onClick={() => handleDelete(p.ID_PESSOA)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
