// ============================================================================
//  Pacientes.jsx  —  CRUD completo de pacientes
// ============================================================================
import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Box, Typography, Avatar, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Skeleton, Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import dayjs from 'dayjs';

import PaginaAnimada from '../components/PaginaAnimada.jsx';
import { useFeedback } from '../context/FeedbackContext.jsx';
import {
  listarPacientes, criarPaciente, atualizarPaciente, excluirPaciente,
} from '../api.js';

const FORM_VAZIO = { nome: '', email: '', telefone: '', data_nascimento: '' };

export default function Pacientes() {
  const feedback = useFeedback();
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(null);

  const carregar = async () => {
    setCarregando(true);
    try {
      const { data } = await listarPacientes();
      setPacientes(data);
    } catch {
      feedback.erro('Erro ao carregar pacientes. O backend está rodando?');
    } finally {
      setCarregando(false);
    }
  };
  useEffect(() => { carregar(); }, []); // eslint-disable-line

  const abrirNovo = () => {
    setForm(FORM_VAZIO);
    setEditandoId(null);
    setDialogoAberto(true);
  };
  const abrirEdicao = (p) => {
    setForm({
      nome: p.nome || '',
      email: p.email || '',
      telefone: p.telefone || '',
      data_nascimento: p.data_nascimento ? dayjs(p.data_nascimento).format('YYYY-MM-DD') : '',
    });
    setEditandoId(p.id);
    setDialogoAberto(true);
  };

  const atualizarCampo = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const salvar = async () => {
    try {
      if (editandoId) {
        await atualizarPaciente(editandoId, form);
        feedback.sucesso('Paciente atualizado!');
      } else {
        await criarPaciente(form);
        feedback.sucesso('Paciente cadastrado!');
      }
      setDialogoAberto(false);
      carregar();
    } catch (e) {
      feedback.erro(e.response?.data?.erro || 'Erro ao salvar paciente.');
    }
  };

  const confirmarExclusao = async () => {
    try {
      await excluirPaciente(excluindo.id);
      feedback.sucesso('Paciente excluído!');
      setExcluindo(null);
      carregar();
    } catch (e) {
      feedback.erro(e.response?.data?.erro || 'Erro ao excluir (há consultas vinculadas?).');
      setExcluindo(null);
    }
  };

  return (
    <PaginaAnimada
      titulo="Pacientes"
      subtitulo={`${pacientes.length} cadastrado(s)`}
      acao={
        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirNovo}>
          Novo paciente
        </Button>
      }
    >
      <Grid container spacing={2}>
        {carregando
          ? [1, 2, 3].map((i) => (
              <Grid item xs={12} md={6} key={i}>
                <Skeleton variant="rounded" height={110} />
              </Grid>
            ))
          : pacientes.map((p, i) => (
              <Grid item xs={12} md={6} key={p.id}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card>
                    <CardContent sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        {p.nome[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>{p.nome}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 14 }} color="action" />
                          <Typography variant="caption" color="text.secondary" noWrap>{p.email}</Typography>
                        </Box>
                        {p.telefone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 14 }} color="action" />
                            <Typography variant="caption" color="text.secondary">{p.telefone}</Typography>
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => abrirEdicao(p)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton size="small" color="error" onClick={() => setExcluindo(p)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
      </Grid>

      {/* ---------- Diálogo criar/editar ---------- */}
      <Dialog open={dialogoAberto} onClose={() => setDialogoAberto(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editandoId ? 'Editar paciente' : 'Novo paciente'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Nome" value={form.nome} onChange={atualizarCampo('nome')} autoFocus />
          <TextField label="E-mail" type="email" value={form.email} onChange={atualizarCampo('email')} />
          <TextField label="Telefone" value={form.telefone} onChange={atualizarCampo('telefone')} />
          <TextField
            label="Data de nascimento" type="date"
            InputLabelProps={{ shrink: true }}
            value={form.data_nascimento} onChange={atualizarCampo('data_nascimento')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAberto(false)}>Cancelar</Button>
          <Button variant="contained" disabled={!form.nome || !form.email} onClick={salvar}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------- Diálogo de exclusão ---------- */}
      <Dialog open={!!excluindo} onClose={() => setExcluindo(null)} maxWidth="xs">
        <DialogTitle>Excluir paciente</DialogTitle>
        <DialogContent>
          <Typography>
            Excluir <strong>{excluindo?.nome}</strong>? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExcluindo(null)}>Voltar</Button>
          <Button color="error" variant="contained" onClick={confirmarExclusao}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </PaginaAnimada>
  );
}
