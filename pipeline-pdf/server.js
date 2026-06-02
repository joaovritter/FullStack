const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dirUploads = path.join(__dirname, 'uploads');
if (!fs.existsSync(dirUploads)) {
  fs.mkdirSync(dirUploads);
}

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'www.com.brj',
  database: 'pdf_pipeline',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ============================================================
//  TESTE DE CONEXÃO NO STARTUP
//  Mostra logo de cara se o banco está acessível.
// ============================================================
(async () => {
  try {
    const conn = await pool.getConnection();
    const [r] = await conn.query('SELECT COUNT(*) AS n FROM documentos');
    console.log('\x1b[32m✔ MySQL conectado.\x1b[0m Tabela "documentos" tem', r[0].n, 'registro(s).');
    conn.release();
  } catch (err) {
    console.error('\x1b[31m✗ FALHA ao conectar/consultar o MySQL:\x1b[0m', err.code || err.message);
    console.error('   → Verifique: serviço MySQL ligado, senha em server.js, e se o database.sql foi executado.');
  }
})();

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são aceitos.'), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }
});

function formatarDataParaMysql(dataBr) {
  if (!dataBr) return null;
  const partes = dataBr.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes;
  return `${ano}-${mes}-${dia}`;
}

app.post('/api/upload', upload.single('pdfDocument'), async (req, res) => {
  let filePath = null;
  console.log('\n──────────── NOVO UPLOAD ────────────');
  try {
    if (!req.file) {
      console.warn('[upload] Nenhum arquivo recebido no campo "pdfDocument".');
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    filePath = req.file.path;
    const fileName = req.file.originalname;
    console.log('[upload] Arquivo:', fileName, '| salvo em:', filePath);

    const dataBuffer = await fs.promises.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;
    console.log('[upload] PDF lido. Tamanho do texto extraído:', extractedText.length, 'caracteres.');

    // CNPJ
    const regexCnpj = /CNPJ:\s*([0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2})/i;
    const matchCnpj = extractedText.match(regexCnpj);
    const cnpjFinal = matchCnpj ? matchCnpj[1] : null;

    // E-mail
    const regexEmail = /E-mail:\s*([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/i;
    const matchEmail = extractedText.match(regexEmail);
    const emailFinal = matchEmail ? matchEmail[1].toLowerCase() : null;

    // Data de Emissão
    const regexEmissao = /Data de Emissao:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i;
    const matchEmissao = extractedText.match(regexEmissao);
    const dataEmissaoFormatada = matchEmissao ? formatarDataParaMysql(matchEmissao[1]) : null;

    // Data de Vencimento
    const regexVencimento = /Data de Vencimento:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i;
    const matchVencimento = extractedText.match(regexVencimento);
    const dataVencimentoFormatada = matchVencimento ? formatarDataParaMysql(matchVencimento[1]) : null;

    // Valor Total
    const regexValor = /R\$\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2}|[0-9]+(?:\.[0-9]{2})?)/i;
    const matchValor = extractedText.match(regexValor);
    let valorFinal = null;
    if (matchValor && matchValor[1]) {
      valorFinal = parseFloat(matchValor[1].replace(/\./g, '').replace(',', '.'));
    }

    // Nome do cliente
    const regexNome = /Nome:\s*(.+)/i;
    const matchNome = extractedText.match(regexNome);
    const nomeFinal = matchNome ? matchNome[1].trim() : null;

    // Número da fatura
    const regexNumero = /Numero da Fatura:\s*([A-Z0-9-]+)/i;
    const matchNumero = extractedText.match(regexNumero);
    const numeroFatura = matchNumero ? matchNumero[1].trim() : null;

    // LOG dos campos extraídos
    console.table({
      nome_cliente: nomeFinal,
      numero_fatura: numeroFatura,
      cnpj: cnpjFinal,
      email: emailFinal,
      emissao: dataEmissaoFormatada,
      vencimento: dataVencimentoFormatada,
      valor: valorFinal
    });
    if (!valorFinal && !cnpjFinal && !nomeFinal) {
      console.warn('[upload] ATENÇÃO: nenhum campo foi extraído. O PDF pode não seguir o formato esperado (rótulos "Nome:", "CNPJ:", "R$"...). Mesmo assim será inserido com NULLs.');
    }

    const queryInsert = `
      INSERT INTO documentos (nome_arquivo, nome_cliente, numero_fatura, cnpj, email_cliente, data_emissao, data_vencimento, valor_extraido)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(queryInsert, [
      fileName,
      nomeFinal,
      numeroFatura,
      cnpjFinal,
      emailFinal,
      dataEmissaoFormatada,
      dataVencimentoFormatada,
      valorFinal
    ]);

    console.log('\x1b[32m[upload] ✔ INSERIDO no banco. insertId =', result.insertId, '\x1b[0m');

    res.json({
      message: 'Pipeline concluído com sucesso!',
      insertId: result.insertId,
      dadosExtraidos: {
        arquivo: fileName,
        nomeCliente: nomeFinal,
        numeroFatura: numeroFatura,
        cnpj: cnpjFinal,
        email: emailFinal,
        emissao: dataEmissaoFormatada,
        vencimento: dataVencimentoFormatada,
        valor: valorFinal
      }
    });

  } catch (error) {
    console.error('\x1b[31m[upload] ✗ ERRO no processamento:\x1b[0m', error?.stack || error);
    // Devolve o detalhe do erro para o frontend ajudar no debug
    res.status(500).json({
      error: 'Erro ao processar o arquivo PDF.',
      detalhe: error?.code || error?.message || String(error)
    });
  } finally {
    if (filePath) {
      try {
        await fs.promises.unlink(filePath);
      } catch (unlinkError) {
        console.error('[upload] Erro ao limpar arquivo temporário:', unlinkError);
      }
    }
  }
});

app.get('/api/documentos', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM documentos ORDER BY id DESC');
    console.log('[GET /api/documentos] retornando', rows.length, 'registro(s).');
    res.json(rows);
  } catch (error) {
    console.error('[GET /api/documentos] ERRO:', error.code || error.message);
    res.status(500).json({ error: 'Erro ao buscar documentos.' });
  }
});

app.delete('/api/documentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM documentos WHERE id = ?', [id]);
    console.log('[DELETE] documento', id, 'removido.');
    res.json({ message: 'Documento removido com sucesso.' });
  } catch (error) {
    console.error('[DELETE] ERRO:', error.code || error.message);
    res.status(500).json({ error: 'Erro ao remover documento.' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [total] = await pool.execute('SELECT COUNT(*) as total FROM documentos');
    const [soma] = await pool.execute('SELECT SUM(valor_extraido) as soma FROM documentos');
    const [maior] = await pool.execute('SELECT MAX(valor_extraido) as maior FROM documentos');
    const [recente] = await pool.execute('SELECT data_upload FROM documentos ORDER BY id DESC LIMIT 1');
    res.json({
      total: total[0].total,
      soma: soma[0].soma || 0,
      maior: maior[0].maior || 0,
      recente: recente[0] ? recente[0].data_upload : null
    });
  } catch (error) {
    console.error('[GET /api/stats] ERRO:', error.code || error.message);
    res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\x1b[36mServidor rodando em http://localhost:${PORT}\x1b[0m`);
});
