// ============================================================
// COMPONENTE: TIME PICKER (Estilo iPhone)
// ============================================================
// Seletor de hora com scroll vertical similar ao iOS
// Permite escolher hora e minuto separadamente

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

// ============================================================
// INTERFACE: Props do componente
// ============================================================
interface TimePickerProps {
  value: string; // Formato "HH:MM"
  onChange: (time: string) => void;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function TimePicker({ value, onChange }: TimePickerProps) {
  // ============================================================
  // REFS: Referências dos ScrollViews
  // ============================================================
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // ============================================================
  // FUNÇÃO: Gerar array de horas (00-23)
  // ============================================================
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  // ============================================================
  // FUNÇÃO: Gerar array de minutos (00-59)
  // ============================================================
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  // ============================================================
  // FUNÇÃO: Extrair hora e minuto do valor
  // ============================================================
  const [currentHour, currentMinute] = value.split(":");

  // ============================================================
  // EFEITO: Scroll inicial para o valor selecionado
  // ============================================================
  useEffect(() => {
    const hourIndex = hours.indexOf(currentHour);
    const minuteIndex = minutes.indexOf(currentMinute);

    if (hourScrollRef.current && hourIndex !== -1) {
      hourScrollRef.current.scrollTo({
        y: hourIndex * ITEM_HEIGHT,
        animated: false,
      });
    }

    if (minuteScrollRef.current && minuteIndex !== -1) {
      minuteScrollRef.current.scrollTo({
        y: minuteIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []);

  // ============================================================
  // FUNÇÃO: Lidar com scroll da hora
  // ============================================================
  const handleHourScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selectedHour = hours[index];

    if (selectedHour && selectedHour !== currentHour) {
      onChange(`${selectedHour}:${currentMinute}`);
    }
  };

  // ============================================================
  // FUNÇÃO: Lidar com scroll do minuto
  // ============================================================
  const handleMinuteScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selectedMinute = minutes[index];

    if (selectedMinute && selectedMinute !== currentMinute) {
      onChange(`${currentHour}:${selectedMinute}`);
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
      {/* Coluna de Horas */}
      <View style={styles.column}>
        <ScrollView
          ref={hourScrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleHourScroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Espaçamento superior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />

          {/* Lista de horas */}
          {hours.map((hour) => renderItem(hour, hour === currentHour))}

          {/* Espaçamento inferior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
        </ScrollView>
        <Text style={styles.label}>hora</Text>
      </View>

      {/* Separador */}
      <Text style={styles.separator}>:</Text>

      {/* Coluna de Minutos */}
      <View style={styles.column}>
        <ScrollView
          ref={minuteScrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMinuteScroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Espaçamento superior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />

          {/* Lista de minutos */}
          {minutes.map((minute) =>
            renderItem(minute, minute === currentMinute)
          )}

          {/* Espaçamento inferior */}
          <View style={{ height: ITEM_HEIGHT * 2 }} />
        </ScrollView>
        <Text style={styles.label}>min</Text>
      </View>

      {/* Linha de seleção */}
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
    marginHorizontal: 8,
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
