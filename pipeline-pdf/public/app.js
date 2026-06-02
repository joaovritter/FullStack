/* ============================================================
   Pipeline de PDFs — app.js (redesign)
   Mantém os mesmos nomes de função do original.
   Tenta a API real (/api/...) e, se falhar (preview sem
   servidor), usa dados MOCK para demonstrar as animações.
   ============================================================ */

// ---- MOCK (fallback de preview) ----
const MOCK_DOCS = [
  { id: 14, nome_arquivo: 'fatura-aurora-tech.pdf', nome_cliente: 'Aurora Tech Ltda', numero_fatura: 'NF-2049', cnpj: '12.345.678/0001-90', email_cliente: 'financeiro@auroratech.com.br', data_emissao: '2026-05-12', data_vencimento: '2026-06-11', valor_extraido: 8420.50, data_upload: '2026-06-01 14:32:00' },
  { id: 13, nome_arquivo: 'boleto-nexity-cloud.pdf', nome_cliente: 'Nexity Cloud SA', numero_fatura: 'NF-2048', cnpj: '98.765.432/0001-21', email_cliente: 'contas@nexitycloud.com', data_emissao: '2026-05-10', data_vencimento: '2026-06-04', valor_extraido: 15780.00, data_upload: '2026-05-30 09:18:00' },
  { id: 12, nome_arquivo: 'invoice-meridian.pdf', nome_cliente: 'Meridian Soluções', numero_fatura: 'NF-2047', cnpj: '45.221.118/0001-08', email_cliente: 'adm@meridian.com.br', data_emissao: '2026-05-02', data_vencimento: '2026-06-02', valor_extraido: 3290.75, data_upload: '2026-05-22 16:05:00' },
  { id: 11, nome_arquivo: 'fatura-vega-energia.pdf', nome_cliente: 'Vega Energia', numero_fatura: 'NF-2046', cnpj: '33.918.220/0001-44', email_cliente: 'cobranca@vegaenergia.com', data_emissao: '2026-04-28', data_vencimento: '2026-05-28', valor_extraido: 6150.00, data_upload: '2026-05-15 11:47:00' },
  { id: 10, nome_arquivo: 'nf-lumina-design.pdf', nome_cliente: 'Lumina Design', numero_fatura: 'NF-2045', cnpj: '21.450.009/0001-67', email_cliente: 'ola@luminadesign.co', data_emissao: '2026-04-20', data_vencimento: '2026-05-20', valor_extraido: 2480.30, data_upload: '2026-05-08 08:12:00' },
  { id: 9, nome_arquivo: 'fatura-orion-log.pdf', nome_cliente: 'Órion Logística', numero_fatura: 'NF-2044', cnpj: '55.012.776/0001-33', email_cliente: 'financeiro@orionlog.com.br', data_emissao: '2026-04-08', data_vencimento: '2026-05-08', valor_extraido: 9930.00, data_upload: '2026-04-25 13:55:00' },
  { id: 8, nome_arquivo: 'boleto-helix-bio.pdf', nome_cliente: 'Helix Bio', numero_fatura: 'NF-2043', cnpj: '77.330.554/0001-12', email_cliente: 'pagar@helixbio.com', data_emissao: '2026-03-30', data_vencimento: '2026-04-29', valor_extraido: 4710.90, data_upload: '2026-04-12 10:03:00' }
];
let USE_MOCK = false;
let BACKEND_OK = false; // definido no init pingando /api/stats

async function api(path, opts) {
  try {
    const res = await fetch(path, opts);
    if (!res.ok) throw new Error('bad');
    USE_MOCK = false;
    return await res.json();
  } catch (e) {
    USE_MOCK = true;
    return mockResponse(path, opts);
  }
}
function mockResponse(path, opts) {
  if (path.startsWith('/api/documentos') && opts && opts.method === 'DELETE') {
    const id = parseInt(path.split('/').pop(), 10);
    const i = MOCK_DOCS.findIndex(d => d.id === id);
    if (i >= 0) MOCK_DOCS.splice(i, 1);
    return { message: 'ok' };
  }
  if (path === '/api/documentos') return [...MOCK_DOCS];
  if (path === '/api/stats') {
    const soma = MOCK_DOCS.reduce((s, d) => s + (d.valor_extraido || 0), 0);
    const maior = MOCK_DOCS.reduce((m, d) => Math.max(m, d.valor_extraido || 0), 0);
    return { total: MOCK_DOCS.length, soma, maior, recente: MOCK_DOCS[0]?.data_upload || null };
  }
  return {};
}

