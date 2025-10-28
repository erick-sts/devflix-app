import { StyleSheet, Text, View } from "react-native";

export default function Dash() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Dash Screen</Text>
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
