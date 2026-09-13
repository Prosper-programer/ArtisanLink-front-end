import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette, Spacing, BorderRadius, BottomTabInset, MaxContentWidth, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import AppHeader from '@/components/AppHeader';

export default function MessagesScreen() {
  const router = useRouter();
  const { authStatus, openAuthModal, language } = useApp();

  const isGuest = authStatus === 'guest';
  const isFrench = language === 'fr';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <AppHeader
          title={isFrench ? 'Messages' : 'Messages'}
          eyebrow="COMMUNICATION"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {isGuest ? (
            /* Guest Prompt */
            <View style={styles.cardContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-circle-outline" size={48} color={Palette.primary} />
              </View>

              <ThemedText type="headlineMd" style={styles.cardTitle}>
                {isFrench ? 'Connectez-vous à votre compte' : 'Sign in to ArtisanLink'}
              </ThemedText>

              <ThemedText style={styles.cardSubtitle}>
                {isFrench
                  ? 'Connectez-vous pour voir vos demandes de services, suivre les artisans et accéder aux futures fonctionnalités de messagerie.'
                  : 'Sign in to view your active service requests, track technicians, and access future messaging releases.'}
              </ThemedText>

              <Pressable
                onPress={() => openAuthModal()}
                style={styles.primaryBtn}
                accessibilityRole="button">
                <ThemedText style={styles.primaryBtnText}>
                  {isFrench ? 'Se connecter / S’inscrire' : 'Sign In / Register'}
                </ThemedText>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            /* Feature Not Yet Available Card */
            <View style={styles.cardContainer}>
              <View style={[styles.iconCircle, styles.featureIconCircle]}>
                <Ionicons name="chatbubbles-outline" size={48} color={Palette.primary} />
              </View>

              <View style={styles.tagBadge}>
                <Ionicons name="sparkles" size={14} color={Palette.primary} />
                <ThemedText style={styles.tagBadgeText}>
                  {isFrench ? 'Bientôt disponible' : 'Coming Soon'}
                </ThemedText>
              </View>

              <ThemedText type="headlineMd" style={styles.cardTitle}>
                {isFrench
                  ? 'Fonctionnalité non disponible dans cette version'
                  : 'Feature not yet available in this app version'}
              </ThemedText>

              <ThemedText style={styles.cardSubtitle}>
                {isFrench
                  ? 'La messagerie instantanée intégrée est en cours de développement et sera disponible dans la prochaine mise à jour de l’application.'
                  : 'In-app real-time messaging is currently under active development and will be released in an upcoming update.'}
              </ThemedText>

              <View style={styles.tipBox}>
                <Ionicons name="call-outline" size={20} color={Palette.primary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.tipTitle}>
                    {isFrench ? 'Comment contacter votre artisan ?' : 'How to reach your artisan?'}
                  </ThemedText>
                  <ThemedText style={styles.tipBody}>
                    {isFrench
                      ? 'Vous pouvez directement appeler ou envoyer un SMS à votre artisan assigné en appuyant sur le bouton d’appel dans l’onglet Demandes.'
                      : 'You can directly call or SMS your assigned artisan using the contact button on confirmed requests in the Requests tab.'}
                  </ThemedText>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionCol}>
                <Pressable
                  onPress={() => router.push('/requests')}
                  style={styles.primaryBtn}
                  accessibilityRole="button">
                  <Ionicons name="clipboard-outline" size={18} color="#FFFFFF" />
                  <ThemedText style={styles.primaryBtnText}>
                    {isFrench ? 'Voir mes demandes' : 'View My Service Requests'}
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/explore')}
                  style={styles.secondaryBtn}
                  accessibilityRole="button">
                  <ThemedText style={styles.secondaryBtnText}>
                    {isFrench ? 'Explorer les artisans' : 'Explore Artisans'}
                  </ThemedText>
                </Pressable>
              </View>
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
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: BottomTabInset + Spacing.xl,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(23, 105, 170, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  featureIconCircle: {
    backgroundColor: 'rgba(23, 105, 170, 0.1)',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(23, 105, 170, 0.12)',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    color: Palette.dark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: 'rgba(23, 105, 170, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(23, 105, 170, 0.15)',
    borderRadius: BorderRadius.default,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.xl,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
    marginBottom: 2,
  },
  tipBody: {
    fontSize: 12,
    color: Palette.secondaryText,
    lineHeight: 16,
  },
  actionCol: {
    width: '100%',
    gap: Spacing.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.primary,
    height: 48,
    borderRadius: BorderRadius.default,
    width: '100%',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
    width: '100%',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.dark,
  },
});
