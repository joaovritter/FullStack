// ============================================================================
//  Dashboard.jsx  —  Início: hero da clínica + cards de totais + sobre a Dra.
// ============================================================================
import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Box, Typography, Skeleton, Avatar, Chip, Stack, Divider, Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpaIcon from '@mui/icons-material/Spa';
import PeopleIcon from '@mui/icons-material/People';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import VerifiedIcon from '@mui/icons-material/Verified';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import PaginaAnimada from '../components/PaginaAnimada.jsx';
import { CLINICA } from '../clinica.js';
import {
  listarAgendamentos, listarProcedimentos, listarPacientes, proximoAgendamento,
} from '../api.js';
import { useFeedback } from '../context/FeedbackContext.jsx';

function CardEstatistica({ titulo, valor, icone, cor, indice, carregando }) {
  return (
    <Grid item xs={6} md={3}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: indice * 0.08, duration: 0.35 }}
        whileHover={{ y: -6 }}
      >
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: cor, width: 48, height: 48 }}>{icone}</Avatar>
            {carregando ? (
              <Skeleton width={60} height={40} />
            ) : (
              <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif' }}>
                {valor}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">{titulo}</Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );
}

export default function Dashboard() {
  const feedback = useFeedback();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState({ total: 0, agendados: 0, procedimentos: 0, pacientes: 0 });
  const [proximo, setProximo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [a, pr, pa, prox] = await Promise.all([
          listarAgendamentos(), listarProcedimentos(), listarPacientes(), proximoAgendamento(),
        ]);
        setDados({
          total: a.data.length,
          agendados: a.data.filter((x) => x.status === 'agendado').length,
          procedimentos: pr.data.length,
          pacientes: pa.data.length,
        });
        setProximo(prox.data);
      } catch {
        feedback.erro('Não foi possível carregar os dados. O backend está rodando?');
      } finally {
        setCarregando(false);
      }
    })();
  }, []); // eslint-disable-line

  return (
    <PaginaAnimada titulo="Início" subtitulo="Visão geral da clínica">
      {/* ---------- HERO ---------- */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          sx={{
            mb: 3,
            background: 'linear-gradient(120deg, #A56A7A 0%, #7E4E5C 60%, #5E3A47 100%)',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Chip
              label={CLINICA.estatistica}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', mb: 1.5 }}
            />
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 26, md: 34 }, fontWeight: 700 }}>
              {CLINICA.slogan}
            </Typography>
            <Typography sx={{ mt: 1, maxWidth: 620, opacity: 0.92 }}>
              {CLINICA.sobre}
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
              <Chip icon={<WhatsAppIcon sx={{ color: '#fff !important' }} />} label={CLINICA.whatsapp}
                sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#fff' }} />
              <Chip icon={<InstagramIcon sx={{ color: '#fff !important' }} />} label={CLINICA.instagram}
                sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#fff' }} />
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------- PRÓXIMO AGENDAMENTO ---------- */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card sx={{ mb: 3, borderLeft: '5px solid', borderColor: 'secondary.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EventAvailableIcon sx={{ color: 'secondary.dark' }} />
              <Typography variant="overline" sx={{ letterSpacing: 2, color: 'secondary.dark' }}>
                Próximo agendamento
              </Typography>
            </Box>
            {carregando ? (
              <Skeleton width="60%" height={32} />
            ) : proximo ? (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                <Box>
                  <Typography variant="h6">{proximo.paciente_nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {proximo.procedimento_nome} • {proximo.categoria}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="body2" color="primary" fontWeight={600}>
                      {dayjs(proximo.data_hora).format('dddd, DD/MM [às] HH:mm')}
                      {proximo.duracao_min ? ` • ${proximo.duracao_min} min` : ''}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="outlined" onClick={() => navigate('/agenda')}>Ver na agenda</Button>
              </Box>
            ) : (
              <Typography color="text.secondary">Nenhum agendamento futuro. Que tal agendar um?</Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------- CARDS DE TOTAIS ---------- */}
      <Grid container spacing={2}>
        <CardEstatistica titulo="Agendamentos" valor={dados.total} icone={<EventNoteIcon />} cor="#A56A7A" indice={0} carregando={carregando} />
        <CardEstatistica titulo="Ativos (agendados)" valor={dados.agendados} icone={<CheckCircleIcon />} cor="#5E8B7E" indice={1} carregando={carregando} />
        <CardEstatistica titulo="Procedimentos" valor={dados.procedimentos} icone={<SpaIcon />} cor="#C9A24B" indice={2} carregando={carregando} />
        <CardEstatistica titulo="Pacientes" valor={dados.pacientes} icone={<PeopleIcon />} cor="#8A6E8E" indice={3} carregando={carregando} />
      </Grid>

      {/* ---------- SOBRE + INFORMAÇÕES ---------- */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontFamily: '"Playfair Display", serif' }}>
                    CR
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{CLINICA.profissional}</Typography>
                    <Typography variant="body2" color="primary">{CLINICA.titulo}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">{CLINICA.bio}</Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  {CLINICA.credenciais.map((c) => (
                    <Box key={c} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <VerifiedIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                      <Typography variant="body2">{c}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={5}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Atendimento</Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <PlaceIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{CLINICA.endereco}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <ScheduleIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{CLINICA.horario}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <WhatsAppIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{CLINICA.whatsapp}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <InstagramIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{CLINICA.instagram}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </PaginaAnimada>
  );
}
