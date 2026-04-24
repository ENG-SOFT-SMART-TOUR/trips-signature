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

export const destinoApi = {
  listar: () => api.get("/destinos"),

  listarSalvos: (usuarioId: number) =>
    api.get(`/destinos/salvos/${usuarioId}`),

  salvar: (destinoId: number, usuarioId: number) =>
    api.post(`/destinos/${destinoId}/salvar/${usuarioId}`),

  remover: (destinoId: number, usuarioId: number) =>
    api.delete(`/destinos/${destinoId}/salvar/${usuarioId}`),
};

export default api;
