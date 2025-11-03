import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "rgba(0, 0, 0, 0.90)"  },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        headerStyle: { backgroundColor: "rgba(0, 0, 0, 0.90)" },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="scheduling"
        options={{
          tabBarLabel: "Scheduling",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
