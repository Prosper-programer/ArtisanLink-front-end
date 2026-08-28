import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const ONBOARDING_DATA = [
  {
    id: 1,
    step: 'FIND',
    title: 'Find the right professional',
    description: 'Discover skilled professionals offering the services you need near you.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80', // Real plumber at work
    buttonText: 'Next →',
    showBadges: false,
  },
  {
    id: 2,
    step: 'CONNECT',
    title: 'Connect with trusted professionals',
    description: 'Compare professionals, explore their profiles and choose the right person for your job.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80', // Real certified master professional
    buttonText: 'Next →',
    showBadges: true,
    badges: {
      verified: 'Verified',
      rating: '4.8',
      distance: '1.2 km',
    },
  },
  {
    id: 3,
    step: 'GET_IT_DONE',
    title: 'Get the job done',
    description: 'Send your request, communicate with your professional and get your work completed with confidence.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80', // Real pro and customer collaboration
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
      {/* Full Screen Cover Image */}
      <Image
        source={{ uri: current.image }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* Dark Overlay Gradient for High Contrast Text */}
      <View style={styles.imageOverlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar Header */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="construct" size={18} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.logoText}>
              <ThemedText style={{ color: '#FFFFFF' }}>Artisan</ThemedText>
              <ThemedText style={{ color: '#38BDF8' }}>Link</ThemedText>
            </ThemedText>
          </View>

          {!isLast && (
            <Pressable onPress={handleSkip} style={styles.skipBtn}>
              <ThemedText style={styles.skipBtnText}>Skip</ThemedText>
            </Pressable>
          )}
        </View>

        {/* Step 2 Subtle Floating Badges */}
        {current.showBadges && current.badges && (
          <View style={styles.floatingBadgesContainer}>
            <View style={styles.badgeItem}>
              <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
              <ThemedText style={styles.badgeItemText}>{current.badges.verified}</ThemedText>
            </View>
            <View style={styles.badgeItem}>
              <Ionicons name="star" size={15} color={Palette.gold} />
              <ThemedText style={styles.badgeItemText}>{current.badges.rating}</ThemedText>
            </View>
            <View style={styles.badgeItem}>
              <Ionicons name="location-sharp" size={15} color={Palette.primary} />
              <ThemedText style={styles.badgeItemText}>{current.badges.distance}</ThemedText>
            </View>
          </View>
        )}

        {/* Bottom Content Card Overlaid on Image */}
        <View style={styles.bottomSheetCard}>
          <View style={styles.textSection}>
            <ThemedText type="headlineLg" style={styles.title}>
              {current.title}
            </ThemedText>
            <ThemedText style={styles.description}>
              {current.description}
            </ThemedText>
          </View>

          {/* Centered 3 Progress Dots in the Middle */}
          <View style={styles.centeredProgressRow}>
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

          {/* Action Buttons: Last screen does NOT have back arrow '<-', only Get Started */}
          <View style={styles.actionsRow}>
            {!isLast && currentStepIndex > 0 && (
              <Pressable
                onPress={() => setCurrentStepIndex((prev) => prev - 1)}
                style={styles.backBtn}>
                <Ionicons name="arrow-back" size={20} color={Palette.dark} />
              </Pressable>
            )}

            <Pressable onPress={handleNext} style={styles.primaryBtn}>
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
    backgroundColor: Palette.dark,
    zIndex: 9980,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 48, 74, 0.55)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  skipBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  floatingBadgesContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginTop: Spacing.md,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    ...Shadows.subtle,
  },
  badgeItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.dark,
  },
  bottomSheetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.lg,
    ...Shadows.hover,
  },
  textSection: {
    gap: Spacing.xs,
  },
  title: {
    color: Palette.dark,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  description: {
    color: Palette.secondaryText,
    fontSize: 14,
    lineHeight: 21,
  },
  // Centered 3 dots in the exact middle
  centeredProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: Palette.primary,
  },
  progressDotInactive: {
    width: 8,
    backgroundColor: Palette.outlineDark,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backBtn: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
