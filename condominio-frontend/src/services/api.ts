import axios from "axios";

const api = axios.create({
  // Se estiver usando o IP da rede, lembre-se de trocar aqui se necessário
  baseURL: 'http://localhost:3000', 
});

// Interceptor para injetar o Token em cada requisição automaticamente
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Opcional: Interceptor para deslogar se o token expirar (Erro 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        
        // Se não for a página de login, espera o roteador estabilizar e redireciona
        if (window.location.pathname !== '/login') {
          setTimeout(() => {
            window.location.href = '/login';
          }, 100); // 100ms é o suficiente para o Next inicializar
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;