import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

// Locale global pt-BR para todas as formatações com dayjs (datas por extenso).
dayjs.locale('pt-br');

import App from './App.jsx';
import theme from './theme.js';
import { FeedbackProvider } from './context/FeedbackContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Adapter de datas em pt-BR para o seletor de data/hora (MUI X) */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        {/* Provider do Snackbar global de feedback (sucesso/erro) */}
        <FeedbackProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FeedbackProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
