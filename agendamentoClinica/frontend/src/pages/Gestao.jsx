// ============================================================================
//  Gestao.jsx  —  Painel de gestão (estilo Power BI)
//
//  KPIs + gráficos (faturamento mensal, por procedimento, por forma de
//  pagamento, por status) + extrato do CAIXA. Consome /api/dashboard/*.
//  Os gráficos usam @mui/x-charts.
// ============================================================================
import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Box, Typography, Avatar, Skeleton, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';

import PaginaAnimada from '../components/PaginaAnimada.jsx';
import { useFeedback } from '../context/FeedbackContext.jsx';
import {
  dashResumo, dashFaturamentoMensal, dashPorProcedimento,
  dashPorFormaPagamento, dashPorStatus, dashCaixa,
} from '../api.js';

const brl = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const CORES = ['#A56A7A', '#C9A24B', '#5E8B7E', '#8A6E8E', '#C68B99', '#E0C27E', '#7E4E5C'];
const rotuloMes = (m) => dayjs(m + '-01').format('MMM/YY');

// Card de KPI
function Kpi({ titulo, valor, icone, cor, indice, carregando }) {
  return (
    <Grid item xs={6} md={3}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: indice * 0.07 }}>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Avatar sx={{ bgcolor: cor, width: 44, height: 44 }}>{icone}</Avatar>
            {carregando
              ? <Skeleton width={80} height={34} />
              : <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif' }}>{valor}</Typography>}
            <Typography variant="body2" color="text.secondary">{titulo}</Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );
}

// Casca padrão de um card de gráfico
function CardGrafico({ titulo, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>{titulo}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export default function Gestao() {
  const feedback = useFeedback();
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState(0);
  const [resumo, setResumo] = useState(null);
  const [mensal, setMensal] = useState([]);
  const [porProc, setPorProc] = useState([]);
  const [porForma, setPorForma] = useState([]);
  const [porStatus, setPorStatus] = useState([]);
  const [caixa, setCaixa] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [r, m, pp, pf, ps, cx] = await Promise.all([
          dashResumo(), dashFaturamentoMensal(), dashPorProcedimento(),
          dashPorFormaPagamento(), dashPorStatus(), dashCaixa(),
        ]);
        setResumo(r.data);
        setMensal(m.data);
        setPorProc(pp.data);
        setPorForma(pf.data);
        setPorStatus(ps.data);
        setCaixa(cx.data);
      } catch {
        feedback.erro('Erro ao carregar a gestão. O backend está rodando?');
      } finally {
        setCarregando(false);
      }
    })();
  }, []); // eslint-disable-line

  // ---- dados preparados p/ os gráficos ----
  const meses = mensal.map((x) => rotuloMes(x.mes));
  const fatMes = mensal.map((x) => x.total);
  const topProc = porProc.slice(0, 7); // top 7 por faturamento

  return (
    <PaginaAnimada titulo="Gestão" subtitulo="Indicadores e financeiro da clínica">
      {/* ---------- KPIs ---------- */}
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Kpi titulo="Faturamento total" valor={carregando ? '' : brl(resumo?.faturamento_total)} icone={<PaidIcon />} cor="#5E8B7E" indice={0} carregando={carregando} />
        <Kpi titulo="Faturamento do mês" valor={carregando ? '' : brl(resumo?.faturamento_mes)} icone={<CalendarMonthIcon />} cor="#A56A7A" indice={1} carregando={carregando} />
        <Kpi titulo="Ticket médio" valor={carregando ? '' : brl(resumo?.ticket_medio)} icone={<TrendingUpIcon />} cor="#C9A24B" indice={2} carregando={carregando} />
        <Kpi titulo="Procedimentos concluídos" valor={carregando ? '' : resumo?.concluidos} icone={<ReceiptLongIcon />} cor="#8A6E8E" indice={3} carregando={carregando} />
      </Grid>

      <Tabs value={aba} onChange={(e, v) => setAba(v)} sx={{ mb: 2 }}>
        <Tab label="Visão geral" />
        <Tab label="Caixa / Extrato" />
      </Tabs>

      {/* ===================== ABA 1 — GRÁFICOS ===================== */}
      {aba === 0 && (
        carregando ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} md={6} key={i}><Skeleton variant="rounded" height={300} /></Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {/* Faturamento mensal (linha) */}
            <Grid item xs={12} md={7}>
              <CardGrafico titulo="Faturamento por mês">
                <LineChart
                  height={300}
                  xAxis={[{ scaleType: 'point', data: meses }]}
                  series={[{ data: fatMes, label: 'Faturamento (R$)', color: '#A56A7A', area: true, showMark: true }]}
                  grid={{ horizontal: true }}
                />
              </CardGrafico>
            </Grid>

            {/* Status (pizza) */}
            <Grid item xs={12} md={5}>
              <CardGrafico titulo="Agendamentos por status">
                <PieChart
                  height={300}
                  series={[{
                    data: porStatus.map((s, i) => ({ id: i, value: s.qtd, label: s.status })),
                    innerRadius: 50,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  }]}
                  colors={CORES}
                />
              </CardGrafico>
            </Grid>

            {/* Faturamento por procedimento (barra horizontal) */}
            <Grid item xs={12} md={7}>
              <CardGrafico titulo="Faturamento por procedimento (top 7)">
                <BarChart
                  height={320}
                  layout="horizontal"
                  yAxis={[{ scaleType: 'band', data: topProc.map((p) => p.procedimento), width: 150 }]}
                  series={[{ data: topProc.map((p) => p.total), label: 'R$', color: '#C9A24B' }]}
                  grid={{ vertical: true }}
                  margin={{ left: 8 }}
                />
              </CardGrafico>
            </Grid>

            {/* Forma de pagamento (pizza) */}
            <Grid item xs={12} md={5}>
              <CardGrafico titulo="Faturamento por forma de pagamento">
                <PieChart
                  height={320}
                  series={[{
                    data: porForma.map((f, i) => ({ id: i, value: f.total, label: f.forma })),
                    innerRadius: 40,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    valueFormatter: (it) => brl(it.value),
                  }]}
                  colors={CORES}
                />
              </CardGrafico>
            </Grid>
          </Grid>
        )
      )}

      {/* ===================== ABA 2 — CAIXA ===================== */}
      {aba === 1 && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Chip color="success" label={`Total em caixa: ${brl(resumo?.faturamento_total)}`} />
              <Chip variant="outlined" label={`${caixa.length} lançamentos`} />
              <Chip variant="outlined" label={`Ticket médio: ${brl(resumo?.ticket_medio)}`} />
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Paciente</TableCell>
                    <TableCell>Procedimento</TableCell>
                    <TableCell>Forma</TableCell>
                    <TableCell align="right">Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carregando ? (
                    <TableRow><TableCell colSpan={5}><Skeleton height={120} /></TableCell></TableRow>
                  ) : caixa.length === 0 ? (
                    <TableRow><TableCell colSpan={5}>
                      <Typography color="text.secondary">Nenhum lançamento ainda. Conclua um procedimento na Agenda.</Typography>
                    </TableCell></TableRow>
                  ) : caixa.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>{c.data_conclusao ? dayjs(c.data_conclusao).format('DD/MM/YYYY') : '—'}</TableCell>
                      <TableCell>{c.paciente_nome}</TableCell>
                      <TableCell>{c.procedimento_nome}</TableCell>
                      <TableCell><Chip size="small" variant="outlined" label={c.forma_pagamento} /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{brl(c.valor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </PaginaAnimada>
  );
}
