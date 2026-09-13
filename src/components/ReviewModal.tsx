import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { API_BASE_URL } from '@/constants/api';

const CUSTOMER_BEHAVIOR_TAGS = [
  'Professional & Punctual',
  'Polite & Respectful',
  'Master Craftsmanship',
  'Clear Explanations',
  'Clean & Tidy Work',
  'Fair & Honest',
];

const PROVIDER_BEHAVIOR_TAGS = [
  'Polite & Respectful',
  'Punctual & Prepared',
  'Clear Requirements',
  'Prompt Coordination',
  'Very Cooperative',
  'Warm Hospitality',
];

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  jobId: string;
  targetName: string;
  isProviderReviewingCustomer?: boolean;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  jobId,
  targetName,
  isProviderReviewingCustomer = false,
  onSuccess,
}) => {
  const { token } = useApp();

  const [rating, setRating] = useState(5);
  const [behaviorRating, setBehaviorRating] = useState<string>(
    isProviderReviewingCustomer ? PROVIDER_BEHAVIOR_TAGS[0] : CUSTOMER_BEHAVIOR_TAGS[0]
  );
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!visible) return null;

  const behaviorTags = isProviderReviewingCustomer
    ? PROVIDER_BEHAVIOR_TAGS
    : CUSTOMER_BEHAVIOR_TAGS;

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setErrorMessage('Please write a brief comment describing your experience.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          rating,
          behaviorRating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Failed to submit review');
        return;
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.headerTitle}>
                {isProviderReviewingCustomer ? 'Rate Customer Behavior' : 'Rate & Review Service'}
              </ThemedText>
              <ThemedText style={styles.headerSub}>
                Feedback for <ThemedText style={{ fontWeight: '700' }}>{targetName}</ThemedText>
              </ThemedText>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {submitted ? (
              <View style={styles.successState}>
                <View style={styles.successCircle}>
                  <Ionicons name="checkmark-circle" size={54} color={Palette.success} />
                </View>
                <ThemedText type="headlineMd" style={styles.successTitle}>
                  Feedback Submitted!
                </ThemedText>
                <ThemedText style={styles.successSub}>
                  Thank you for contributing to trust and accountability in the ArtisanLink community.
                </ThemedText>
              </View>
            ) : (
              <>
                {errorMessage ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={18} color={Palette.errorRed} />
                    <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
                  </View>
                ) : null}

                {/* 1. Star Rating */}
                <View style={styles.ratingSection}>
                  <ThemedText style={styles.sectionLabel}>Select Rating</ThemedText>
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = star <= rating;
                      return (
                        <Pressable
                          key={star}
                          onPress={() => setRating(star)}
                          hitSlop={8}
                          style={styles.starBtn}>
                          <Ionicons
                            name={filled ? 'star' : 'star-outline'}
                            size={34}
                            color={filled ? Palette.gold : '#CBD5E1'}
                          />
                        </Pressable>
                      );
                    })}
                  </View>
                  <ThemedText style={styles.ratingScoreLabel}>
                    {rating === 5
                      ? '⭐⭐⭐⭐⭐ Exceptional (5 / 5)'
                      : rating === 4
                      ? '⭐⭐⭐⭐ Great Work (4 / 5)'
                      : rating === 3
                      ? '⭐⭐⭐ Average (3 / 5)'
                      : rating === 2
                      ? '⭐⭐ Fair (2 / 5)'
                      : '⭐ Unsatisfactory (1 / 5)'}
                  </ThemedText>
                </View>

                {/* 2. Behavior Selection */}
                <View style={styles.section}>
                  <ThemedText style={styles.sectionLabel}>
                    {isProviderReviewingCustomer
                      ? 'Customer Conduct & Behavior'
                      : 'Artisan Behavior & Work Ethic'}
                  </ThemedText>
                  <ThemedText style={styles.sectionSub}>
                    Choose the attribute that best describes this experience:
                  </ThemedText>
                  <View style={styles.tagsWrap}>
                    {behaviorTags.map((tag) => {
                      const isSelected = behaviorRating === tag;
                      return (
                        <Pressable
                          key={tag}
                          onPress={() => setBehaviorRating(tag)}
                          style={[
                            styles.behaviorTag,
                            isSelected && styles.behaviorTagSelected,
                          ]}>
                          <Ionicons
                            name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                            size={14}
                            color={isSelected ? '#FFFFFF' : Palette.secondaryText}
                          />
                          <ThemedText
                            style={[
                              styles.behaviorTagText,
                              isSelected && styles.behaviorTagTextSelected,
                            ]}>
                            {tag}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Comment Field */}
                <View style={styles.section}>
                  <ThemedText style={styles.sectionLabel}>Written Feedback *</ThemedText>
                  <TextInput
                    style={styles.textArea}
                    value={comment}
                    onChangeText={setComment}
                    placeholder={
                      isProviderReviewingCustomer
                        ? 'Share your experience with this client (punctuality, communication, workspace accessibility)...'
                        : 'Share feedback regarding the service quality, speed, professionalism, and pricing...'
                    }
                    placeholderTextColor={Palette.secondaryText}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                {/* Submit Action */}
                <Pressable
                  onPress={handleSubmit}
                  disabled={submitting}
                  style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}>
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <ThemedText style={styles.submitBtnText}>Submit Feedback ✓</ThemedText>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </>
                  )}
                </Pressable>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 48, 74, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Palette.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '88%',
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
    backgroundColor: Palette.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.dark,
  },
  headerSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  ratingSection: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    ...Shadows.subtle,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginBottom: Spacing.sm,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: Spacing.xs,
  },
  starBtn: {
    padding: 2,
  },
  ratingScoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.dark,
    marginTop: 4,
  },
  section: {
    marginBottom: Spacing.md,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  behaviorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
  },
  behaviorTagSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  behaviorTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
  },
  behaviorTagTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    padding: Spacing.md,
    fontSize: 13,
    color: Palette.mainText,
    minHeight: 88,
    textAlignVertical: 'top',
  },
  submitBtn: {
    height: 48,
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FFF5F5',
    padding: Spacing.sm,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.errorRed,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Palette.errorRed,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  successCircle: {
    marginBottom: Spacing.md,
  },
  successTitle: {
    color: Palette.dark,
    marginBottom: Spacing.xs,
  },
  successSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.lg,
  },
});
