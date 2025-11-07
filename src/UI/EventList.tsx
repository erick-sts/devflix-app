// ============================================================
// COMPONENTE: LISTA DE EVENTOS
// ============================================================
// Exibe uma lista de eventos em cards
// Mostra mensagem quando não há eventos

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import EventCard from "./EventCard";
import { Scheduling } from "../service/scheduling/schedulingService";

// ============================================================
// INTERFACE: Props do componente
// ============================================================
interface EventListProps {
  events: Scheduling[];
  onEventPress: (event: Scheduling) => void;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function EventList({ events, onEventPress }: EventListProps) {
  // ============================================================
  // RENDERIZAÇÃO: Lista vazia
  // ============================================================
  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
        <Text style={styles.emptySubText}>
          Clique no botão "+" para criar um novo evento
        </Text>
      </View>
    );
  }

  // ============================================================
  // RENDERIZAÇÃO: Lista com eventos
  // ============================================================
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Contador de eventos */}
      <Text style={styles.countText}>
        {events.length} {events.length === 1 ? "evento" : "eventos"}
      </Text>

      {/* Lista de cards */}
      {events.map((event) => (
        <EventCard key={event.id} event={event} onPress={onEventPress} />
      ))}
    </ScrollView>
  );
}

// ============================================================
// ESTILOS DO COMPONENTE
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  countText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
});
