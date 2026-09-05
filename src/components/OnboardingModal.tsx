import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const ONBOARDING_DATA = [
  {
    id: 1,
    step: 'FIND',
    tag: 'EXPLORE SERVICES',
    title: 'Find the right professional',
    description: 'Discover skilled and verified professionals offering the services you need near you.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=85',
    buttonText: 'Next →',
    showBadges: false,
  },
  {
    id: 2,
    step: 'CONNECT',
    tag: 'TRUSTED & VERIFIED',
    title: 'Connect with trusted professionals',
    description: 'Compare professionals, explore real ratings and reviews, and choose the perfect artisan for your project.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=85',
    buttonText: 'Next →',
    showBadges: true,
    badges: {
      verified: 'Verified Pro',
      rating: '4.9',
      distance: '1.2 km',
    },
  },
  {
    id: 3,
    step: 'GET_IT_DONE',
    tag: 'GUARANTEED QUALITY',
    title: 'Get the job done',
    description: 'Send your request, communicate directly with your professional, and get quality work done with total confidence.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=85',
    buttonText: 'Get Started',
    showBadges: false,
  },
];

export const OnboardingModal: React.FC = () => {
  const { appPhase, setAppPhase } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (appPhase !== 'ONBOARDING') return null;

  const current = ONBOARDING_DATA[currentStepIndex];
  const isLast = currentStepIndex === ONBOARDING_DATA.length - 1;

  const handleNext = () => {
    if (isLast) {
      setAppPhase('APP');
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setAppPhase('APP');
  };

  return (
    <View style={styles.container}>
      {/* 1. Full-screen Cinematic Artisan Image taking the whole screen */}
      <Image
        key={current.image}
        source={{ uri: current.image }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* 2. Ultra-Smooth Native Linear Gradient: Seamless transparent fade into rich navy dark */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(9, 21, 34, 0.08)',
          'rgba(9, 21, 34, 0.35)',
          'rgba(9, 21, 34, 0.68)',
          'rgba(9, 21, 34, 0.92)',
        ]}
        locations={[0, 0.25, 0.55, 0.8, 1]}
        style={styles.smoothBottomGradient}
        pointerEvents="none"
      />

      {/* 3. Safe Area Interactive Layer */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Top Header: Matching ArtisanLink Brand Bar & Clean Action Button */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="construct" size={17} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.logoText}>
              <ThemedText style={{ color: Palette.dark, fontWeight: '800' }}>Artisan</ThemedText>
              <ThemedText style={{ color: Palette.primary, fontWeight: '800' }}>Link</ThemedText>
            </ThemedText>
          </View>

          {!isLast ? (
            <Pressable
              onPress={handleSkip}
              style={({ pressed }) => [
                styles.skipBtn,
                pressed && styles.skipBtnPressed,
              ]}
              hitSlop={10}
              accessibilityLabel="Skip onboarding">
              <ThemedText style={styles.skipBtnText}>Skip</ThemedText>
              <Ionicons name="chevron-forward" size={15} color={Palette.secondaryText} />
            </Pressable>
          ) : (
            <View style={styles.skipSpacer} />
          )}
        </View>

        {/* Bottom Section: Badge, Title, Description, Pagination Dots, Actions */}
        <View style={styles.bottomContent}>
            {/* Step Tag / Pill */}
            <View style={styles.stepTagPill}>
              <Ionicons name="sparkles" size={12} color={Palette.accent} />
              <ThemedText style={styles.stepTagText}>{current.tag}</ThemedText>
            </View>

            {/* Step 2 Trust Badges (Success Green verification, Warm Gold rating, Artisan Blue distance) */}
            {current.showBadges && current.badges && (
              <View style={styles.trustBadgesRow}>
                <View style={styles.badgeItem}>
                  <Ionicons name="checkmark-circle" size={14} color={Palette.success} />
                  <ThemedText style={styles.badgeItemText}>{current.badges.verified}</ThemedText>
                </View>
                <View style={styles.badgeItem}>
                  <Ionicons name="star" size={13} color={Palette.gold} />
                  <ThemedText style={styles.badgeItemText}>{current.badges.rating}</ThemedText>
                </View>
                <View style={styles.badgeItem}>
                  <Ionicons name="location-sharp" size={13} color={Palette.primary} />
                  <ThemedText style={styles.badgeItemText}>{current.badges.distance}</ThemedText>
                </View>
              </View>
            )}

            {/* Heading & Subtitle */}
            <View style={styles.textStack}>
              <ThemedText type="headlineLg" style={styles.title}>
                {current.title}
              </ThemedText>
              <ThemedText style={styles.description}>
                {current.description}
              </ThemedText>
            </View>

            {/* Centered Pagination Dots */}
            <View style={styles.dotsRow}>
              {ONBOARDING_DATA.map((_, idx) => {
                const active = idx === currentStepIndex;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.progressDot,
                      active ? styles.progressDotActive : styles.progressDotInactive,
                    ]}
                  />
                );
              })}
            </View>

            {/* Action Row: Back Button & Primary Button */}
            <View style={styles.actionsRow}>
              {currentStepIndex > 0 && (
                <Pressable
                  onPress={() => setCurrentStepIndex((prev) => prev - 1)}
                  style={({ pressed }) => [
                    styles.backBtn,
                    pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
                  ]}
                  accessibilityLabel="Go back">
                  <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </Pressable>
              )}

              <Pressable
                onPress={handleNext}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
                accessibilityLabel={current.buttonText}>
                <ThemedText style={styles.primaryBtnText}>
                  {current.buttonText}
                </ThemedText>
              </Pressable>
            </View>
          </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#091522',
    zIndex: 9980,
  },

  // Ultra-Smooth Native Linear Gradient bottom mask
  smoothBottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '65%',
  },

  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Top Bar Layout - Soft translucent white pills floating directly over image
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.72)', // Reduced white opacity
    paddingVertical: 6,
    paddingHorizontal: 12,
    paddingRight: 16,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.60)',
    ...Shadows.subtle,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.72)', // Reduced white opacity
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.60)',
    ...Shadows.subtle,
  },
  skipBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
    letterSpacing: 0.2,
  },
  skipSpacer: {
    width: 50,
  },

  // Bottom Content Stack
  bottomContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },

  // Step Tag
  stepTagPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(242, 140, 40, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(242, 140, 40, 0.38)',
  },
  stepTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.accent,
    letterSpacing: 0.8,
  },

  // Step 2 Trust Badges
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: BorderRadius.full,
    ...Shadows.subtle,
  },
  badgeItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.dark,
  },

  // Typography
  textStack: {
    gap: Spacing.xs + 2,
    marginTop: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  description: {
    color: 'rgba(241, 245, 249, 0.88)',
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
  },

  // Pagination Indicator
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
  },
  progressDotActive: {
    width: 28,
    backgroundColor: Palette.accent, // Craft Orange accent for active step
  },
  progressDotInactive: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.30)',
  },

  // Action Buttons
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary, // Artisan Blue
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
