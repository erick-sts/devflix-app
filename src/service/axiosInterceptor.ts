import axios from "axios";
import * as secureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://192.168.31.206:3000",
});

api.interceptors.request.use(
  async (config) => {
    try {
      // garante que headers exista
      config.headers = config.headers || {};
      const token = await secureStore.getItemAsync("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("axios request interceptor: headers set"); // log de verificação
      return config;
    } catch (err) {
      console.error("erro no request interceptor", err);
      // repassa erro para evitar requests inconsistentes
      return Promise.reject(err);
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if ([401, 403].includes(error.response?.status)) {
      await secureStore.deleteItemAsync("accessToken");
      }
    const message =
      error.response?.data?.message || "Ocorreu um erro na requisição";
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
