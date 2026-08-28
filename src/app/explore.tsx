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
import { POPULAR_SERVICES, PROFESSIONALS, ServiceCategory, Professional } from '@/data/mockData';

export default function ExploreScreen() {
  const {
    openServiceDetails,
    openProfessionalProfile,
    openCreateRequest,
    startChatWithPro,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'professionals'>('services');

  const filteredServices = useMemo(() => {
    return POPULAR_SERVICES.filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.popularServices.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const filteredPros = useMemo(() => {
    return PROFESSIONALS.filter((p) => {
      if (
        selectedCategoryFilter !== 'all' &&
        p.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.profession.toLowerCase().includes(q) ||
          p.skills.some((sk) => sk.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategoryFilter, searchQuery]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <ThemedText type="headlineLg" style={styles.headerTitle}>
            Services & Trades
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={18} color={Palette.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder={activeTab === 'services' ? 'Search services...' : 'Search professionals by name, trade...'}
              placeholderTextColor={Palette.secondaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Palette.secondaryText} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Switcher Tabs: Services vs Professionals */}
        <View style={styles.switchTabsRow}>
          <Pressable
            onPress={() => setActiveTab('services')}
            style={[styles.switchTab, activeTab === 'services' && styles.switchTabActive]}>
            <ThemedText
              style={[
                styles.switchTabText,
                activeTab === 'services' && styles.switchTabTextActive,
              ]}>
              All Services ({filteredServices.length})
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('professionals')}
            style={[styles.switchTab, activeTab === 'professionals' && styles.switchTabActive]}>
            <ThemedText
              style={[
                styles.switchTabText,
                activeTab === 'professionals' && styles.switchTabTextActive,
              ]}>
              Professionals ({filteredPros.length})
            </ThemedText>
          </Pressable>
        </View>

        {/* Category Chips if viewing Professionals */}
        {activeTab === 'professionals' && (
          <View style={styles.categoryChipsBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
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
                  All Trades
                </ThemedText>
              </Pressable>

              {POPULAR_SERVICES.map((cat) => {
                const isSelected = selectedCategoryFilter === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategoryFilter(cat.id)}
                    style={[styles.categoryChip, isSelected && styles.categoryChipActive]}>
                    <ThemedText
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextActive,
                      ]}>
                      {cat.name}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Main Body List */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {activeTab === 'services' ? (
            /* SERVICES GRID VIEW */
            <View style={styles.servicesGrid}>
              {filteredServices.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => openServiceDetails(cat)}
                  style={styles.serviceGridCard}>
                  <Image source={{ uri: cat.image }} style={styles.serviceGridImg} />
                  <View style={styles.serviceGridOverlay} />
                  <View style={styles.serviceGridContent}>
                    <ThemedText style={styles.serviceGridTitle}>{cat.name}</ThemedText>
                    <ThemedText style={styles.serviceGridSub}>
                      {cat.count} verified pros available
                    </ThemedText>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            /* PROFESSIONALS LIST VIEW */
            <View style={styles.prosList}>
              {filteredPros.map((pro) => (
                <Pressable
                  key={pro.id}
                  onPress={() => openProfessionalProfile(pro)}
                  style={styles.proCard}>
                  <View style={styles.proCardTop}>
                    <Image source={{ uri: pro.avatar }} style={styles.proAvatar} />

                    <View style={styles.proInfo}>
                      <View style={styles.proNameRow}>
                        <ThemedText style={styles.proName}>{pro.name}</ThemedText>
                        {pro.verified && (
                          <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                        )}
                      </View>

                      <ThemedText style={styles.proProfession}>{pro.profession}</ThemedText>

                      <View style={styles.proMetaRow}>
                        <Ionicons name="star" size={13} color={Palette.gold} />
                        <ThemedText style={styles.proRating}>
                          {pro.rating} · {pro.reviewCount} reviews
                        </ThemedText>
                        <ThemedText style={styles.metaDot}>·</ThemedText>
                        <ThemedText style={styles.proDist}>{pro.distance}</ThemedText>
                      </View>
                    </View>
                  </View>

                  <View style={styles.proActionsRow}>
                    <Pressable
                      onPress={() => startChatWithPro(pro)}
                      style={styles.chatActionBtn}>
                      <Ionicons name="chatbubble-ellipses-outline" size={16} color={Palette.dark} />
                      <ThemedText style={styles.chatActionText}>Chat</ThemedText>
                    </Pressable>

                    <Pressable
                      onPress={() => openCreateRequest(undefined, pro)}
                      style={styles.requestActionBtn}>
                      <ThemedText style={styles.requestActionText}>Request Service</ThemedText>
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </View>
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
    paddingVertical: Spacing.md,
    backgroundColor: Palette.surface,
  },
  headerTitle: {
    color: Palette.dark,
  },
  searchWrap: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Palette.surface,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.mainText,
  },
  switchTabsRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  switchTabActive: {
    borderBottomColor: Palette.primary,
  },
  switchTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.secondaryText,
  },
  switchTabTextActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  categoryChipsBar: {
    width: '100%',
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  chipsScroll: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.xs + 2,
  },
  categoryChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
  },
  categoryChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
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
    paddingTop: Spacing.md,
    paddingBottom: BottomTabInset + Spacing.xl,
  },
  servicesGrid: {
    gap: Spacing.md,
  },
  serviceGridCard: {
    width: '100%',
    height: 130,
    borderRadius: BorderRadius.default,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.card,
  },
  serviceGridImg: {
    width: '100%',
    height: '100%',
  },
  serviceGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 48, 74, 0.45)',
  },
  serviceGridContent: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  serviceGridTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  serviceGridSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  prosList: {
    gap: Spacing.md,
  },
  proCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  proCardTop: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  proAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  proInfo: {
    flex: 1,
  },
  proNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  proName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
  },
  proProfession: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 1,
  },
  proMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
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
  proDist: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  proActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chatActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
  },
  chatActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.dark,
  },
  requestActionBtn: {
    flex: 1.5,
    paddingVertical: 8,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
