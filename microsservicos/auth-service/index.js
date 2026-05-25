import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import 'dotenv/config';


const app = express();

app.use(express.json());
app.use(cors());

const USERS = [];

const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta';

//Rota de registro

app.post('/register', (req, res) => {
    try {
        const { email, password } = req.body;
        USERS.push({ email, password })
        res.status(201).json({ message: 'Usuario cadastrado com sucesso!' })

    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar usuario" })
    }
});


//Rota de login
app.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const user = USERS.find(user => user.email === email && user.password === password);

        if (user) {
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token });
        }
        return res.status(401).json({ message: 'Email ou senha invalidos!' })

    } catch (error) {
        return res.status(401).json({ message: 'Email ou senha invalidos!' })
    }

});

app.listen(3001, () => console.log("Auth service rodando na porta 3001"));

