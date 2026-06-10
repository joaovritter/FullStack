// ============================================================================
//  App.jsx  —  Roteamento principal com animação de transição entre páginas
// ============================================================================
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Agenda from './pages/Agenda.jsx';
import Agendar from './pages/Agendar.jsx';
import Gestao from './pages/Gestao.jsx';
import Procedimentos from './pages/Procedimentos.jsx';
import Pacientes from './pages/Pacientes.jsx';

export default function App() {
  const location = useLocation();
  return (
    <Layout>
      {/* AnimatePresence anima a entrada/saída das páginas ao trocar de rota */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/agendar" element={<Agendar />} />
          <Route path="/gestao" element={<Gestao />} />
          <Route path="/procedimentos" element={<Procedimentos />} />
          <Route path="/pacientes" element={<Pacientes />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
