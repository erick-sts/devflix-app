import axios from "axios";
import * as secureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://192.168.31.206:3000",
});

api.interceptors.request.use(async (config) => {
  const token = await secureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    const data = error?.response?.data;
    const status = error?.response?.status;

    let message = "Erro desconhecido";
    if (data?.message) {
      message = data.message;
    } else if (status) {
      const statusMessages: Record<number, string> = {
        400: "Requisição inválida",
        401: "Não autorizado. Por favor, faça login novamente.",
        403: "Acesso negado",
        404: "Recurso não encontrado",
        500: "Erro interno do servidor",
        503: "Serviço indisponível",
      };
      message = statusMessages[status] || `Erro inesperado: ${status}`;
    } else if (error?.request) {
      message = "Sem resposta do servidor";
    } else if (error?.message) {
      message = error.message;
    }

    // Retorna apenas um objeto simples
    return Promise.reject({ message });
  }
);

export default api;
