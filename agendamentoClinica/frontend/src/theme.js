import { createTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------------
//  Tema Ritter&Co — estética sofisticada (nude / rosé / dourado / champagne)
// ----------------------------------------------------------------------------
const theme = createTheme({
  palette: {
    primary: { main: '#A56A7A', dark: '#7E4E5C', light: '#C68B99' }, // rosé/mauve
    secondary: { main: '#C9A24B', dark: '#A8862F', light: '#E0C27E' }, // dourado
    background: { default: '#FBF7F4', paper: '#FFFFFF' },              // creme
    text: { primary: '#3A2E30', secondary: '#8A7A7E' },
    success: { main: '#5E8B7E' },
    warning: { main: '#C9893E' },
    error: { main: '#B5524E' },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Jost", "Inter", system-ui, sans-serif',
    // Títulos em serifada elegante (Playfair Display)
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.3 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(165,106,122,0.10)',
          border: '1px solid rgba(201,162,75,0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20 },
        containedPrimary: { boxShadow: '0 6px 18px rgba(165,106,122,0.30)' },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

export default theme;