// ---- NAVEGAÇÃO ----
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById(`sec-${name}`);
  // reflow para reiniciar animações de entrada
  sec.classList.remove('active'); void sec.offsetWidth; sec.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick')?.includes(`'${name}'`)) n.classList.add('active');
  });

  const titles = {
    dashboard: ['Dashboard', 'Visão geral do sistema de processamento'],
    upload:    ['Upload PDF', 'Envie e processe um novo documento'],
    documentos:['Documentos', 'Todos os registros persistidos no banco de dados']
  };
  document.getElementById('pageTitle').textContent = titles[name][0];
  document.getElementById('pageSub').textContent   = titles[name][1];

  if (name === 'dashboard') carregarStats();
  if (name === 'documentos') carregarDocumentos();
  if (window.innerWidth <= 760) document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function toggleSidebar() { document.querySelector('.sidebar').classList.toggle('open'); }

// ---- HELPERS de formatação ----
const fmtBRL = v => v != null ? 'R$ ' + parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
const fmtDate = s => s ? new Date(s).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—';

// ---- COUNT-UP ----
function countUp(el, target, { money = false, decimals = 0, dur = 1100 } = {}) {
  if (el.__raf) cancelAnimationFrame(el.__raf);
  const start = performance.now();
  const from = 0;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = from + (target - from) * easeOut(p);
    el.textContent = money
      ? 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(v).toLocaleString('pt-BR');
    if (p < 1) el.__raf = requestAnimationFrame(tick);
  }
  el.__raf = requestAnimationFrame(tick);
}

// ============================================================
//  UPLOAD
// ============================================================
const pdfInput    = document.getElementById('pdfInput');
const dropZone    = document.getElementById('dropZone');
const filePreview = document.getElementById('filePreview');
const btnUpload   = document.getElementById('btnUpload');

pdfInput.addEventListener('change', e => { if (e.target.files[0]) mostrarArquivo(e.target.files[0]); });
dropZone.addEventListener('click', () => pdfInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('drag-over');
  const f = e.dataTransfer.files[0];
  if (f && f.type === 'application/pdf') { pdfInput.files = e.dataTransfer.files; mostrarArquivo(f); }
  else toast('Apenas arquivos PDF são aceitos.', 'error');
});

function mostrarArquivo(file) {
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('fileSize').textContent = formatBytes(file.size);
  dropZone.style.display = 'none';
  filePreview.style.display = 'flex';
  btnUpload.disabled = false;
}
function limparArquivo() {
  pdfInput.value = '';
  dropZone.style.display = 'flex';
  filePreview.style.display = 'none';
  btnUpload.disabled = true;
  document.getElementById('resultCard').style.display = 'none';
}

const ETAPAS = ['Enviando arquivo...', 'Lendo conteúdo do PDF...', 'Extraindo valores e CNPJ...', 'Persistindo no banco...'];

