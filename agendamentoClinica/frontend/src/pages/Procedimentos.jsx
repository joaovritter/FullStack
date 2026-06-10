// ============================================================================
//  Procedimentos.jsx  —  Catálogo dos tratamentos da Dra. Camila
//   * cards com categoria, descrição, duração, benefícios e "valor sob consulta"
//   * filtro por categoria
// ============================================================================
import { useEffect, useMemo, useState } from 'react';
import {
  Grid, Card, CardContent, Box, Typography, Chip, Skeleton, Stack, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import SpaIcon from '@mui/icons-material/Spa';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

import PaginaAnimada from '../components/PaginaAnimada.jsx';
import { useFeedback } from '../context/FeedbackContext.jsx';
import { listarProcedimentos } from '../api.js';

export default function Procedimentos() {
  const feedback = useFeedback();
  const navigate = useNavigate();
  const [procedimentos, setProcedimentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('Todos');
  const [detalhe, setDetalhe] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await listarProcedimentos();
        setProcedimentos(data);
      } catch {
        feedback.erro('Erro ao carregar procedimentos.');
      } finally {
        setCarregando(false);
      }
    })();
  }, []); // eslint-disable-line

  const categorias = useMemo(
    () => ['Todos', ...new Set(procedimentos.map((p) => p.categoria))],
    [procedimentos]
  );

  const lista = useMemo(
    () => (filtro === 'Todos' ? procedimentos : procedimentos.filter((p) => p.categoria === filtro)),
    [procedimentos, filtro]
  );

  return (
    <PaginaAnimada titulo="Procedimentos" subtitulo={`${procedimentos.length} tratamentos disponíveis`}>
      {/* Filtros por categoria */}
      {!carregando && (
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {categorias.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setFiltro(cat)}
              color={filtro === cat ? 'primary' : 'default'}
              variant={filtro === cat ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      )}

      <Grid container spacing={2}>
        {carregando
          ? [1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={230} />
              </Grid>
            ))
          : lista.map((p, i) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  style={{ height: '100%' }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <SpaIcon sx={{ color: 'secondary.main' }} />
                        <Chip size="small" label={p.categoria} color="secondary" variant="outlined" />
                      </Box>
                      <Typography variant="h6" sx={{ mt: 1.5, fontSize: 19 }}>
                        {p.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {p.descricao}
                      </Typography>

                      <Stack direction="row" spacing={0.5} sx={{ mt: 2, flexWrap: 'wrap', gap: 0.5 }}>
                        {(p.beneficios || []).map((b) => (
                          <Chip
                            key={b}
                            size="small"
                            icon={<CheckIcon sx={{ fontSize: 14 }} />}
                            label={b}
                            sx={{ bgcolor: 'rgba(165,106,122,0.08)' }}
                          />
                        ))}
                      </Stack>
                    </CardContent>

                    <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {p.duracao_min ? `${p.duracao_min} min` : '—'} • valor sob consulta
                        </Typography>
                      </Box>
                      <Button size="small" onClick={() => setDetalhe(p)}>Detalhes</Button>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
      </Grid>

      {/* ---------- Diálogo de detalhe ---------- */}
      <Dialog open={!!detalhe} onClose={() => setDetalhe(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          {detalhe?.nome}
          <Typography variant="body2" color="primary">{detalhe?.categoria}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>{detalhe?.descricao}</Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Detalhe técnico</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {detalhe?.detalhe_tecnico}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {(detalhe?.beneficios || []).map((b) => (
              <Chip key={b} size="small" icon={<CheckIcon sx={{ fontSize: 14 }} />} label={b} />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Duração estimada: {detalhe?.duracao_min ? `${detalhe.duracao_min} min` : '—'} • Valor sob consulta
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalhe(null)}>Fechar</Button>
          <Button variant="contained" onClick={() => navigate('/agendar')}>
            Agendar este procedimento
          </Button>
        </DialogActions>
      </Dialog>
    </PaginaAnimada>
  );
}
