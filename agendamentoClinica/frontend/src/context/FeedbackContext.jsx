// ============================================================================
//  FeedbackContext.jsx  —  Snackbar global de sucesso/erro
//
//  Qualquer componente chama  feedback.sucesso('...')  ou  feedback.erro('...')
//  para mostrar uma mensagem.
// ============================================================================
import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [estado, setEstado] = useState({
    aberto: false,
    mensagem: '',
    tipo: 'success',
  });

  const mostrar = useCallback((mensagem, tipo) => {
    setEstado({ aberto: true, mensagem, tipo });
  }, []);

  const valor = {
    sucesso: (msg) => mostrar(msg, 'success'),
    erro: (msg) => mostrar(msg, 'error'),
    info: (msg) => mostrar(msg, 'info'),
  };

  const fechar = () => setEstado((e) => ({ ...e, aberto: false }));

  return (
    <FeedbackContext.Provider value={valor}>
      {children}
      <Snackbar
        open={estado.aberto}
        autoHideDuration={4000}
        onClose={fechar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={fechar} severity={estado.tipo} variant="filled" sx={{ width: '100%' }}>
          {estado.mensagem}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);
