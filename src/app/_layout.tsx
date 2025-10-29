import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

/**
 * Layout raiz da aplicação
 * Aqui configuramos a navegação Stack e envolvemos tudo com o AuthProvider
 */
export default function Layout() {
  return (
    // AuthProvider envolve toda a aplicação para que qualquer componente
    // possa acessar o contexto de autenticação usando o hook useAuth()
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "rgba(0, 0, 0, 0.90)" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen name="login/index" options={{ title: "Login" }} />
        <Stack.Screen name="register/index" options={{ title: "Cadastro" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
