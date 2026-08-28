import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const RequestSubmittedModal: React.FC = () => {
  const router = useRouter();
  const {
    requestSubmittedVisible,
    closeRequestSubmitted,
    submittedRequest,
    openRequestDetails,
  } = useApp();

  if (!requestSubmittedVisible || !submittedRequest) return null;

  const handleViewRequest = () => {
    const req = submittedRequest;
    closeRequestSubmitted();
    openRequestDetails(req);
    router.push('/bookings');
  };

  const handleBackToHome = () => {
    closeRequestSubmitted();
    router.push('/');
  };

  return (
    <Modal visible={requestSubmittedVisible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Success Checkmark Circle in #22A06B */}
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={44} color="#FFFFFF" />
          </View>

          {/* Title & Message */}
          <ThemedText type="headlineLg" style={styles.title}>
            Request Submitted!
          </ThemedText>

          <ThemedText style={styles.proTargetText}>
            Your request has been sent to {submittedRequest.professionalName}.
          </ThemedText>

          <ThemedText style={styles.notificationNote}>
            We'll notify you when the professional responds.
          </ThemedText>

          {/* Request Quick Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Request ID</ThemedText>
              <ThemedText style={styles.summaryValue}>#{submittedRequest.id}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Service</ThemedText>
              <ThemedText style={styles.summaryValue}>{submittedRequest.serviceName}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Schedule</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {submittedRequest.date} ({submittedRequest.time})
              </ThemedText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable onPress={handleViewRequest} style={styles.primaryBtn}>
              <ThemedText style={styles.primaryBtnText}>View My Request</ThemedText>
            </Pressable>

            <Pressable onPress={handleBackToHome} style={styles.secondaryBtn}>
              <ThemedText style={styles.secondaryBtnText}>Back to Home</ThemedText>
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
    backgroundColor: 'rgba(18, 48, 74, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22A06B', // Exact #22A06B requirement
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    color: Palette.dark,
    textAlign: 'center',
  },
  proTargetText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
    textAlign: 'center',
    marginTop: 2,
  },
  notificationNote: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Palette.background,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.xs + 2,
    marginVertical: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
  },
  actions: {
    width: '100%',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    width: '100%',
    height: 44,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surface,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.dark,
  },
});
