import { useState } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  // Restaura a sessao salva (token + dados do colaborador)
  const [sessao, setSessao] = useState(() => {
    const salvo = localStorage.getItem('sessao');
    return salvo ? JSON.parse(salvo) : null;
  });

  function aoLogar(dados) {
    localStorage.setItem('sessao', JSON.stringify(dados));
    setSessao(dados);
  }

  async function sair() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessao.token}` },
      });
    } catch {
      /* mesmo se falhar, encerramos localmente */
    }
    localStorage.removeItem('sessao');
    setSessao(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {sessao ? (
        <Dashboard sessao={sessao} onSair={sair} />
      ) : (
        <Login onLogar={aoLogar} />
      )}
    </div>
  );
}
