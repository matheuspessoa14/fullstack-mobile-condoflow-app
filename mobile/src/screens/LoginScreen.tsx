import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BRAND_COLORS } from "../assets/branding";
import { CondoBrandLockup } from "../components/common/CondoBrandLockup";

interface LoginScreenProps {
  onLogin: (role: "morador" | "porteiro" | "sindico") => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLogin, onForgotPassword }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const canLogin = email.trim().length > 0 && password.trim().length > 0;

  const resolveRoleFromEmail = (): "morador" | "porteiro" | "sindico" => {
    const normalized = email.trim().toLowerCase();

    if (normalized.includes("porteiro")) {
      return "porteiro";
    }

    if (normalized.includes("sindico")) {
      return "sindico";
    }

    return "morador";
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[styles.circle, styles.topCircleLarge]}
        pointerEvents="none"
      />
      <View
        style={[styles.circle, styles.topCircleSmall]}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcome}>Bem-vindo de volta!</Text>

        <CondoBrandLockup size="login" style={styles.brandRow} />

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            placeholderTextColor={BRAND_COLORS.textSubtle}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            placeholderTextColor={BRAND_COLORS.textSubtle}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            onPress={onForgotPassword}
            accessibilityRole="button"
          >
            <Text style={styles.helperText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              !canLogin && styles.loginButtonDisabled,
            ]}
            onPress={() => onLogin(resolveRoleFromEmail())}
            disabled={!canLogin}
            accessibilityRole="button"
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.socialLabel}>ou cadastre-se com</Text>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton} accessibilityRole="button">
              <Text style={styles.socialButtonText}>f</Text>
            </Pressable>
            <Pressable style={styles.socialButton} accessibilityRole="button">
              <Text style={styles.socialButtonText}>G</Text>
            </Pressable>
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            activeOpacity={0.7}
            onPress={() => {
              console.log("Clicou em Cadastre-se");
              Alert.alert(
                "Cadastro",
                "Para realizar seu cadastro, entre em contato com o síndico do condomínio.",
              );
            }}
          >
            <Text style={styles.signUpText}>
              Ainda não tem cadastro?{" "}
              <Text style={styles.signUpLink}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BRAND_COLORS.primaryLight,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: BRAND_COLORS.accentSoft,
    opacity: 0.34,
  },
  topCircleLarge: {
    width: 208,
    height: 208,
    top: -88,
    left: -76,
  },
  topCircleSmall: {
    width: 118,
    height: 118,
    top: 6,
    left: -26,
    opacity: 0.22,
  },
  content: {
    minHeight: "100%",
    paddingHorizontal: 28,
    paddingTop: 96,
    paddingBottom: 48,
    alignItems: "center",
  },
  welcome: {
    color: BRAND_COLORS.white,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 34,
  },
  brandRow: {
    marginBottom: 42,
    alignSelf: "center",
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 999,
    paddingHorizontal: 18,
    fontSize: 15,
    color: BRAND_COLORS.text,
    marginBottom: 14,
  },
  helperText: {
    fontSize: 12,
    color: BRAND_COLORS.accentSoft,
    marginBottom: 22,
  },
  loginButton: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: BRAND_COLORS.accentDark,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: BRAND_COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  socialLabel: {
    marginTop: 18,
    fontSize: 12,
    color: BRAND_COLORS.accentSoft,
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    marginBottom: 26,
  },
  socialButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: BRAND_COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  socialButtonText: {
    color: BRAND_COLORS.primaryDark,
    fontSize: 20,
    fontWeight: "700",
  },
  signUpText: {
    textAlign: "center",
    fontSize: 14,
    color: BRAND_COLORS.white,
  },
  signUpLink: {
    color: BRAND_COLORS.accent,
    textDecorationLine: "underline",
  },
  signUpButton: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  alignItems: "center",
  justifyContent: "center",
},
});
