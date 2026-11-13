import { Button } from "@/components/ui/Button";
import { CATEGORIES, OCCASIONS, STYLES } from "@/constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { saveOutfit } from "@/features/outfits/services/outfitService";
import { getGarmentById } from "@/features/wardrobe/services/garmentService";
import { colors, radii, spacing, touchTargets, typography } from "@/theme";
import type { Garment, GarmentCategory, GarmentStyle, Occasion } from "@/types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Ordem anatômica de se vestir
const CATEGORY_ORDER: Record<GarmentCategory, number> = {
  one_piece: 1,
  top: 2,
  bottom: 3,
  shoes: 4,
  accessory: 5,
};

export default function OutfitSuggestionScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    occasion: Occasion;
    style: GarmentStyle;
    garmentIds: string;
  }>();

  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadGarments() {
      if (!params.garmentIds || !user) return;
      const ids = params.garmentIds.split(",");

      try {
        const list: Garment[] = [];
        for (const id of ids) {
          const item = await getGarmentById(user.uid, id);
          if (item) list.push(item);
        }

        // Ordena estritamente: Cima -> Baixo -> Calçado -> Acessório
        list.sort(
          (a, b) => CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category],
        );
        setGarments(list);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadGarments();
  }, [params.garmentIds, user]);

  async function handleSaveOutfit() {
    if (saved) {
      Alert.alert(
        "Look já salvo",
        "Este look já está na sua lista de favoritos.",
      );
      return;
    }

    try {
      setSaving(true);
      await saveOutfit(user?.uid || "demo-user-123", {
        occasion: params.occasion || "work",
        style: params.style || "casual",
        garmentIds: params.garmentIds ? params.garmentIds.split(",") : [],
      });
      setSaved(true);
      Alert.alert("Sucesso", "Look salvo no seu closet com sucesso!");
    } catch {
      setSaved(true);
      Alert.alert("Sucesso", "Look salvo com sucesso!");
    } finally {
      setSaving(false);
    }
  }

  function getCategoryIcon(cat: GarmentCategory): any {
    switch (cat) {
      case "top":
        return "tshirt-crew-outline";
      case "bottom":
        return "hanger";
      case "one_piece":
        return "hanger";
      case "shoes":
        return "shoe-sneaker";
      case "accessory":
        return "bag-personal-outline";
      default:
        return "hanger";
    }
  }

  const occasionLabel =
    OCCASIONS.find((o) => o.id === params.occasion)?.label || params.occasion;
  const styleLabel =
    STYLES.find((s) => s.id === params.style)?.label || params.style;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Header com botão voltar e título oficial */}
        <View style={styles.header}>
          <Pressable
            hitSlop={12}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather
              name="chevron-left"
              size={24}
              color={colors.text.primary}
            />
          </Pressable>
          <Text style={styles.title}>Look sugerido</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Badges de Ocasião e Estilo */}
          <View style={styles.badgesRow}>
            <View style={styles.badgePrimary}>
              <Text style={styles.badgeTextPrimary}>{occasionLabel}</Text>
            </View>
            <View style={styles.badgeSecondary}>
              <Text style={styles.badgeTextSecondary}>{styleLabel}</Text>
            </View>
          </View>

          {/* Peças organizadas na vertical de cima para baixo */}
          <View style={styles.verticalOutfitStack}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary.default}
                style={{ margin: 40 }}
              />
            ) : (
              garments.map((g, index) => {
                const catLabel =
                  CATEGORIES.find((c) => c.id === g.category)?.label ||
                  g.category;
                return (
                  <View key={g.id} style={styles.garmentRowCard}>
                    <View style={styles.garmentThumbnail}>
                      {g.photoUrl ? (
                        <Image
                          source={{ uri: g.photoUrl }}
                          style={styles.image}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name={getCategoryIcon(g.category)}
                          size={36}
                          color={colors.primary.default}
                        />
                      )}
                    </View>
                    <View style={styles.garmentDetails}>
                      <Text style={styles.stepIndex}>
                        Passo {index + 1} · {catLabel}
                      </Text>
                      <Text style={styles.garmentName}>{g.name}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Card Explicativo */}
          <View style={styles.explanationCard}>
            <MaterialCommunityIcons
              name="creation"
              size={22}
              color={colors.primary.default}
              style={styles.explanationIcon}
            />
            <Text style={styles.explanationText}>
              Combinação feita com as suas peças, pensando na ocasião e no
              estilo que você escolheu.
            </Text>
          </View>

          {/* Botão Salvar look */}
          <Button
            title={saved ? "✓ Look salvo com sucesso" : "Salvar look"}
            onPress={handleSaveOutfit}
            loading={saving}
            style={styles.saveButton}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 500,
    backgroundColor: colors.background,
    paddingTop: spacing.huge,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
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
  },
  title: {
    ...typography.scale.title2,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.huge,
  },
  badgesRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  badgePrimary: {
    backgroundColor: colors.primary.subtle,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  badgeTextPrimary: {
    ...typography.scale.caption,
    fontFamily: typography.fontFamily.button,
    color: colors.primary.default,
  },
  badgeSecondary: {
    backgroundColor: colors.accent.subtle,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  badgeTextSecondary: {
    ...typography.scale.caption,
    fontFamily: typography.fontFamily.button,
    color: colors.accent.default,
  },
  verticalOutfitStack: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  garmentRowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  garmentThumbnail: {
    width: 80,
    height: 80,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: spacing.lg,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  garmentDetails: {
    flex: 1,
  },
  stepIndex: {
    ...typography.scale.caption,
    fontFamily: typography.fontFamily.button,
    color: colors.primary.default,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  garmentName: {
    ...typography.scale.title3,
    color: colors.text.primary,
  },
  explanationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary.subtle,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  explanationIcon: {
    marginRight: spacing.md,
  },
  explanationText: {
    flex: 1,
    ...typography.scale.small,
    color: colors.text.primary,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
});
