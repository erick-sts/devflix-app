import { Alert } from "react-native";
import api from "../axiosInterceptor";
import * as secureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { access_token } = response.data;

    // Decodifica o token para extrair informações do usuário
    const decoded: any = jwtDecode(access_token);
    const user = { email: decoded.email, id: decoded.sub };
    
    await secureStore.setItemAsync("accessToken", access_token);
    return user;
  } catch (error: any) {
    Alert.alert("Erro", error.message);
  }
}

async function logout() {
  await secureStore.deleteItemAsync("accessToken");
}

const loginService = {
  login,
  logout,
};

export default loginService;
