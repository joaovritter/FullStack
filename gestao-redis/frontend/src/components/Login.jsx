import { useState } from 'react';

export default function Login({ onLogar }) {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo, texto }

  async function entrar(e) {
    e.preventDefault();
    setEnviando(true);
    setAviso(null);
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, senha }),
      });
      const body = await resp.json();

      if (resp.ok) {
        onLogar(body); // { token, colaborador }
        return;
      }
      if (resp.status === 429) {
        setAviso({ tipo: 'bloqueado', texto: `${body.erro} Desbloqueio em ~${body.desbloqueioEmSegundos}s.` });
      } else {
        setAviso({
          tipo: 'erro',
          texto: `${body.erro}${
            body.tentativasRestantes !== undefined ? ` · ${body.tentativasRestantes} tentativa(s) restante(s)` : ''
          }`,
        });
      }
    } catch {
      setAviso({ tipo: 'erro', texto: 'Servidor indisponivel' });
    } finally {
      setEnviando(false);
    }
  }

  const corAviso =
    aviso?.tipo === 'bloqueado'
      ? 'border-red-700/50 bg-red-950/40 text-red-300'
      : 'border-amber-700/50 bg-amber-950/40 text-amber-300';

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl font-black">
            AS
          </div>
          <h1 className="text-xl font-bold">Atacado Sul · Portal Interno</h1>
          <p className="text-sm text-slate-400">Acesso restrito a colaboradores</p>
        </div>

        <form
          onSubmit={entrar}
          className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <input
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            placeholder="Matrícula"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-red-500"
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 font-medium transition hover:bg-red-500 disabled:opacity-60"
          >
            {enviando ? 'Validando…' : 'Entrar'}
          </button>

          {aviso && <div className={`rounded-xl border px-3 py-2 text-sm ${corAviso}`}>{aviso.texto}</div>}
        </form>

        <p className="mt-4 text-center text-xs text-slate-600">
          Teste: <strong className="text-slate-400">12345 / senha_segura</strong> · errar 5× bloqueia o IP (429)
        </p>
      </div>
    </div>
  );
}
