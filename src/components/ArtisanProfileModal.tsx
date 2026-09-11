import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { getDefaultCoverForProfession } from '@/constants/professionAssets';

export const ArtisanProfileModal: React.FC = () => {
  const {
    professionalProfileVisible,
    closeProfessionalProfile,
    selectedProfessional,
    openCreateRequest,
    startChatWithPro,
    language,
  } = useApp();

  if (!professionalProfileVisible || !selectedProfessional) return null;

  const pro = selectedProfessional;
  const isFrench = language === 'fr';

  const coverUrl = pro.coverImage || getDefaultCoverForProfession(pro.profession);

  const handleRequestService = () => {
    closeProfessionalProfile();
    openCreateRequest(undefined, pro);
  };

  const handleStartChat = () => {
    closeProfessionalProfile();
    startChatWithPro(pro);
  };

  return (
    <Modal visible={professionalProfileVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Scrollable Container with Hero and All Details */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Header Cover Image */}
            <View style={styles.heroContainer}>
              <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
              <Pressable onPress={closeProfessionalProfile} style={styles.closeBtn} hitSlop={8}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Profile Card Header Info */}
            <View style={styles.headerInfoSection}>
              <Image source={{ uri: pro.avatar }} style={styles.avatar} />
              <View style={styles.nameSection}>
                <View style={styles.nameRow}>
                  <ThemedText type="headlineLg" style={styles.proName}>{pro.name}</ThemedText>
                  {pro.verified && (
                    <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
                  )}
                </View>
                <ThemedText style={styles.proProfession}>{pro.profession}</ThemedText>
                <ThemedText style={styles.proSpecialization}>{pro.specialization}</ThemedText>

                <View style={styles.statsMetaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="star" size={14} color={Palette.gold} />
                    <ThemedText style={styles.metaVal}>{pro.rating} ({pro.reviewCount} {isFrench ? 'avis' : 'reviews'})</ThemedText>
                  </View>
                  <ThemedText style={styles.metaDot}>•</ThemedText>
                  <View style={styles.metaItem}>
                    <Ionicons name="location" size={14} color={Palette.primary} />
                    <ThemedText style={styles.metaVal}>{pro.distance}</ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* Body Content */}
            <View style={styles.body}>
              {/* Quick Metrics Bar: Per-Task Quote Pricing, Experience, Completed Jobs */}
              <View style={styles.metricsBar}>
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricVal}>
                    {isFrench ? 'Sur Devis' : 'Per Task'}
                  </ThemedText>
                  <ThemedText style={styles.metricLabel}>
                    {isFrench ? 'Tarification' : 'Pricing Mode'}
                  </ThemedText>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricVal}>{pro.experienceYears} {isFrench ? 'Ans' : 'Yrs'}</ThemedText>
                  <ThemedText style={styles.metricLabel}>{isFrench ? 'Expérience' : 'Experience'}</ThemedText>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <ThemedText style={styles.metricVal}>{pro.completedJobs}</ThemedText>
                  <ThemedText style={styles.metricLabel}>{isFrench ? 'Missions' : 'Jobs Done'}</ThemedText>
                </View>
              </View>

              {/* About Bio */}
              <ThemedText style={styles.sectionTitle}>
                {isFrench ? 'À propos du professionnel' : 'About Professional'}
              </ThemedText>
              <ThemedText style={styles.bioText}>{pro.about}</ThemedText>

              {/* Skills & Specialties */}
              <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.md }]}>
                {isFrench ? 'Compétences & Spécialités' : 'Skills & Specialties'}
              </ThemedText>
              <View style={styles.skillsGrid}>
                {pro.skills.map((sk, idx) => (
                  <View key={idx} style={styles.skillChip}>
                    <Ionicons name="checkmark-sharp" size={14} color={Palette.primary} />
                    <ThemedText style={styles.skillChipText}>{sk}</ThemedText>
                  </View>
                ))}
              </View>

              {/* Portfolio Showcase */}
              {pro.portfolio.length > 0 && (
                <>
                  <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
                    {isFrench ? 'Réalisations & Portfolio' : 'Portfolio Showcase'}
                  </ThemedText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.portfolioScroll}>
                    {pro.portfolio.map((item) => (
                      <View key={item.id} style={styles.portfolioCard}>
                        <Image source={{ uri: item.image }} style={styles.portfolioImg} />
                        <View style={styles.portfolioMeta}>
                          <ThemedText style={styles.portfolioTitle}>{item.title}</ThemedText>
                          <ThemedText style={styles.portfolioCat}>{item.category}</ThemedText>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}

              {/* Customer Reviews */}
              {pro.reviews.length > 0 && (
                <>
                  <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
                    {isFrench ? `Avis vérifiés (${pro.reviews.length})` : `Verified Reviews (${pro.reviews.length})`}
                  </ThemedText>
                  <View style={styles.reviewsList}>
                  {pro.reviews.map((rev) => (
                    <View key={rev.id} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <Image source={{ uri: rev.avatar }} style={styles.revAvatar} />
                        <View style={{ flex: 1 }}>
                          <ThemedText style={styles.revAuthor}>{rev.author}</ThemedText>
                          <ThemedText style={styles.revDate}>{rev.date} • {rev.service}</ThemedText>
                        </View>
                        <View style={styles.ratingBadge}>
                          <Ionicons name="star" size={12} color={Palette.gold} />
                          <ThemedText style={styles.ratingBadgeText}>{rev.rating}</ThemedText>
                        </View>
                      </View>
                      <ThemedText style={styles.revComment}>{rev.comment}</ThemedText>
                    </View>
                  ))}
                </View>
              </>
            )}
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <Pressable onPress={handleStartChat} style={styles.chatBtn}>
              <Ionicons name="chatbubble-ellipses" size={18} color={Palette.dark} />
              <ThemedText style={styles.chatBtnText}>Chat</ThemedText>
            </Pressable>

            <Pressable onPress={handleRequestService} style={styles.requestBtn}>
              <ThemedText style={styles.requestBtnText}>Request Service</ThemedText>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 48, 74, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Palette.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '94%',
    minHeight: '85%',
    flex: 1,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl + 20,
  },
  heroContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
    backgroundColor: Palette.dark,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfoSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
    position: 'relative',
    marginTop: -30,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Palette.surface,
    marginBottom: Spacing.xs,
  },
  nameSection: {
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proName: {
    color: Palette.dark,
  },
  proProfession: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primary,
  },
  proSpecialization: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  statsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.dark,
  },
  metaDot: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  body: {
    flex: 1,
    padding: Spacing.lg,
  },
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.dark,
  },
  metricLabel: {
    fontSize: 11,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Palette.outline,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
    marginBottom: Spacing.xs,
  },
  bioText: {
    fontSize: 13,
    color: Palette.mainText,
    lineHeight: 20,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
  },
  portfolioScroll: {
    gap: Spacing.md,
  },
  portfolioCard: {
    width: 180,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    overflow: 'hidden',
  },
  portfolioImg: {
    width: '100%',
    height: 110,
  },
  portfolioMeta: {
    padding: Spacing.sm,
  },
  portfolioTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.dark,
  },
  portfolioCat: {
    fontSize: 10,
    color: Palette.secondaryText,
    marginTop: 1,
  },
  reviewsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  reviewCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  revAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  revAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
  },
  revDate: {
    fontSize: 11,
    color: Palette.secondaryText,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Palette.goldLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.full,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.goldDark,
  },
  revComment: {
    fontSize: 12,
    color: Palette.mainText,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  chatBtn: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Palette.surface,
  },
  chatBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
  },
  requestBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  requestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
