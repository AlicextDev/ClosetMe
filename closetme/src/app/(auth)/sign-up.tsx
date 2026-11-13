import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { translateAuthError } from "../../features/auth/services/authService";
import { colors, radii, spacing, touchTargets, typography } from "../../theme";

export default function SignUpScreen() {
  const { signUp, signOut } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos.",
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert("Senha curta", "A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await signUp(name, email, password);
      await signOut(); // Desloga para que a pessoa faça o login na tela de Entrar
      Alert.alert(
        "Conta criada com sucesso!",
        "Agora faça login com seu e-mail e senha para começar.",
        [
          {
            text: "Ir para o Login",
            onPress: () => router.replace("/(auth)/sign-in"),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert("Erro ao criar conta", translateAuthError(err.code || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          hitSlop={12}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="chevron-left" size={24} color={colors.text.primary} />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>
            Monte seu guarda-roupa digital e receba looks com as suas peças.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome"
            placeholder="Como quer ser chamada(o)"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Input
            label="E-mail"
            placeholder="voce@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Senha"
            placeholder="Crie uma senha (mínimo 6 caracteres)"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <Button
            title="Criar conta"
            onPress={handleSignUp}
            loading={loading}
            style={styles.submitButton}
          />

          <View style={styles.footerLinkContainer}>
            <Text style={styles.footerText}>Já tem conta? </Text>
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text style={styles.footerLink}>Entrar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    width: touchTargets.chip,
    height: touchTargets.chip,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.scale.title1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.scale.body,
    color: colors.text.secondary,
  },
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: spacing.md,
  },
  footerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xxl,
  },
  footerText: {
    ...typography.scale.small,
    color: colors.text.secondary,
  },
  footerLink: {
    ...typography.scale.small,
    fontFamily: typography.fontFamily.button,
    color: colors.primary.default,
  },
});
