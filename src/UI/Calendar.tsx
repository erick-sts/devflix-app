// ============================================================
// COMPONENTE: CALENDÁRIO
// ============================================================
// Este componente exibe um calendário mensal que pode ser aberto/fechado
// Ao clicar duplo em uma data, abre o modal para criar evento

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

// ============================================================
// INTERFACE: Props do componente
// ============================================================
interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onDoubleClickDate: (date: Date) => void;
  events: Array<{ startDateTime: Date | string }>;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function Calendar({
  selectedDate,
  onSelectDate,
  onDoubleClickDate,
  events,
}: CalendarProps) {
  // ============================================================
  // ESTADO: Controla qual mês está sendo exibido
  // ============================================================
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ============================================================
  // ESTADO: Controla o último clique para detectar duplo clique
  // ============================================================
  const [lastClickTime, setLastClickTime] = useState(0);
  const [lastClickedDate, setLastClickedDate] = useState<Date | null>(null);

  // ============================================================
  // FUNÇÃO: Obter nome do mês
  // ============================================================
  const getMonthName = (date: Date) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[date.getMonth()];
  };

  // ============================================================
  // FUNÇÃO: Obter dias do mês atual
  // ============================================================
  // Retorna um array com todos os dias do mês
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);

    // Array para armazenar os dias
    const days = [];

    // Adiciona espaços vazios antes do primeiro dia
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Adiciona todos os dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // ============================================================
  // FUNÇÃO: Verificar se é o dia selecionado
  // ============================================================
  const isSelectedDate = (date: Date | null) => {
    if (!date) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // ============================================================
  // FUNÇÃO: Verificar se é hoje
  // ============================================================
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // ============================================================
  // FUNÇÃO: Verificar se o dia tem eventos
  // ============================================================
  const hasEvents = (date: Date | null) => {
    if (!date) return false;
    return events.some((event) => {
      const eventDate = new Date(event.startDateTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // ============================================================
  // FUNÇÃO: Lidar com clique na data
  // ============================================================
  // Detecta clique simples e duplo clique
  const handleDatePress = (date: Date) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime;

    // Se clicar duas vezes na mesma data em menos de 300ms = duplo clique
    if (
      timeDiff < 300 &&
      lastClickedDate &&
      lastClickedDate.getTime() === date.getTime()
    ) {
      onDoubleClickDate(date);
    } else {
      // Clique simples apenas seleciona a data
      onSelectDate(date);
    }

    setLastClickTime(now);
    setLastClickedDate(date);
  };

  // ============================================================
  // FUNÇÃO: Navegar para o mês anterior
  // ============================================================
  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  // ============================================================
  // FUNÇÃO: Navegar para o próximo mês
  // ============================================================
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // ============================================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ============================================================
  return (
    <View style={styles.container}>
      {/* Cabeçalho com mês/ano e botões de navegação */}
      <View style={styles.header}>
        <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {getMonthName(currentMonth)} {currentMonth.getFullYear()}
        </Text>

        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Dias da semana */}
      <View style={styles.weekDays}>
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <View key={day} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grade de dias do mês */}
      <View style={styles.daysGrid}>
        {getDaysInMonth().map((day, index) => (
          <View key={index} style={styles.dayCell}>
            {day ? (
              <TouchableOpacity
                style={[
                  styles.dayButton,
                  isToday(day) && styles.todayDay,
                  isSelectedDate(day) && styles.selectedDay,
                ]}
                onPress={() => handleDatePress(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    (isSelectedDate(day) || isToday(day)) &&
                      styles.selectedDayText,
                  ]}
                >
                  {day.getDate()}
                </Text>
                {/* Indicador de eventos */}
                {hasEvents(day) && !isToday(day) && !isSelectedDate(day) && (
                  <View style={styles.eventIndicator} />
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.dayButton} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// ESTILOS DO COMPONENTE
// ============================================================
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    width: 40,
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  monthText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekDayText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    position: "relative",
  },
  dayText: {
    color: "#fff",
    fontSize: 14,
  },
  selectedDay: {
    backgroundColor: "#dc143c",
  },
  todayDay: {
    backgroundColor: "#dc143c",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  eventIndicator: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#dc143c",
  },
});