async function fazerUpload() {
  const file = pdfInput.files[0];
  if (!file) return;

  const progressWrap = document.getElementById('progressWrap');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  btnUpload.disabled = true;
  progressWrap.style.display = 'block';
  document.getElementById('resultCard').style.display = 'none';

  let pct = 0, etapa = 0;
  progressText.textContent = ETAPAS[0];
  const interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 14 + 4, 90);
    progressFill.style.width = pct + '%';
    const idx = Math.min(Math.floor(pct / 25), ETAPAS.length - 1);
    if (idx !== etapa) { etapa = idx; progressText.textContent = ETAPAS[etapa]; }
  }, 280);

  const formData = new FormData();
  formData.append('pdfDocument', file);

  // ===== BACKEND REAL: envia de verdade e NÃO mascara erros =====
  if (BACKEND_OK) {
    try {
      console.log('[upload] enviando', file.name, '(' + file.size + ' bytes) para /api/upload');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const body = await res.json().catch(() => ({}));
      clearInterval(interval);
      console.log('[upload] resposta HTTP', res.status, body);

      if (!res.ok) {
        progressWrap.style.display = 'none';
        const msg = body.error || ('HTTP ' + res.status);
        toast('Erro ao salvar no banco: ' + msg, 'error');
        console.error('[upload] FALHOU — nada foi salvo:', msg, body.detalhe || '');
        btnUpload.disabled = false;
        return;
      }

      progressFill.style.width = '100%';
      progressText.textContent = 'Salvo no banco!';
      setTimeout(() => { progressWrap.style.display = 'none'; progressFill.style.width = '0%'; }, 700);
      console.log('[upload] OK — persistido. Dados:', body.dadosExtraidos);
      exibirResultado(body.dadosExtraidos || {});
      toast('PDF salvo no banco com sucesso!', 'success');
      limparArquivo();
      carregarDocumentos(); // recarrega a lista para o registro aparecer
      return;
    } catch (err) {
      clearInterval(interval);
      console.error('[upload] falha de conexão com o servidor:', err);
      progressWrap.style.display = 'none';
      toast('Falha de conexão com o servidor. Veja o terminal do Node.', 'error');
      btnUpload.disabled = false;
      return;
    }
  }

  // ===== MODO DEMONSTRAÇÃO (sem backend) — apenas visual, nada é salvo =====
  await new Promise(r => setTimeout(r, 1200));
  clearInterval(interval);
  const novo = {
    id: (MOCK_DOCS[0]?.id || 0) + 1,
    nome_arquivo: file.name,
    nome_cliente: 'Cliente Demo Ltda',
    numero_fatura: 'NF-' + (2050 + Math.floor(Math.random() * 50)),
    cnpj: '10.234.567/0001-89',
    email_cliente: 'financeiro@clientedemo.com.br',
    data_emissao: '2026-06-01',
    data_vencimento: '2026-07-01',
    valor_extraido: +(Math.random() * 9000 + 800).toFixed(2),
    data_upload: new Date().toISOString()
  };
  MOCK_DOCS.unshift(novo);
  progressFill.style.width = '100%';
  progressText.textContent = 'Concluído (demo)';
  setTimeout(() => { progressWrap.style.display = 'none'; progressFill.style.width = '0%'; }, 700);
  exibirResultado({
    arquivo: novo.nome_arquivo, nomeCliente: novo.nome_cliente, numeroFatura: novo.numero_fatura,
    cnpj: novo.cnpj, email: novo.email_cliente, emissao: novo.data_emissao,
    vencimento: novo.data_vencimento, valor: novo.valor_extraido
  });
  toast('Modo demonstração: nada foi salvo no banco.', 'error');
  limparArquivo();
}

function exibirResultado(d) {
  const card = document.getElementById('resultCard');
  const grid = document.getElementById('resultGrid');
  let i = 0; const delay = () => `style="--d:${(i++) * 70}ms"`;

  grid.innerHTML = `
    <div class="result-item hero" ${delay()}>
      <div class="result-label">Valor Total</div>
      <div class="result-value highlight">${fmtBRL(d.valor)}</div>
    </div>
    <div class="result-item" ${delay()}><div class="result-label">CNPJ</div><div class="result-value mono">${d.cnpj || '—'}</div></div>
    <div class="result-item" ${delay()}><div class="result-label">E-mail</div><div class="result-value">${d.email || '—'}</div></div>
    <div class="result-item" ${delay()}><div class="result-label">Data de Emissão</div><div class="result-value">${fmtDate(d.emissao)}</div></div>
    <div class="result-item" ${delay()}><div class="result-label">Data de Vencimento</div><div class="result-value">${fmtDate(d.vencimento)}</div></div>
    <div class="result-item full" ${delay()}><div class="result-label">Cliente</div><div class="result-value">${d.nomeCliente || '—'}</div></div>
    <div class="result-item full" ${delay()}><div class="result-label">Nº da Fatura</div><div class="result-value mono">${d.numeroFatura || '—'}</div></div>
  `;
  card.style.display = 'block';
}

// ============================================================
//  DOCUMENTOS
// ============================================================
let todosDocumentos = [];

async function carregarDocumentos() {
  todosDocumentos = await api('/api/documentos');
  renderizarTabela(todosDocumentos);
}

function vencBadge(dataVenc) {
  if (!dataVenc) return '<span style="color:var(--text-3)">—</span>';
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const venc = new Date(dataVenc);
  const diff = Math.ceil((venc - hoje) / 86400000);
  const cls = diff < 0 ? 'danger' : diff <= 7 ? 'warn' : 'ok';
  return `<span class="venc ${cls}"><span class="vdot"></span>${fmtDate(dataVenc)}</span>`;
}

