import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';

export interface StepItem {
  id: number;
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface FriendlyStepperProps {
  steps: StepItem[];
  currentStep: number;
  friendlySubtitle?: string;
}

export const FriendlyStepper: React.FC<FriendlyStepperProps> = ({
  steps,
  currentStep,
  friendlySubtitle,
}) => {
  const total = steps.length;
  const progressPercent = Math.min(Math.round((currentStep / total) * 100), 100);

  return (
    <View style={styles.container}>
      {/* Step Circles & Connectors */}
      <View style={styles.stepRow}>
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Connector line before (if not first) */}
              {idx > 0 && (
                <View
                  style={[
                    styles.connector,
                    stepNum <= currentStep ? styles.connectorActive : styles.connectorInactive,
                  ]}
                />
              )}

              {/* Step Badge */}
              <View style={styles.badgeColumn}>
                <View
                  style={[
                    styles.badge,
                    isDone && styles.badgeDone,
                    isCurrent && styles.badgeCurrent,
                  ]}>
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <ThemedText
                      style={[
                        styles.badgeText,
                        isCurrent && styles.badgeTextCurrent,
                      ]}>
                      {stepNum}
                    </ThemedText>
                  )}
                </View>
                <ThemedText
                  style={[
                    styles.stepTitle,
                    (isCurrent || isDone) && styles.stepTitleActive,
                  ]}
                  numberOfLines={1}>
                  {step.title}
                </ThemedText>
              </View>
            </React.Fragment>
          );
        })}
      </View>

      {/* Progress Bar & Contextual Banner */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.stepHeadline}>
            {friendlySubtitle || `Step ${currentStep} of ${total}`}
          </ThemedText>
          <View style={styles.percentBadge}>
            <ThemedText style={styles.percentText}>{progressPercent}%</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  connector: {
    flex: 1,
    height: 3,
    marginHorizontal: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  connectorActive: {
    backgroundColor: Palette.primary,
  },
  connectorInactive: {
    backgroundColor: '#E2E8F0',
  },
  badgeColumn: {
    alignItems: 'center',
    minWidth: 52,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  badgeDone: {
    backgroundColor: Palette.success,
    borderColor: Palette.success,
  },
  badgeCurrent: {
    backgroundColor: Palette.primary,
    borderColor: Palette.accent,
    transform: [{ scale: 1.08 }],
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.secondaryText,
  },
  badgeTextCurrent: {
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.secondaryText,
    marginTop: 4,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: Spacing.xs + 2,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Palette.primary,
    borderRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepHeadline: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
  },
  percentBadge: {
    backgroundColor: 'rgba(23, 105, 170, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  percentText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.primary,
  },
});
