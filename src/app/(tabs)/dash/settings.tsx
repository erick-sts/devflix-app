import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import * as secureStore from "expo-secure-store";

/**
 * Tela de Settings - ROTA PROTEGIDA
 * Esta tela só pode ser acessada por usuários autenticados
 * O AuthContext verifica automaticamente e redireciona para login se necessário
 */
export default function Settings() {
  const router = useRouter();

  // Obtém os estados e funções do contexto de autenticação
  // isLoading: indica se ainda está verificando o token
  // isAuthenticated: indica se o usuário está autenticado
  // setAuthenticated: função para atualizar o estado de autenticação
  const { isLoading, isAuthenticated, setAuthenticated } = useAuth();

  /**
   * Enquanto está verificando o token (isLoading = true),
   * exibe um loading para não mostrar conteúdo antes da verificação
   */
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  /**
   * Se chegou aqui, significa que:
   * 1. Já verificou o token (isLoading = false)
   * 2. O usuário está autenticado (senão teria sido redirecionado pelo AuthContext)
   */
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Settings Screen</Text>

      {/* Botão de Logout */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          // 1. Remove o token do secure store
          await secureStore.deleteItemAsync("accessToken");

          // 2. Atualiza o contexto para marcar como não autenticado
          // Isso dispara o useEffect no AuthContext que redireciona para login
          setAuthenticated(false);

          // 3. Redireciona manualmente para a tela de login
          router.replace("/login");
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E50914",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
