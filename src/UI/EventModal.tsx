// ============================================================
// COMPONENTE: MODAL DE EVENTO
// ============================================================
// Modal para criar ou editar um evento
// Valida os campos e faz a integração com a API

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";
import {
  Scheduling,
  createScheduling,
  updateScheduling,
  deleteScheduling,
} from "../service/scheduling/schedulingService";

// ============================================================
// INTERFACE: Props do componente
// ============================================================
interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  event?: Scheduling | null;
  initialDate?: Date;
  userId: number;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function EventModal({
  visible,
  onClose,
  onSave,
  event,
  initialDate,
  userId,
}: EventModalProps) {
  // ============================================================
  // ESTADOS: Campos do formulário
  // ============================================================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [timePickerType, setTimePickerType] = useState<"start" | "end">(
    "start"
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // ============================================================
  // EFEITO: Preencher campos quando modal abrir
  // ============================================================
  useEffect(() => {
    if (visible) {
      if (event) {
        // Modo edição: preenche com dados do evento
        const start = new Date(event.startDateTime);
        const end = new Date(event.endDateTime);

        setTitle(event.title);
        setDescription(event.description || "");
        setEventDate(formatDateForInput(start));
        setStartTime(formatTimeForInput(start));
        setEndTime(formatTimeForInput(end));
      } else if (initialDate) {
        // Modo criação: preenche com data inicial
        setTitle("");
        setDescription("");
        setEventDate(formatDateForInput(initialDate));
        setStartTime("09:00");
        setEndTime("10:00");
      }
    }
  }, [visible, event, initialDate]);

  // ============================================================
  // FUNÇÃO: Formatar data para o input (DD/MM/YYYY)
  // ============================================================
  const formatDateForInput = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ============================================================
  // FUNÇÃO: Formatar hora para o input (HH:MM)
  // ============================================================
  const formatTimeForInput = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // ============================================================
  // FUNÇÃO: Converter string de data/hora para Date
  // ============================================================
  const parseDateTime = (dateStr: string, timeStr: string): Date | null => {
    // Espera formato DD/MM/YYYY e HH:MM
    const dateParts = dateStr.split("/");
    const timeParts = timeStr.split(":");

    if (dateParts.length !== 3 || timeParts.length !== 2) {
      return null;
    }

    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    return new Date(year, month, day, hours, minutes);
  };

  // ============================================================
  // FUNÇÃO: Validar campos do formulário
  // ============================================================
  const validateFields = (): boolean => {
    // Validar título
    if (!title.trim()) {
      Alert.alert("Erro", "O título é obrigatório");
      return false;
    }

    if (title.length < 3 || title.length > 50) {
      Alert.alert("Erro", "O título deve ter entre 3 e 50 caracteres");
      return false;
    }

    // Validar descrição
    if (description && description.length > 255) {
      Alert.alert("Erro", "A descrição deve ter no máximo 255 caracteres");
      return false;
    }

    // Validar data e horas
    const startDateTime = parseDateTime(eventDate, startTime);
    const endDateTime = parseDateTime(eventDate, endTime);

    if (!startDateTime || !endDateTime) {
      Alert.alert("Erro", "Data ou hora inválida");
      return false;
    }

    // Validar que hora de fim é depois da hora de início
    if (endDateTime <= startDateTime) {
      Alert.alert("Erro", "A hora de término deve ser após a hora de início");
      return false;
    }

    return true;
  };

  // ============================================================
  // FUNÇÃO: Salvar evento (criar ou atualizar)
  // ============================================================
  const handleSave = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      const startDateTime = parseDateTime(eventDate, startTime);
      const endDateTime = parseDateTime(eventDate, endTime);

      if (!startDateTime || !endDateTime) return;

      if (event?.id) {
        // Atualizar evento existente
        await updateScheduling(event.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
        });
      } else {
        // Criar novo evento
        await createScheduling({
          title: title.trim(),
          description: description.trim() || undefined,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          userId,
        });
      }

      onSave();
      handleClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o evento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: Deletar evento
  // ============================================================
  const handleDelete = () => {
    if (!event?.id) return;

    Alert.alert("Confirmar exclusão", "Deseja realmente excluir este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await deleteScheduling(event.id!);
            onSave();
            handleClose();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o evento");
            console.error(error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // ============================================================
  // FUNÇÃO: Fechar modal e limpar campos
  // ============================================================
  const handleClose = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
    setStartTime("09:00");
    setEndTime("10:00");
    onClose();
  };

  // ============================================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ============================================================
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {event ? "Editar Evento" : "Novo Evento"}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Campo: Título */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título do evento"
                placeholderTextColor="#666"
                maxLength={50}
              />
            </View>

            {/* Campo: Descrição */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Digite uma descrição (opcional)"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                maxLength={255}
              />
            </View>

            {/* Campo: Data do evento */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Data do Evento *</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setDatePickerVisible(true)}
              >
                <Text style={styles.timeInputText}>
                  {eventDate || "Selecione a data"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Campo: Hora de início */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Hora de Início *</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setTimePickerType("start");
                  setTimePickerVisible(true);
                }}
              >
                <Text style={styles.timeInputText}>{startTime}</Text>
              </TouchableOpacity>
            </View>

            {/* Campo: Hora de término */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Hora de Término *</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setTimePickerType("end");
                  setTimePickerVisible(true);
                }}
              >
                <Text style={styles.timeInputText}>{endTime}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Botões de ação */}
          <View style={styles.actions}>
            {event && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                disabled={loading}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            )}

            <View style={styles.rightActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.disabledButton]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Modal do TimePicker */}
      <Modal
        visible={timePickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.timePickerOverlay}>
          <View style={styles.timePickerModal}>
            {/* Cabeçalho do TimePicker */}
            <View style={styles.timePickerHeader}>
              <TouchableOpacity onPress={() => setTimePickerVisible(false)}>
                <Text style={styles.timePickerCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.timePickerTitle}>Selecionar Hora</Text>
              <TouchableOpacity onPress={() => setTimePickerVisible(false)}>
                <Text style={styles.timePickerConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>

            {/* TimePicker */}
            <View style={styles.timePickerContent}>
              <TimePicker
                value={timePickerType === "start" ? startTime : endTime}
                onChange={(time) => {
                  if (timePickerType === "start") {
                    setStartTime(time);
                  } else {
                    setEndTime(time);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal do DatePicker */}
      <Modal
        visible={datePickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View style={styles.timePickerOverlay}>
          <View style={styles.timePickerModal}>
            {/* Cabeçalho do DatePicker */}
            <View style={styles.timePickerHeader}>
              <TouchableOpacity onPress={() => setDatePickerVisible(false)}>
                <Text style={styles.timePickerCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.timePickerTitle}>Selecionar Data</Text>
              <TouchableOpacity onPress={() => setDatePickerVisible(false)}>
                <Text style={styles.timePickerConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>

            {/* DatePicker */}
            <View style={styles.timePickerContent}>
              <DatePicker value={eventDate} onChange={setEventDate} />
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

// ============================================================
// ESTILOS DO COMPONENTE
// ============================================================
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#0a0a0a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  timeInput: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  timeInputText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  timePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  timePickerModal: {
    backgroundColor: "#0a0a0a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  timePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  timePickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  timePickerCancelText: {
    color: "#888",
    fontSize: 16,
  },
  timePickerConfirmText: {
    color: "#dc143c",
    fontSize: 16,
    fontWeight: "600",
  },
  timePickerContent: {
    paddingVertical: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  rightActions: {
    flexDirection: "row",
    gap: 12,
  },
  deleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dc143c",
  },
  deleteButtonText: {
    color: "#dc143c",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#dc143c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
