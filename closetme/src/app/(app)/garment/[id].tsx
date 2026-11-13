import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { CATEGORIES, COLORS, SEASONS, STYLES } from '@/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  checkGarmentDeletionImpact,
  deleteGarmentWithCascade,
  getGarmentById,
} from '@/features/wardrobe/services/garmentService';
import { colors, radii, spacing, touchTargets, typography } from '@/theme';
import type { Garment } from '@/types';

export default function GarmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [garment, setGarment] = useState<Garment | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id || !user) return;
      try {
        const item = await getGarmentById(user.uid, id);
        setGarment(item);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  async function handleDelete() {
    if (!id || !user) return;

    try {
      setDeleting(true);

      // 1. Calcula o impacto nos looks salvos
      let message = 'Tem certeza que deseja excluir esta peça do seu guarda-roupa?';
      try {
        const impact = await checkGarmentDeletionImpact(user.uid, id);
        if (impact.affectedCount > 0) {
          message =
            `Esta peça está presente em ${impact.affectedCount} look(s) salvo(s):\n\n` +
            `• ${impact.updatedCount} look(s) serão atualizados.\n` +
            `• ${impact.deletedCount} look(s) serão apagados por ficarem incompletos.\n\n` +
            `Deseja confirmar a exclusão?`;
        }
      } catch {
        // Se der erro no cálculo, segue com a pergunta básica
      }

      // Suporte para o Navegador do Computador (Web)
      if (Platform.OS === 'web') {
        const confirmed = window.confirm(message);
        if (confirmed) {
          await deleteGarmentWithCascade(user.uid, id);
          router.back();
        }
        return;
      }

      // Suporte para Celular (iOS e Android)
      Alert.alert('Excluir peça', message, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGarmentWithCascade(user.uid, id);
              router.back();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a peça.');
            }
          },
        },
      ]);
    } catch {
      // Fallback direto
      if (Platform.OS === 'web') {
        if (window.confirm('Deseja excluir esta peça?')) {
          await deleteGarmentWithCascade(user.uid, id);
          router.back();
        }
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  if (!garment) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Peça não encontrada.</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const categoryLabel = CATEGORIES.find((c) => c.id === garment.category)?.label || garment.category;
  const colorLabel = COLORS.find((c) => c.id === garment.color)?.label || garment.color;
  const seasonLabel = SEASONS.find((s) => s.id === garment.season)?.label || garment.season;
  const stylesLabel = garment.styles
    .map((s) => STYLES.find((st) => st.id === s)?.label || s)
    .join(', ');

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.circleBtn}>
            <Feather name="chevron-left" size={24} color={colors.text.primary} />
          </Pressable>
          <Pressable hitSlop={12} onPress={handleDelete} disabled={deleting} style={styles.deleteBtn}>
            {deleting ? (
              <ActivityIndicator size="small" color={colors.semantic.error.text} />
            ) : (
              <Feather name="trash-2" size={20} color={colors.semantic.error.text} />
            )}
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Foto ou Ícone */}
          <View style={styles.imageCard}>
            {garment.photoUrl ? (
              <Image source={{ uri: garment.photoUrl }} style={styles.image} />
            ) : (
              <MaterialCommunityIcons name="hanger" size={80} color={colors.primary.default} />
            )}
          </View>

          {/* Título e Categoria */}
          <Text style={styles.garmentTitle}>{garment.name}</Text>
          <Text style={styles.categorySubtitle}>{categoryLabel}</Text>

          {/* Tabela de Atributos */}
          <View style={styles.attributesCard}>
            <View style={styles.attributeRow}>
              <Text style={styles.attributeName}>Cor</Text>
              <Text style={styles.attributeValue}>{colorLabel}</Text>
            </View>

            <View style={styles.attributeRow}>
              <Text style={styles.attributeName}>Estilo</Text>
              <Text style={styles.attributeValue}>{stylesLabel}</Text>
            </View>

            <View style={[styles.attributeRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.attributeName}>Estação</Text>
              <Text style={styles.attributeValue}>{seasonLabel}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.background,
    paddingTop: spacing.xxxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.scale.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  backLink: {
    padding: spacing.md,
  },
  backLinkText: {
    ...typography.scale.button,
    color: colors.primary.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  circleBtn: {
    width: touchTargets.chip,
    height: touchTargets.chip,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  deleteBtn: {
    width: touchTargets.chip,
    height: touchTargets.chip,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.huge,
  },
  imageCard: {
    width: '100%',
    height: 280,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  garmentTitle: {
    ...typography.scale.title1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  categorySubtitle: {
    ...typography.scale.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  attributesCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  attributeName: {
    ...typography.scale.body,
    color: colors.text.secondary,
  },
  attributeValue: {
    ...typography.scale.button,
    color: colors.text.primary,
  },
});