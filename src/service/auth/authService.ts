import { Alert } from "react-native";
import api from "../axiosInterceptor";
import * as secureStore from "expo-secure-store";

 async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth", { email, password });
    const { access_token, user } = response.data;
    
    await secureStore.setItemAsync("accessToken", access_token);
    return user;
  } catch (error : any) {
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