function renderizarTabela(docs) {
  const tbody = document.getElementById('tabelaDocumentos');
  if (!docs.length) { tbody.innerHTML = '<tr><td colspan="10" class="empty-state">Nenhum documento encontrado.</td></tr>'; return; }

  tbody.innerHTML = docs.map(doc => {
    const valor = doc.valor_extraido != null ? `<span class="val-strong">${fmtBRL(doc.valor_extraido)}</span>` : '<span style="color:var(--text-3)">—</span>';
    const upload = new Date(doc.data_upload).toLocaleString('pt-BR');
    return `<tr>
      <td><span style="color:var(--text-3)" class="mono">#${doc.id}</span></td>
      <td>
        <div class="file-cell">
          <div class="file-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <span style="max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline-block" title="${doc.nome_arquivo}">${doc.nome_arquivo}</span>
        </div>
      </td>
      <td><div class="cli-name">${doc.nome_cliente || '—'}</div><div class="cli-sub mono">${doc.numero_fatura || ''}</div></td>
      <td class="mono" style="font-size:12.5px">${doc.cnpj || '<span style="color:var(--text-3)">—</span>'}</td>
      <td style="font-size:12.5px">${doc.email_cliente || '<span style="color:var(--text-3)">—</span>'}</td>
      <td>${fmtDate(doc.data_emissao)}</td>
      <td>${vencBadge(doc.data_vencimento)}</td>
      <td>${valor}</td>
      <td style="font-size:11.5px;color:var(--text-3)" class="mono">${upload}</td>
      <td><button class="btn btn-danger" onclick="removerDocumento(${doc.id})" title="Remover">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button></td>
    </tr>`;
  }).join('');
}

function filtrarTabela() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const f = todosDocumentos.filter(d =>
    [d.nome_arquivo, d.cnpj, d.email_cliente, d.nome_cliente, d.numero_fatura].some(v => v && v.toLowerCase().includes(q)));
  renderizarTabela(f);
}

async function removerDocumento(id) {
  if (!confirm('Remover este documento do banco?')) return;
  await api(`/api/documentos/${id}`, { method: 'DELETE' });
  toast('Documento removido.', 'success');
  carregarDocumentos();
}

// ============================================================
//  STATS + CHARTS
// ============================================================
async function carregarStats() {
  const [stats, docs] = await Promise.all([api('/api/stats'), api('/api/documentos')]);

  countUp(document.getElementById('statTotal'), stats.total || 0);
  countUp(document.getElementById('statSoma'), stats.soma || 0, { money: true });
  countUp(document.getElementById('statMaior'), stats.maior || 0, { money: true });
  document.getElementById('statRecente').textContent = stats.recente ? new Date(stats.recente).toLocaleDateString('pt-BR') : '—';
  document.getElementById('chartTotal').textContent = fmtBRL(stats.soma || 0);

  // tabela recentes
  const tbody = document.getElementById('tabelaRecentes');
  if (!docs.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Nenhum documento processado ainda.</td></tr>';
  } else {
    tbody.innerHTML = docs.slice(0, 5).map(doc => `
      <tr>
        <td><div class="file-cell"><div class="file-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <span style="max-width:170px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline-block">${doc.nome_arquivo}</span></div></td>
        <td>${doc.nome_cliente || '<span style="color:var(--text-3)">—</span>'}</td>
        <td>${doc.valor_extraido != null ? `<span class="val-strong">${fmtBRL(doc.valor_extraido)}</span>` : '—'}</td>
        <td style="font-size:12px;color:var(--text-3)" class="mono">${new Date(doc.data_upload).toLocaleString('pt-BR')}</td>
      </tr>`).join('');
  }

  // gráficos
  desenharChart(docs);
  desenharDonut(docs);

  // status badge
  setDbStatus(!USE_MOCK);
}

function setDbStatus(online) {
  const el = document.getElementById('dbStatus');
  if (online) {
    el.className = 'status-badge online';
    el.innerHTML = '<span class="status-dot"></span> Banco conectado';
  } else {
    el.className = 'status-badge offline';
    el.innerHTML = '<span class="status-dot"></span> Modo demonstração (sem backend)';
  }
}

