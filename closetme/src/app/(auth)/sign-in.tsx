import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { translateAuthError } from "@/features/auth/services/authService";
import { colors, radii, spacing, typography } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha seu e-mail e senha.",
      );
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      router.replace("/(app)/(tabs)/wardrobe");
    } catch (err: any) {
      Alert.alert("Erro ao entrar", translateAuthError(err.code || ""));
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
        <View style={styles.cardContainer}>
          {/* Logo do Cabide com Margaridas */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons
                name="hanger"
                size={44}
                color={colors.primary.default}
              />
              <View style={styles.daisyBadge}>
                <MaterialCommunityIcons
                  name="flower"
                  size={20}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <Text style={styles.brandTitle}>ClosetMe</Text>
            <Text style={styles.brandSubtitle}>
              Seu guarda-roupa digital com estilo dos anos 90.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.screenTitle}>Entrar</Text>

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
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <Button
              title="Entrar"
              onPress={handleSignIn}
              loading={loading}
              style={styles.submitButton}
            />

            <View style={styles.footerLinkContainer}>
              <Text style={styles.footerText}>Ainda não tem conta? </Text>
              <Pressable onPress={() => router.push("/(auth)/sign-up")}>
                <Text style={styles.footerLink}>Criar conta</Text>
              </Pressable>
            </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    maxWidth: 440,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderRetro,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    position: "relative",
  },
  daisyBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.accent.default,
    borderRadius: radii.full,
    padding: 2,
  },
  brandTitle: {
    ...typography.scale.title1,
    fontSize: 34,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  brandSubtitle: {
    ...typography.scale.small,
    color: colors.text.secondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.borderRetro,
  },
  screenTitle: {
    ...typography.scale.title2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.scale.small,
    color: colors.text.secondary,
  },
  footerLink: {
    ...typography.scale.small,
    fontFamily: typography.fontFamily.button,
    color: colors.text.primary,
    textDecorationLine: "underline",
  },
});
