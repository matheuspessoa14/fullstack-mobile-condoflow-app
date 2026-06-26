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

interface RegisterOccurrenceScreenProps {
  onGoBack: () => void;
  onConfirmOccurrence: () => void;
  onPressTab?: (tab: CondoBottomTab) => void;
}

function getLocalDateTime(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function RegisterOccurrenceScreen({
  onGoBack,
  onConfirmOccurrence,
  onPressTab,
}: RegisterOccurrenceScreenProps) {
  const [residentName, setResidentName] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [block, setBlock] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    residentName.trim().length > 0 &&
    apartmentNumber.trim().length > 0 &&
    block.trim().length > 0 &&
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    !isSubmitting;

  async function handleRegisterOccurrence() {
    if (!canSubmit) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos obrigatórios da ocorrência."
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      residentName: residentName.trim(),
      apartmentNumber: apartmentNumber.trim(),
      block: block.trim(),
      title: title.trim(),
      description: description.trim(),
      status: "Aberta",
      createdAt: getLocalDateTime(),
    };

    try {
      console.log("Enviando ocorrência:", payload);

      const response = await api.post("/occurrences", payload);

      console.log("Ocorrência registrada:", response.data);

      setResidentName("");
      setApartmentNumber("");
      setBlock("");
      setTitle("");
      setDescription("");

      Alert.alert(
        "Sucesso",
        "Ocorrência registrada com sucesso!",
        [
          {
            text: "OK",
            onPress: onConfirmOccurrence,
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

      console.log("Erro ao registrar ocorrência:", {
        status,
        responseData,
        message,
      });

      Alert.alert(
        "Erro",
        responseData?.message ||
          message ||
          "Não foi possível registrar a ocorrência."
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
          title={"Registrar\nOcorrência"}
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
          <Text style={styles.label}>Nome do Morador:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={residentName}
              onChangeText={setResidentName}
              style={styles.fieldInput}
              placeholder="Digite o nome do morador"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.label}>Número do Apartamento:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={apartmentNumber}
              onChangeText={setApartmentNumber}
              style={styles.fieldInput}
              placeholder="Ex.: 201"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Bloco:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={block}
              onChangeText={setBlock}
              style={styles.fieldInput}
              placeholder="Ex.: Bloco A"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.label}>Título da Ocorrência:</Text>

          <View style={styles.fieldContainer}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.fieldInput}
              placeholder="Ex.: Problema no elevador"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
              autoCapitalize="sentences"
            />
          </View>

          <Text style={styles.label}>Descrição:</Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            style={styles.descriptionInput}
            multiline
            textAlignVertical="top"
            placeholder="Descreva detalhadamente o ocorrido"
            placeholderTextColor={BRAND_COLORS.mutedText}
            editable={!isSubmitting}
            autoCapitalize="sentences"
          />

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !canSubmit && styles.confirmButtonDisabled,
            ]}
            onPress={handleRegisterOccurrence}
            disabled={!canSubmit}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.confirmButtonText}>
              {isSubmitting
                ? "Registrando..."
                : "Confirmar Ocorrência"}
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
    paddingHorizontal: 14,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  fieldInput: {
    flex: 1,
    color: BRAND_COLORS.text,
    fontSize: 15,
  },

  descriptionInput: {
    height: 170,
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