import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const ServiceDetailsModal: React.FC = () => {
  const router = useRouter();
  const {
    serviceDetailsVisible,
    closeServiceDetails,
    selectedService,
    openCreateRequest,
    setSelectedCategoryFilter,
  } = useApp();

  if (!serviceDetailsVisible || !selectedService) return null;

  const handleRequestService = () => {
    const srv = selectedService;
    closeServiceDetails();
    openCreateRequest(srv);
  };

  const handleExplorePros = () => {
    const srv = selectedService;
    setSelectedCategoryFilter(srv.id);
    closeServiceDetails();
    router.push('/explore');
  };

  return (
    <Modal visible={serviceDetailsVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedService.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <Pressable onPress={closeServiceDetails} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Service Details Body */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.titleRow}>
              <View style={styles.titleWrap}>
                <ThemedText type="headlineLg" style={styles.serviceTitle}>
                  {selectedService.name}
                </ThemedText>
                <ThemedText style={styles.proCount}>
                  {selectedService.count} verified professionals available
                </ThemedText>
              </View>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={selectedService.icon as any}
                  size={24}
                  color={Palette.primary}
                />
              </View>
            </View>

            <ThemedText style={styles.description}>
              {selectedService.description}
            </ThemedText>

            {/* Popular Common Tasks */}
            <ThemedText style={styles.sectionHeading}>Common Requests</ThemedText>
            <View style={styles.chipsGrid}>
              {selectedService.popularServices.map((task, idx) => (
                <View key={idx} style={styles.taskChip}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={Palette.primary} />
                  <ThemedText style={styles.taskChipText}>{task}</ThemedText>
                </View>
              ))}
            </View>

            {/* Trust Banner */}
            <View style={styles.trustCard}>
              <Ionicons name="shield-checkmark" size={20} color={Palette.success} />
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.trustTitle}>ArtisanLink Guarantee</ThemedText>
                <ThemedText style={styles.trustSub}>
                  Upfront transparent pricing, identity-verified professionals, and craftsmanship satisfaction protection.
                </ThemedText>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <Pressable onPress={handleExplorePros} style={styles.exploreBtn}>
              <ThemedText style={styles.exploreBtnText}>Explore Professionals</ThemedText>
            </Pressable>

            <Pressable onPress={handleRequestService} style={styles.requestBtn}>
              <ThemedText style={styles.requestBtnText}>Request this Service</ThemedText>
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
    maxHeight: '88%',
    minHeight: '70%',
    flex: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
    backgroundColor: Palette.dark,
  },
  heroImage: {
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
  body: {
    flex: 1,
    padding: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleWrap: {
    flex: 1,
  },
  serviceTitle: {
    color: Palette.dark,
  },
  proCount: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 15,
    color: Palette.mainText,
    lineHeight: 22,
    marginVertical: Spacing.sm,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  taskChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.default,
  },
  taskChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Palette.dark,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: BorderRadius.default,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  trustSub: {
    fontSize: 12,
    color: '#15803D',
    lineHeight: 17,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  exploreBtn: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surface,
  },
  exploreBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  requestBtn: {
    flex: 1.2,
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
