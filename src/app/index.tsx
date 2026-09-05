import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
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

const TRANSLATIONS = {
  en: {
    greetingGuest: 'Hello 👋',
    greetingUser: (name: string) => `Hello, ${name} 👋`,
    mainHeading: 'What do you need help with?',
    searchPlaceholder: 'Search for a service...',
    popularServices: 'Popular Services',
    viewAllServices: 'View all services →',
    growthOpportunity: '↗ Growth Opportunity',
    becomeServiceSeller: 'Become a service seller',
    becomeServiceSellerDesc:
      'Turn your skills into opportunities. Join thousands of local professionals growing their business on ArtisanLink.',
    getStartedArrow: 'Get Started →',
    becomeArtisanGuest: 'Become an Artisan',
    becomeArtisanGuestDesc:
      'Join our network of trusted local professionals and grow your business today.',
    signUpAsPro: 'Sign Up as Pro',
    howItWorks: 'How ArtisanLink Works',
    howItWorksSub: 'Get trusted home and commercial services done in 3 simple steps',
    step1Title: 'Choose a service',
    step1Desc: 'Browse categories or search for the task you need done',
    step2Title: 'Select a professional',
    step2Desc: 'Compare verified profiles, ratings, and instant quotes',
    step3Title: 'Get the job done',
    step3Desc: 'Schedule a date, relax, and release payment upon satisfaction',
    trustedProfessionals: 'Trusted professionals',
    verifiedArtisansAvailable: 'Verified artisans available',
    verifiedArtisansDesc:
      'Connect with skilled, background-checked craftsmen ready to help with your project today.',
    createAccount: 'Create an Account',
    partnerTag: 'PARTNER WITH US',
    becomeProvider: 'Become a Provider',
    offerServices: 'Offer your services on ArtisanLink',
    getStarted: 'Get Started →',
    prosNearYou: 'Professionals near you',
    viewProfile: 'View Profile',
    reviews: 'reviews',
    selectLanguage: 'Select Language',
    chooseLanguageSub: 'Choose your preferred language for the app',
    english: 'English',
    englishSub: 'English (US / UK)',
    french: 'Français',
    frenchSub: 'French',
  },
  fr: {
    greetingGuest: 'Bonjour 👋',
    greetingUser: (name: string) => `Bonjour, ${name} 👋`,
    mainHeading: 'De quoi avez-vous besoin ?',
    searchPlaceholder: 'Rechercher un service...',
    popularServices: 'Services populaires',
    viewAllServices: 'Voir tous les services →',
    growthOpportunity: '↗ Opportunité de Croissance',
    becomeServiceSeller: 'Devenez vendeur de services',
    becomeServiceSellerDesc:
      'Transformez vos compétences en opportunités. Rejoignez des milliers de professionnels locaux qui développent leur activité sur ArtisanLink.',
    getStartedArrow: 'Commencer →',
    becomeArtisanGuest: 'Devenez un Artisan',
    becomeArtisanGuestDesc:
      'Rejoignez notre réseau de professionnels locaux de confiance et développez votre activité dès aujourd’hui.',
    signUpAsPro: 'S’inscrire en tant que Pro',
    howItWorks: 'Comment fonctionne ArtisanLink',
    howItWorksSub: 'Réalisez vos travaux en toute sérénité en 3 étapes simples',
    step1Title: 'Choisissez un service',
    step1Desc: 'Parcourez les catégories ou recherchez la prestation souhaitée',
    step2Title: 'Sélectionnez un professionnel',
    step2Desc: 'Comparez les profils vérifiés, les avis et les devis instantanés',
    step3Title: 'Travaux réalisés avec succès',
    step3Desc: 'Planifiez une date, détendez-vous et libérez le paiement à satisfaction',
    trustedProfessionals: 'Professionnels de confiance',
    verifiedArtisansAvailable: 'Artisans certifiés disponibles',
    verifiedArtisansDesc:
      'Entrez en relation avec des artisans qualifiés et vérifiés, prêts à intervenir sur votre projet aujourd’hui.',
    createAccount: 'Créer un compte',
    partnerTag: 'DEVENEZ PARTENAIRE',
    becomeProvider: 'Devenir prestataire',
    offerServices: 'Proposez vos services sur ArtisanLink',
    getStarted: 'Commencer →',
    prosNearYou: 'Artisans à proximité',
    viewProfile: 'Voir le profil',
    reviews: 'avis',
    selectLanguage: 'Choisir la langue',
    chooseLanguageSub: 'Choisissez votre langue préférée pour l’application',
    english: 'English',
    englishSub: 'Anglais (US / UK)',
    french: 'Français',
    frenchSub: 'Français',
  },
};

