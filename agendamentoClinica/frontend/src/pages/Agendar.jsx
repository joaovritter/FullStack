// ============================================================================
//  Agendar.jsx  —  Formulário de agendamento (paciente, procedimento, horário)
//
//  Ao confirmar, chama POST /api/agendamentos/agendar (que faz INSERT do
//  agendamento + UPDATE do horário na MESMA transação no backend).
// ============================================================================
import { useEffect, useState } from 'react';
import {
  Card, CardContent, Grid, TextField, MenuItem, Button, Box,
  CircularProgress, Typography, Chip,
} from '@mui/material';
import dayjs from 'dayjs';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import PaginaAnimada from '../components/PaginaAnimada.jsx';
import { useFeedback } from '../context/FeedbackContext.jsx';
import {
  listarPacientes, listarProcedimentos, horariosDisponiveis, agendar,
} from '../api.js';

export default function Agendar() {
  const feedback = useFeedback();
  const [pacientes, setPacientes] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [form, setForm] = useState({
    id_paciente: '',
    id_procedimento: '',
    id_horario: '',
    observacoes: '',
  });
  const [enviando, setEnviando] = useState(false);

  const carregar = async () => {
    try {
      const [p, pr, h] = await Promise.all([
        listarPacientes(), listarProcedimentos(), horariosDisponiveis(),
      ]);
      setPacientes(p.data);
      setProcedimentos(pr.data);
      setHorarios(h.data);
    } catch {
      feedback.erro('Erro ao carregar dados. O backend está rodando?');
    }
  };

  useEffect(() => { carregar(); }, []); // eslint-disable-line

  const atualizar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const podeEnviar =
    form.id_paciente && form.id_procedimento && form.id_horario && !enviando;

  const enviar = async () => {
    setEnviando(true);
    try {
      await agendar(form);
      feedback.sucesso('Agendamento criado com sucesso!');
      setForm({ id_paciente: '', id_procedimento: '', id_horario: '', observacoes: '' });
      // recarrega horários (o escolhido já não estará disponível)
      const { data } = await horariosDisponiveis();
      setHorarios(data);
    } catch (e) {
      feedback.erro(e.response?.data?.erro || 'Erro ao criar agendamento.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <PaginaAnimada titulo="Calendario" subtitulo="Selecione a paciente, o procedimento e o horário">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select fullWidth label="Paciente"
                value={form.id_paciente} onChange={atualizar('id_paciente')}
              >
                {pacientes.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select fullWidth label="Procedimento"
                value={form.id_procedimento} onChange={atualizar('id_procedimento')}
              >
                {procedimentos.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nome} — {p.categoria}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select fullWidth label="Horário disponível"
                value={form.id_horario} onChange={atualizar('id_horario')}
                helperText={
                  horarios.length === 0
                    ? 'Nenhum horário disponível no momento.'
                    : 'Horários livres da clínica (Seg–Sex, 08:00–21:00).'
                }
              >
                {horarios.map((h) => (
                  <MenuItem key={h.id} value={h.id}>
                    {dayjs(h.data_hora).format('DD/MM/YYYY [às] HH:mm')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth multiline minRows={2} label="Observações (opcional)"
                value={form.observacoes} onChange={atualizar('observacoes')}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained" size="large"
                  startIcon={enviando ? <CircularProgress size={18} color="inherit" /> : <EventAvailableIcon />}
                  disabled={!podeEnviar}
                  onClick={enviar}
                >
                  Confirmar agendamento
                </Button>
                {form.id_horario && <Chip color="secondary" label="Horário selecionado" />}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        * O agendamento insere o registro e marca o horário como indisponível na MESMA transação (padrão da aula).
      </Typography>
    </PaginaAnimada>
  );
}
