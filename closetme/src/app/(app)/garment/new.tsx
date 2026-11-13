import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { CATEGORIES, COLORS, SEASONS, STYLES } from "../../../constants";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { createGarment } from "../../../features/wardrobe/services/garmentService";
import {
    pickImageFromGallery,
    takePhotoWithCamera,
} from "../../../features/wardrobe/services/imageService";
import {
    colors,
    radii,
    spacing,
    touchTargets,
    typography,
} from "../../../theme";
import type {
    GarmentCategory,
    GarmentColor,
    GarmentSeason,
    GarmentStyle,
} from "../../../types";

export default function NewGarmentScreen() {
  const { user } = useAuth();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GarmentCategory | null>(null);
  const [color, setColor] = useState<GarmentColor | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<GarmentStyle[]>([]);
  const [season, setSeason] = useState<GarmentSeason | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePickImage() {
    const uri = await pickImageFromGallery();
    if (uri) setPhotoUri(uri);
  }

  async function handleTakePhoto() {
    const uri = await takePhotoWithCamera();
    if (uri) setPhotoUri(uri);
  }

  function toggleStyle(s: GarmentStyle) {
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s],
    );
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Nome obrigatório", "Dê um nome para a sua peça.");
      return;
    }
    if (!category) {
      Alert.alert("Categoria obrigatória", "Selecione a categoria da peça.");
      return;
    }
    if (!color) {
      Alert.alert("Cor obrigatória", "Selecione a cor da peça.");
      return;
    }
    if (selectedStyles.length === 0) {
      Alert.alert("Estilo obrigatório", "Selecione pelo menos um estilo.");
      return;
    }
    if (!season) {
      Alert.alert("Estação obrigatória", "Selecione a estação recomendada.");
      return;
    }

    try {
      setLoading(true);
      await createGarment(user?.uid || "guest-user", {
        name: name.trim(),
        category,
        color,
        styles: selectedStyles,
        season,
        photoUrl: photoUri || "",
      });

      router.back();
    } catch {
      Alert.alert(
        "Erro ao salvar",
        "Não foi possível salvar a peça. Tente novamente.",
      );
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
        {/* Cabeçalho do Modal */}
        <View style={styles.header}>
          <Pressable
            hitSlop={12}
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Nova peça</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Área de Foto */}
        <View style={styles.photoBox}>
          {photoUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <Pressable
                onPress={() => setPhotoUri(null)}
                style={styles.removePhotoButton}
              >
                <Feather
                  name="trash-2"
                  size={18}
                  color={colors.semantic.error.text}
                />
              </Pressable>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={36}
                color={colors.primary.default}
              />
              <Text style={styles.photoInstructions}>
                Adicione uma foto da peça
              </Text>
              <View style={styles.photoButtonsRow}>
                <Pressable
                  onPress={handleTakePhoto}
                  style={styles.photoActionBtn}
                >
                  <Feather
                    name="camera"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.photoActionText}>Câmera</Text>
                </Pressable>
                <Pressable
                  onPress={handlePickImage}
                  style={styles.photoActionBtn}
                >
                  <Feather name="image" size={16} color={colors.text.primary} />
                  <Text style={styles.photoActionText}>Galeria</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Nome da Peça */}
        <Input
          label="Nome da peça"
          placeholder="Ex.: Camiseta básica"
          value={name}
          onChangeText={setName}
        />

        {/* Categoria */}
        <Text style={styles.sectionLabel}>Categoria</Text>
        <View style={styles.chipsRow}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[styles.chip, isSelected && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Cor */}
        <Text style={styles.sectionLabel}>Cor</Text>
        <View style={styles.chipsRow}>
          {COLORS.map((c) => {
            const isSelected = color === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setColor(c.id)}
                style={[styles.colorChip, isSelected && styles.chipActive]}
              >
                <View
                  style={[styles.colorCircle, { backgroundColor: c.hex }]}
                />
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Estilo (múltiplo) */}
        <Text style={styles.sectionLabel}>Estilo</Text>
        <Text style={styles.sectionHelp}>Pode escolher mais de um.</Text>
        <View style={styles.chipsRow}>
          {STYLES.map((st) => {
            const isSelected = selectedStyles.includes(st.id);
            return (
              <Pressable
                key={st.id}
                onPress={() => toggleStyle(st.id)}
                style={[styles.chip, isSelected && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {st.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Estação */}
        <Text style={styles.sectionLabel}>Estação</Text>
        <View style={styles.chipsRow}>
          {SEASONS.map((se) => {
            const isSelected = season === se.id;
            return (
              <Pressable
                key={se.id}
                onPress={() => setSeason(se.id)}
                style={[styles.chip, isSelected && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {se.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Botão Salvar */}
        <Button
          title="Salvar peça"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
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
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.huge,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.scale.title2,
    color: colors.text.primary,
  },
  photoBox: {
    width: "100%",
    minHeight: 180,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderStyle: "dashed",
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
    overflow: "hidden",
  },
  photoPlaceholder: {
    alignItems: "center",
    padding: spacing.lg,
  },
  photoInstructions: {
    ...typography.scale.button,
    color: colors.text.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  photoButtonsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  photoActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    height: touchTargets.chip,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
  },
  photoActionText: {
    ...typography.scale.small,
    fontFamily: typography.fontFamily.button,
    color: colors.text.primary,
  },
  previewContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removePhotoButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.full,
  },
  sectionLabel: {
    ...typography.scale.button,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  sectionHelp: {
    ...typography.scale.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    height: touchTargets.chip,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  colorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: touchTargets.chip,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  colorCircle: {
    width: 14,
    height: 14,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: {
    backgroundColor: colors.primary.subtle,
    borderColor: colors.primary.default,
  },
  chipText: {
    ...typography.scale.small,
    fontFamily: typography.fontFamily.button,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.primary.default,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