const CATEGORY_NAMES_FR: Record<string, string> = {
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

export default function HomeScreen() {
  const router = useRouter();
  const {
    user,
    authStatus,
    language,
    setLanguage,
    openAuthModal,
    openServiceDetails,
    openProfessionalProfile,
    openProviderActivation,
  } = useApp();

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const isGuest = authStatus === 'guest';

  const handleServiceClick = (cat: typeof POPULAR_SERVICES[0]) => {
    openServiceDetails(cat);
  };

  const handleViewAllServices = () => {
    router.push('/services' as any);
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
            {/* Language Switcher (before notification icon) */}
            <Pressable
              onPress={() => setShowLanguageModal(true)}
              style={styles.langBtn}
              accessibilityLabel="Change language"
              accessibilityRole="button">
              <ThemedText style={styles.langFlagEmoji}>
                {language === 'fr' ? '🇫🇷' : '🇬🇧'}
              </ThemedText>
              <ThemedText style={styles.langCodeText}>
                {language === 'fr' ? 'FR' : 'EN'}
              </ThemedText>
              <Ionicons name="chevron-down" size={11} color={Palette.secondaryText} />
            </Pressable>

            {/* Notification Icon */}
            <Pressable
              onPress={() => (isGuest ? openAuthModal() : router.push('/bookings'))}
              style={styles.iconBtn}
              accessibilityLabel="Notifications">
              <Ionicons name="notifications-outline" size={20} color={Palette.dark} />
              {!isGuest && <View style={styles.notifDot} />}
            </Pressable>

            {/* Account Icon */}
            <Pressable
              onPress={handleAccountIconClick}
              style={styles.iconBtn}
              accessibilityLabel="Account">
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
              {isGuest ? t.greetingGuest : t.greetingUser(user.name.split(' ')[0])}
            </ThemedText>
            <ThemedText type="headlineXl" style={styles.mainHeading}>
              {t.mainHeading}
            </ThemedText>
          </View>

          {/* Search Bar */}
          <Pressable onPress={() => router.push('/services' as any)} style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Palette.primary} />
            <ThemedText style={styles.searchPlaceholder}>
              {t.searchPlaceholder}
            </ThemedText>
          </Pressable>

          {isGuest ? (
            /* =========================================================================
                GUEST HOME EXPERIENCE:
                3. "How ArtisanLink Works" (Onboarding Flow Card)
                Surface 3: Guest Become an Artisan Card
                4. Trust & Account Conversion Card
            ========================================================================= */
            <>
              {/* 3. "How ArtisanLink Works" (Onboarding Flow Card) */}
              <View style={styles.howItWorksCard}>
                <View style={styles.howItWorksHeader}>
                  <ThemedText style={styles.howItWorksTitle}>{t.howItWorks}</ThemedText>
                  <ThemedText style={styles.howItWorksSub}>{t.howItWorksSub}</ThemedText>
                </View>

                {/* Step 1 */}
                <View style={styles.howStepRow}>
                  <View style={styles.stepBadge}>
                    <ThemedText style={styles.stepBadgeText}>1</ThemedText>
                  </View>
                  <View style={styles.stepTextContent}>
                    <ThemedText style={styles.stepTitle}>{t.step1Title}</ThemedText>
                    <ThemedText style={styles.stepDesc}>{t.step1Desc}</ThemedText>
                  </View>
                </View>

                <View style={styles.stepDivider} />

                {/* Step 2 */}
                <View style={styles.howStepRow}>
                  <View style={styles.stepBadge}>
                    <ThemedText style={styles.stepBadgeText}>2</ThemedText>
                  </View>
                  <View style={styles.stepTextContent}>
                    <ThemedText style={styles.stepTitle}>{t.step2Title}</ThemedText>
                    <ThemedText style={styles.stepDesc}>{t.step2Desc}</ThemedText>
                  </View>
                </View>

                <View style={styles.stepDivider} />

                {/* Step 3 */}
                <View style={styles.howStepRow}>
                  <View style={styles.stepBadge}>
                    <ThemedText style={styles.stepBadgeText}>3</ThemedText>
                  </View>
                  <View style={styles.stepTextContent}>
                    <ThemedText style={styles.stepTitle}>{t.step3Title}</ThemedText>
                    <ThemedText style={styles.stepDesc}>{t.step3Desc}</ThemedText>
                  </View>
                </View>
              </View>

              {/* Surface 3: Become an Artisan Guest Card */}
              <View style={styles.guestSellerCard}>
                <View style={styles.guestSellerHeaderRow}>
                  <View style={styles.guestSellerIconBadge}>
                    <Ionicons name="briefcase-outline" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.guestSellerTextWrap}>
                    <ThemedText style={styles.guestSellerTitle}>
                      {t.becomeArtisanGuest}
                    </ThemedText>
                    <ThemedText style={styles.guestSellerSub}>
                      {t.becomeArtisanGuestDesc}
                    </ThemedText>
                  </View>
                </View>

                <Pressable
                  onPress={openProviderActivation}
                  style={styles.guestSellerBtn}
                  accessibilityRole="button"
                  accessibilityLabel={t.signUpAsPro}>
                  <ThemedText style={styles.guestSellerBtnText}>{t.signUpAsPro}</ThemedText>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* 4. Trust & Account Conversion Card */}
              <View style={styles.trustCard}>
                {/* Trust Eyebrow */}
                <View style={styles.trustEyebrowRow}>
                  <Ionicons name="star" size={16} color={Palette.gold} />
                  <ThemedText style={styles.trustEyebrowText}>
                    {t.trustedProfessionals}
                  </ThemedText>
                </View>

                {/* Value Headline & Copy */}
                <ThemedText style={styles.trustHeadline}>
                  {t.verifiedArtisansAvailable}
                </ThemedText>
                <ThemedText style={styles.trustCopy}>
                  {t.verifiedArtisansDesc}
                </ThemedText>

                {/* Primary Call-to-Action (CTA): Create an Account */}
                <Pressable
                  onPress={() => openAuthModal()}
                  style={styles.trustCtaBtn}
                  accessibilityRole="button"
                  accessibilityLabel={t.createAccount}>
                  <ThemedText style={styles.trustCtaBtnText}>
                    {t.createAccount}
                  </ThemedText>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            </>
          ) : (
            /* =========================================================================
                AUTHENTICATED CUSTOMER EXPERIENCE:
                Popular Services + Surface 1 Large Banner + Nearby Professionals
            ========================================================================= */
            <>
              {/* POPULAR SERVICES SECTION */}
              <View style={styles.sectionHeader}>
                <ThemedText type="headlineMd" style={styles.sectionTitle}>
                  {t.popularServices}
                </ThemedText>
                <Pressable onPress={handleViewAllServices}>
                  <ThemedText style={styles.viewAllText}>{t.viewAllServices}</ThemedText>
                </Pressable>
              </View>

              <View style={styles.popularServicesGrid}>
                {POPULAR_SERVICES.slice(0, 6).map((cat) => {
                  const displayName =
                    language === 'fr' && CATEGORY_NAMES_FR[cat.id]
                      ? CATEGORY_NAMES_FR[cat.id]
                      : cat.name;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => handleServiceClick(cat)}
                      style={styles.serviceCard}>
                      <Image source={{ uri: cat.image }} style={styles.serviceCardImg} />
                      <View style={styles.serviceCardOverlay} />
                      <View style={styles.serviceCardContent}>
                        <ThemedText style={styles.serviceCardName}>{displayName}</ThemedText>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* SURFACE 1: LARGE BANNER CARD (HOME - SELLERS & NEARBY) */}
              {!user.isProvider && (
                <View style={styles.sellerBannerCard}>
                  {/* Text Content */}
                  <View style={styles.sellerBannerContent}>
                    {/* Eyebrow Chip */}
                    <View style={styles.sellerEyebrowChip}>
                      <ThemedText style={styles.sellerEyebrowText}>
                        {t.growthOpportunity}
                      </ThemedText>
                    </View>

                    {/* Headline */}
                    <ThemedText style={styles.sellerBannerHeadline}>
                      {t.becomeServiceSeller}
                    </ThemedText>

                    {/* Body Copy */}
                    <ThemedText style={styles.sellerBannerBody}>
                      {t.becomeServiceSellerDesc}
                    </ThemedText>

                    {/* CTA Button */}
                    <Pressable
                      onPress={openProviderActivation}
                      style={styles.sellerBannerBtn}
                      accessibilityRole="button"
                      accessibilityLabel={t.getStartedArrow}>
                      <ThemedText style={styles.sellerBannerBtnText}>
                        {t.getStartedArrow}
                      </ThemedText>
                    </Pressable>
                  </View>

                  {/* Craftsman Workshop Photography */}
                  <View style={styles.sellerBannerImageWrap}>
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&auto=format&fit=crop&q=80',
                      }}
                      style={styles.sellerBannerImage}
                      resizeMode="cover"
                    />
                    <View style={styles.sellerBannerImageGradientOverlay} />
                  </View>
                </View>
              )}

              {/* NEARBY PROFESSIONALS SECTION */}
              <View style={[styles.sectionHeader, { marginTop: Spacing.md }]}>
                <View>
                  <ThemedText type="headlineMd" style={styles.sectionTitle}>
                    {t.prosNearYou}
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
                            {pro.rating} · {pro.reviewCount} {t.reviews}
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
                      <ThemedText style={styles.viewProfileText}>{t.viewProfile}</ThemedText>
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        {/* Language Selection Modal */}
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
                <View style={styles.modalTitleWrap}>
                  <ThemedText style={styles.modalTitle}>
                    {t.selectLanguage}
                  </ThemedText>
                  <ThemedText style={styles.modalSub}>
                    {t.chooseLanguageSub}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => setShowLanguageModal(false)}
                  style={styles.modalCloseBtn}
                  hitSlop={8}
                  accessibilityLabel="Close">
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>

              <View style={styles.modalOptionsContainer}>
                {/* English Option */}
                <Pressable
                  onPress={() => {
                    setLanguage('en');
                    setShowLanguageModal(false);
                  }}
                  style={[
                    styles.modalLangCard,
                    language === 'en' && styles.modalLangCardSelected,
                  ]}>
                  <View style={styles.modalFlagWrap}>
                    <ThemedText style={styles.modalFlagEmoji}>🇬🇧</ThemedText>
                  </View>
                  <View style={styles.modalLangTextWrap}>
                    <ThemedText
                      style={[
                        styles.modalLangName,
                        language === 'en' && styles.modalLangNameSelected,
                      ]}>
                      {t.english}
                    </ThemedText>
                    <ThemedText style={styles.modalLangSub}>
                      {t.englishSub}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.modalRadio,
                      language === 'en' && styles.modalRadioSelected,
                    ]}>
                    {language === 'en' && <View style={styles.modalRadioInner} />}
                  </View>
                </Pressable>

                {/* French Option */}
                <Pressable
                  onPress={() => {
                    setLanguage('fr');
                    setShowLanguageModal(false);
                  }}
                  style={[
                    styles.modalLangCard,
                    language === 'fr' && styles.modalLangCardSelected,
                  ]}>
                  <View style={styles.modalFlagWrap}>
                    <ThemedText style={styles.modalFlagEmoji}>🇫🇷</ThemedText>
                  </View>
                  <View style={styles.modalLangTextWrap}>
                    <ThemedText
                      style={[
                        styles.modalLangName,
                        language === 'fr' && styles.modalLangNameSelected,
                      ]}>
                      {t.french}
                    </ThemedText>
                    <ThemedText style={styles.modalLangSub}>
                      {t.frenchSub}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.modalRadio,
                      language === 'fr' && styles.modalRadioSelected,
                    ]}>
                    {language === 'fr' && <View style={styles.modalRadioInner} />}
                  </View>
                </Pressable>
              </View>
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
  langBtn: {
    height: 36,
    paddingHorizontal: 9,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  langFlagEmoji: {
    fontSize: 14,
  },
  langCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.dark,
    letterSpacing: 0.3,
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
  // SURFACE 1: LARGE BANNER CARD (HOME - SELLERS & NEARBY)
  sellerBannerCard: {
    backgroundColor: Palette.accent,
    borderRadius: 16, // rounded-2xl
    overflow: 'hidden',
    marginTop: Spacing.xs,
    shadowColor: Palette.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  sellerBannerContent: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  sellerEyebrowChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    marginBottom: 4,
  },
  sellerEyebrowText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.dark,
    letterSpacing: 0.2,
  },
  sellerBannerHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: Palette.dark,
    lineHeight: 28,
  },
  sellerBannerBody: {
    fontSize: 13,
    fontWeight: '500',
    color: '#332014',
    lineHeight: 19,
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  sellerBannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.default,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  sellerBannerBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  sellerBannerImageWrap: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  sellerBannerImage: {
    width: '100%',
    height: '100%',
  },
  sellerBannerImageGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 48, 74, 0.15)',
  },

  // SURFACE 3: GUEST HOME CARD
  guestSellerCard: {
    backgroundColor: Palette.accent,
    borderRadius: 16,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginTop: Spacing.xs,
    shadowColor: Palette.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  guestSellerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  guestSellerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestSellerTextWrap: {
    flex: 1,
    gap: 3,
  },
  guestSellerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.dark,
  },
  guestSellerSub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#332014',
    lineHeight: 18,
  },
  guestSellerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.primary,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.default,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  // 3. "HOW ARTISANLINK WORKS" (ONBOARDING FLOW CARD)
  howItWorksCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16, // rounded-2xl
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.md,
    marginTop: Spacing.xs,
    ...Shadows.subtle,
  },
  howItWorksHeader: {
    gap: 4,
  },
  howItWorksTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.dark,
  },
  howItWorksSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    lineHeight: 18,
  },
  howStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primary, // Circular Artisan Blue badge
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepTextContent: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
  },
  stepDesc: {
    fontSize: 12,
    color: Palette.secondaryText,
    lineHeight: 17,
  },
  stepDivider: {
    height: 1,
    backgroundColor: Palette.outline,
    marginLeft: 40,
  },

  // 4. TRUST & ACCOUNT CONVERSION CARD
  trustCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
    ...Shadows.card,
  },
  trustEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  trustEyebrowText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.goldDark,
  },
  trustHeadline: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.dark,
    textAlign: 'center',
  },
  trustCopy: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 320,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  trustCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.primary, // Artisan Blue (#1769AA)
    width: '100%',
    paddingVertical: 13,
    borderRadius: BorderRadius.xl, // rounded-xl
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  trustCtaBtnText: {
    fontSize: 15,
    fontWeight: '800',
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
  /* Language Selector Modal Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    ...Shadows.hover,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  modalTitleWrap: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.dark,
  },
  modalSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionsContainer: {
    gap: Spacing.sm,
  },
  modalLangCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    backgroundColor: Palette.surfaceContainerLow,
    gap: Spacing.md,
  },
  modalLangCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainer,
  },
  modalFlagWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  modalFlagEmoji: {
    fontSize: 20,
  },
  modalLangTextWrap: {
    flex: 1,
  },
  modalLangName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
  },
  modalLangNameSelected: {
    color: Palette.primary,
    fontWeight: '800',
  },
  modalLangSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  modalRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Palette.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRadioSelected: {
    borderColor: Palette.primary,
  },
  modalRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Palette.primary,
  },
});
