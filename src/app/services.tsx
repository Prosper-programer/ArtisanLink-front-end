import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  Palette,
  Spacing,
  BorderRadius,
  BottomTabInset,
  MaxContentWidth,
  Shadows,
} from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { POPULAR_SERVICES, ServiceCategory } from '@/data/mockData';

export default function ServicesScreen() {
  const router = useRouter();
  const { openServiceDetails, setSelectedCategoryFilter, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const isFrench = language === 'fr';

  const categoryNamesFr: Record<string, string> = {
    plumbing: 'Plomberie',
    electrical: 'Électricité',
    painting: 'Peinture',
    carpentry: 'Menuiserie',
    cleaning: 'Nettoyage',
    masonry: 'Maçonnerie',
    construction: 'Construction',
    mechanics: 'Mécanique',
    pastry: 'Pâtisserie & Boulangerie',
  };

  const getCategoryName = (cat: ServiceCategory) => {
    return isFrench && categoryNamesFr[cat.id] ? categoryNamesFr[cat.id] : cat.name;
  };

  const filterChips = [
    { id: 'all', label: isFrench ? 'Tous les services' : 'All Services' },
    ...POPULAR_SERVICES.map((s) => ({
      id: s.id,
      label: getCategoryName(s),
    })),
  ];

  const filteredServices = useMemo(() => {
    return POPULAR_SERVICES.filter((cat) => {
      // Category filter
      if (selectedFilter !== 'all' && cat.id !== selectedFilter) {
        return false;
      }
      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const displayName = getCategoryName(cat).toLowerCase();
      return (
        displayName.includes(q) ||
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.popularServices.some((item) => item.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedFilter, isFrench]);

  const handleExploreArtisans = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    router.push('/explore');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="headlineLg" style={styles.headerTitle}>
              {isFrench ? 'Services & Métiers' : 'Services & Trades'}
            </ThemedText>
            <ThemedText style={styles.headerSub}>
              {isFrench
                ? 'Parcourez nos métiers certifiés et trouvez une assistance rapide'
                : 'Browse verified service categories and find skilled assistance'}
            </ThemedText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={18} color={Palette.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder={
                isFrench
                  ? 'Rechercher un service, une panne, une réparation...'
                  : 'Search services, repairs, installations...'
              }
              placeholderTextColor={Palette.secondaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={Palette.secondaryText} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Horizontal Category Filter Pills */}
        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}>
            {filterChips.map((chip) => {
              const active = selectedFilter === chip.id;
              return (
                <Pressable
                  key={chip.id}
                  onPress={() => setSelectedFilter(chip.id)}
                  style={[styles.filterChip, active && styles.filterChipActive]}>
                  <ThemedText
                    style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {chip.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Main Services List */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="construct-outline" size={48} color={Palette.secondaryText} />
              <ThemedText style={styles.emptyTitle}>
                {isFrench ? 'Aucun service trouvé' : 'No services found'}
              </ThemedText>
              <ThemedText style={styles.emptySub}>
                {isFrench
                  ? 'Essayez de modifier vos termes de recherche ou sélectionnez un autre filtre.'
                  : 'Try adjusting your search terms or select another category filter.'}
              </ThemedText>
              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                style={styles.resetBtn}>
                <ThemedText style={styles.resetBtnText}>
                  {isFrench ? 'Réinitialiser les filtres' : 'Reset Filters'}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            filteredServices.map((cat) => (
              <View key={cat.id} style={styles.categoryCard}>
                {/* Hero Image */}
                <View style={styles.cardImageWrap}>
                  <Image source={{ uri: cat.image }} style={styles.cardImage} />
                  <View style={styles.imageOverlay} />

                  <View style={styles.categoryBadge}>
                    <Ionicons name={cat.icon as any} size={15} color="#FFFFFF" />
                    <ThemedText style={styles.categoryBadgeText}>
                      {getCategoryName(cat)}
                    </ThemedText>
                  </View>

                  <View style={styles.countBadge}>
                    <ThemedText style={styles.countBadgeText}>
                      {isFrench ? '5 artisans disponibles' : '5 available pros'}
                    </ThemedText>
                  </View>
                </View>

                {/* Card Body */}
                <View style={styles.cardBody}>
                  <ThemedText style={styles.categoryDescription}>
                    {cat.description}
                  </ThemedText>

                  {/* Popular Services Sub-Pills */}
                  <ThemedText style={styles.popularOfferingsTitle}>
                    {isFrench ? 'Prestations fréquentes :' : 'Popular Offerings:'}
                  </ThemedText>
                  <View style={styles.popularTagsRow}>
                    {cat.popularServices.map((svc, idx) => (
                      <View key={idx} style={styles.popularTag}>
                        <Ionicons name="checkmark-circle" size={13} color={Palette.primary} />
                        <ThemedText style={styles.popularTagText}>{svc}</ThemedText>
                      </View>
                    ))}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.cardActions}>
                    <Pressable
                      onPress={() => handleExploreArtisans(cat.id)}
                      style={styles.outlineActionBtn}>
                      <Ionicons name="people-outline" size={16} color={Palette.primary} />
                      <ThemedText style={styles.outlineActionText}>
                        {isFrench ? 'Voir les artisans' : 'Explore Artisans'}
                      </ThemedText>
                    </Pressable>

                    <Pressable
                      onPress={() => openServiceDetails(cat)}
                      style={styles.primaryActionBtn}>
                      <ThemedText style={styles.primaryActionText}>
                        {isFrench ? 'Détails & Tarifs' : 'Details & Pricing'}
                      </ThemedText>
                      <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.dark,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  searchWrap: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.outline,
    ...Shadows.subtle,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.mainText,
    paddingVertical: 0,
  },
  filterBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingVertical: Spacing.xs,
  },
  filterScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  filterChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.secondaryText,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: BottomTabInset + Spacing.xl + 20,
    gap: Spacing.md,
  },
  categoryCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.outline,
    ...Shadows.card,
  },
  cardImageWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 48, 74, 0.4)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(18, 48, 74, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  countBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  countBadgeText: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  categoryDescription: {
    fontSize: 13,
    color: Palette.secondaryText,
    lineHeight: 18,
  },
  popularOfferingsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.dark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  popularTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  popularTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.surfaceContainerLow,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  popularTagText: {
    fontSize: 12,
    color: Palette.dark,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  outlineActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  outlineActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.primary,
    ...Shadows.subtle,
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.dark,
  },
  emptySub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    maxWidth: 300,
  },
  resetBtn: {
    marginTop: Spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.primary,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
