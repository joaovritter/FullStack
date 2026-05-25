import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const API_AUTH = import.meta.env.VITE_API_AUTH;
    const API_NOTES = import.meta.env.VITE_API_NOTES;

    // Carregar token salvo ao carregar a página
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // Buscar notas sempre que o token mudar
    useEffect(() => {
        if (token) {
            fetchNotes();
        }
    }, [token]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_AUTH}/login`, { email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
        } catch (error) {
            alert(error.response?.data?.message || "Erro ao realizar login");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_AUTH}/register`, { email, password });
            alert("Cadastro realizado com sucesso! Agora faça login.");
            setIsRegisterMode(false);
            setPassword('');
        } catch (error) {
            alert(error.response?.data?.message || "Erro ao realizar cadastro");
        }
    };

    const fetchNotes = async () => {
        try {
            const res = await axios.get(`${API_NOTES}/notes`, {
                headers: { Authorization: token }
            });
            setNotes(res.data);
        } catch (error) {
            console.error("Erro ao buscar notas:", error);
            if (error.response?.status === 401) {
                handleLogoutClick();
            }
        }
    };

    const addNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            const res = await axios.post(`${API_NOTES}/notes`, 
                { content: newNote }, 
                { headers: { Authorization: token } }
            );
            setNotes([res.data, ...notes]);
            setNewNote('');
        } catch (error) {
            alert("Erro ao salvar nota");
        }
    };

    const deleteNote = async (id) => {
        try {
            await axios.delete(`${API_NOTES}/notes/${id}`, {
                headers: { Authorization: token }
            });
            setNotes(notes.filter(note => note._id !== id));
        } catch (error) {
            alert("Erro ao deletar nota");
        }
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        setToken('');
        setNotes([]);
        setEmail('');
        setPassword('');
    };

    // --- TELA DE AUTENTICAÇÃO (LOGIN / REGISTRO) ---
    if (!token) {
        return (
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>{isRegisterMode ? "Criar Conta" : "Entrar"}</h1>
                        <p>{isRegisterMode ? "Cadastre-se no Sistema UFN" : "Gerencie suas notas acadêmicas com segurança"}</p>
                    </div>

                    <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
                        <div className="form-group">
                            <label>E-mail</label>
                            <input 
                                type="email" 
                                className="input-control"
                                placeholder="exemplo@ufn.edu.br" 
                                value={email}
                                onChange={e => setEmail(e.target.value)} 
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <input 
                                type="password" 
                                className="input-control"
                                placeholder="Sua senha" 
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            {isRegisterMode ? "Cadastrar" : "Acessar Sistema"}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        <span>{isRegisterMode ? "Já tem uma conta?" : "Ainda não tem conta?"}</span>
                        <button 
                            className="auth-toggle-link"
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setPassword('');
                            }}
                        >
                            {isRegisterMode ? "Faça login" : "Cadastre-se"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- TELA DO DASHBOARD (NOTAS) ---
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-info">
                    <h2>Minhas Notas</h2>
                    <p>Conectado como: <strong>{email || "Usuário UFN"}</strong></p>
                </div>
                <button onClick={handleLogoutClick} className="btn-outline">
                    Sair da Conta
                </button>
            </header>

            <main>
                <form onSubmit={addNote} className="note-form">
                    <h3>Criar Nova Anotação</h3>
                    <textarea 
                        className="textarea-control"
                        placeholder="Digite o conteúdo da sua nota acadêmica aqui..." 
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        required
                    />
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            Salvar Nota
                        </button>
                    </div>
                </form>

                <div className="notes-grid">
                    {notes.length === 0 ? (
                        <div className="empty-state">
                            <p>Nenhuma nota encontrada.</p>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Comece escrevendo uma nova anotação acima!
                            </span>
                        </div>
                    ) : (
                        notes.map(note => (
                            <div key={note._id} className="note-card">
                                <p className="note-content">{note.content}</p>
                                <div className="note-footer">
                                    <button 
                                        onClick={() => deleteNote(note._id)} 
                                        className="btn-delete"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
