import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { colors, radii, spacing, typography } from "../../../theme";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Feather name="user" size={32} color={colors.primary.default} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.displayName || "Usuário ClosetMe"}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || "voce@email.com"}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Sair da conta"
          onPress={handleSignOut}
          style={styles.signOutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.huge,
  },
  title: {
    ...typography.scale.title1,
    color: colors.text.primary,
    marginBottom: spacing.xxl,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.xxxl,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radii.full,
    backgroundColor: colors.primary.subtle,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.scale.title3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.scale.small,
    color: colors.text.secondary,
  },
  footer: {
    marginTop: "auto",
    marginBottom: spacing.xxl,
  },
  signOutButton: {
    backgroundColor: colors.semantic.error.background,
  },
});
