import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

const STATUS_STEPS = ['Sent', 'Accepted', 'In Progress', 'Completed'];

export const RequestDetailsModal: React.FC = () => {
  const {
    requestDetailsVisible,
    closeRequestDetails,
    selectedRequest,
    advanceRequestStatus,
    openChat,
    chats,
  } = useApp();

  if (!requestDetailsVisible || !selectedRequest) return null;

  const handleMessage = () => {
    const chat = chats.find((c) => c.professionalId === selectedRequest.professionalId);
    closeRequestDetails();
    if (chat) {
      openChat(chat.id);
    } else if (chats.length > 0) {
      openChat(chats[0].id);
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+15552348901');
  };

  return (
    <Modal visible={requestDetailsVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.headerTitle}>Request Details</ThemedText>
              <ThemedText style={styles.headerRef}>#{selectedRequest.id}</ThemedText>
            </View>
            <Pressable onPress={closeRequestDetails} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Status Live Tracker Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeaderRow}>
                <ThemedText style={styles.statusCardTitle}>Status</ThemedText>
                <View style={styles.statusBadge}>
                  <ThemedText style={styles.statusBadgeText}>
                    {selectedRequest.status}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.stepTrackRow}>
                {STATUS_STEPS.map((stepName, idx) => {
                  const isDone = idx < selectedRequest.statusIndex;
                  const isCurrent = idx === selectedRequest.statusIndex;
                  return (
                    <View key={idx} style={styles.stepTrackItem}>
                      <View
                        style={[
                          styles.stepTrackDot,
                          isDone && styles.stepTrackDotDone,
                          isCurrent && styles.stepTrackDotCurrent,
                        ]}>
                        {isDone ? (
                          <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                        ) : isCurrent ? (
                          <View style={styles.stepDotInnerCore} />
                        ) : null}
                      </View>
                      <ThemedText
                        style={[
                          styles.stepTrackLabel,
                          isCurrent && styles.stepTrackLabelCurrent,
                          isDone && styles.stepTrackLabelDone,
                        ]}
                        numberOfLines={1}>
                        {stepName}
                      </ThemedText>
                      {idx < STATUS_STEPS.length - 1 && (
                        <View
                          style={[
                            styles.stepTrackLine,
                            isDone && styles.stepTrackLineDone,
                          ]}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Assigned Professional Card */}
            <ThemedText style={styles.sectionHeading}>Assigned Professional</ThemedText>
            <View style={styles.proCard}>
              <Image
                source={{ uri: selectedRequest.professionalAvatar }}
                style={styles.proAvatar}
              />
              <View style={styles.proInfo}>
                <View style={styles.proNameRow}>
                  <ThemedText style={styles.proName}>
                    {selectedRequest.professionalName}
                  </ThemedText>
                  <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                </View>
                <ThemedText style={styles.proProfession}>
                  {selectedRequest.professionalProfession}
                </ThemedText>
              </View>

              <View style={styles.proActions}>
                <Pressable onPress={handleMessage} style={styles.proActionIconBtn}>
                  <Ionicons name="chatbubble-ellipses" size={18} color={Palette.primary} />
                </Pressable>
                <Pressable onPress={handleCall} style={styles.proActionIconBtn}>
                  <Ionicons name="call" size={18} color={Palette.primary} />
                </Pressable>
              </View>
            </View>

            {/* Request Specifics */}
            <ThemedText style={[styles.sectionHeading, { marginTop: Spacing.lg }]}>
              Service Information
            </ThemedText>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Service Category</ThemedText>
                <ThemedText style={styles.infoVal}>{selectedRequest.serviceCategory}</ThemedText>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Service Name</ThemedText>
                <ThemedText style={styles.infoVal}>{selectedRequest.serviceName}</ThemedText>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Schedule</ThemedText>
                <ThemedText style={styles.infoVal}>
                  {selectedRequest.date} ({selectedRequest.time})
                </ThemedText>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Address</ThemedText>
                <ThemedText style={styles.infoVal} numberOfLines={2}>
                  {selectedRequest.location}
                </ThemedText>
              </View>
            </View>

            {/* Problem Description */}
            <ThemedText style={[styles.sectionHeading, { marginTop: Spacing.lg }]}>
              Problem Description
            </ThemedText>
            <View style={styles.descriptionBox}>
              <ThemedText style={styles.descriptionText}>
                {selectedRequest.problemDescription}
              </ThemedText>
            </View>

            {/* Photos */}
            {selectedRequest.photos.length > 0 && (
              <>
                <ThemedText style={[styles.sectionHeading, { marginTop: Spacing.lg }]}>
                  Attached Photos
                </ThemedText>
                <View style={styles.photosRow}>
                  {selectedRequest.photos.map((p, i) => (
                    <Image key={i} source={{ uri: p }} style={styles.photoThumb} />
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          {/* Footer Action: Advance status for demo */}
          {selectedRequest.statusIndex < 3 && (
            <View style={styles.footer}>
              <Pressable
                onPress={() => advanceRequestStatus(selectedRequest.id)}
                style={styles.advanceBtn}>
                <ThemedText style={styles.advanceBtnText}>
                  Simulate Next Status Update →
                </ThemedText>
              </Pressable>
            </View>
          )}
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
    maxHeight: '92%',
    minHeight: '75%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.dark,
  },
  headerRef: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    padding: Spacing.lg,
  },
  statusCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
  },
  statusBadge: {
    backgroundColor: Palette.primary,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTrackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepTrackDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Palette.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTrackDotDone: {
    backgroundColor: Palette.primary,
  },
  stepTrackDotCurrent: {
    backgroundColor: Palette.surfaceContainer,
    borderWidth: 2,
    borderColor: Palette.primary,
  },
  stepDotInnerCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.primary,
  },
  stepTrackLabel: {
    fontSize: 10,
    color: Palette.secondaryText,
    marginLeft: 3,
    maxWidth: 50,
  },
  stepTrackLabelCurrent: {
    color: Palette.primary,
    fontWeight: '700',
  },
  stepTrackLabelDone: {
    color: Palette.dark,
  },
  stepTrackLine: {
    flex: 1,
    height: 2,
    backgroundColor: Palette.outline,
    marginHorizontal: 2,
  },
  stepTrackLineDone: {
    backgroundColor: Palette.primary,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
    marginBottom: Spacing.xs,
  },
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  proActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  proActionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.xs + 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: Palette.secondaryText,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
    maxWidth: '65%',
  },
  divider: {
    height: 1,
    backgroundColor: Palette.outline,
  },
  descriptionBox: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
  },
  descriptionText: {
    fontSize: 13,
    color: Palette.mainText,
    lineHeight: 20,
  },
  photosRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.default,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  advanceBtn: {
    height: 46,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advanceBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
