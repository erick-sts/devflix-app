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
import * as secureStore from "expo-secure-store";

export default function Settings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await secureStore.getItemAsync("accessToken");

        if (!token) {
          Alert.alert("Erro ao verificar autenticação.");

          router.replace("/login");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        Alert.alert("Erro ao verificar autenticação.");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Settings Screen</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await secureStore.deleteItemAsync("accessToken");
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
