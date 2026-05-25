//gerencia as notas e valida o acesso via token

import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import 'dotenv/config';
import dns from 'dns';

// Força o Node.js a usar DNS público para ler o Atlas na nuvem sem erros de rede
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta';
const MONGO_URI = process.env.MONGO_URI;

//conectar banco
mongoose.connect(MONGO_URI)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch(error => console.error("Erro na conexão:", error));

const NoteSchema = new mongoose.Schema({
    content: String,
    userEmail: String
});

const Note = mongoose.model('Note', NoteSchema);

//Middleware de autentitacao
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Token nao fornecido!");

    try {
        const decoded = jwt.verify(token, JWT_SECRET); //valida o token e extrai dados
        req.user = decoded; //salva os dados dentro do obj da req (req.user)
        next(); //vai pra proxima rota
    } catch (error) {
        return res.status(401).send("Token invalido!");
    }
}

//rota de notas
app.get('/notes', authenticate, async (req, res) => {
    const notes = await Note.find({ userEmail: req.user.email });
    res.json(notes);
})

app.post('/notes', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        const newNote = new Note({ content, userEmail: req.user.email });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        return res.status(500).send("Erro ao criar nota!");
    }
})

app.delete('/notes/:id', authenticate, async (req, res) => {
    try {
        const note = await Note.deleteOne({ _id: req.params.id, userEmail: req.user.email });
        if (!note.deletedCount) return res.status(404).send("Nota nao encontrada!");
        res.send("Nota deletada com sucesso!");
    } catch (error) {
        return res.status(500).send("Erro ao deletar nota!");
    }
})


app.listen(3002, () => console.log("Note Service rodando na porta 3002"));

