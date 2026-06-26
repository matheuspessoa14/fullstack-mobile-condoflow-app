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

interface RegisterVisitorScreenProps {
  onGoBack: () => void;
  onConfirmVisit: () => void;
  onPressTab?: (tab: CondoBottomTab) => void;
}

export function RegisterVisitorScreen({
  onGoBack,
  onConfirmVisit,
  onPressTab,
}: RegisterVisitorScreenProps) {
  const [name, setName] = useState("Luccas Bentim");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("13/03/2026");
  const [time, setTime] = useState("18:00");
  const [notes, setNotes] = useState("");

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    date.trim().length > 0 &&
    time.trim().length > 0;

  async function handleRegisterVisitor() {
    try {
      await api.post("/visitors", {
        name,
        email,
        date,
        time,
        notes,
      });

      Alert.alert("Sucesso", "Visitante cadastrado com sucesso!");

      setName("");
      setEmail("");
      setDate("");
      setTime("");
      setNotes("");

      onConfirmVisit();
    } catch (error: any) {
      console.log(
        "ERRO AO CADASTRAR VISITANTE:",
        error?.response?.data || error?.message || error
      );
      Alert.alert("Erro", "Não foi possível cadastrar o visitante.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerArea}>
        <CondoTopHeader title="Cadastrar Visitantes" onBack={onGoBack} />
      </View>

      <View style={styles.panel}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.formArea}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Apelido do Visitante:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.field}
            placeholder="Nome do visitante"
            placeholderTextColor={BRAND_COLORS.mutedText}
          />

          <Text style={styles.label}>E-mail do Visitante:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.field}
            placeholder="email@exemplo.com"
            placeholderTextColor={BRAND_COLORS.mutedText}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Data:</Text>
          <View style={styles.fieldWithIcon}>
            <TextInput
              value={date}
              onChangeText={setDate}
              style={styles.fieldInput}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={BRAND_COLORS.mutedText}
            />
            <View style={styles.fieldIconWrap}>
              <Text style={styles.fieldIconText}>C</Text>
            </View>
          </View>

          <Text style={styles.label}>Horário:</Text>
          <View style={styles.fieldWithIcon}>
            <TextInput
              value={time}
              onChangeText={setTime}
              style={styles.fieldInput}
              placeholder="00:00"
              placeholderTextColor={BRAND_COLORS.mutedText}
            />
            <Text style={styles.arrowIcon}>v</Text>
          </View>

          <TextInput
            value={notes}
            onChangeText={setNotes}
            style={styles.notes}
            multiline
            textAlignVertical="top"
            placeholder="Observações"
            placeholderTextColor={BRAND_COLORS.info}
          />

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !canSubmit && styles.confirmButtonDisabled,
            ]}
            onPress={handleRegisterVisitor}
            disabled={!canSubmit}
            accessibilityRole="button"
          >
            <Text style={styles.confirmButtonText}>Confirmar Visita!</Text>
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
    paddingBottom: 12,
  },
  label: {
    color: BRAND_COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 6,
  },
  field: {
    height: 50,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingHorizontal: 14,
    color: BRAND_COLORS.mutedText,
    fontSize: 15,
    marginBottom: 18,
  },
  fieldWithIcon: {
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
    color: BRAND_COLORS.mutedText,
    fontSize: 15,
  },
  fieldIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND_COLORS.info,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldIconText: {
    color: BRAND_COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  arrowIcon: {
    color: BRAND_COLORS.primaryLight,
    fontSize: 20,
    lineHeight: 20,
  },
  notes: {
    height: 166,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingHorizontal: 14,
    paddingTop: 14,
    color: BRAND_COLORS.text,
    fontSize: 15,
    marginTop: 22,
    marginBottom: 26,
  },
  confirmButton: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 320,
    height: 50,
    borderRadius: 25,
    backgroundColor: BRAND_COLORS.info,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: BRAND_COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
});