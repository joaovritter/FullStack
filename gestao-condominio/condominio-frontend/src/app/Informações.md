Projeto Full Stack
(Parte 3)
Sistema de Gestão de Condomínios
Frontend com Next.js
Objetivo
Construir o frontend do sistema de gestão de condomínios com formulários de cadastro,
listagem, edição e exclusão, integrando ao backend NestJS.
1 Instalar Node.js e criar projeto
Baixe o Node.js LTS em nodejs.org.
Verifique instalação:
node -v
npm -v
Crie projeto Next.js:
npx create-next-app@latest condominio-frontend
2 Configurar API
Instale Axios:
npm install axios
Crie src/services/api.ts:
import axios from "axios";
const api = axios.create({
 baseURL: "http://localhost:3000", // backend NestJS
});
export default api;
3 CRUD de Pessoas
Crie src/app/pessoas/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function PessoasPage() {
 const [pessoas, setPessoas] = useState<any[]>([]);
 const [form, setForm] = useState({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
 const [editId, setEditId] = useState<number | null>(null);
 // Carregar lista
 useEffect(() => {
 carregarPessoas();
 }, []);
 const carregarPessoas = async () => {
 const res = await api.get("/pessoas");
 setPessoas(res.data);
 };
 // Criar ou editar
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/pessoas/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/pessoas", { ...form, DATA_CADASTRO: new Date() });
 }
 setForm({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
 carregarPessoas();
 };
 // Excluir
 const handleDelete = async (id: number) => {
 await api.delete(`/pessoas/${id}`);
 carregarPessoas();
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
 <input value={form.NOME} placeholder="Nome"
 onChange={e => setForm({ ...form, NOME: e.target.value })} />
 <select value={form.TIPO_PESSOA}
 onChange={e => setForm({ ...form, TIPO_PESSOA: e.target.value })}>
 <option value="">Selecione</option>
 <option value="FISICA">Física</option>
 <option value="JURIDICA">Jurídica</option>
 </select>
 <input value={form.CPF_CNPJ} placeholder="CPF/CNPJ"
 onChange={e => setForm({ ...form, CPF_CNPJ: e.target.value })} />
 <button className="bg-blue-500 text-white px-4">
 {editId ? "Atualizar" : "Salvar"}
 </button>
 </form>
 <ul className="mt-6">
 {pessoas.map((p: any) => (
 <li key={p.ID_PESSOA} className="flex gap-2">
 {p.NOME} - {p.TIPO_PESSOA}
 <button onClick={() => handleEdit(p)} className="bg-yellow-500
px-2">Editar</button>
 <button onClick={() => handleDelete(p.ID_PESSOA)} className="bg-red-500 px2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
4 Replicar para outras entidades
Moradores - formulário com seleção de pessoa e unidade.
Funcionários - pessoa + função + salário.
Fornecedores - pessoa + área de atuação.
Visitantes - pessoa + documento.
Unidades - número, bloco, tipo, área total.
Áreas comuns - nome, descrição, capacidade.
Reservas - morador + área comum + data/hora.
Boletos - morador + valor + vencimento + status.
Comunicados - título + mensagem + data/hora.
Contratos - fornecedor + descrição + datas + valor.
Financeiro - contas a pagar/receber com valor, vencimento e status.
Cada página segue o mesmo padrão:
Formulário com inputs
Botão salvar (POST/PUT)
Listagem (GET)
Botões editar e excluir (PUT/DELETE)
5 Dashboard para Acesso às Funcionalidades
Arquivo dashboard/page.tsx:
export default function Dashboard() {
 return (
 <div className="p-6">
 <h1 className="text-2xl font-bold">Painel do Condomínio</h1>
 <div className="grid grid-cols-2 gap-4 mt-6">
 <a href="/pessoas" className="border p-4">Pessoas</a>
 <a href="/moradores" className="border p-4">Moradores</a>
 <a href="/funcionarios" className="border p-4">Funcionários</a>
 <a href="/fornecedores" className="border p-4">Fornecedores</a>
 <a href="/visitantes" className="border p-4">Visitantes</a>
 <a href="/unidades" className="border p-4">Unidades</a>
 <a href="/areas-comuns" className="border p-4">Áreas Comuns</a>
 <a href="/reservas" className="border p-4">Reservas</a>
 <a href="/boletos" className="border p-4">Boletos</a>
 <a href="/comunicados" className="border p-4">Comunicados</a>
 <a href="/contratos" className="border p-4">Contratos</a>
 <a href="/financeiro" className="border p-4">Financeiro</a>
 </div>
 </div>
 );
}
Resultado Esperados até aqui:
- Frontend completo com CRUD (criar, listar, editar, excluir) para todas as entidades.
- Dashboard centralizado para navegação.
- Sistema funcional e integrado ao backend NestJS.
Replicação para demais entidades
Moradores
Arquivo src/app/moradores/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function MoradoresPage() {
 const [moradores, setMoradores] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_PESSOA: "", ID_UNIDADE: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/moradores");
 setMoradores(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/moradores/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/moradores", form);
 }
 setForm({ ID_PESSOA: "", ID_UNIDADE: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/moradores/${id}`);
 carregar();
 };
 const handleEdit = (m: any) => {
 setForm({ ID_PESSOA: m.ID_PESSOA, ID_UNIDADE: m.ID_UNIDADE });
 setEditId(m.ID_MORADOR);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Cadastro de Moradores</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Pessoa" value={form.ID_PESSOA}
 onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}/>
 <input placeholder="ID Unidade" value={form.ID_UNIDADE}
 onChange={e => setForm({ ...form, ID_UNIDADE: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">
 {editId ? "Atualizar" : "Salvar"}
 </button>
 </form>
 <ul className="mt-6">
 {moradores.map((m: any) => (
 <li key={m.ID_MORADOR} className="flex gap-2">
 Pessoa {m.ID_PESSOA} - Unidade {m.ID_UNIDADE}
 <button onClick={() => handleEdit(m)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(m.ID_MORADOR)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Reservas
Arquivo src/app/reservas/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function ReservasPage() {
 const [reservas, setReservas] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_MORADOR: "", ID_AREA_COMUM: "",
DATA_RESERVA: "", HR_INICIO: "", HR_FIM: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/reservas");
 setReservas(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/reservas/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/reservas", form);
 }
 setForm({ ID_MORADOR: "", ID_AREA_COMUM: "", DATA_RESERVA: "", HR_INICIO:
"", HR_FIM: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/reservas/${id}`);
 carregar();
 };
 const handleEdit = (r: any) => {
 setForm({ ID_MORADOR: r.ID_MORADOR, ID_AREA_COMUM: r.ID_AREA_COMUM,
DATA_RESERVA: r.DATA_RESERVA, HR_INICIO: r.HR_INICIO, HR_FIM: r.HR_FIM });
 setEditId(r.ID_RESERVA);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Reservas</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Morador" value={form.ID_MORADOR} onChange={e =>
setForm({ ...form, ID_MORADOR: e.target.value })}/>
 <input placeholder="ID Área Comum" value={form.ID_AREA_COMUM}
onChange={e => setForm({ ...form, ID_AREA_COMUM: e.target.value })}/>
 <input type="date" value={form.DATA_RESERVA} onChange={e =>
setForm({ ...form, DATA_RESERVA: e.target.value })}/>
 <input type="time" value={form.HR_INICIO} onChange={e =>
setForm({ ...form, HR_INICIO: e.target.value })}/>
 <input type="time" value={form.HR_FIM} onChange={e => setForm({ ...form,
HR_FIM: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {reservas.map((r: any) => (
 <li key={r.ID_RESERVA} className="flex gap-2">
 {r.DATA_RESERVA} - {r.HR_INICIO} até {r.HR_FIM}
 <button onClick={() => handleEdit(r)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(r.ID_RESERVA)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Boletos
Arquivo src/app/boletos/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function BoletosPage() {
 const [boletos, setBoletos] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_MORADOR: "", VL_BOLETO: "",
DT_VENCIMENTO: "", STATUS: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/boletos");
 setBoletos(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/boletos/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/boletos", form);
 }
 setForm({ ID_MORADOR: "", VL_BOLETO: "", DT_VENCIMENTO: "", STATUS: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/boletos/${id}`);
 carregar();
 };
 const handleEdit = (b: any) => {
 setForm({ ID_MORADOR: b.ID_MORADOR, VL_BOLETO: b.VL_BOLETO, DT_VENCIMENTO:
b.DT_VENCIMENTO, STATUS: b.STATUS });
 setEditId(b.ID_BOLETO);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Boletos</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Morador" value={form.ID_MORADOR} onChange={e =>
setForm({ ...form, ID_MORADOR: e.target.value })}/>
 <input type="number" placeholder="Valor" value={form.VL_BOLETO}
onChange={e => setForm({ ...form, VL_BOLETO: e.target.value })}/>
 <input type="date" value={form.DT_VENCIMENTO} onChange={e =>
setForm({ ...form, DT_VENCIMENTO: e.target.value })}/>
 <select value={form.STATUS} onChange={e => setForm({ ...form, STATUS:
e.target.value })}>
 <option value="">Selecione</option>
 <option value="ABERTO">Aberto</option>
 <option value="PAGO">Pago</option>
 <option value="ATRASADO">Atrasado</option>
 </select>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {boletos.map((b: any) => (
 <li key={b.ID_BOLETO} className="flex gap-2">
 Morador {b.ID_MORADOR} - Valor {b.VL_BOLETO} - {b.STATUS}
 <button onClick={() => handleEdit(b)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(b.ID_BOLETO)} className="bg-red500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Comunicados
Arquivo src/app/comunicados/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function ComunicadosPage() {
 const [comunicados, setComunicados] = useState<any[]>([]);
 const [form, setForm] = useState({ TITULO: "", MENSAGEM: "", DT_COMUNICADO:
"", HR_COMUNICADO: "", TIPO: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/comunicados");
 setComunicados(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/comunicados/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/comunicados", form);
 }
 setForm({ TITULO: "", MENSAGEM: "", DT_COMUNICADO: "", HR_COMUNICADO: "",
TIPO: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/comunicados/${id}`);
 carregar();
 };
 const handleEdit = (c: any) => {
 setForm({ TITULO: c.TITULO, MENSAGEM: c.MENSAGEM, DT_COMUNICADO:
c.DT_COMUNICADO, HR_COMUNICADO: c.HR_COMUNICADO, TIPO: c.TIPO });
 setEditId(c.ID_COMUNICADO);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Comunicados</h1>
 <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
 <input placeholder="Título" value={form.TITULO} onChange={e => setForm({
...form, TITULO: e.target.value })}/>
 <textarea placeholder="Mensagem" value={form.MENSAGEM} onChange={e =>
setForm({ ...form, MENSAGEM: e.target.value })}/>
 <input type="date" value={form.DT_COMUNICADO} onChange={e =>
setForm({ ...form, DT_COMUNICADO: e.target.value })}/>
 <input type="time" value={form.HR_COMUNICADO} onChange={e =>
setForm({ ...form, HR_COMUNICADO: e.target.value })}/>
 <input placeholder="Tipo" value={form.TIPO} onChange={e =>
setForm({ ...form, TIPO: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {comunicados.map((c: any) => (
 <li key={c.ID_COMUNICADO} className="flex gap-2">
 {c.TITULO} - {c.TIPO}
 <button onClick={() => handleEdit(c)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(c.ID_COMUNICADO)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Funcionários
Arquivo src/app/funcionarios/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function FuncionariosPage() {
 const [funcionarios, setFuncionarios] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_PESSOA: "", FUNCAO: "", DATA_ADMISSAO:
"", SALARIO: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/funcionarios");
 setFuncionarios(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/funcionarios/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/funcionarios", form);
 }
 setForm({ ID_PESSOA: "", FUNCAO: "", DATA_ADMISSAO: "", SALARIO: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/funcionarios/${id}`);
 carregar();
 };
 const handleEdit = (f: any) => {
 setForm({ ID_PESSOA: f.ID_PESSOA, FUNCAO: f.FUNCAO, DATA_ADMISSAO:
f.DATA_ADMISSAO, SALARIO: f.SALARIO });
 setEditId(f.ID_FUNCIONARIO);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Funcionários</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Pessoa" value={form.ID_PESSOA} onChange={e =>
setForm({ ...form, ID_PESSOA: e.target.value })}/>
 <input placeholder="Função" value={form.FUNCAO} onChange={e => setForm({
...form, FUNCAO: e.target.value })}/>
 <input type="date" value={form.DATA_ADMISSAO} onChange={e =>
setForm({ ...form, DATA_ADMISSAO: e.target.value })}/>
 <input type="number" placeholder="Salário" value={form.SALARIO}
onChange={e => setForm({ ...form, SALARIO: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {funcionarios.map((f: any) => (
 <li key={f.ID_FUNCIONARIO} className="flex gap-2">
 Pessoa {f.ID_PESSOA} - {f.FUNCAO} - Salário {f.SALARIO}
 <button onClick={() => handleEdit(f)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(f.ID_FUNCIONARIO)}
className="bg-red-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Fornecedores
Arquivo src/app/fornecedores/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function FornecedoresPage() {
 const [fornecedores, setFornecedores] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_PESSOA: "", AREA_ATUACAO: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/fornecedores");
 setFornecedores(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/fornecedores/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/fornecedores", form);
 }
 setForm({ ID_PESSOA: "", AREA_ATUACAO: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/fornecedores/${id}`);
 carregar();
 };
 const handleEdit = (f: any) => {
 setForm({ ID_PESSOA: f.ID_PESSOA, AREA_ATUACAO: f.AREA_ATUACAO });
 setEditId(f.ID_FORNECEDOR);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Fornecedores</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Pessoa" value={form.ID_PESSOA} onChange={e =>
setForm({ ...form, ID_PESSOA: e.target.value })}/>
 <input placeholder="Área de Atuação" value={form.AREA_ATUACAO}
onChange={e => setForm({ ...form, AREA_ATUACAO: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {fornecedores.map((f: any) => (
 <li key={f.ID_FORNECEDOR} className="flex gap-2">
 Pessoa {f.ID_PESSOA} - Área {f.AREA_ATUACAO}
 <button onClick={() => handleEdit(f)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(f.ID_FORNECEDOR)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Visitantes
Arquivo src/app/visitantes/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function VisitantesPage() {
 const [visitantes, setVisitantes] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_PESSOA: "", DOCUMENTO: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/visitantes");
 setVisitantes(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/visitantes/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/visitantes", form);
 }
 setForm({ ID_PESSOA: "", DOCUMENTO: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/visitantes/${id}`);
 carregar();
 };
 const handleEdit = (v: any) => {
 setForm({ ID_PESSOA: v.ID_PESSOA, DOCUMENTO: v.DOCUMENTO });
 setEditId(v.ID_VISITANTE);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Visitantes</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Pessoa" value={form.ID_PESSOA} onChange={e =>
setForm({ ...form, ID_PESSOA: e.target.value })}/>
 <input placeholder="Documento" value={form.DOCUMENTO} onChange={e =>
setForm({ ...form, DOCUMENTO: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {visitantes.map((v: any) => (
 <li key={v.ID_VISITANTE} className="flex gap-2">
 Pessoa {v.ID_PESSOA} - Documento {v.DOCUMENTO}
 <button onClick={() => handleEdit(v)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(v.ID_VISITANTE)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Unidades
Arquivo src/app/unidades/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function UnidadesPage() {
 const [unidades, setUnidades] = useState<any[]>([]);
 const [form, setForm] = useState({ NUM_UNIDADE: "", BLOCO: "", TIPO: "",
AREA_TOTAL: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/unidades");
 setUnidades(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/unidades/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/unidades", form);
 }
 setForm({ NUM_UNIDADE: "", BLOCO: "", TIPO: "", AREA_TOTAL: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/unidades/${id}`);
 carregar();
 };
 const handleEdit = (u: any) => {
 setForm({ NUM_UNIDADE: u.NUM_UNIDADE, BLOCO: u.BLOCO, TIPO: u.TIPO,
AREA_TOTAL: u.AREA_TOTAL });
 setEditId(u.ID_UNIDADE);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Unidades</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="Número" value={form.NUM_UNIDADE} onChange={e =>
setForm({ ...form, NUM_UNIDADE: e.target.value })}/>
 <input placeholder="Bloco" value={form.BLOCO} onChange={e =>
setForm({ ...form, BLOCO: e.target.value })}/>
 <input placeholder="Tipo" value={form.TIPO} onChange={e =>
setForm({ ...form, TIPO: e.target.value })}/>
 <input type="number" placeholder="Área Total" value={form.AREA_TOTAL}
onChange={e => setForm({ ...form, AREA_TOTAL: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {unidades.map((u: any) => (
 <li key={u.ID_UNIDADE} className="flex gap-2">
 {u.NUM_UNIDADE} - Bloco {u.BLOCO} - {u.TIPO} - Área {u.AREA_TOTAL}
 <button onClick={() => handleEdit(u)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(u.ID_UNIDADE)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Áreas Comuns
Arquivo src/app/areas-comuns/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function AreasComunsPage() {
 const [areas, setAreas] = useState<any[]>([]);
 const [form, setForm] = useState({ NOME_AREA: "", DESCR_AREA: "", CAPACIDADE:
"" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/areas-comuns");
 setAreas(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/areas-comuns/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/areas-comuns", form);
 }
 setForm({ NOME_AREA: "", DESCR_AREA: "", CAPACIDADE: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/areas-comuns/${id}`);
 carregar();
 };
 const handleEdit = (a: any) => {
 setForm({ NOME_AREA: a.NOME_AREA, DESCR_AREA: a.DESCR_AREA, CAPACIDADE:
a.CAPACIDADE });
 setEditId(a.ID_AREA_COMUM);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Áreas Comuns</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="Nome" value={form.NOME_AREA} onChange={e =>
setForm({ ...form, NOME_AREA: e.target.value })}/>
 <input placeholder="Descrição" value={form.DESCR_AREA} onChange={e =>
setForm({ ...form, DESCR_AREA: e.target.value })}/>
 <input type="number" placeholder="Capacidade" value={form.CAPACIDADE}
onChange={e => setForm({ ...form, CAPACIDADE: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {areas.map((a: any) => (
 <li key={a.ID_AREA_COMUM} className="flex gap-2">
 {a.NOME_AREA} - Capacidade {a.CAPACIDADE}
 <button onClick={() => handleEdit(a)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(a.ID_AREA_COMUM)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Reservas
Arquivo src/app/reservas/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function ReservasPage() {
 const [reservas, setReservas] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_MORADOR: "", ID_AREA_COMUM: "",
DATA_RESERVA: "", HR_INICIO: "", HR_FIM: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/reservas");
 setReservas(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/reservas/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/reservas", form);
 }
 setForm({ ID_MORADOR: "", ID_AREA_COMUM: "", DATA_RESERVA: "", HR_INICIO:
"", HR_FIM: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/reservas/${id}`);
 carregar();
 };
 const handleEdit = (r: any) => {
 setForm({ ID_MORADOR: r.ID_MORADOR, ID_AREA_COMUM: r.ID_AREA_COMUM,
DATA_RESERVA: r.DATA_RESERVA, HR_INICIO: r.HR_INICIO, HR_FIM: r.HR_FIM });
 setEditId(r.ID_RESERVA);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Reservas</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Morador" value={form.ID_MORADOR} onChange={e =>
setForm({ ...form, ID_MORADOR: e.target.value })}/>
 <input placeholder="ID Área Comum" value={form.ID_AREA_COMUM}
onChange={e => setForm({ ...form, ID_AREA_COMUM: e.target.value })}/>
 <input type="date" value={form.DATA_RESERVA} onChange={e =>
setForm({ ...form, DATA_RESERVA: e.target.value })}/>
 <input type="time" value={form.HR_INICIO} onChange={e =>
setForm({ ...form, HR_INICIO: e.target.value })}/>
 <input type="time" value={form.HR_FIM} onChange={e => setForm({ ...form,
HR_FIM: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {reservas.map((r: any) => (
 <li key={r.ID_RESERVA} className="flex gap-2">
 {r.DATA_RESERVA} - {r.HR_INICIO} até {r.HR_FIM}
 <button onClick={() => handleEdit(r)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(r.ID_RESERVA)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Boletos
Arquivo src/app/boletos/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function BoletosPage() {
 const [boletos, setBoletos] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_MORADOR: "", VL_BOLETO: "",
DT_VENCIMENTO: "", STATUS: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/boletos");
 setBoletos(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/boletos/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/boletos", form);
 }
 setForm({ ID_MORADOR: "", VL_BOLETO: "", DT_VENCIMENTO: "", STATUS: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/boletos/${id}`);
 carregar();
 };
 const handleEdit = (b: any) => {
 setForm({ ID_MORADOR: b.ID_MORADOR, VL_BOLETO: b.VL_BOLETO, DT_VENCIMENTO:
b.DT_VENCIMENTO, STATUS: b.STATUS });
 setEditId(b.ID_BOLETO);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Boletos</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Morador" value={form.ID_MORADOR} onChange={e =>
setForm({ ...form, ID_MORADOR: e.target.value })}/>
 <input type="number" placeholder="Valor" value={form.VL_BOLETO}
onChange={e => setForm({ ...form, VL_BOLETO: e.target.value })}/>
 <input type="date" value={form.DT_VENCIMENTO} onChange={e =>
setForm({ ...form, DT_VENCIMENTO: e.target.value })}/>
 <select value={form.STATUS} onChange={e => setForm({ ...form, STATUS:
e.target.value })}>
 <option value="">Selecione</option>
 <option value="ABERTO">Aberto</option>
 <option value="PAGO">Pago</option>
 <option value="ATRASADO">Atrasado</option>
 </select>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {boletos.map((b: any) => (
 <li key={b.ID_BOLETO} className="flex gap-2">
 Morador {b.ID_MORADOR} - Valor {b.VL_BOLETO} - {b.STATUS}
 <button onClick={() => handleEdit(b)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(b.ID_BOLETO)} className="bg-red500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Comunicados
Arquivo src/app/comunicados/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function ComunicadosPage() {
 const [comunicados, setComunicados] = useState<any[]>([]);
 const [form, setForm] = useState({ TITULO: "", MENSAGEM: "", DT_COMUNICADO:
"", HR_COMUNICADO: "", TIPO: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/comunicados");
 setComunicados(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/comunicados/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/comunicados", form);
 }
 setForm({ TITULO: "", MENSAGEM: "", DT_COMUNICADO: "", HR_COMUNICADO: "",
TIPO: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/comunicados/${id}`);
 carregar();
 };
 const handleEdit = (c: any) => {
 setForm({ TITULO: c.TITULO, MENSAGEM: c.MENSAGEM, DT_COMUNICADO:
c.DT_COMUNICADO, HR_COMUNICADO: c.HR_COMUNICADO, TIPO: c.TIPO });
 setEditId(c.ID_COMUNICADO);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Comunicados</h1>
 <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
 <input placeholder="Título" value={form.TITULO} onChange={e => setForm({
...form, TITULO: e.target.value })}/>
 <textarea placeholder="Mensagem" value={form.MENSAGEM} onChange={e =>
setForm({ ...form, MENSAGEM: e.target.value })}/>
 <input type="date" value={form.DT_COMUNICADO} onChange={e =>
setForm({ ...form, DT_COMUNICADO: e.target.value })}/>
 <input type="time" value={form.HR_COMUNICADO} onChange={e =>
setForm({ ...form, HR_COMUNICADO: e.target.value })}/>
 <input placeholder="Tipo" value={form.TIPO} onChange={e =>
setForm({ ...form, TIPO: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {comunicados.map((c: any) => (
 <li key={c.ID_COMUNICADO} className="flex gap-2">
 {c.TITULO} - {c.TIPO}
 <button onClick={() => handleEdit(c)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(c.ID_COMUNICADO)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Contratos
Arquivo src/app/contratos/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function ContratosPage() {
 const [contratos, setContratos] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_FORNECEDOR: "", DESCRICAO: "",
DATA_INICIO: "", DATA_FIM: "", VALOR: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/contratos");
 setContratos(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/contratos/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/contratos", form);
 }
 setForm({ ID_FORNECEDOR: "", DESCRICAO: "", DATA_INICIO: "", DATA_FIM: "",
VALOR: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/contratos/${id}`);
 carregar();
 };
 const handleEdit = (c: any) => {
 setForm({ ID_FORNECEDOR: c.ID_FORNECEDOR, DESCRICAO: c.DESCRICAO,
DATA_INICIO: c.DATA_INICIO, DATA_FIM: c.DATA_FIM, VALOR: c.VALOR });
 setEditId(c.ID_CONTRATO);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Contratos</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Fornecedor" value={form.ID_FORNECEDOR}
onChange={e => setForm({ ...form, ID_FORNECEDOR: e.target.value })}/>
 <input placeholder="Descrição" value={form.DESCRICAO} onChange={e =>
setForm({ ...form, DESCRICAO: e.target.value })}/>
 <input type="date" value={form.DATA_INICIO} onChange={e =>
setForm({ ...form, DATA_INICIO: e.target.value })}/>
 <input type="date" value={form.DATA_FIM} onChange={e =>
setForm({ ...form, DATA_FIM: e.target.value })}/>
 <input type="number" placeholder="Valor" value={form.VALOR} onChange={e
=> setForm({ ...form, VALOR: e.target.value })}/>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {contratos.map((c: any) => (
 <li key={c.ID_CONTRATO} className="flex gap-2">
 Fornecedor {c.ID_FORNECEDOR} - {c.DESCRICAO} - Valor {c.VALOR}
 <button onClick={() => handleEdit(c)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(c.ID_CONTRATO)} className="bgred-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Contas a Pagar
Arquivo src/app/contas-pagar/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function ContasPagarPage() {
 const [contas, setContas] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_FORNECEDOR: "", DESCRICAO: "", VALOR:
"", DATA_VENCIMENTO: "", STATUS: "" });
 const [editId, setEditId] = useState<number | null>(null);
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/contas-pagar");
 setContas(res.data);
 };
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/contas-pagar/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/contas-pagar", form);
 }
 setForm({ ID_FORNECEDOR: "", DESCRICAO: "", VALOR: "", DATA_VENCIMENTO: "",
STATUS: "" });
 carregar();
 };
 const handleDelete = async (id: number) => {
 await api.delete(`/contas-pagar/${id}`);
 carregar();
 };
 const handleEdit = (c: any) => {
 setForm({ ID_FORNECEDOR: c.ID_FORNECEDOR, DESCRICAO: c.DESCRICAO, VALOR:
c.VALOR, DATA_VENCIMENTO: c.DATA_VENCIMENTO, STATUS: c.STATUS });
 setEditId(c.ID_CONTA_PAGAR);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Contas a Pagar</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Fornecedor" value={form.ID_FORNECEDOR}
onChange={e => setForm({ ...form, ID_FORNECEDOR: e.target.value })}/>
 <input placeholder="Descrição" value={form.DESCRICAO} onChange={e =>
setForm({ ...form, DESCRICAO: e.target.value })}/>
 <input type="number" placeholder="Valor" value={form.VALOR} onChange={e
=> setForm({ ...form, VALOR: e.target.value })}/>
 <input type="date" value={form.DATA_VENCIMENTO} onChange={e => setForm({
...form, DATA_VENCIMENTO: e.target.value })}/>
 <select value={form.STATUS} onChange={e => setForm({ ...form, STATUS:
e.target.value })}>
 <option value="">Selecione</option>
 <option value="ABERTO">Aberto</option>
 <option value="PAGO">Pago</option>
 <option value="ATRASADO">Atrasado</option>
 </select>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {contas.map((c: any) => (
 <li key={c.ID_CONTA_PAGAR} className="flex gap-2">
 Fornecedor {c.ID_FORNECEDOR} - {c.DESCRICAO} - Valor {c.VALOR} -
{c.STATUS}
 <button onClick={() => handleEdit(c)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(c.ID_CONTA_PAGAR)}
className="bg-red-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Contas a Receber
Arquivo src/app/contas-receber/page.tsx:
"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function ContasReceberPage() {
 const [contas, setContas] = useState<any[]>([]);
 const [form, setForm] = useState({ ID_MORADOR: "", DESCRICAO: "", VALOR: "",
DATA_VENCIMENTO: "", STATUS: "" });
 const [editId, setEditId] = useState<number | null>(null);
 // Carregar lista inicial
 useEffect(() => { carregar(); }, []);
 const carregar = async () => {
 const res = await api.get("/contas-receber");
 setContas(res.data);
 };
 // Criar ou editar
 const handleSubmit = async (e: any) => {
 e.preventDefault();
 if (editId) {
 await api.put(`/contas-receber/${editId}`, form);
 setEditId(null);
 } else {
 await api.post("/contas-receber", form);
 }
 setForm({ ID_MORADOR: "", DESCRICAO: "", VALOR: "", DATA_VENCIMENTO: "",
STATUS: "" });
 carregar();
 };
 // Excluir
 const handleDelete = async (id: number) => {
 await api.delete(`/contas-receber/${id}`);
 carregar();
 };
 // Preparar edição
 const handleEdit = (c: any) => {
 setForm({ ID_MORADOR: c.ID_MORADOR, DESCRICAO: c.DESCRICAO, VALOR: c.VALOR,
DATA_VENCIMENTO: c.DATA_VENCIMENTO, STATUS: c.STATUS });
 setEditId(c.ID_CONTA_RECEBER);
 };
 return (
 <div className="p-6">
 <h1 className="text-xl font-bold">Contas a Receber</h1>
 <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
 <input placeholder="ID Morador" value={form.ID_MORADOR} onChange={e =>
setForm({ ...form, ID_MORADOR: e.target.value })}/>
 <input placeholder="Descrição" value={form.DESCRICAO} onChange={e =>
setForm({ ...form, DESCRICAO: e.target.value })}/>
 <input type="number" placeholder="Valor" value={form.VALOR} onChange={e
=> setForm({ ...form, VALOR: e.target.value })}/>
 <input type="date" value={form.DATA_VENCIMENTO} onChange={e => setForm({
...form, DATA_VENCIMENTO: e.target.value })}/>
 <select value={form.STATUS} onChange={e => setForm({ ...form, STATUS:
e.target.value })}>
 <option value="">Selecione</option>
 <option value="ABERTO">Aberto</option>
 <option value="PAGO">Pago</option>
 <option value="ATRASADO">Atrasado</option>
 </select>
 <button className="bg-blue-500 text-white px-4">{editId ? "Atualizar" :
"Salvar"}</button>
 </form>
 <ul className="mt-6">
 {contas.map((c: any) => (
 <li key={c.ID_CONTA_RECEBER} className="flex gap-2">
 Morador {c.ID_MORADOR} - {c.DESCRICAO} - Valor {c.VALOR} -
{c.STATUS}
 <button onClick={() => handleEdit(c)} className="bg-yellow-500 px2">Editar</button>
 <button onClick={() => handleDelete(c.ID_CONTA_RECEBER)}
className="bg-red-500 px-2">Excluir</button>
 </li>
 ))}
 </ul>
 </div>
 );
}
Resultado
O frontend cobre todas as entidades principais do sistema de gestão de condomínios:
- Pessoas
- Moradores
- Funcionários
- Fornecedores
- Visitantes
- Unidades
- Áreas Comuns
- Reservas
- Boletos
- Comunicados
- Contratos
- Financeiro (Contas a Pagar e Receber)
Todos com CRUD completo (criar, listar, editar, excluir).