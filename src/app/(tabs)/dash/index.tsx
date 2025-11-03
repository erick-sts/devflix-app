import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";

export default function Dash() {

  const { user } = useAuth();
  
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Dash Screen</Text>
      <Text style={{ color: "#fff" }}>Usuário: {user?.email}</Text>
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
});
