import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { POPULAR_SERVICES } from '@/data/mockData';

const ACTIVATION_STEPS = [
  { id: 1, title: 'Profession' },
  { id: 2, title: 'Specialization' },
  { id: 3, title: 'Professional Info' },
  { id: 4, title: 'Location' },
  { id: 5, title: 'Portfolio' },
  { id: 6, title: 'Verification' },
  { id: 7, title: 'Submitted' },
];

export const BecomeSellerModal: React.FC = () => {
  const {
    providerActivationVisible,
    closeProviderActivation,
    activateProvider,
  } = useApp();

  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState('Plumbing');
  const [specialization, setSpecialization] = useState('Pipe Repairs, Leaks & Water Heaters');
  const [bio, setBio] = useState('Master certified plumber with over 10 years of experience in residential repairs.');
  const [hourlyRate, setHourlyRate] = useState('50');
  const [experienceYears, setExperienceYears] = useState('10');
  const [location, setLocation] = useState('Central District (25km coverage)');
  const [portfolioUploaded, setPortfolioUploaded] = useState(true);
  const [licenseUploaded, setLicenseUploaded] = useState(true);

  if (!providerActivationVisible) return null;

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      activateProvider({
        profession,
        specialization,
        hourlyRate: parseFloat(hourlyRate) || 50,
      });
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 7) {
      setStep(step - 1);
    }
  };

  return (
    <Modal visible={providerActivationVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {step > 1 && step < 7 && (
                <Pressable onPress={handleBack} style={styles.iconBtn}>
                  <Ionicons name="arrow-back" size={18} color={Palette.dark} />
                </Pressable>
              )}
              <View>
                <ThemedText style={styles.headerTitle}>Become a Service Seller</ThemedText>
                <ThemedText style={styles.headerSub}>
                  {step === 7 ? 'Activation Complete' : `Step ${step} of 7 • ${ACTIVATION_STEPS[step - 1].title}`}
                </ThemedText>
              </View>
            </View>

            <Pressable onPress={closeProviderActivation} style={styles.iconBtn}>
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          {/* Stepper Track */}
          {step < 7 && (
            <View style={styles.stepperTrack}>
              {ACTIVATION_STEPS.slice(0, 6).map((s, idx) => {
                const isDone = idx + 1 < step;
                const isCurrent = idx + 1 === step;
                return (
                  <View
                    key={s.id}
                    style={[
                      styles.stepperSegment,
                      isDone && styles.stepperSegmentDone,
                      isCurrent && styles.stepperSegmentCurrent,
                    ]}
                  />
                );
              })}
            </View>
          )}

          {/* Form Content */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {step === 7 ? (
              <View style={styles.submittedContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="trophy" size={44} color={Palette.accent} />
                </View>
                <ThemedText type="headlineLg" style={styles.submittedTitle}>
                  Application Submitted!
                </ThemedText>
                <ThemedText style={styles.submittedText}>
                  Your professional provider profile is now active. You can now toggle between Customer and Provider mode anytime.
                </ThemedText>

                <Pressable onPress={handleNext} style={styles.goToDashboardBtn}>
                  <ThemedText style={styles.goToDashboardBtnText}>
                    Go to Provider Dashboard
                  </ThemedText>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            ) : (
              <>
                {/* STEP 1: PROFESSION */}
                {step === 1 && (
                  <View style={styles.stepForm}>
                    <ThemedText type="headlineMd" style={styles.stepTitle}>
                      What is your profession?
                    </ThemedText>
                    <ThemedText style={styles.stepSub}>
                      Select your primary trade category on ArtisanLink.
                    </ThemedText>

                    <View style={styles.gridContainer}>
                      {POPULAR_SERVICES.map((cat) => {
                        const isSelected = profession.toLowerCase() === cat.name.toLowerCase();
                        return (
                          <Pressable
                            key={cat.id}
                            onPress={() => setProfession(cat.name)}
                            style={[
                              styles.choiceCard,
                              isSelected && styles.choiceCardSelected,
                            ]}>
                            <Ionicons
                              name={cat.icon as any}
                              size={20}
                              color={isSelected ? Palette.primary : Palette.dark}
                            />
                            <ThemedText
                              style={[
                                styles.choiceCardText,
                                isSelected && styles.choiceCardTextSelected,
                              ]}>
                              {cat.name}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* STEP 2: SPECIALIZATION */}
                {step === 2 && (
                  <View style={styles.stepForm}>
                    <ThemedText type="headlineMd" style={styles.stepTitle}>
                      Your Specialization
                    </ThemedText>
                    <ThemedText style={styles.stepSub}>
                      Specify your core areas of expertise (e.g. Pipe Repairs, Panel Upgrades).
                    </ThemedText>

                    <TextInput
                      style={styles.textInput}
                      value={specialization}
                      onChangeText={setSpecialization}
                      placeholder="e.g. Pipe Repairs, Leaks & Water Heaters"
                      placeholderTextColor={Palette.secondaryText}
                    />
                  </View>
                )}

                {/* STEP 3: PROFESSIONAL INFORMATION */}
                {step === 3 && (
                  <View style={styles.stepForm}>
                    <ThemedText type="headlineMd" style={styles.stepTitle}>
                      Professional Information
                    </ThemedText>
                    <ThemedText style={styles.stepSub}>
                      Set your hourly labor rate and years of field experience.
                    </ThemedText>

                    <ThemedText style={styles.fieldLabel}>Hourly Rate ($ USD)</ThemedText>
                    <TextInput
                      style={styles.textInput}
                      value={hourlyRate}
                      onChangeText={setHourlyRate}
                      keyboardType="numeric"
                      placeholder="50"
                      placeholderTextColor={Palette.secondaryText}
                    />

                    <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                      Years of Experience
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      value={experienceYears}
                      onChangeText={setExperienceYears}
                      keyboardType="numeric"
                      placeholder="10"
                      placeholderTextColor={Palette.secondaryText}
                    />

                    <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                      Professional Bio
                    </ThemedText>
                    <TextInput
                      style={styles.textArea}
                      value={bio}
                      onChangeText={setBio}
                      multiline
                      numberOfLines={4}
                      placeholder="Describe your background and commitment to quality..."
                      placeholderTextColor={Palette.secondaryText}
                    />
                  </View>
                )}

                {/* STEP 4: LOCATION */}
                {step === 4 && (
                  <View style={styles.stepForm}>
                    <ThemedText type="headlineMd" style={styles.stepTitle}>
                      Location & Coverage Area
                    </ThemedText>
                    <ThemedText style={styles.stepSub}>
                      Set your base district and maximum service travel radius.
                    </ThemedText>

                    <TextInput
                      style={styles.textInput}
                      value={location}
                      onChangeText={setLocation}
                      placeholder="e.g. Central District (25km coverage)"
                      placeholderTextColor={Palette.secondaryText}
                    />
                  </View>
                )}

                {/* STEP 5: PORTFOLIO */}
                {step === 5 && (
                  <View style={styles.stepForm}>
                    <ThemedText type="headlineMd" style={styles.stepTitle}>
                      Portfolio & Work Photos
                    </ThemedText>
                    <ThemedText style={styles.stepSub}>
                      Showcase past completed projects to build trust with customers.
                    </ThemedText>

                    <Pressable
                      onPress={() => setPortfolioUploaded(!portfolioUploaded)}
                      style={[styles.uploadCard, portfolioUploaded && styles.uploadCardDone]}>
                      <Ionicons
                        name={portfolioUploaded ? 'checkmark-circle' : 'camera-outline'}
                        size={24}
                        color={portfolioUploaded ? Palette.success : Palette.primary}
                      />
                      <View style={{ flex: 1 }}>
                        <ThemedText style={styles.uploadTitle}>
                          {portfolioUploaded ? '3 Work Photos Attached' : 'Upload Past Work Photos'}
                        </ThemedText>
                        <ThemedText style={styles.uploadSub}>
                          {portfolioUploaded ? 'High quality photos verified' : 'JPG or PNG images'}
                        </ThemedText>
                      </View>
                    </Pressable>
                  </View>
                )}

                {/* STEP 6: VERIFICATION */}
                {step === 6 && (
                  <View style={styles.stepForm}>
                    <ThemedText type="headlineMd" style={styles.stepTitle}>
                      Identity & License Verification
                    </ThemedText>
                    <ThemedText style={styles.stepSub}>
                      Upload trade license or government ID to get the Verified Badge.
                    </ThemedText>

                    <Pressable
                      onPress={() => setLicenseUploaded(!licenseUploaded)}
                      style={[styles.uploadCard, licenseUploaded && styles.uploadCardDone]}>
                      <Ionicons
                        name={licenseUploaded ? 'checkmark-circle' : 'shield-checkmark-outline'}
                        size={24}
                        color={licenseUploaded ? Palette.success : Palette.primary}
                      />
                      <View style={{ flex: 1 }}>
                        <ThemedText style={styles.uploadTitle}>
                          {licenseUploaded ? 'Trade_License_Document.pdf' : 'Upload License or ID'}
                        </ThemedText>
                        <ThemedText style={styles.uploadSub}>
                          {licenseUploaded ? 'Verified Document' : 'Official trade license or state ID'}
                        </ThemedText>
                      </View>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {/* Footer Button */}
          {step < 7 && (
            <View style={styles.footer}>
              <Pressable onPress={handleNext} style={styles.primaryActionBtn}>
                <ThemedText style={styles.primaryActionBtnText}>
                  {step === 6 ? 'Submit Application' : 'Continue →'}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.dark,
  },
  headerSub: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  stepperTrack: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: Palette.outline,
  },
  stepperSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: Palette.outline,
  },
  stepperSegmentDone: {
    backgroundColor: Palette.primary,
  },
  stepperSegmentCurrent: {
    backgroundColor: Palette.accent,
  },
  body: {
    flex: 1,
    padding: Spacing.lg,
  },
  stepForm: {
    paddingBottom: Spacing.xl,
  },
  stepTitle: {
    color: Palette.dark,
  },
  stepSub: {
    fontSize: 14,
    color: Palette.secondaryText,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
  },
  choiceCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainerLow,
  },
  choiceCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.dark,
  },
  choiceCardTextSelected: {
    color: Palette.primary,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
    marginBottom: Spacing.xs,
  },
  textInput: {
    height: 46,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    color: Palette.mainText,
  },
  textArea: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    padding: Spacing.md,
    fontSize: 14,
    color: Palette.mainText,
    textAlignVertical: 'top',
    minHeight: 90,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  uploadCardDone: {
    borderColor: Palette.success,
    backgroundColor: '#F0FDF4',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
  },
  uploadSub: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  submittedContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  submittedTitle: {
    color: Palette.dark,
    textAlign: 'center',
  },
  submittedText: {
    fontSize: 14,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  goToDashboardBtn: {
    width: '100%',
    height: 50,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  goToDashboardBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  primaryActionBtn: {
    height: 50,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
