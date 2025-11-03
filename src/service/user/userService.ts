import api from "../axiosInterceptor";
import * as secureStore from "expo-secure-store";
import { Alert } from "react-native";

export interface User {
  id: string;
  name: string;
  email: string;
}

async function register(name: string, email: string, password: string): Promise<User | void> {
  try {
    const response = await api.post("/users", { name, email, password });
    return response.data;
  } catch (error: any) {
    Alert.alert("Erro", error.message);
  }
}

async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await secureStore.getItemAsync("accessToken");
    if (!token) return null;

    const response = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error: any) {
    Alert.alert("Erro", error.message);
    return null;
  }
}

const userService = {
  register,
  getCurrentUser,
};

export default userService;