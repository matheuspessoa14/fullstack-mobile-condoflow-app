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

interface RegisterPackageScreenProps {
  onGoBack: () => void;
  onConfirmPackage: () => void;
  onPressTab?: (tab: CondoBottomTab) => void;
}

export function RegisterPackageScreen({
  onGoBack,
  onConfirmPackage,
  onPressTab,
}: RegisterPackageScreenProps) {
  const [resident, setResident] = useState("");
  const [date, setDate] = useState("13/03/2026");
  const [time, setTime] = useState("18:00");
  const [size, setSize] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    resident.trim().length > 0 &&
    date.trim().length > 0 &&
    time.trim().length > 0 &&
    size.trim().length > 0 &&
    !isSubmitting;

  async function handleRegisterPackage() {
    if (!canSubmit) {
      Alert.alert(
        "Atenção",
        "Preencha o morador, a data, o horário e o tamanho da encomenda."
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      resident: resident.trim(),
      date: date.trim(),
      time: time.trim(),
      size: size.trim(),
      notes: notes.trim(),
      status: "Recebida",
    };

    try {
      console.log("Enviando encomenda:", payload);

      const response = await api.post("/packages", payload);

      console.log("Encomenda salva:", response.data);

      setResident("");
      setDate("");
      setTime("");
      setSize("");
      setNotes("");

      Alert.alert(
        "Sucesso",
        "Encomenda registrada com sucesso!",
        [
          {
            text: "OK",
            onPress: onConfirmPackage,
          },
        ],
        {
          cancelable: false,
        }
      );
    } catch (error: any) {
      const status = error?.response?.status;
      const responseData = error?.response?.data;
      const message = error?.message;

      console.log("Erro ao registrar encomenda:", {
        status,
        responseData,
        message,
      });

      Alert.alert(
        "Erro",
        responseData?.message ||
          message ||
          "Não foi possível registrar a encomenda."
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
        <CondoTopHeader
          title={"Registrar\nEncomenda"}
          onBack={onGoBack}
        />
      </View>

      <View style={styles.panel}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.formArea}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Morador:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={resident}
              onChangeText={setResident}
              style={styles.fieldInput}
              placeholder="Nome do morador"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
            />
          </View>

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

          <Text style={styles.label}>Tamanho da Encomenda:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={size}
              onChangeText={setSize}
              style={styles.fieldInput}
              placeholder="Pequena, média ou grande"
              placeholderTextColor={BRAND_COLORS.mutedText}
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
            placeholder="Informações adicionais sobre a encomenda"
            placeholderTextColor={BRAND_COLORS.mutedText}
            editable={!isSubmitting}
          />

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !canSubmit && styles.confirmButtonDisabled,
            ]}
            onPress={handleRegisterPackage}
            disabled={!canSubmit}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.confirmButtonText}>
              {isSubmitting
                ? "Registrando..."
                : "Confirmar Encomenda"}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <CondoBottomNav
          active="center"
          onPressTab={onPressTab}
        />
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
    fontSize: 15,
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