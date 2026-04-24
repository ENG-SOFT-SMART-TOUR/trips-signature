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

export const roteiroApi = {
  criar: (data: { usuarioId: number; destinoId: number; dataIda: string; dataVolta: string }) =>
    api.post('/roteiros', data),

  buscarPorId: (id: number) =>
    api.get(`/roteiros/${id}`),

  listarPorUsuario: (usuarioId: number) =>
    api.get(`/roteiros/usuario/${usuarioId}`),

  deletar: (roteiroId: number, usuarioId: number) =>
    api.delete(`/roteiros/${roteiroId}/usuario/${usuarioId}`),
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
