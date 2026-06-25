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
import { api } from "../services/api";
import { BRAND_COLORS } from "../assets/branding";
import {
  CondoBottomNav,
  CondoBottomTab,
} from "../components/common/CondoBottomNav";
import { CondoTopHeader } from "../components/common/CondoTopHeader";

interface RegisterResidentScreenProps {
  onGoBack: () => void;
  onPressTab?: (tab: CondoBottomTab) => void;
}

export function RegisterResidentScreen({
  onGoBack,
  onPressTab,
}: RegisterResidentScreenProps) {
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [apartment, setApartment] = useState("");
  const [block, setBlock] = useState("");
  const canSubmit =
    fullName.trim().length > 0 &&
    cpf.trim().length > 0 &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    apartment.trim().length > 0 &&
    block.trim().length > 0;

  async function handleRegisterResident() {
    try {
      await api.post("/residents", {
        name: fullName,
        cpf,
        phone,
        email,
        apartmentNumber: apartment,
        block,
      });

      Alert.alert("Sucesso", "Morador cadastrado com sucesso!");

      setFullName("");
      setCpf("");
      setPhone("");
      setEmail("");
      setApartment("");
      setBlock("");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível cadastrar o morador.");
    }
  }
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerArea}>
        <CondoTopHeader title={"Cadastrar Novo\nMorador"} onBack={onGoBack} />
      </View>

      <View style={styles.panel}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <View style={styles.pictureFrame}>
                <View style={styles.pictureSun} />
                <View style={styles.pictureMountainSmall} />
                <View style={styles.pictureMountainLarge} />
              </View>
              <View style={styles.pictureBadge}>
                <Text style={styles.pictureBadgeText}>+</Text>
              </View>
            </View>
          </View>

          <View style={styles.formArea}>
            <Text style={styles.label}>Nome Completo:</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.field}
              placeholder="Nome Completo"
              placeholderTextColor={BRAND_COLORS.mutedText}
            />

            <Text style={styles.label}>CPF:</Text>
            <TextInput
              value={cpf}
              onChangeText={setCpf}
              style={styles.field}
              placeholder="XXX.XXX.XXX-XX"
              placeholderTextColor={BRAND_COLORS.mutedText}
            />

            <Text style={styles.label}>Telefone:</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.field}
              placeholder="(XX) X XXXX-XXXX"
              placeholderTextColor={BRAND_COLORS.mutedText}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>E-Mail:</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.field}
              placeholder="XXX@GMAIL.COM"
              placeholderTextColor={BRAND_COLORS.mutedText}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Apartamento:</Text>
            <TextInput
              value={apartment}
              onChangeText={setApartment}
              style={styles.field}
              placeholder="XXX"
              placeholderTextColor={BRAND_COLORS.mutedText}
            />

            <Text style={styles.label}>Bloco</Text>
            <View style={styles.selectField}>
              <TextInput
                value={block}
                onChangeText={setBlock}
                style={styles.fieldInput}
                placeholder="Bloco"
                placeholderTextColor={BRAND_COLORS.mutedText}
              />
              <Text style={styles.arrowIcon}>v</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !canSubmit && styles.confirmButtonDisabled,
              ]}
              disabled={!canSubmit}
              accessibilityRole="button"
              onPress={handleRegisterResident}
            >
              <Text style={styles.confirmButtonText}>Cadastrar!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CondoBottomNav active="profile" onPressTab={onPressTab} />
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
    paddingBottom: 8,
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
  scrollContent: {
    paddingBottom: 12,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: -32,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: BRAND_COLORS.backgroundSoft,
    borderWidth: 1,
    borderColor: BRAND_COLORS.borderSoft,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pictureFrame: {
    width: 64,
    height: 48,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: BRAND_COLORS.text,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  pictureSun: {
    position: "absolute",
    top: 7,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_COLORS.text,
  },
  pictureMountainSmall: {
    position: "absolute",
    bottom: 6,
    left: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: BRAND_COLORS.text,
  },
  pictureMountainLarge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: BRAND_COLORS.text,
  },
  pictureBadge: {
    position: "absolute",
    right: 30,
    bottom: 22,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BRAND_COLORS.text,
    alignItems: "center",
    justifyContent: "center",
  },
  pictureBadgeText: {
    color: BRAND_COLORS.white,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "700",
    marginTop: -1,
  },
  formArea: {
    paddingHorizontal: 26,
    paddingTop: 8,
  },
  label: {
    color: BRAND_COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 10,
  },
  field: {
    height: 50,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingHorizontal: 14,
    color: BRAND_COLORS.mutedText,
    fontSize: 15,
    marginBottom: 16,
  },
  selectField: {
    height: 50,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingLeft: 14,
    paddingRight: 12,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  fieldInput: {
    flex: 1,
    color: BRAND_COLORS.mutedText,
    fontSize: 15,
  },
  arrowIcon: {
    color: BRAND_COLORS.primaryLight,
    fontSize: 20,
    lineHeight: 20,
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
    fontWeight: "600",
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
});
