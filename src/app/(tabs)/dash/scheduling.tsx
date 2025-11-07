// ============================================================
// TELA: SCHEDULING (AGENDAMENTOS)
// ============================================================
// Esta é a tela principal de agendamentos
// Integra: Calendário, Lista de eventos, Modal de criação/edição

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import Calendar from "../../../UI/Calendar";
import EventList from "../../../UI/EventList";
import EventModal from "../../../UI/EventModal";
import ViewModeSelector from "../../../UI/ViewModeSelector";
import {
  Scheduling as SchedulingType,
  getAllSchedulings,
} from "../../../service/scheduling/schedulingService";

export default function Scheduling() {
  // ============================================================
  // CONTEXTO: Obter dados do usuário logado
  // ============================================================
  const { user } = useAuth();

  // ============================================================
  // ESTADOS: Controle de visualização
  // ============================================================
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SchedulingType | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  // ============================================================
  // ESTADOS: Dados e carregamento
  // ============================================================
  const [events, setEvents] = useState<SchedulingType[]>([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // EFEITO: Carregar eventos ao abrir a tela
  // ============================================================
  useEffect(() => {
    loadEvents();
  }, []);

  // ============================================================
  // FUNÇÃO: Carregar eventos da API
  // ============================================================
  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllSchedulings();
      setEvents(data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: Filtrar eventos por visualização (dia/semana/mês)
  // ============================================================
  const getFilteredEvents = () => {
    const today = new Date();
    const selected = selectedDate;

    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime);

      switch (viewMode) {
        case "day":
          // Filtrar por dia específico
          return (
            eventDate.getDate() === selected.getDate() &&
            eventDate.getMonth() === selected.getMonth() &&
            eventDate.getFullYear() === selected.getFullYear()
          );

        case "week":
          // Filtrar por semana (7 dias a partir da data selecionada)
          const weekStart = new Date(selected);
          weekStart.setDate(selected.getDate() - selected.getDay());
          weekStart.setHours(0, 0, 0, 0);

          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          return eventDate >= weekStart && eventDate <= weekEnd;

        case "month":
          // Filtrar por mês
          return (
            eventDate.getMonth() === selected.getMonth() &&
            eventDate.getFullYear() === selected.getFullYear()
          );

        default:
          return true;
      }
    });
  };

  // ============================================================
  // FUNÇÃO: Abrir modal para criar novo evento
  // ============================================================
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setModalVisible(true);
  };

  // ============================================================
  // FUNÇÃO: Abrir modal para editar evento
  // ============================================================
  const handleEditEvent = (event: SchedulingType) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // ============================================================
  // FUNÇÃO: Duplo clique no calendário abre modal
  // ============================================================
  const handleDoubleClickDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setModalVisible(true);
  };

  // ============================================================
  // FUNÇÃO: Callback após salvar/deletar evento
  // ============================================================
  const handleEventSaved = () => {
    loadEvents();
  };

  // ============================================================
  // FUNÇÃO: Formatar data para exibição
  // ============================================================
  const formatSelectedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return selectedDate.toLocaleDateString("pt-BR", options);
  };

  // ============================================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ============================================================
  return (
    <View style={styles.container}>
      {/* Cabeçalho com botão de calendário */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Agendamentos</Text>
          <Text style={styles.headerSubtitle}>{formatSelectedDate()}</Text>
        </View>

        {/* Botão para abrir/fechar calendário */}
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setCalendarVisible(!calendarVisible)}
        >
          <Ionicons name="calendar-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Seletor de visualização - sempre visível */}
      <View style={styles.filterContainer}>
        <ViewModeSelector currentMode={viewMode} onChangeMode={setViewMode} />
      </View>

      {/* Área scrollável com calendário e lista */}
      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendário (mostra/esconde) */}
        {calendarVisible && (
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onDoubleClickDate={handleDoubleClickDate}
            events={events}
          />
        )}

        {/* Lista de eventos */}
        <View style={styles.eventsSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#dc143c" />
              <Text style={styles.loadingText}>Carregando eventos...</Text>
            </View>
          ) : (
            <EventList
              events={getFilteredEvents()}
              onEventPress={handleEditEvent}
            />
          )}
        </View>
      </ScrollView>

      {/* Botão flutuante para adicionar evento */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateEvent}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal de criação/edição */}
      <EventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleEventSaved}
        event={selectedEvent}
        initialDate={selectedDate}
        userId={user?.id || 0}
      />
    </View>
  );
}

// ============================================================
// ESTILOS DO COMPONENTE
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 8,
  },
  headerSubtitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
    textTransform: "capitalize",
  },
  calendarButton: {
    backgroundColor: "#1a1a1a",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  calendarIcon: {
    fontSize: 24,
  },
  contentScroll: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  eventsSection: {
    padding: 16,
    paddingTop: 0,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#888",
    marginTop: 12,
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#dc143c",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
  },
});
