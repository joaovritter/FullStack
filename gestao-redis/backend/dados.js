// ============================================================================
// "Banco de dados" do ERP (em memoria).
// Em um sistema real isso seria um PostgreSQL/MySQL. Aqui geramos uma base de
// pedidos realista UMA vez, na inicializacao, para que o fechamento consolidado
// tenha de fato muitos registros para agregar -- e o cache no Redis faca sentido.
// ============================================================================

// --- Colaboradores que podem acessar o portal (Missao 2 / login) -----------
const colaboradores = [
  { matricula: '12345', senha: 'senha_segura', nome: 'Joao Ritter', cargo: 'Gerente Comercial' },
  { matricula: '20001', senha: 'atacado2026', nome: 'Camila Souza', cargo: 'Analista Financeiro' },
  { matricula: '30007', senha: 'logistica#1', nome: 'Marcos Lima', cargo: 'Supervisor de Logistica' },
];

// --- Catalogo de produtos da distribuidora ---------------------------------
const catalogo = [
  { produto: 'Refrigerante Cola 2L', categoria: 'Bebidas', preco: 8.5 },
  { produto: 'Cerveja Pilsen Lata', categoria: 'Bebidas', preco: 3.9 },
  { produto: 'Agua Mineral 1.5L', categoria: 'Bebidas', preco: 2.2 },
  { produto: 'Suco de Uva 1L', categoria: 'Bebidas', preco: 11.0 },
  { produto: 'Arroz Tipo 1 5kg', categoria: 'Alimentos', preco: 27.9 },
  { produto: 'Feijao Carioca 1kg', categoria: 'Alimentos', preco: 8.2 },
  { produto: 'Oleo de Soja 900ml', categoria: 'Alimentos', preco: 7.5 },
  { produto: 'Macarrao Espaguete 500g', categoria: 'Alimentos', preco: 4.3 },
  { produto: 'Detergente Neutro 500ml', categoria: 'Limpeza', preco: 2.8 },
  { produto: 'Sabao em Po 1kg', categoria: 'Limpeza', preco: 14.9 },
  { produto: 'Agua Sanitaria 2L', categoria: 'Limpeza', preco: 6.4 },
  { produto: 'Sabonete Barra 90g', categoria: 'Higiene', preco: 1.9 },
  { produto: 'Creme Dental 90g', categoria: 'Higiene', preco: 4.6 },
  { produto: 'Papel Higienico 12un', categoria: 'Higiene', preco: 18.5 },
];

// Gerador pseudo-aleatorio deterministico (LCG) -> numeros estaveis a cada boot
function criarRandom(seed) {
  let estado = seed;
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296;
    return estado / 4294967296;
  };
}

// Gera ~8000 pedidos espalhados pelos ultimos 6 meses
function gerarPedidos(quantidade = 8000) {
  const rand = criarRandom(42);
  const pedidos = [];
  const agora = new Date('2026-06-16T12:00:00');

  for (let i = 0; i < quantidade; i++) {
    const diasAtras = Math.floor(rand() * 180); // ate 6 meses
    const data = new Date(agora);
    data.setDate(data.getDate() - diasAtras);

    const qtdItens = 1 + Math.floor(rand() * 4); // 1 a 4 itens por pedido
    const itens = [];
    for (let j = 0; j < qtdItens; j++) {
      const p = catalogo[Math.floor(rand() * catalogo.length)];
      const quantidade = 1 + Math.floor(rand() * 12);
      itens.push({
        produto: p.produto,
        categoria: p.categoria,
        quantidade,
        precoUnitario: p.preco,
        subtotal: +(quantidade * p.preco).toFixed(2),
      });
    }

    pedidos.push({
      id: 1000 + i,
      data: data.toISOString(),
      itens,
      total: +itens.reduce((s, it) => s + it.subtotal, 0).toFixed(2),
    });
  }
  return pedidos;
}

const pedidos = gerarPedidos();

// ============================================================================
// Fechamento consolidado: varre TODOS os pedidos e agrega os indicadores.
// E essa varredura pesada que cacheamos no Redis (Missao 1).
// ============================================================================
function calcularFechamento() {
  const porCategoria = {};
  const porMes = {};
  const porProduto = {};
  let faturamentoTotal = 0;
  let itensVendidos = 0;

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  for (const pedido of pedidos) {
    faturamentoTotal += pedido.total;
    const d = new Date(pedido.data);
    const chaveMes = `${meses[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    porMes[chaveMes] = (porMes[chaveMes] || 0) + pedido.total;

    for (const item of pedido.itens) {
      itensVendidos += item.quantidade;
      porCategoria[item.categoria] = (porCategoria[item.categoria] || 0) + item.subtotal;
      if (!porProduto[item.produto]) porProduto[item.produto] = { faturamento: 0, quantidade: 0 };
      porProduto[item.produto].faturamento += item.subtotal;
      porProduto[item.produto].quantidade += item.quantidade;
    }
  }

  const arredondar = (n) => +n.toFixed(2);

  return {
    gerado_em: new Date().toISOString(),
    periodo: 'Ultimos 6 meses',
    kpis: {
      faturamentoTotal: arredondar(faturamentoTotal),
      totalPedidos: pedidos.length,
      ticketMedio: arredondar(faturamentoTotal / pedidos.length),
      itensVendidos,
    },
    porCategoria: Object.entries(porCategoria)
      .map(([categoria, faturamento]) => ({ categoria, faturamento: arredondar(faturamento) }))
      .sort((a, b) => b.faturamento - a.faturamento),
    porMes: Object.entries(porMes)
      .map(([mes, faturamento]) => ({ mes, faturamento: arredondar(faturamento) }))
      .sort((a, b) => new Date('01 ' + a.mes) - new Date('01 ' + b.mes)),
    topProdutos: Object.entries(porProduto)
      .map(([produto, v]) => ({ produto, faturamento: arredondar(v.faturamento), quantidade: v.quantidade }))
      .sort((a, b) => b.faturamento - a.faturamento)
      .slice(0, 5),
  };
}

module.exports = { colaboradores, calcularFechamento };
