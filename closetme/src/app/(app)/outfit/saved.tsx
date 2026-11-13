import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { OCCASIONS, STYLES } from '@/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { listSavedOutfits } from '@/features/outfits/services/outfitService';
import { colors, radii, spacing, touchTargets, typography } from '@/theme';
import type { Outfit } from '@/types';

export default function SavedOutfitsScreen() {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const data = await listSavedOutfits(user.uid);
        setOutfits(data);
      } catch {
        setOutfits([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  function getOutfitTitle(outfit: Outfit) {
    const occ = OCCASIONS.find((o) => o.id === outfit.occasion)?.label || outfit.occasion;
    const st = STYLES.find((s) => s.id === outfit.style)?.label || outfit.style;
    return `${occ} · ${st}`;
  }

  function getOutfitDate(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  // Ao clicar no look salvo, abre a visualização das peças daquele look
  function handleOpenOutfit(item: Outfit) {
    router.push({
      pathname: '/outfit/suggestion' as any,
      params: {
        occasion: item.occasion,
        style: item.style,
        garmentIds: item.garmentIds.join(','),
      },
    });
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Header oficial com proteção anti-tradução do navegador */}
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color={colors.text.primary} />
          </Pressable>
          {/* @ts-ignore translate prop para evitar o Google Tradutor distorcer o nome */}
          <Text style={styles.title} translate="no">
            Looks salvos
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary.default} />
          </View>
        ) : outfits.length === 0 ? (
          <View style={styles.centerContainer}>
            <Feather name="heart" size={56} color={colors.outline} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Nenhum look salvo ainda</Text>
            <Text style={styles.emptySubtitle}>
              Gere looks na aba "Looks" e salve suas combinações favoritas aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={outfits}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleOpenOutfit(item)}
                style={({ pressed }) => [
                  styles.outfitCard,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={styles.thumbnailsGrid}>
                  {[0, 1, 2, 3].map((idx) => (
                    <View key={idx} style={styles.thumbnailBox}>
                      <MaterialCommunityIcons
                        name="hanger"
                        size={20}
                        color={colors.primary.default}
                      />
                    </View>
                  ))}
                </View>

                <View style={styles.cardInfo}>
                  {/* @ts-ignore */}
                  <Text style={styles.cardTitle} numberOfLines={1} translate="no">
                    {getOutfitTitle(item)}
                  </Text>
                  <Text style={styles.cardDate}>{getOutfitDate(item.createdAt)}</Text>
                </View>
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
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.background,
    paddingTop: spacing.huge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: touchTargets.chip,
    height: touchTargets.chip,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.scale.title2,
    color: colors.text.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    ...typography.scale.title3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.scale.small,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  outfitCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  thumbnailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.xs,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  thumbnailBox: {
    width: '47%',
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    paddingTop: spacing.xs,
  },
  cardTitle: {
    ...typography.scale.button,
    color: colors.text.primary,
  },
  cardDate: {
    ...typography.scale.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});