// --- Line/area chart: valor acumulado por upload (mais antigo → recente) ---
function desenharChart(docs) {
  const wrap = document.getElementById('chartWrap');
  if (!docs.length) { wrap.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:var(--text-3);font-size:13px">Sem dados para exibir</div>'; return; }

  const ordered = [...docs].reverse(); // mais antigo primeiro
  let acc = 0;
  const pts = ordered.map(d => { acc += (d.valor_extraido || 0); return acc; });

  const W = 600, H = 210, padL = 8, padR = 8, padT = 18, padB = 26;
  const max = Math.max(...pts) * 1.12 || 1;
  const n = pts.length;
  const x = i => padL + (i / Math.max(n - 1, 1)) * (W - padL - padR);
  const y = v => padT + (1 - v / max) * (H - padT - padB);

  const linePts = pts.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const linePath = 'M' + linePts.join(' L');
  const areaPath = `M${x(0)},${H - padB} L` + linePts.join(' L') + ` L${x(n - 1)},${H - padB} Z`;

  // gridlines
  let grid = '';
  for (let g = 0; g <= 3; g++) { const gy = padT + (g / 3) * (H - padT - padB); grid += `<line x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}"/>`; }

  // dots (só alguns para não poluir)
  const dots = pts.map((v, i) => `<circle class="chart-dot" cx="${x(i)}" cy="${y(v)}" r="4" style="animation-delay:${0.6 + i * 0.08}s; transform-origin:${x(i)}px ${y(v)}px"/>`).join('');

  const len = Math.ceil(linePts.reduce((s, p, i) => { if (i === 0) return 0; const [x1, y1] = linePts[i - 1].split(','); const [x2, y2] = p.split(','); return s + Math.hypot(x2 - x1, y2 - y1); }, 0)) + 10;

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <g class="chart-grid">${grid}</g>
      <path class="area-path" d="${areaPath}"/>
      <path class="line-path" d="${linePath}" style="--len:${len}"/>
      ${dots}
    </svg>`;
}

// --- Donut: distribuição de vencimentos ---
function desenharDonut(docs) {
  const wrap = document.getElementById('donutWrap');
  const legend = document.getElementById('donutLegend');
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  let vencidas = 0, proximas = 0, emDia = 0;
  docs.forEach(d => {
    if (!d.data_vencimento) { emDia++; return; }
    const diff = Math.ceil((new Date(d.data_vencimento) - hoje) / 86400000);
    if (diff < 0) vencidas++; else if (diff <= 7) proximas++; else emDia++;
  });
  const total = docs.length || 1;
  const segs = [
    { name: 'Em dia', val: emDia, color: '#10b981' },
    { name: 'Próximas (7d)', val: proximas, color: '#f0a020' },
    { name: 'Vencidas', val: vencidas, color: '#f43f6b' }
  ];

  const R = 70, C = 2 * Math.PI * R;
  let offset = 0;
  const circles = segs.map(s => {
    const frac = s.val / total;
    const dash = frac * C;
    const el = `<circle class="donut-seg" cx="85" cy="85" r="${R}" stroke="${s.color}"
      stroke-dasharray="${dash} ${C - dash}" stroke-dashoffset="${-offset}"/>`;
    offset += dash;
    return el;
  }).join('');

  wrap.innerHTML = `
    <svg width="170" height="170" viewBox="0 0 170 170">
      <circle cx="85" cy="85" r="${R}" fill="none" stroke="#eef3f1" stroke-width="16"/>
      ${circles}
    </svg>
    <div class="donut-center"><div class="big">${total}</div><div class="sm">faturas</div></div>`;

  legend.innerHTML = segs.map(s => `
    <div class="lg-row"><span class="lg-dot" style="background:${s.color}"></span>
      <span class="lg-name">${s.name}</span><span class="lg-val">${s.val}</span></div>`).join('');
}

// ============================================================
//  TOAST
// ============================================================
function toast(msg, type = 'success') {
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  const icon = type === 'success'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-ico">${icon}</span><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 320); }, 3300);
}

// ---- UTILS ----
function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

// ---- INIT ----
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const r = await fetch('/api/stats');
    BACKEND_OK = r.ok;
  } catch { BACKEND_OK = false; }
  console.log('[init] backend disponível?', BACKEND_OK, '— USE_MOCK será', !BACKEND_OK);
  carregarStats();
});
