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
import { POPULAR_SERVICES, PROFESSIONALS, Professional } from '@/data/mockData';

export default function ExploreScreen() {
  const {
    openProfessionalProfile,
    openCreateRequest,
    startChatWithPro,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    authStatus,
    openAuthModal,
    language,
  } = useApp();

  const isGuest = authStatus === 'guest';
  const isFrench = language === 'fr';

  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'today' | 'topRated'>('all');

  const categoryNamesFr: Record<string, string> = {
    plumbing: 'Plomberie',
    electrical: 'Électricité',
    painting: 'Peinture',
    carpentry: 'Menuiserie',
    cleaning: 'Nettoyage',
    masonry: 'Maçonnerie',
    construction: 'Construction',
    mechanics: 'Mécanique',
    pastry: 'Pâtisserie',
  };

  const getCategoryLabel = (id: string, name: string) => {
    return isFrench && categoryNamesFr[id] ? categoryNamesFr[id] : name;
  };

  const filteredPros = useMemo(() => {
    return PROFESSIONALS.filter((p) => {
      // Category Filter
      if (
        selectedCategoryFilter !== 'all' &&
        p.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()
      ) {
        return false;
      }

      // Quick Availability / Rating Filter
      if (quickFilter === 'today' && p.availability !== 'Available Today') {
        return false;
      }
      if (quickFilter === 'topRated' && p.rating < 4.9) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.profession.toLowerCase().includes(q) ||
          p.specialization.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.skills.some((sk) => sk.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategoryFilter, quickFilter, searchQuery]);

  const handleChatPress = (pro: Professional) => {
    if (isGuest) {
      openAuthModal(() => {
        startChatWithPro(pro);
      });
    } else {
      startChatWithPro(pro);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.headerTitleRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="headlineLg" style={styles.headerTitle}>
                {isFrench ? 'Explorer les Artisans' : 'Explore Providers'}
              </ThemedText>
              <ThemedText style={styles.headerSub}>
                {isFrench
                  ? 'Découvrez nos professionnels certifiés sans créer de compte'
                  : 'Discover verified professionals & portfolios without creating an account'}
              </ThemedText>
            </View>
          </View>

          {/* Guest Reassurance Banner */}
          <View style={styles.reassurancePill}>
            <Ionicons name="sparkles" size={14} color={Palette.primary} />
            <ThemedText style={styles.reassuranceText}>
              {isFrench
                ? 'Accès libre : consultez profils, avis et tarifs en toute liberté'
                : 'Free access: view profiles, reviews, and rates with zero signup required'}
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
                  ? 'Rechercher par nom, métier, compétences...'
                  : 'Search by artisan name, trade, specialty, skills...'
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

        {/* Category Filter Chips Bar */}
        <View style={styles.categoryChipsBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}>
            <Pressable
              onPress={() => setSelectedCategoryFilter('all')}
              style={[
                styles.categoryChip,
                selectedCategoryFilter === 'all' && styles.categoryChipActive,
              ]}>
              <ThemedText
                style={[
                  styles.categoryChipText,
                  selectedCategoryFilter === 'all' && styles.categoryChipTextActive,
                ]}>
                {isFrench ? 'Tous les métiers' : 'All Trades'}
              </ThemedText>
            </Pressable>

            {POPULAR_SERVICES.map((cat) => {
              const isSelected = selectedCategoryFilter === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategoryFilter(cat.id)}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive]}>
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={isSelected ? '#FFFFFF' : Palette.secondaryText}
                  />
                  <ThemedText
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}>
                    {getCategoryLabel(cat.id, cat.name)}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Secondary Quick Filter Pills (All / Today / Top Rated) */}
        <View style={styles.quickFilterBar}>
          <Pressable
            onPress={() => setQuickFilter('all')}
            style={[
              styles.quickFilterBtn,
              quickFilter === 'all' && styles.quickFilterBtnActive,
            ]}>
            <ThemedText
              style={[
                styles.quickFilterText,
                quickFilter === 'all' && styles.quickFilterTextActive,
              ]}>
              {isFrench ? 'Tous' : 'All'} ({filteredPros.length})
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setQuickFilter('today')}
            style={[
              styles.quickFilterBtn,
              quickFilter === 'today' && styles.quickFilterBtnActive,
            ]}>
            <Ionicons
              name="flash"
              size={12}
              color={quickFilter === 'today' ? '#FFFFFF' : Palette.accent}
            />
            <ThemedText
              style={[
                styles.quickFilterText,
                quickFilter === 'today' && styles.quickFilterTextActive,
              ]}>
              {isFrench ? 'Dispo aujourd’hui' : 'Available Today'}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setQuickFilter('topRated')}
            style={[
              styles.quickFilterBtn,
              quickFilter === 'topRated' && styles.quickFilterBtnActive,
            ]}>
            <Ionicons
              name="star"
              size={12}
              color={quickFilter === 'topRated' ? '#FFFFFF' : Palette.gold}
            />
            <ThemedText
              style={[
                styles.quickFilterText,
                quickFilter === 'topRated' && styles.quickFilterTextActive,
              ]}>
              {isFrench ? 'Top notés (4.9+)' : 'Top Rated (4.9+)'}
            </ThemedText>
          </Pressable>
        </View>

        {/* Professionals List */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {filteredPros.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={Palette.secondaryText} />
              <ThemedText style={styles.emptyTitle}>
                {isFrench ? 'Aucun artisan trouvé' : 'No artisans match your criteria'}
              </ThemedText>
              <ThemedText style={styles.emptySub}>
                {isFrench
                  ? 'Essayez de changer les filtres de métier ou la recherche par mot-clé.'
                  : 'Try clearing your search query or choosing another trade category.'}
              </ThemedText>
              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategoryFilter('all');
                  setQuickFilter('all');
                }}
                style={styles.resetBtn}>
                <ThemedText style={styles.resetBtnText}>
                  {isFrench ? 'Réinitialiser les filtres' : 'Reset All Filters'}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            filteredPros.map((pro) => (
              <View key={pro.id} style={styles.proCard}>
                {/* Pro Top Header */}
                <View style={styles.proCardTop}>
                  <View style={styles.avatarWrap}>
                    <Image source={{ uri: pro.avatar }} style={styles.proAvatar} />
                    <View style={styles.onlineBadge} />
                  </View>

                  <View style={styles.proInfo}>
                    <View style={styles.proNameRow}>
                      <ThemedText style={styles.proName}>{pro.name}</ThemedText>
                      {pro.verified && (
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="checkmark-circle" size={15} color={Palette.success} />
                          <ThemedText style={styles.verifiedText}>
                            {isFrench ? 'Vérifié' : 'Verified'}
                          </ThemedText>
                        </View>
                      )}
                    </View>

                    <ThemedText style={styles.proProfession}>{pro.profession}</ThemedText>
                    <ThemedText style={styles.proSpecialization} numberOfLines={1}>
                      {pro.specialization}
                    </ThemedText>

                    <View style={styles.proMetaRow}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={13} color={Palette.gold} />
                        <ThemedText style={styles.proRating}>
                          {pro.rating} ({pro.reviewCount} {isFrench ? 'avis' : 'reviews'})
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.metaDot}>·</ThemedText>
                      <View style={styles.distRow}>
                        <Ionicons name="location-outline" size={13} color={Palette.secondaryText} />
                        <ThemedText style={styles.proDist}>{pro.distance}</ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Badge Row: Hourly Rate, Experience, Availability */}
                <View style={styles.proStatsRow}>
                  <View style={styles.statPill}>
                    <ThemedText style={styles.statPillLabel}>
                      {isFrench ? 'Tarif :' : 'Rate:'}
                    </ThemedText>
                    <ThemedText style={styles.statPillValue}>${pro.hourlyRate}/hr</ThemedText>
                  </View>

                  <View style={styles.statPill}>
                    <ThemedText style={styles.statPillLabel}>
                      {isFrench ? 'Exp :' : 'Exp:'}
                    </ThemedText>
                    <ThemedText style={styles.statPillValue}>{pro.experienceYears} yrs</ThemedText>
                  </View>

                  <View
                    style={[
                      styles.availabilityPill,
                      pro.availability === 'Available Today' && styles.availabilityToday,
                    ]}>
                    <Ionicons
                      name={pro.availability === 'Available Today' ? 'flash' : 'time-outline'}
                      size={11}
                      color={
                        pro.availability === 'Available Today' ? Palette.accent : Palette.secondaryText
                      }
                    />
                    <ThemedText
                      style={[
                        styles.availabilityText,
                        pro.availability === 'Available Today' && styles.availabilityTodayText,
                      ]}>
                      {pro.availability}
                    </ThemedText>
                  </View>
                </View>

                {/* Skills tags */}
                <View style={styles.skillsRow}>
                  {pro.skills.slice(0, 3).map((sk, idx) => (
                    <View key={idx} style={styles.skillTag}>
                      <ThemedText style={styles.skillTagText}>{sk}</ThemedText>
                    </View>
                  ))}
                  {pro.skills.length > 3 && (
                    <View style={styles.skillTagMore}>
                      <ThemedText style={styles.skillTagMoreText}>
                        +{pro.skills.length - 3}
                      </ThemedText>
                    </View>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.proActionsRow}>
                  {/* View Profile (Primary open for everyone, zero login required) */}
                  <Pressable
                    onPress={() => openProfessionalProfile(pro)}
                    style={styles.viewProfileBtn}>
                    <Ionicons name="eye-outline" size={15} color={Palette.primary} />
                    <ThemedText style={styles.viewProfileBtnText}>
                      {isFrench ? 'Voir Profil & Portfolio' : 'View Profile'}
                    </ThemedText>
                  </Pressable>

                  {/* Chat Action (Prompts sign in if guest) */}
                  <Pressable
                    onPress={() => handleChatPress(pro)}
                    style={styles.chatActionBtn}
                    accessibilityLabel="Message professional">
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={Palette.dark} />
                  </Pressable>

                  {/* Request Service */}
                  <Pressable
                    onPress={() => openCreateRequest(undefined, pro)}
                    style={styles.requestActionBtn}>
                    <ThemedText style={styles.requestActionText}>
                      {isFrench ? 'Demander' : 'Request'}
                    </ThemedText>
                  </Pressable>
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
  topHeader: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  reassurancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  reassuranceText: {
    fontSize: 12,
    color: Palette.primary,
    fontWeight: '600',
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
  categoryChipsBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingVertical: Spacing.xs,
  },
  chipsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  categoryChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.secondaryText,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  quickFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  quickFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  quickFilterBtnActive: {
    backgroundColor: Palette.dark,
    borderColor: Palette.dark,
  },
  quickFilterText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.secondaryText,
  },
  quickFilterTextActive: {
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
  proCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  proCardTop: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  avatarWrap: {
    position: 'relative',
    width: 62,
    height: 62,
  },
  proAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Palette.surfaceContainerLow,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Palette.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  proInfo: {
    flex: 1,
  },
  proNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  proName: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.dark,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Palette.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.success,
  },
  proProfession: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
    marginTop: 1,
  },
  proSpecialization: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 1,
  },
  proMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  proRating: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.dark,
  },
  metaDot: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  proDist: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  proStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.surfaceContainerLow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statPillLabel: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontWeight: '600',
  },
  statPillValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.dark,
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: Palette.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  availabilityToday: {
    backgroundColor: Palette.accentLight,
  },
  availabilityText: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontWeight: '600',
  },
  availabilityTodayText: {
    color: Palette.accentDark,
    fontWeight: '700',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: Palette.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  skillTagText: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontWeight: '500',
  },
  skillTagMore: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  skillTagMoreText: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontWeight: '600',
  },
  proActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  viewProfileBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  chatActionBtn: {
    width: 38,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  requestActionBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.primary,
  },
  requestActionText: {
    fontSize: 12,
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
