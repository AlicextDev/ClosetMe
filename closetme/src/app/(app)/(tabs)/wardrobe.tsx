import { TartanCard } from "@/components/ui/TartanCard";
import { CATEGORIES, COLORS, SEASONS } from "@/constants";
import { useGarments } from "@/features/wardrobe/hooks/useGarments";
import { colors, radii, spacing, touchTargets, typography } from "@/theme";
import type { Garment, GarmentCategory } from "@/types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function WardrobeScreen() {
  const {
    garments,
    loading,
    selectedCategory,
    setSelectedCategory,
    refreshGarments,
  } = useGarments();

  function getGarmentSubtitle(garment: Garment) {
    const colorLabel =
      COLORS.find((c) => c.id === garment.color)?.label || garment.color;
    const seasonLabel =
      SEASONS.find((s) => s.id === garment.season)?.label || garment.season;
    return `${colorLabel} · ${seasonLabel}`;
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Seu Guarda-Roupa</Text>
          <Pressable
            hitSlop={8}
            onPress={() => router.push("/garment/new" as any)}
            style={styles.addButton}
          >
            <Feather name="plus" size={24} color={colors.text.primary} />
          </Pressable>
        </View>

        {/* Chips de Categorias Xadrez */}
        <View style={styles.chipsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            <Pressable
              onPress={() => setSelectedCategory("all")}
              style={[
                styles.chip,
                selectedCategory === "all" && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === "all" && styles.chipTextActive,
                ]}
              >
                Todas
              </Text>
            </Pressable>

            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id as GarmentCategory)}
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Grade de Roupas */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text.primary} />
          </View>
        ) : garments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="hanger"
              size={64}
              color={colors.text.tertiary}
              style={{ marginBottom: spacing.md }}
            />
            <Text style={styles.emptyTitle}>Seu armário está vazio</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão + acima para cadastrar sua primeira peça.
            </Text>
          </View>
        ) : (
          <FlatList
            data={garments}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onRefresh={refreshGarments}
            refreshing={loading}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/garment/${item.id}` as any)}
                style={styles.cardPressable}
              >
                <TartanCard>
                  <View style={styles.imageContainer}>
                    {item.photoUrl ? (
                      <Image
                        source={{ uri: item.photoUrl }}
                        style={styles.image}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="hanger"
                        size={44}
                        color={colors.text.secondary}
                      />
                    )}
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      {getGarmentSubtitle(item)}
                    </Text>
                  </View>
                </TartanCard>
              </Pressable>
            )}
          />
        )}
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
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.scale.title1,
    color: colors.text.primary,
  },
  addButton: {
    width: touchTargets.chip,
    height: touchTargets.chip,
    borderRadius: radii.full,
    backgroundColor: colors.primary.default,
    borderWidth: 1.5,
    borderColor: colors.borderRetro,
    justifyContent: "center",
    alignItems: "center",
  },
  chipsWrapper: {
    marginBottom: spacing.lg,
  },
  chipsScroll: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
  },
  chip: {
    height: touchTargets.chip,
    paddingHorizontal: spacing.lg,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.scale.title3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.scale.small,
    color: colors.text.tertiary,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  cardPressable: {
    width: "48%",
  },
  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardInfo: {
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.scale.button,
    color: colors.text.primary,
  },
  cardSubtitle: {
    ...typography.scale.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
