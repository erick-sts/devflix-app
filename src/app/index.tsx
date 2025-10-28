import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as secureStore from "expo-secure-store";

export default function App() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await secureStore.getItemAsync("accessToken");
        if (token) {
          router.replace("/(tabs)/dash");
          return;
        }
      } catch (error) {
        console.error("Erro ao buscar token:", error);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: 150, height: 150, marginBottom: 10 }}
      />
      <Text style={{ color: "#fff", fontSize: 24, marginBottom: 20 }}>
        Faça login ou cadastra-se!
      </Text>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <Link href="/login">
          <View
            style={{
              backgroundColor: "red",
              borderRadius: 20,
              width: 200,
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Login</Text>
          </View>
        </Link>
        <Link href="/register">
          <View
            style={{
              backgroundColor: "gray",
              borderRadius: 20,
              width: 200,
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Cadastrar-se</Text>
          </View>
        </Link>

        <Link href="/(tabs)/dash/settings">
          <View
            style={{
              backgroundColor: "blue",
              borderRadius: 20,
              width: 200,
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Settings</Text>
          </View>
        </Link>
      </View>

      <StatusBar style="light" backgroundColor="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
