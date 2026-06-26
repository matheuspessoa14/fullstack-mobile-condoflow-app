import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BRAND_COLORS } from "../assets/branding";
import {
  CondoBottomNav,
  CondoBottomTab,
} from "../components/common/CondoBottomNav";
import { CondoTopHeader } from "../components/common/CondoTopHeader";
import { api } from "../services/api";

interface RequestReservationScreenProps {
  onGoBack: () => void;
  onConfirmReservation: () => void;
  onPressTab?: (tab: CondoBottomTab) => void;
}

export function RequestReservationScreen({
  onGoBack,
  onConfirmReservation,
  onPressTab,
}: RequestReservationScreenProps) {
  const [date, setDate] = useState("13/03/2026");
  const [area, setArea] = useState("");
  const [time, setTime] = useState("18:00");
  const [guests, setGuests] = useState("120");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    date.trim().length > 0 &&
    area.trim().length > 0 &&
    time.trim().length > 0 &&
    guests.trim().length > 0 &&
    !isSubmitting;

  async function handleRegisterReservation() {
    if (!canSubmit) {
      Alert.alert(
        "Atenção",
        "Preencha a data, a área, o horário e o número de convidados."
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      date: date.trim(),
      area: area.trim(),
      time: time.trim(),
      guests: guests.trim(),
      notes: notes.trim(),
      status: "Pendente",
    };

    try {
      console.log("Enviando reserva:", payload);

      const response = await api.post("/reservations", payload);

      console.log("Reserva salva:", response.data);

      setDate("");
      setArea("");
      setTime("");
      setGuests("");
      setNotes("");

      Alert.alert(
        "Sucesso",
        "Reserva solicitada com sucesso!",
        [
          {
            text: "OK",
            onPress: onConfirmReservation,
          },
        ],
        {
          cancelable: false,
        }
      );
    } catch (error: any) {
      console.log("Erro ao registrar reserva:", {
        status: error?.response?.status,
        responseData: error?.response?.data,
        message: error?.message,
      });

      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          error?.message ||
          "Não foi possível realizar a reserva."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerArea}>
        <CondoTopHeader title="Adicionar Reserva" onBack={onGoBack} />
      </View>

      <View style={styles.panel}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.formArea}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Data:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={date}
              onChangeText={setDate}
              style={styles.fieldInput}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
            />

            <View style={styles.calendarIconWrap}>
              <Text style={styles.calendarIcon}>C</Text>
            </View>
          </View>

          <Text style={styles.label}>Área:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={area}
              onChangeText={setArea}
              style={styles.fieldInput}
              placeholder="Ex.: Salão de festas"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
            />
          </View>

          <Text style={styles.label}>Horário:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={time}
              onChangeText={setTime}
              style={styles.fieldInput}
              placeholder="00:00"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
            />
          </View>

          <Text style={styles.label}>Número de Convidados:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={guests}
              onChangeText={setGuests}
              style={styles.fieldInput}
              placeholder="0"
              placeholderTextColor={BRAND_COLORS.mutedText}
              keyboardType="numeric"
              editable={!isSubmitting}
            />
          </View>

          <Text style={styles.label}>Observações:</Text>

          <TextInput
            value={notes}
            onChangeText={setNotes}
            style={styles.notes}
            multiline
            textAlignVertical="top"
            placeholder="Informações adicionais sobre a reserva"
            placeholderTextColor={BRAND_COLORS.mutedText}
            editable={!isSubmitting}
          />

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !canSubmit && styles.confirmButtonDisabled,
            ]}
            onPress={handleRegisterReservation}
            disabled={!canSubmit}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.confirmButtonText}>
              {isSubmitting ? "Registrando..." : "Confirmar Reserva"}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <CondoBottomNav active="center" onPressTab={onPressTab} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BRAND_COLORS.primaryLight,
  },

  headerArea: {
    paddingBottom: 10,
  },

  panel: {
    flex: 1,
    backgroundColor: BRAND_COLORS.backgroundMuted,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    overflow: "hidden",
  },

  scroll: {
    flex: 1,
  },

  formArea: {
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 90,
  },

  label: {
    color: BRAND_COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 6,
  },

  fieldContainer: {
    height: 50,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingLeft: 14,
    paddingRight: 12,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  fieldInput: {
    flex: 1,
    color: BRAND_COLORS.text,
    fontSize: 15,
  },

  calendarIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND_COLORS.info,
    alignItems: "center",
    justifyContent: "center",
  },

  calendarIcon: {
    color: BRAND_COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  notes: {
    height: 150,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingHorizontal: 14,
    paddingTop: 14,
    color: BRAND_COLORS.text,
    fontSize: 15,
    marginBottom: 26,
  },

  confirmButton: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 320,
    height: 54,
    borderRadius: 27,
    backgroundColor: BRAND_COLORS.info,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  confirmButtonDisabled: {
    opacity: 0.5,
  },

  confirmButtonText: {
    color: BRAND_COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
});