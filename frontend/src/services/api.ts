import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const authApi = {
  cadastrar: (data: { nome: string; email: string; senha: string }) =>
    api.post("/auth/cadastro", data),

  login: (data: { email: string; senha: string }) =>
    api.post("/auth/login", data),
};

export const quizApi = {
  getPerguntas: () => api.get("/quiz/perguntas"),

  responder: (data: { usuarioId: number; tags: string[] }) =>
    api.post("/quiz/responder", data),
};

export default api;
