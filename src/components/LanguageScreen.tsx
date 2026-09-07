import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import CountryFlag from './CountryFlag';

export const LanguageScreen: React.FC = () => {
  const { language, setLanguage, setAppPhase } = useApp();

  const handleContinue = () => {
    setAppPhase('ONBOARDING');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="construct" size={24} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.logoText}>
            <ThemedText style={{ color: Palette.dark, fontWeight: '800' }}>Artisan</ThemedText>
            <ThemedText style={{ color: Palette.primary, fontWeight: '800' }}>Link</ThemedText>
          </ThemedText>
        </View>

        {/* Title & Subtitle */}
        <View style={styles.headingSection}>
          <ThemedText type="headlineXl" style={styles.title}>
            Welcome! 👋
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Choose your language
          </ThemedText>
        </View>

        {/* Language Options */}
        <View style={styles.optionsContainer}>
          {/* English Option */}
          <Pressable
            onPress={() => setLanguage('en')}
            style={[
              styles.languageCard,
              language === 'en' && styles.languageCardSelected,
            ]}>
            <View style={styles.flagIconWrap}>
              <CountryFlag country="en" size={28} />
            </View>
            <View style={styles.languageTextWrap}>
              <ThemedText style={[styles.languageName, language === 'en' && styles.languageNameSelected]}>
                English
              </ThemedText>
              <ThemedText style={styles.languageSub}>English (US / UK)</ThemedText>
            </View>
            <View
              style={[
                styles.radioCircle,
                language === 'en' && styles.radioCircleSelected,
              ]}>
              {language === 'en' && <View style={styles.radioCore} />}
            </View>
          </Pressable>

          {/* Français Option */}
          <Pressable
            onPress={() => setLanguage('fr')}
            style={[
              styles.languageCard,
              language === 'fr' && styles.languageCardSelected,
            ]}>
            <View style={styles.flagIconWrap}>
              <CountryFlag country="fr" size={28} />
            </View>
            <View style={styles.languageTextWrap}>
              <ThemedText style={[styles.languageName, language === 'fr' && styles.languageNameSelected]}>
                Français
              </ThemedText>
              <ThemedText style={styles.languageSub}>French</ThemedText>
            </View>
            <View
              style={[
                styles.radioCircle,
                language === 'fr' && styles.radioCircleSelected,
              ]}>
              {language === 'fr' && <View style={styles.radioCore} />}
            </View>
          </Pressable>
        </View>
      </View>

      {/* Continue Action */}
      <View style={styles.footer}>
        <Pressable onPress={handleContinue} style={styles.continueBtn}>
          <ThemedText style={styles.continueBtnText}>
            Continue
          </ThemedText>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Palette.background, // #F8FAFC
    justifyContent: 'space-between',
    zIndex: 9990,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.dark,
    letterSpacing: -0.3,
  },
  headingSection: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  title: {
    color: Palette.dark,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    color: Palette.secondaryText,
  },
  optionsContainer: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  languageCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainerLow,
  },
  flagIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 24,
  },
  languageTextWrap: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.dark,
  },
  languageNameSelected: {
    color: Palette.primary,
  },
  languageSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Palette.outlineDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Palette.primary,
  },
  radioCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Palette.primary,
  },
  footer: {
    padding: Spacing.lg,
  },
  continueBtn: {
    height: 52,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary, // #1769AA
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
