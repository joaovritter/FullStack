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