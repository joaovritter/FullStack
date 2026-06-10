// ============================================================================
//  Agenda.jsx  —  Agenda em CALENDÁRIO + detalhe do dia
//
//  * Calendário mensal (DateCalendar) com badge nos dias que têm agendamentos.
//  * Ao clicar num dia, mostra os agendamentos daquele dia com breve detalhe.
//  * Ações: CONCLUIR (registra valor + forma de pagamento -> caixa),
//           EDITAR (status/observações) e CANCELAR.
//    Todas enviam a "versao" (controle de concorrência otimista).
// ============================================================================
import { useEffect, useMemo, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Chip, Box, Stack, Button, IconButton,
  Badge, Divider, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, InputAdornment, Tooltip,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import SpaIcon from '@mui/icons-material/Spa';
import PaymentsIcon from '@mui/icons-material/Payments';
import dayjs from 'dayjs';

import PaginaAnimada from '../components/PaginaAnimada.jsx';
import { useFeedback } from '../context/FeedbackContext.jsx';
import {
  listarAgendamentos, atualizarAgendamento, concluirAgendamento,
  cancelarAgendamento, FORMAS_PAGAMENTO,
} from '../api.js';

const CORES_STATUS = { agendado: 'primary', concluido: 'success', cancelado: 'default' };
const brl = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Dia do calendário com um "ponto" indicando quantidade de agendamentos.
function DiaComBadge(props) {
  const { diasComAgenda = {}, day, outsideCurrentMonth, ...other } = props;
  const chave = day.format('YYYY-MM-DD');
  const qtd = !outsideCurrentMonth ? diasComAgenda[chave] : 0;
  return (
    <Badge
      key={chave}
      overlap="circular"
      color="secondary"
      variant="dot"
      invisible={!qtd}
    >
      <PickersDay day={day} outsideCurrentMonth={outsideCurrentMonth} {...other} />
    </Badge>
  );
}

export default function Agenda() {
  const feedback = useFeedback();
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [diaSel, setDiaSel] = useState(dayjs('2026-06-10')); // dia inicial com agenda

  const [editando, setEditando] = useState(null);
  const [cancelando, setCancelando] = useState(null);
  const [concluindo, setConcluindo] = useState(null); // { ...ag, valor, forma_pagamento }

  const carregar = async () => {
    setCarregando(true);
    try {
      const { data } = await listarAgendamentos();
      setAgendamentos(data);
    } catch {
      feedback.erro('Erro ao carregar a agenda. O backend está rodando?');
    } finally {
      setCarregando(false);
    }
  };
  useEffect(() => { carregar(); }, []); // eslint-disable-line

  // Mapa { 'YYYY-MM-DD': quantidade } para os badges do calendário.
  const diasComAgenda = useMemo(() => {
    const m = {};
    agendamentos.forEach((a) => {
      const k = dayjs(a.data_hora).format('YYYY-MM-DD');
      m[k] = (m[k] || 0) + 1;
    });
    return m;
  }, [agendamentos]);

  // Agendamentos do dia selecionado.
  const doDia = useMemo(
    () => agendamentos
      .filter((a) => dayjs(a.data_hora).isSame(diaSel, 'day'))
      .sort((a, b) => dayjs(a.data_hora) - dayjs(b.data_hora)),
    [agendamentos, diaSel]
  );

  // ---- Ações (todas enviam versao) ----
  const salvarEdicao = async () => {
    try {
      await atualizarAgendamento(editando.id, {
        status: editando.status,
        observacoes: editando.observacoes,
        versao: editando.versao,
      });
      feedback.sucesso('Agendamento atualizado!');
    } catch (e) {
      feedback.erro(e.response?.status === 409
        ? 'Conflito de versão: outra pessoa já alterou este agendamento.'
        : e.response?.data?.erro || 'Erro ao atualizar.');
    }
    setEditando(null); carregar();
  };

  const confirmarConclusao = async () => {
    try {
      await concluirAgendamento(concluindo.id, {
        valor: concluindo.valor,
        forma_pagamento: concluindo.forma_pagamento,
        observacoes: concluindo.observacoes,
        versao: concluindo.versao,
      });
      feedback.sucesso('Procedimento concluído e caixa registrado!');
    } catch (e) {
      feedback.erro(e.response?.status === 409
        ? 'Conflito de versão ao concluir.'
        : e.response?.data?.erro || 'Erro ao concluir.');
    }
    setConcluindo(null); carregar();
  };

  const confirmarCancelamento = async () => {
    try {
      await cancelarAgendamento(cancelando.id, cancelando.versao);
      feedback.sucesso('Agendamento cancelado e horário liberado!');
    } catch (e) {
      feedback.erro(e.response?.status === 409
        ? 'Conflito de versão ao cancelar.'
        : e.response?.data?.erro || 'Erro ao cancelar.');
    }
    setCancelando(null); carregar();
  };

  return (
    <PaginaAnimada titulo="Agenda" subtitulo="Calendário de atendimentos">
      <Grid container spacing={2}>
        {/* ---------- CALENDÁRIO ---------- */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
              <DateCalendar
                value={diaSel}
                onChange={(novo) => setDiaSel(novo)}
                slots={{ day: DiaComBadge }}
                slotProps={{ day: { diasComAgenda } }}
              />
            </CardContent>
          </Card>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
            <Typography variant="caption" color="text.secondary">
              dias com agendamento
            </Typography>
          </Box>
        </Grid>

        {/* ---------- DETALHE DO DIA ---------- */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            {diaSel.format('dddd, DD [de] MMMM [de] YYYY')}
          </Typography>

          {carregando ? (
            <Stack spacing={1.5}>
              {[1, 2].map((i) => <Skeleton key={i} variant="rounded" height={120} />)}
            </Stack>
          ) : doDia.length === 0 ? (
            <Card><CardContent>
              <Typography color="text.secondary">Nenhum agendamento neste dia.</Typography>
            </CardContent></Card>
          ) : (
            <Stack spacing={1.5}>
              {doDia.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif' }}>
                            {dayjs(a.data_hora).format('HH:mm')}
                          </Typography>
                          <Chip size="small" label={a.status} color={CORES_STATUS[a.status]} sx={{ textTransform: 'capitalize' }} />
                        </Box>
                        {a.status === 'concluido' && (
                          <Chip size="small" icon={<PaymentsIcon />} color="success" variant="outlined"
                            label={`${brl(a.valor)} • ${a.forma_pagamento}`} />
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography fontWeight={600}>{a.paciente_nome}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SpaIcon fontSize="small" color="action" />
                        <Typography variant="body2">{a.procedimento_nome} • {a.categoria}</Typography>
                      </Box>
                      {a.observacoes && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          “{a.observacoes}”
                        </Typography>
                      )}

                      {a.status === 'agendado' && (
                        <>
                          <Divider sx={{ my: 1.5 }} />
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Button size="small" variant="contained" startIcon={<CheckCircleIcon />}
                              onClick={() => setConcluindo({
                                ...a,
                                valor: a.valor_referencia ?? '',
                                forma_pagamento: 'Pix',
                              })}>
                              Concluir
                            </Button>
                            <Button size="small" startIcon={<EditIcon />} onClick={() => setEditando({ ...a })}>
                              Editar
                            </Button>
                            <Tooltip title="Cancelar">
                              <IconButton size="small" color="error" onClick={() => setCancelando(a)}>
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </>
                      )}
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                        versão #{a.versao}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>

      {/* ---------- Diálogo CONCLUIR (caixa) ---------- */}
      <Dialog open={!!concluindo} onClose={() => setConcluindo(null)} fullWidth maxWidth="xs">
        <DialogTitle>Concluir procedimento</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {concluindo?.procedimento_nome} — {concluindo?.paciente_nome}
          </Typography>
          <TextField
            label="Valor cobrado" type="number"
            value={concluindo?.valor ?? ''}
            onChange={(e) => setConcluindo((c) => ({ ...c, valor: e.target.value }))}
            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
            helperText="Sugestão preenchida pelo valor de referência do procedimento."
          />
          <TextField
            select label="Forma de pagamento"
            value={concluindo?.forma_pagamento || ''}
            onChange={(e) => setConcluindo((c) => ({ ...c, forma_pagamento: e.target.value }))}
          >
            {FORMAS_PAGAMENTO.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </TextField>
          <TextField
            label="Observações (opcional)" multiline minRows={2}
            value={concluindo?.observacoes || ''}
            onChange={(e) => setConcluindo((c) => ({ ...c, observacoes: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConcluindo(null)}>Voltar</Button>
          <Button variant="contained" color="success"
            disabled={!concluindo?.valor || Number(concluindo?.valor) < 0 || !concluindo?.forma_pagamento}
            onClick={confirmarConclusao}>
            Confirmar conclusão
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------- Diálogo EDITAR ---------- */}
      <Dialog open={!!editando} onClose={() => setEditando(null)} fullWidth maxWidth="xs">
        <DialogTitle>Editar agendamento</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField select label="Status" value={editando?.status || ''}
            onChange={(e) => setEditando((a) => ({ ...a, status: e.target.value }))}>
            <MenuItem value="agendado">Agendado</MenuItem>
            <MenuItem value="cancelado">Cancelado</MenuItem>
          </TextField>
          <TextField label="Observações" multiline minRows={2}
            value={editando?.observacoes || ''}
            onChange={(e) => setEditando((a) => ({ ...a, observacoes: e.target.value }))} />
          <Typography variant="caption" color="text.secondary">
            Para registrar pagamento, use “Concluir”. Enviando versão #{editando?.versao}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditando(null)}>Voltar</Button>
          <Button variant="contained" onClick={salvarEdicao}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* ---------- Diálogo CANCELAR ---------- */}
      <Dialog open={!!cancelando} onClose={() => setCancelando(null)} maxWidth="xs">
        <DialogTitle>Cancelar agendamento</DialogTitle>
        <DialogContent>
          <Typography>
            Cancelar o agendamento de <strong>{cancelando?.paciente_nome}</strong>? O horário será liberado.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelando(null)}>Voltar</Button>
          <Button color="error" variant="contained" onClick={confirmarCancelamento}>Cancelar agendamento</Button>
        </DialogActions>
      </Dialog>
    </PaginaAnimada>
  );
}
