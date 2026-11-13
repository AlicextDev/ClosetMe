import { Button } from "@/components/ui/Button";
import { OCCASIONS, STYLES } from "@/constants";
import { generateOutfitRecommendation } from "@/features/outfits/services/recommendationService";
import { useGarments } from "@/features/wardrobe/hooks/useGarments";
import { colors, radii, spacing, touchTargets, typography } from "@/theme";
import type { GarmentStyle, Occasion } from "@/types";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LooksScreen() {
  const { garments } = useGarments();
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(
    "work",
  );
  const [selectedStyle, setSelectedStyle] = useState<GarmentStyle | null>(
    "casual",
  );

  function handleGenerate() {
    if (!selectedOccasion || !selectedStyle) {
      Alert.alert("Escolha as opções", "Selecione uma ocasião e um estilo.");
      return;
    }

    const result = generateOutfitRecommendation(
      garments,
      selectedOccasion,
      selectedStyle,
    );

    if (!result.success) {
      Alert.alert(
        "Não foi possível gerar o look",
        result.message || "Faltam peças.",
      );
      return;
    }

    const garmentIds = (result.garments || []).map((g: any) => g.id).join(",");
    router.push({
      pathname: "/outfit/suggestion" as any,
      params: {
        occasion: selectedOccasion,
        style: selectedStyle,
        garmentIds,
      },
    });
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pedir look</Text>
          <Pressable
            hitSlop={8}
            onPress={() => router.push("/outfit/saved" as any)}
            style={styles.heartButton}
          >
            <Feather name="heart" size={22} color={colors.accent.default} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Ocasião */}
          <Text style={styles.sectionTitle}>Para qual ocasião?</Text>
          <View style={styles.chipsRow}>
            {OCCASIONS.map((occ) => {
              const isSelected = selectedOccasion === occ.id;
              return (
                <Pressable
                  key={occ.id}
                  onPress={() => setSelectedOccasion(occ.id)}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {occ.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Estilo */}
          <Text style={styles.sectionTitle}>Qual estilo?</Text>
          <View style={styles.chipsRow}>
            {STYLES.map((st) => {
              const isSelected = selectedStyle === st.id;
              return (
                <Pressable
                  key={st.id}
                  onPress={() => setSelectedStyle(st.id)}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {st.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Botão Gerar look com animação elástica */}
          <Button
            title="✨ Gerar look"
            onPress={handleGenerate}
            style={styles.generateButton}
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
    paddingTop: spacing.huge,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.scale.title1,
    color: colors.text.primary,
  },
  heartButton: {
    width: touchTargets.chip,
    height: touchTargets.chip,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.borderRetro,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.huge,
  },
  sectionTitle: {
    ...typography.scale.title2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  chip: {
    height: touchTargets.chip,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: colors.primary.default,
    borderColor: colors.borderRetro,
  },
  chipText: {
    ...typography.scale.small,
    fontFamily: typography.fontFamily.button,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.text.primary,
  },
  generateButton: {
    marginTop: spacing.md,
  },
});
