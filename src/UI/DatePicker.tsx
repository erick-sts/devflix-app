// ============================================================
// COMPONENTE: DATE PICKER (Estilo iPhone)
// ============================================================
// Seletor de data com scroll vertical similar ao iOS
// Permite escolher dia, mês e ano separadamente

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

// ============================================================
// INTERFACE: Props do componente
// ============================================================
interface DatePickerProps {
  value: string; // Formato "DD/MM/YYYY"
  onChange: (date: string) => void;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function DatePicker({ value, onChange }: DatePickerProps) {
  // ============================================================
  // REFS: Referências dos ScrollViews
  // ============================================================
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  // ============================================================
  // FUNÇÃO: Gerar array de dias (1-31)
  // ============================================================
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  // ============================================================
  // FUNÇÃO: Gerar array de meses (1-12)
  // ============================================================
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  // ============================================================
  // FUNÇÃO: Gerar array de anos (1900-2100)
  // ============================================================
  const todayYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => String(1900 + i));

  // ============================================================
  // FUNÇÃO: Extrair dia, mês e ano do valor
  // ============================================================
  const parseDateValue = () => {
    if (!value || value === "Selecione a data") {
      return {
        day: String(new Date().getDate()).padStart(2, "0"),
        month: String(new Date().getMonth() + 1).padStart(2, "0"),
        year: String(new Date().getFullYear()),
      };
    }
    const parts = value.split("/");
    return {
      day: parts[0] || "01",
      month: parts[1] || "01",
      year: parts[2] || String(todayYear),
    };
  };

  const {
    day: currentDay,
    month: currentMonth,
    year: currentYear,
  } = parseDateValue();

  // ============================================================
  // EFEITO: Scroll inicial para o valor selecionado
  // ============================================================
  useEffect(() => {
    const dayIndex = days.indexOf(currentDay);
    const monthIndex = months.indexOf(currentMonth);
    const yearIndex = years.indexOf(currentYear);

    if (dayScrollRef.current && dayIndex !== -1) {
      dayScrollRef.current.scrollTo({
        y: dayIndex * ITEM_HEIGHT,
        animated: false,
      });
    }

    if (monthScrollRef.current && monthIndex !== -1) {
      monthScrollRef.current.scrollTo({
        y: monthIndex * ITEM_HEIGHT,
        animated: false,
      });
    }

    if (yearScrollRef.current && yearIndex !== -1) {
      yearScrollRef.current.scrollTo({
        y: yearIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []);

  // ============================================================
  // FUNÇÃO: Lidar com scroll do dia
  // ============================================================
  const handleDayScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selectedDay = days[index];

    if (selectedDay && selectedDay !== currentDay) {
      onChange(`${selectedDay}/${currentMonth}/${currentYear}`);
    }
  };

  // ============================================================
  // FUNÇÃO: Lidar com scroll do mês
  // ============================================================
  const handleMonthScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selectedMonth = months[index];

    if (selectedMonth && selectedMonth !== currentMonth) {
      onChange(`${currentDay}/${selectedMonth}/${currentYear}`);
    }
  };

  // ============================================================
  // FUNÇÃO: Lidar com scroll do ano
  // ============================================================
  const handleYearScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selectedYear = years[index];

    if (selectedYear && selectedYear !== currentYear) {
      onChange(`${currentDay}/${currentMonth}/${selectedYear}`);
    }
  };

  // ============================================================
  // FUNÇÃO: Renderizar item do picker
  // ============================================================
  const renderItem = (item: string, isSelected: boolean) => (
    <View key={item} style={styles.item}>
      <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
        {item}
      </Text>
    </View>
  );

  // ============================================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ============================================================
  return (
    <View style={styles.container}>
      {/* Coluna de Dias */}
      <View style={styles.column}>
        <ScrollView
          ref={dayScrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleDayScroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Espaçamento superior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />

          {/* Lista de dias */}
          {days.map((day) => renderItem(day, day === currentDay))}

          {/* Espaçamento inferior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
        </ScrollView>
        <Text style={styles.label}>dia</Text>
      </View>

      {/* Separador */}
      <Text style={styles.separator}>/</Text>

      {/* Coluna de Meses */}
      <View style={styles.column}>
        <ScrollView
          ref={monthScrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMonthScroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Espaçamento superior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />

          {/* Lista de meses */}
          {months.map((month) => renderItem(month, month === currentMonth))}

          {/* Espaçamento inferior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
        </ScrollView>
        <Text style={styles.label}>mês</Text>
      </View>

      {/* Separador */}
      <Text style={styles.separator}>/</Text>

      {/* Coluna de Anos */}
      <View style={styles.column}>
        <ScrollView
          ref={yearScrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleYearScroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Espaçamento superior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />

          {/* Lista de anos */}
          {years.map((year) => renderItem(year, year === currentYear))}

          {/* Espaçamento inferior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
        </ScrollView>
        <Text style={styles.label}>ano</Text>
      </View>

      {/* Linhas de seleção */}
      <View style={styles.selectionIndicator} pointerEvents="none">
        <View style={styles.selectionLine} />
        <View style={[styles.selectionLine, { top: ITEM_HEIGHT }]} />
      </View>
    </View>
  );
}

// ============================================================
// ESTILOS DO COMPONENTE
// ============================================================
const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  column: {
    width: 80,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  scrollContent: {
    alignItems: "center",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 20,
    color: "#666",
  },
  selectedItemText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
  },
  separator: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
    marginHorizontal: 4,
  },
  label: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  selectionIndicator: {
    position: "absolute",
    width: "100%",
    height: ITEM_HEIGHT,
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
  },
  selectionLine: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "#333",
  },
});
