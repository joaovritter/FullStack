// ============================================================================
//  Layout.jsx  —  Casca da aplicação (Ritter&Co)
//   * Desktop: Sidebar fixa à esquerda com a marca da clínica.
//   * Mobile : Bottom Navigation (mobile-first).
// ============================================================================
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, useMediaQuery, BottomNavigation, BottomNavigationAction,
  Paper, Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SpaIcon from '@mui/icons-material/Spa';
import PeopleIcon from '@mui/icons-material/People';
import InsightsIcon from '@mui/icons-material/Insights';

import { CLINICA } from '../clinica.js';

const LARGURA_SIDEBAR = 250;

const itens = [
  { rotulo: 'Início', caminho: '/', icone: <DashboardIcon /> },
  { rotulo: 'Agenda', caminho: '/agenda', icone: <CalendarMonthIcon /> },
  { rotulo: 'Calendario', caminho: '/agendar', icone: <EventAvailableIcon /> },
  { rotulo: 'Gestão', caminho: '/gestao', icone: <InsightsIcon /> },
  { rotulo: 'Procedimentos', caminho: '/procedimentos', icone: <SpaIcon /> },
  { rotulo: 'Pacientes', caminho: '/pacientes', icone: <PeopleIcon /> },
];

// Itens reduzidos na bottom nav do mobile (rótulos curtos).
const itensMobile = [
  { rotulo: 'Início', caminho: '/', icone: <DashboardIcon /> },
  { rotulo: 'Agenda', caminho: '/agenda', icone: <CalendarMonthIcon /> },
  { rotulo: 'Calendario', caminho: '/agendar', icone: <EventAvailableIcon /> },
  { rotulo: 'Gestão', caminho: '/gestao', icone: <InsightsIcon /> },
  { rotulo: 'Clientes', caminho: '/pacientes', icone: <PeopleIcon /> },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const indiceAtual = Math.max(itens.findIndex((i) => i.caminho === pathname), 0);

  // ---- Marca da clínica (logo textual elegante) ----
  const Marca = (
    <Box sx={{ px: 3, py: 3, textAlign: 'center' }}>
      <Typography
        sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 26, color: 'primary.dark', lineHeight: 1 }}
      >
        {CLINICA.nome}
      </Typography>
      <Typography variant="overline" sx={{ letterSpacing: 3, color: 'secondary.dark' }}>
        {CLINICA.subtitulo}
      </Typography>
      <Divider sx={{ mt: 1.5, borderColor: 'rgba(201,162,75,0.25)' }} />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
        {CLINICA.profissional}
      </Typography>
      <Typography variant="caption" sx={{ color: 'primary.main' }}>
        {CLINICA.titulo}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ---------- SIDEBAR (desktop) ---------- */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: LARGURA_SIDEBAR,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: LARGURA_SIDEBAR,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(201,162,75,0.15)',
              bgcolor: 'background.paper',
            },
          }}
        >
          {Marca}
          <List sx={{ px: 1.5 }}>
            {itens.map((item) => {
              const ativo = item.caminho === pathname;
              return (
                <ListItemButton
                  key={item.caminho}
                  selected={ativo}
                  onClick={() => navigate(item.caminho)}
                  sx={{
                    borderRadius: 3,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#fff',
                      '& .MuiListItemIcon-root': { color: '#fff' },
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icone}</ListItemIcon>
                  <ListItemText primary={item.rotulo} />
                </ListItemButton>
              );
            })}
          </List>
        </Drawer>
      )}

      {/* ---------- CONTEÚDO ---------- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          pb: { xs: 11, md: 4 },
          maxWidth: 1180,
          mx: 'auto',
          width: '100%',
        }}
      >
        {children}
      </Box>

      {/* ---------- BOTTOM NAVIGATION (mobile) ---------- */}
      {isMobile && (
        <Paper
          elevation={8}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}
        >
          <BottomNavigation
            showLabels
            value={indiceAtual}
            onChange={(e, novo) => navigate(itensMobile[novo].caminho)}
          >
            {itensMobile.map((item) => (
              <BottomNavigationAction
                key={item.caminho}
                label={item.rotulo}
                icon={item.icone}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
