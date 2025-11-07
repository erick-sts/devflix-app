// ============================================================
// COMPONENTE: CARD DE EVENTO
// ============================================================
// Exibe um card com informações do evento
// Ao clicar, abre o modal em modo de edição

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Scheduling } from "../service/scheduling/schedulingService";

// ============================================================
// INTERFACE: Props do componente
// ============================================================
interface EventCardProps {
  event: Scheduling;
  onPress: (event: Scheduling) => void;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function EventCard({ event, onPress }: EventCardProps) {
  // ============================================================
  // FUNÇÃO: Formatar data e hora
  // ============================================================
  const formatDateTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month} às ${hours}:${minutes}`;
  };

  // ============================================================
  // FUNÇÃO: Calcular duração do evento
  // ============================================================
  const getEventDuration = () => {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
  };

  // ============================================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ============================================================
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(event)}
      activeOpacity={0.7}
    >
      {/* Barra lateral colorida para identificação visual */}
      <View style={styles.colorBar} />

      <View style={styles.content}>
        {/* Título do evento */}
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>

        {/* Descrição do evento (se existir) */}
        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {/* Horários */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatDateTime(event.startDateTime)}
          </Text>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{getEventDuration()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// ESTILOS DO COMPONENTE
// ============================================================
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  colorBar: {
    width: 4,
    backgroundColor: "#dc143c",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeText: {
    color: "#888",
    fontSize: 12,
  },
  durationBadge: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: "#dc143c",
    fontSize: 11,
    fontWeight: "600",
  },
});
