import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  Palette,
  Spacing,
  BorderRadius,
  Shadows,
  BottomTabInset,
  MaxContentWidth,
} from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { POPULAR_SERVICES, PROFESSIONALS } from '@/data/mockData';

export default function HomeScreen() {
  const router = useRouter();
  const {
    user,
    authStatus,
    openAuthModal,
    openServiceDetails,
    openProfessionalProfile,
    openProviderActivation,
  } = useApp();

  const isGuest = authStatus === 'guest';

  const handleServiceClick = (cat: typeof POPULAR_SERVICES[0]) => {
    openServiceDetails(cat);
  };

  const handleViewAllServices = () => {
    router.push('/explore');
  };

  const handleAccountIconClick = () => {
    if (isGuest) {
      openAuthModal(() => {
        router.push('/profile');
      });
    } else {
      router.push('/profile');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="construct" size={18} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.brandName}>
              <ThemedText style={{ color: Palette.dark, fontWeight: '800' }}>Artisan</ThemedText>
              <ThemedText style={{ color: Palette.primary, fontWeight: '800' }}>Link</ThemedText>
            </ThemedText>
          </View>

          <View style={styles.headerIcons}>
            <Pressable
              onPress={() => (isGuest ? openAuthModal() : router.push('/bookings'))}
              style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={Palette.dark} />
              {!isGuest && <View style={styles.notifDot} />}
            </Pressable>

            <Pressable onPress={handleAccountIconClick} style={styles.iconBtn}>
              <Ionicons name="person-circle-outline" size={24} color={Palette.dark} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <ThemedText style={styles.greetingText}>
              {isGuest ? 'Hello 👋' : `Hello, ${user.name.split(' ')[0]} 👋`}
            </ThemedText>
            <ThemedText type="headlineXl" style={styles.mainHeading}>
              What do you need help with?
            </ThemedText>
          </View>

          {/* Search Bar */}
          <Pressable onPress={() => router.push('/explore')} style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Palette.primary} />
            <ThemedText style={styles.searchPlaceholder}>
              Search for a service...
            </ThemedText>
          </Pressable>

          {/* POPULAR SERVICES SECTION */}
          <View style={styles.sectionHeader}>
            <ThemedText type="headlineMd" style={styles.sectionTitle}>
              Popular Services
            </ThemedText>
            <Pressable onPress={handleViewAllServices}>
              <ThemedText style={styles.viewAllText}>View all services →</ThemedText>
            </Pressable>
          </View>

          <View style={styles.popularServicesGrid}>
            {POPULAR_SERVICES.slice(0, 6).map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => handleServiceClick(cat)}
                style={styles.serviceCard}>
                <Image source={{ uri: cat.image }} style={styles.serviceCardImg} />
                <View style={styles.serviceCardOverlay} />
                <View style={styles.serviceCardContent}>
                  <ThemedText style={styles.serviceCardName}>{cat.name}</ThemedText>
                </View>
              </Pressable>
            ))}
          </View>

          {/* BECOME A PROVIDER PROMOTIONAL CARD WITH FULL IMAGE COVER & BLUR TEXT OVERLAY */}
          <View style={styles.providerPromoCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
              }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            {/* Dark Blur Overlay */}
            <View style={styles.providerCardOverlay} />

            <View style={styles.providerCardContent}>
              <View style={styles.providerTag}>
                <Ionicons name="construct" size={12} color={Palette.accent} />
                <ThemedText style={styles.providerTagText}>PARTNER WITH US</ThemedText>
              </View>

              <ThemedText style={styles.providerTitle}>Become a Provider</ThemedText>
              <ThemedText style={styles.providerSub}>
                Offer your services on ArtisanLink
              </ThemedText>

              <Pressable onPress={openProviderActivation} style={styles.providerBtn}>
                <ThemedText style={styles.providerBtnText}>Get Started →</ThemedText>
              </Pressable>
            </View>
          </View>

          {/* NEARBY PROFESSIONALS SECTION */}
          <View style={[styles.sectionHeader, { marginTop: Spacing.md }]}>
            <View>
              <ThemedText type="headlineMd" style={styles.sectionTitle}>
                Professionals near you
              </ThemedText>
            </View>
          </View>

          <View style={styles.proList}>
            {PROFESSIONALS.slice(0, 4).map((pro) => (
              <Pressable
                key={pro.id}
                onPress={() => openProfessionalProfile(pro)}
                style={styles.proCard}>
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
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color={Palette.gold} />
                      <ThemedText style={styles.ratingText}>
                        {pro.rating} · {pro.reviewCount} reviews
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.metaDot}>·</ThemedText>
                    <View style={styles.distRow}>
                      <Ionicons name="location-outline" size={13} color={Palette.secondaryText} />
                      <ThemedText style={styles.distText}>{pro.distance}</ThemedText>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => openProfessionalProfile(pro)}
                  style={styles.viewProfileActionBtn}>
                  <ThemedText style={styles.viewProfileText}>View Profile</ThemedText>
                </Pressable>
              </Pressable>
            ))}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    letterSpacing: -0.3,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.accent,
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
    paddingBottom: BottomTabInset + Spacing.xl + 20,
    gap: Spacing.md,
  },
  greetingSection: {
    gap: 4,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.secondaryText,
  },
  mainHeading: {
    color: Palette.dark,
    lineHeight: 34,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    height: 48,
    ...Shadows.subtle,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: Palette.secondaryText,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    color: Palette.dark,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  popularServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  serviceCard: {
    width: '48%',
    height: 110,
    borderRadius: BorderRadius.default,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.subtle,
  },
  serviceCardImg: {
    width: '100%',
    height: '100%',
  },
  serviceCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 48, 74, 0.45)',
  },
  serviceCardContent: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
  },
  serviceCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // BECOME A PROVIDER FULL COVER IMAGE CARD
  providerPromoCard: {
    height: 150,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    marginTop: Spacing.xs,
    ...Shadows.card,
  },
  providerCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 48, 74, 0.72)',
  },
  providerCardContent: {
    padding: Spacing.lg,
    gap: 4,
  },
  providerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  providerTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.accent,
    letterSpacing: 0.5,
  },
  providerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  providerSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  providerBtn: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs + 2,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  providerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  proList: {
    gap: Spacing.sm,
  },
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.md,
    ...Shadows.subtle,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
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
  distText: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  viewProfileActionBtn: {
    backgroundColor: Palette.surfaceContainerLow,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
});
