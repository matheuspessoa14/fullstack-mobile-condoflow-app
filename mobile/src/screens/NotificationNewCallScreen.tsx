import { useState } from "react";
import {
  ActivityIndicator,
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
import { api } from "../services/api";

interface NotificationNewCallScreenProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

type Category =
  | "Manutenção"
  | "Segurança"
  | "Barulho"
  | "Limpeza"
  | "Outros";

type Priority = "Baixa" | "Média" | "Alta" | "Urgente";

const categories: Category[] = [
  "Manutenção",
  "Segurança",
  "Barulho",
  "Limpeza",
  "Outros",
];

const priorities: Priority[] = [
  "Baixa",
  "Média",
  "Alta",
  "Urgente",
];

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

export function NotificationNewCallScreen({
  onConfirm,
  onCancel,
  onDismiss,
}: NotificationNewCallScreenProps) {
  const [residentName, setResidentName] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [block, setBlock] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormComplete =
    residentName.trim() !== "" &&
    apartmentNumber.trim() !== "" &&
    block.trim() !== "" &&
    title.trim() !== "" &&
    category !== null &&
    priority !== null &&
    description.trim() !== "";

  function validateForm(): string | null {
    if (!residentName.trim()) {
      return "Informe o nome do morador.";
    }

    if (!apartmentNumber.trim()) {
      return "Informe o número do apartamento.";
    }

    if (!block.trim()) {
      return "Informe o bloco.";
    }

    if (!title.trim()) {
      return "Informe o título da chamada.";
    }

    if (!category) {
      return "Selecione uma categoria.";
    }

    if (!priority) {
      return "Selecione uma prioridade.";
    }

    if (!description.trim()) {
      return "Informe a descrição da chamada.";
    }

    return null;
  }

  function clearForm() {
    setResidentName("");
    setApartmentNumber("");
    setBlock("");
    setTitle("");
    setCategory(null);
    setPriority(null);
    setDescription("");
  }

  async function handleConfirmCall() {
    if (isSubmitting) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    const fullDescription = [
      `Categoria: ${category}`,
      `Prioridade: ${priority}`,
      "",
      description.trim(),
    ].join("\n");

    const payload = {
      residentName: residentName.trim(),
      apartmentNumber: apartmentNumber.trim(),
      block: block.trim(),
      title: title.trim(),
      description: fullDescription,
      status: "Aberta",
      createdAt: getLocalDateTime(),
    };

    try {
      setIsSubmitting(true);

      console.log("ENVIANDO OCORRÊNCIA:", payload);

      const response = await api.post("/occurrences", payload);

      console.log("OCORRÊNCIA SALVA:", response.data);

      clearForm();

      Alert.alert(
        "Sucesso",
        "Chamada registrada com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              if (onConfirm) {
                onConfirm();
              } else {
                onDismiss?.();
              }
            },
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

      console.log("ERRO AO REGISTRAR OCORRÊNCIA:", {
        status,
        responseData,
        message,
      });

      let errorMessage =
        "Não foi possível registrar a chamada. Tente novamente.";

      if (message === "Network Error") {
        errorMessage =
          "Não foi possível conectar ao backend. Verifique se ele está ligado na porta 8090.";
      } else if (status === 404) {
        errorMessage =
          "O endpoint de ocorrências não foi encontrado.";
      } else if (status === 400) {
        errorMessage =
          "O servidor não aceitou os dados enviados.";
      } else if (status === 403) {
        errorMessage =
          "O servidor bloqueou a requisição.";
      } else if (status === 500) {
        errorMessage =
          "O servidor encontrou um erro ao salvar a chamada.";
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (typeof responseData === "string" && responseData.trim()) {
        errorMessage = responseData;
      } else if (message) {
        errorMessage = message;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (isSubmitting) {
      return;
    }

    Alert.alert(
      "Cancelar chamada",
      "Deseja sair sem salvar esta chamada?",
      [
        {
          text: "Continuar preenchendo",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            if (onCancel) {
              onCancel();
            } else {
              onDismiss?.();
            }
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Criar Nova Chamada</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCancel}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionTitle}>Dados do morador</Text>

            <Text style={styles.label}>Nome completo:</Text>

            <TextInput
              value={residentName}
              onChangeText={setResidentName}
              style={styles.input}
              placeholder="Ex.: Matheus Pessoa"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Apartamento:</Text>

                <TextInput
                  value={apartmentNumber}
                  onChangeText={setApartmentNumber}
                  style={styles.input}
                  placeholder="Ex.: 407"
                  placeholderTextColor={BRAND_COLORS.mutedText}
                  editable={!isSubmitting}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Bloco:</Text>

                <TextInput
                  value={block}
                  onChangeText={setBlock}
                  style={styles.input}
                  placeholder="Ex.: B"
                  placeholderTextColor={BRAND_COLORS.mutedText}
                  editable={!isSubmitting}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Dados da chamada</Text>

            <Text style={styles.label}>Título:</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Ex.: Problema no elevador"
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
              autoCapitalize="sentences"
              maxLength={100}
            />

            <Text style={styles.label}>Categoria:</Text>

            <View style={styles.optionsContainer}>
              {categories.map((item) => {
                const selected = category === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.optionButton,
                      selected && styles.optionButtonSelected,
                    ]}
                    onPress={() => setCategory(item)}
                    disabled={isSubmitting}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Prioridade:</Text>

            <View style={styles.optionsContainer}>
              {priorities.map((item) => {
                const selected = priority === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.optionButton,
                      selected && styles.optionButtonSelected,
                    ]}
                    onPress={() => setPriority(item)}
                    disabled={isSubmitting}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Descrição:</Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              style={styles.descriptionInput}
              placeholder="Descreva o problema, o local e quando ele começou..."
              placeholderTextColor={BRAND_COLORS.mutedText}
              editable={!isSubmitting}
              autoCapitalize="sentences"
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />

            <Text style={styles.characterCounter}>
              {description.length}/1000
            </Text>

            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Status inicial: Aberta</Text>

              <Text style={styles.statusText}>
                Após o registro, a chamada ficará disponível para o síndico.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !isFormComplete && styles.confirmButtonIncomplete,
              ]}
              onPress={handleConfirmCall}
              disabled={isSubmitting}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <View style={styles.loadingContent}>
                  <ActivityIndicator
                    size="small"
                    color={BRAND_COLORS.white}
                  />

                  <Text style={styles.confirmButtonText}>
                    Registrando...
                  </Text>
                </View>
              ) : (
                <Text style={styles.confirmButtonText}>
                  Confirmar chamada
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                isSubmitting && styles.disabledButton,
              ]}
              onPress={handleCancel}
              disabled={isSubmitting}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#B9BEC6",
  },

  overlay: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 18,
  },

  card: {
    flex: 1,
    backgroundColor: BRAND_COLORS.backgroundMuted,
    borderRadius: 28,
    overflow: "hidden",
  },

  header: {
    minHeight: 70,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: BRAND_COLORS.primaryLight,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonText: {
    color: BRAND_COLORS.text,
    fontSize: 25,
    lineHeight: 27,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 24,
  },

  sectionTitle: {
    color: BRAND_COLORS.info,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  label: {
    color: BRAND_COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginLeft: 3,
  },

  input: {
    height: 44,
    borderRadius: 18,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingHorizontal: 14,
    marginBottom: 14,
    color: BRAND_COLORS.text,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  rowItem: {
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: BRAND_COLORS.border,
    marginTop: 2,
    marginBottom: 18,
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  optionButton: {
    minHeight: 38,
    borderRadius: 19,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  optionButtonSelected: {
    backgroundColor: BRAND_COLORS.info,
    borderColor: BRAND_COLORS.info,
  },

  optionText: {
    color: BRAND_COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: BRAND_COLORS.white,
  },

  descriptionInput: {
    minHeight: 115,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 13,
    color: BRAND_COLORS.text,
    fontSize: 14,
  },

  characterCounter: {
    marginTop: 5,
    marginRight: 5,
    marginBottom: 14,
    color: BRAND_COLORS.mutedText,
    fontSize: 12,
    textAlign: "right",
  },

  statusBox: {
    borderRadius: 16,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  statusTitle: {
    color: BRAND_COLORS.info,
    fontSize: 14,
    fontWeight: "700",
  },

  statusText: {
    marginTop: 3,
    color: BRAND_COLORS.textSubtle,
    fontSize: 13,
    lineHeight: 18,
  },

  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
    backgroundColor: BRAND_COLORS.backgroundMuted,
    gap: 8,
  },

  confirmButton: {
    width: "100%",
    minHeight: 50,
    borderRadius: 25,
    backgroundColor: BRAND_COLORS.info,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmButtonIncomplete: {
    opacity: 0.65,
  },

  confirmButtonText: {
    color: BRAND_COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    width: "100%",
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: BRAND_COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },

  disabledButton: {
    opacity: 0.5,
  },

  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});