import { useEffect, useState } from 'react';

const brl = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const num = (v) => v.toLocaleString('pt-BR');

export default function Dashboard({ sessao, onSair }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const resp = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${sessao.token}` },
      });
      if (resp.status === 401) {
        onSair(); // sessao expirou no Redis
        return;
      }
      if (!resp.ok) throw new Error('Falha ao carregar o fechamento');
      setDados(await resp.json());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const f = dados?.fechamento;
  const veioDoCache = dados?.origem === 'cache';
  const maxCat = Math.max(...(f?.porCategoria.map((c) => c.faturamento) ?? [1]));
  const maxMes = Math.max(...(f?.porMes.map((m) => m.faturamento) ?? [1]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Cabecalho */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black">AS</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">Fechamento Consolidado</h1>
            <p className="text-sm text-slate-400">Atacado Sul · {f?.periodo ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div className="text-sm">
            <p className="font-medium">{sessao.colaborador.nome}</p>
            <p className="text-xs text-slate-500">{sessao.colaborador.cargo}</p>
          </div>
          <button
            onClick={onSair}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Barra de status do cache */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {dados && (
          <span
            className={`rounded-full border px-3 py-1 text-sm ${
              veioDoCache
                ? 'border-emerald-700/50 bg-emerald-950/40 text-emerald-300'
                : 'border-amber-700/50 bg-amber-950/40 text-amber-300'
            }`}
          >
            {veioDoCache ? '⚡ Servido do Redis' : '🐢 Recalculado no banco'} · {dados.tempoMs} ms
          </span>
        )}
        <button
          onClick={carregar}
          disabled={carregando}
          className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium transition hover:bg-red-500 disabled:opacity-60"
        >
          {carregando ? 'Carregando…' : 'Recarregar'}
        </button>
      </div>

      {erro && <p className="mb-6 text-sm text-red-400">{erro}</p>}

      {!f && carregando && (
        <p className="text-slate-500">Consolidando os pedidos… (a 1ª carga vem do banco, ~1,5s)</p>
      )}

      {f && (
        <>
          {/* KPIs */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi titulo="Faturamento total" valor={brl(f.kpis.faturamentoTotal)} />
            <Kpi titulo="Pedidos" valor={num(f.kpis.totalPedidos)} />
            <Kpi titulo="Ticket médio" valor={brl(f.kpis.ticketMedio)} />
            <Kpi titulo="Itens vendidos" valor={num(f.kpis.itensVendidos)} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Faturamento por categoria */}
            <Card titulo="Faturamento por categoria">
              <ul className="space-y-3">
                {f.porCategoria.map((c) => (
                  <li key={c.categoria}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-300">{c.categoria}</span>
                      <span className="font-medium tabular-nums">{brl(c.faturamento)}</span>
                    </div>
                    <Barra pct={(c.faturamento / maxCat) * 100} />
                  </li>
                ))}
              </ul>
            </Card>

            {/* Faturamento por mes */}
            <Card titulo="Faturamento por mês">
              <ul className="space-y-3">
                {f.porMes.map((m) => (
                  <li key={m.mes}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-300">{m.mes}</span>
                      <span className="font-medium tabular-nums">{brl(m.faturamento)}</span>
                    </div>
                    <Barra pct={(m.faturamento / maxMes) * 100} cor="bg-sky-500" />
                  </li>
                ))}
              </ul>
            </Card>

            {/* Top produtos */}
            <Card titulo="Top 5 produtos" className="lg:col-span-2">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-2">Produto</th>
                    <th className="pb-2 text-right">Qtd vendida</th>
                    <th className="pb-2 text-right">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {f.topProdutos.map((p) => (
                    <tr key={p.produto}>
                      <td className="py-2 text-slate-300">{p.produto}</td>
                      <td className="py-2 text-right tabular-nums">{num(p.quantidade)}</td>
                      <td className="py-2 text-right font-medium tabular-nums">{brl(p.faturamento)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Fechamento gerado em {new Date(f.gerado_em).toLocaleString('pt-BR')} · cache de 60s no Redis
          </p>
        </>
      )}
    </div>
  );
}

function Kpi({ titulo, valor }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{titulo}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{valor}</p>
    </div>
  );
}

function Card({ titulo, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-6 ${className}`}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">{titulo}</h2>
      {children}
    </section>
  );
}

function Barra({ pct, cor = 'bg-red-500' }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
      <div className={`h-full rounded-full ${cor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
