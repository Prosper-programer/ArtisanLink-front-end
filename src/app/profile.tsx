import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
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

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    authStatus,
    activeRole,
    toggleActiveRole,
    openAuthModal,
    logout,
    openProviderActivation,
    serviceRequests,
    openRequestDetails,
    language,
    setLanguage,
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<{ title: string; content: string } | null>(null);

  const isGuest = authStatus === 'guest';
  const isFrench = language === 'fr';
  const isProviderRole = user.isProvider && activeRole === 'provider';

  const newRequests = serviceRequests.filter((r) => r.status === 'Sent');
  const activeJobs = serviceRequests.filter((r) => r.status === 'Accepted' || r.status === 'In Progress');
  const completedJobs = serviceRequests.filter((r) => r.status === 'Completed');

  const handleHelpCenter = () => {
    setActiveInfoModal({
      title: isFrench ? 'Centre d’aide & FAQ' : 'Help Center & FAQ',
      content: isFrench
        ? "1. Comment réserver un artisan ?\nParcourez les services ou l'onglet Explorer, sélectionnez un professionnel certifié et cliquez sur 'Demander un service'.\n\n2. Comment fonctionne le paiement ?\nLes devis sont transparents. Le paiement s'effectue directement ou de manière sécurisée une fois le travail validé.\n\n3. Quelle est la garantie ArtisanLink ?\nTous nos artisans sont rigoureusement vérifiés (qualifications, assurances et références clients)."
        : '1. How do I book a professional?\nBrowse services or the Explore tab, choose a verified artisan, and tap "Request Service".\n\n2. How do payments work?\nQuotes are clear and transparent. Payment is handled directly or securely once the job is approved.\n\n3. What is the ArtisanLink Guarantee?\nAll artisans undergo credential checks, background verification, and verified customer review assessments.',
    });
  };

  const handleContactSupport = () => {
    setActiveInfoModal({
      title: isFrench ? 'Contacter le Support' : 'Contact Support',
      content: isFrench
        ? "Notre équipe d'assistance est à votre écoute 7j/7.\n\n📧 Email : support@artisanlink.com\n📞 Téléphone : +1 (800) 278-4726\n💬 Chat d'aide : disponible de 08h à 20h\n\nTemps de réponse habituel : moins de 15 minutes."
        : 'Our customer support team is available 7 days a week.\n\n📧 Email: support@artisanlink.com\n📞 Phone: +1 (800) 278-4726\n💬 Live Chat: Mon-Sun 8:00 AM - 8:00 PM\n\nTypical response time: under 15 minutes.',
    });
  };

  const handleAboutArtisanLink = () => {
    setActiveInfoModal({
      title: 'ArtisanLink',
      content: isFrench
        ? "ArtisanLink est la plateforme de référence connectant propriétaires et professionnels du bâtiment et des services artisanaux.\n\nNotre mission : rendre les travaux du quotidien simples, sûrs et transparents en valorisant les artisans locaux qualifiés."
        : 'ArtisanLink is the premier marketplace connecting homeowners with certified local craftspeople, tradespeople, and artisans.\n\nOur mission is to make home maintenance and specialized craft services transparent, reliable, and effortless.',
    });
  };

  const handleTermsAndPrivacy = (type: 'terms' | 'privacy') => {
    setActiveInfoModal({
      title: type === 'terms' ? (isFrench ? 'Conditions Générales' : 'Terms of Service') : (isFrench ? 'Politique de Confidentialité' : 'Privacy Policy'),
      content: isFrench
        ? 'En utilisant ArtisanLink, vous bénéficiez de garanties de protection des données conformes aux normes de sécurité les plus strictes. Vos coordonnées ne sont partagées avec les artisans que lors de la confirmation d’une intervention.'
        : 'By using ArtisanLink, your data is protected under modern encryption standards. Contact and location information is only shared with confirmed artisans upon booking.',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="headlineLg" style={styles.headerTitle}>
              {isFrench ? 'Compte & Paramètres' : 'Account & Settings'}
            </ThemedText>
            <ThemedText style={styles.headerSub}>
              {isGuest
                ? isFrench
                  ? 'Connectez-vous et gérez vos préférences'
                  : 'Manage sign-in, preferences, and support'
                : isProviderRole
                ? isFrench
                  ? 'Tableau de bord prestataire'
                  : 'Provider business dashboard'
                : isFrench
                ? 'Profil client et historique'
                : 'Customer profile and settings'}
            </ThemedText>
          </View>

          {/* Dual Role Switcher Button (if user is provider) */}
          {!isGuest && user.isProvider && (
            <Pressable onPress={toggleActiveRole} style={styles.roleSwitchBtn}>
              <Ionicons
                name={isProviderRole ? 'person-outline' : 'construct-outline'}
                size={14}
                color={Palette.primary}
              />
              <ThemedText style={styles.roleSwitchBtnText}>
                {isProviderRole
                  ? isFrench
                    ? 'Vue Client'
                    : 'Customer View'
                  : isFrench
                  ? 'Vue Pro'
                  : 'Provider View'}
              </ThemedText>
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* 1. GUEST USER HEADER / SIGN-IN CALLOUT */}
          {isGuest ? (
            <View style={styles.guestCard}>
              <View style={styles.guestAvatarWrap}>
                <Ionicons name="person-circle-outline" size={54} color={Palette.primary} />
              </View>
              <View style={styles.guestInfo}>
                <ThemedText type="headlineMd" style={styles.guestTitle}>
                  {isFrench ? 'Bienvenue sur ArtisanLink' : 'Welcome to ArtisanLink'}
                </ThemedText>
                <ThemedText style={styles.guestSub}>
                  {isFrench
                    ? 'Connectez-vous pour suivre vos demandes et échanger avec les artisans.'
                    : 'Sign in or register to book services, message artisans, and manage orders.'}
                </ThemedText>
              </View>
              <Pressable onPress={() => openAuthModal()} style={styles.signInPrimaryBtn}>
                <ThemedText style={styles.signInPrimaryBtnText}>
                  {isFrench ? 'Se connecter / Créer un compte' : 'Sign In / Create Account'}
                </ThemedText>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : isProviderRole ? (
            /* 2. PROVIDER DASHBOARD VIEW */
            <View style={styles.dashboardSection}>
              <ThemedText type="headlineMd" style={styles.greetingHeader}>
                {isFrench ? 'Bonjour' : 'Good morning'}, {user.name.split(' ')[0]} 👋
              </ThemedText>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statLabel}>{isFrench ? 'Nouvelles demandes' : 'New Requests'}</ThemedText>
                  <ThemedText style={styles.statValue}>{newRequests.length}</ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statLabel}>{isFrench ? 'Missions en cours' : 'Active Jobs'}</ThemedText>
                  <ThemedText style={styles.statValue}>{activeJobs.length}</ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statLabel}>{isFrench ? 'Terminées' : 'Completed'}</ThemedText>
                  <ThemedText style={styles.statValue}>{completedJobs.length + 28}</ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statLabel}>{isFrench ? 'Note' : 'Rating'}</ThemedText>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={15} color={Palette.gold} />
                    <ThemedText style={styles.statValue}>4.8</ThemedText>
                  </View>
                </View>
              </View>

              {/* Incoming requests preview */}
              <View style={[styles.sectionHeader, { marginTop: Spacing.sm }]}>
                <ThemedText type="headlineMd" style={styles.sectionTitle}>
                  {isFrench ? 'Demandes de service récentes' : 'Recent Service Requests'}
                </ThemedText>
              </View>

              {newRequests.length === 0 ? (
                <View style={styles.emptyRequestsCard}>
                  <Ionicons name="checkmark-done-circle-outline" size={28} color={Palette.success} />
                  <ThemedText style={styles.emptyRequestsText}>
                    {isFrench ? 'Toutes les demandes sont traitées.' : 'All pending requests handled.'}
                  </ThemedText>
                </View>
              ) : (
                newRequests.slice(0, 2).map((req) => (
                  <View key={req.id} style={styles.providerReqCard}>
                    <View style={styles.reqTop}>
                      <View style={styles.reqCategoryBadge}>
                        <ThemedText style={styles.reqCategoryText}>{req.serviceCategory}</ThemedText>
                      </View>
                      <ThemedText style={styles.reqDate}>{req.date}</ThemedText>
                    </View>
                    <ThemedText style={styles.reqTitle}>{req.serviceName}</ThemedText>
                    <ThemedText style={styles.reqDesc}>{req.problemDescription}</ThemedText>
                  </View>
                ))
              )}
            </View>
          ) : (
            /* 3. AUTHENTICATED CUSTOMER PROFILE CARD */
            <View style={styles.userCard}>
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>{user.name}</ThemedText>
                <ThemedText style={styles.userPhone}>{user.phone}</ThemedText>
                <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
              </View>
            </View>
          )}

          {/* 4. SURFACE 2: COMPACT ACTION CARD (If not already a provider) */}
          {(!user.isProvider || isGuest) && (
            <Pressable
              onPress={openProviderActivation}
              style={styles.becomeSellerCard}
              accessibilityRole="button"
              accessibilityLabel={isFrench ? 'Devenir vendeur de services' : 'Become a Service Seller'}>
              <View style={styles.sellerCardIconCircle}>
                <Ionicons name="storefront-outline" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.becomeSellerTitle}>
                  {isFrench ? 'Devenir vendeur de services' : 'Become a Service Seller'}
                </ThemedText>
                <ThemedText style={styles.becomeSellerSub}>
                  {isFrench ? 'Proposez vos compétences à la communauté' : 'Offer your skills to the community'}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </Pressable>
          )}

          {/* 5. USER ACTIVITY SHORTCUTS (Only when logged in) */}
          {!isGuest && (
            <View style={styles.menuSection}>
              <View style={styles.menuSectionHeader}>
                <ThemedText style={styles.menuSectionTitle}>
                  {isFrench ? 'Mes Activités' : 'My Activity'}
                </ThemedText>
              </View>

              <Pressable onPress={() => router.push('/bookings')} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="clipboard-outline" size={20} color={Palette.primary} />
                  <ThemedText style={styles.menuItemText}>
                    {isFrench ? 'Mes demandes de service' : 'My Service Requests'}
                  </ThemedText>
                </View>
                {serviceRequests.length > 0 && (
                  <View style={styles.countPill}>
                    <ThemedText style={styles.countPillText}>{serviceRequests.length}</ThemedText>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
              </Pressable>

              <Pressable
                onPress={() => Alert.alert(isFrench ? 'Mes Avis' : 'My Reviews', isFrench ? 'Vous avez 4 avis vérifiés déposés.' : 'You have 4 verified reviews submitted.')}
                style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="star-outline" size={20} color={Palette.primary} />
                  <ThemedText style={styles.menuItemText}>
                    {isFrench ? 'Mes avis & évaluations' : 'My Reviews & Ratings'}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
              </Pressable>
            </View>
          )}

          {/* 6. SETTINGS SECTION */}
          <View style={styles.menuSection}>
            <View style={styles.menuSectionHeader}>
              <ThemedText style={styles.menuSectionTitle}>
                {isFrench ? 'Paramètres' : 'Settings'}
              </ThemedText>
            </View>

            {/* Language Preference */}
            <Pressable
              onPress={() => setShowLanguageModal(true)}
              style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="globe-outline" size={20} color={Palette.primary} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? 'Langue de l’application' : 'App Language'}
                </ThemedText>
              </View>
              <View style={styles.menuItemRightValue}>
                <ThemedText style={styles.valueText}>
                  {language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
                </ThemedText>
                <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
              </View>
            </Pressable>

            {/* Push Notifications Toggle */}
            <Pressable
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="notifications-outline" size={20} color={Palette.primary} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? 'Notifications d’intervention' : 'Service Notifications'}
                </ThemedText>
              </View>
              <View style={[styles.toggleBadge, notificationsEnabled && styles.toggleBadgeActive]}>
                <ThemedText style={[styles.toggleBadgeText, notificationsEnabled && styles.toggleBadgeTextActive]}>
                  {notificationsEnabled ? (isFrench ? 'Activé' : 'Enabled') : (isFrench ? 'Désactivé' : 'Disabled')}
                </ThemedText>
              </View>
            </Pressable>

            {/* Theme / Appearance */}
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="color-palette-outline" size={20} color={Palette.primary} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? 'Thème visuel' : 'Appearance'}
                </ThemedText>
              </View>
              <ThemedText style={styles.valueText}>
                {isFrench ? 'Système / Clair' : 'Light / System'}
              </ThemedText>
            </View>
          </View>

          {/* 7. HELP & SUPPORT SECTION */}
          <View style={styles.menuSection}>
            <View style={styles.menuSectionHeader}>
              <ThemedText style={styles.menuSectionTitle}>
                {isFrench ? 'Aide & Assistance' : 'Help & Support'}
              </ThemedText>
            </View>

            <Pressable onPress={handleHelpCenter} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="help-circle-outline" size={20} color={Palette.primary} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? 'Centre d’aide & FAQ' : 'Help Center & FAQ'}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
            </Pressable>

            <Pressable onPress={handleContactSupport} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="headset-outline" size={20} color={Palette.primary} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? 'Contacter le support client' : 'Contact Support'}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
            </Pressable>
          </View>

          {/* 8. ABOUT SECTION */}
          <View style={styles.menuSection}>
            <View style={styles.menuSectionHeader}>
              <ThemedText style={styles.menuSectionTitle}>
                {isFrench ? 'À Propos' : 'About'}
              </ThemedText>
            </View>

            <Pressable onPress={handleAboutArtisanLink} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="information-circle-outline" size={20} color={Palette.primary} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? 'À propos d’ArtisanLink' : 'About ArtisanLink'}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
            </Pressable>

            <Pressable onPress={() => handleTermsAndPrivacy('terms')} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="document-text-outline" size={20} color={Palette.primary} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? 'Conditions d’utilisation' : 'Terms of Service'}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
            </Pressable>

            <Pressable onPress={() => handleTermsAndPrivacy('privacy')} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Palette.primary} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? 'Politique de confidentialité' : 'Privacy Policy'}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
            </Pressable>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="phone-portrait-outline" size={20} color={Palette.secondaryText} />
                <ThemedText style={[styles.menuItemText, { color: Palette.secondaryText }]}>
                  {isFrench ? 'Version de l’application' : 'App Version'}
                </ThemedText>
              </View>
              <ThemedText style={styles.valueText}>v1.0.0 (Build 42)</ThemedText>
            </View>
          </View>

          {/* 9. LOGOUT (Only when authenticated) */}
          {!isGuest && (
            <Pressable onPress={logout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={20} color={Palette.errorRed} />
              <ThemedText style={styles.logoutBtnText}>
                {isFrench ? 'Se déconnecter' : 'Log Out'}
              </ThemedText>
            </Pressable>
          )}
        </ScrollView>

        {/* Language Modal */}
        <Modal
          visible={showLanguageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowLanguageModal(false)}>
            <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalSheetTitle}>
                  {isFrench ? 'Choisir la langue' : 'Select Language'}
                </ThemedText>
                <Pressable onPress={() => setShowLanguageModal(false)} hitSlop={8}>
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>

              <Pressable
                onPress={() => {
                  setLanguage('en');
                  setShowLanguageModal(false);
                }}
                style={[styles.langChoiceCard, language === 'en' && styles.langChoiceCardActive]}>
                <ThemedText style={styles.langEmoji}>🇬🇧</ThemedText>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.langName}>English</ThemedText>
                  <ThemedText style={styles.langSub}>English (US / UK)</ThemedText>
                </View>
                {language === 'en' && <Ionicons name="checkmark-circle" size={20} color={Palette.primary} />}
              </Pressable>

              <Pressable
                onPress={() => {
                  setLanguage('fr');
                  setShowLanguageModal(false);
                }}
                style={[styles.langChoiceCard, language === 'fr' && styles.langChoiceCardActive]}>
                <ThemedText style={styles.langEmoji}>🇫🇷</ThemedText>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.langName}>Français</ThemedText>
                  <ThemedText style={styles.langSub}>French</ThemedText>
                </View>
                {language === 'fr' && <Ionicons name="checkmark-circle" size={20} color={Palette.primary} />}
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Info Modal for Help/About */}
        <Modal
          visible={!!activeInfoModal}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveInfoModal(null)}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setActiveInfoModal(null)}>
            <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalSheetTitle}>{activeInfoModal?.title}</ThemedText>
                <Pressable onPress={() => setActiveInfoModal(null)} hitSlop={8}>
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>
              <ScrollView style={{ maxHeight: 350 }}>
                <ThemedText style={styles.modalSheetContent}>{activeInfoModal?.content}</ThemedText>
              </ScrollView>
              <Pressable onPress={() => setActiveInfoModal(null)} style={styles.modalDoneBtn}>
                <ThemedText style={styles.modalDoneBtnText}>
                  {isFrench ? 'Fermer' : 'Close'}
                </ThemedText>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.dark,
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  roleSwitchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
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
  guestCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.card,
  },
  guestAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestInfo: {
    alignItems: 'center',
    gap: 4,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.dark,
    textAlign: 'center',
  },
  guestSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  signInPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    marginTop: 6,
  },
  signInPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.md,
    ...Shadows.card,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.dark,
  },
  userPhone: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  dashboardSection: {
    gap: Spacing.sm,
  },
  greetingHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.dark,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Palette.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Palette.secondaryText,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.dark,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.dark,
  },
  emptyRequestsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  emptyRequestsText: {
    fontSize: 13,
    color: Palette.secondaryText,
  },
  providerReqCard: {
    backgroundColor: Palette.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: 4,
  },
  reqTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reqCategoryBadge: {
    backgroundColor: Palette.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  reqCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  reqDate: {
    fontSize: 11,
    color: Palette.secondaryText,
  },
  reqTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
    marginTop: 2,
  },
  reqDesc: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  becomeSellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.accent, // Solid warm Craft Orange (#F28C28)
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: Palette.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  sellerCardIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Semi-transparent white badge container
    alignItems: 'center',
    justifyContent: 'center',
  },
  becomeSellerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF', // Bold white typography
  },
  becomeSellerSub: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.92)', // Soft warm-white
    marginTop: 2,
    lineHeight: 16,
  },
  menuSection: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  menuSectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.dark,
  },
  menuItemRightValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.secondaryText,
  },
  countPill: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
  countPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  toggleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
  },
  toggleBadgeActive: {
    backgroundColor: Palette.successLight,
  },
  toggleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.secondaryText,
  },
  toggleBadgeTextActive: {
    color: Palette.success,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.surface,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    marginTop: Spacing.xs,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.errorRed,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.dark,
  },
  modalSheetContent: {
    fontSize: 13,
    color: Palette.mainText,
    lineHeight: 20,
  },
  modalDoneBtn: {
    backgroundColor: Palette.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  modalDoneBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  langChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    backgroundColor: Palette.surfaceContainerLow,
    gap: Spacing.md,
  },
  langChoiceCardActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainer,
  },
  langEmoji: {
    fontSize: 24,
  },
  langName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
  },
  langSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
});
