import { Stack } from "expo-router";

export default function Layout() {
  return (
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
  );
}
