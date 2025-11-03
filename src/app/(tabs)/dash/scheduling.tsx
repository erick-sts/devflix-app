import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ViewModeSelector from "../../../UI/ViewModeSelector";

export default function Scheduling() {
  const [viewMode, setViewMode] = React.useState<"day" | "week" | "month">(
    "day"
  );
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Scheduling Screen</Text>
      <ViewModeSelector currentMode={viewMode} onChangeMode={setViewMode} />
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
