import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type ViewMode = "day" | "week" | "month";

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onChangeMode: (mode: ViewMode) => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  currentMode,
  onChangeMode,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, currentMode === "day" && styles.activeTab]}
        onPress={() => onChangeMode("day")}
      >
        <Text
          style={[
            styles.tabText,
            currentMode === "day" && styles.activeTabText,
          ]}
        >
          Dia
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, currentMode === "week" && styles.activeTab]}
        onPress={() => onChangeMode("week")}
      >
        <Text
          style={[
            styles.tabText,
            currentMode === "week" && styles.activeTabText,
          ]}
        >
          Semana
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, currentMode === "month" && styles.activeTab]}
        onPress={() => onChangeMode("month")}
      >
        <Text
          style={[
            styles.tabText,
            currentMode === "month" && styles.activeTabText,
          ]}
        >
          Mês
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 5,
    margin: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#E50914",
  },
  tabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ViewModeSelector;
