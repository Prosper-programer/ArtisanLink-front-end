import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { ProviderService, ProfessionTaxonomyItem } from '@/services/provider.service';

const ACTIVATION_STEPS = [
  { id: 1, title: 'Profession' },
  { id: 2, title: 'Specializations' },
  { id: 3, title: 'Profile & Location' },
  { id: 4, title: 'Submitted' },
];

const PROFESSION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Plumber: 'water-outline',
  Electrician: 'flash-outline',
  Carpenter: 'hammer-outline',
  Painter: 'color-palette-outline',
};

const SUGGESTED_AVATARS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&auto=format&fit=crop&q=80',
];

export const BecomeSellerModal: React.FC = () => {
  const {
    providerActivationVisible,
    closeProviderActivation,
    becomeProvider,
    authStatus,
    openAuthModal,
    user,
    updateUserProfile,
  } = useApp();

  const [step, setStep] = useState(1);
  const [professionsList, setProfessionsList] = useState<ProfessionTaxonomyItem[]>([]);
  const [profession, setProfession] = useState('Plumber');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '');
  const [bio, setBio] = useState('Master certified artisan with comprehensive experience in residential and commercial installations.');
  const [experienceYears, setExperienceYears] = useState('5');
  const [location, setLocation] = useState('Central District (25km coverage)');

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setErrorMessage('Permission to access photos is required.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setAvatarUrl(result.assets[0].uri);
        setErrorMessage(null);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch official professions from backend on mount or when modal opens
  useEffect(() => {
    if (providerActivationVisible) {
      ProviderService.getProfessions().then((res) => {
        if (res.data && res.data.length > 0) {
          setProfessionsList(res.data);
          if (!profession) {
            setProfession(res.data[0].profession);
          }
        }
      });
    }
  }, [providerActivationVisible]);

  // When profession changes, ensure initial specialization is set
  useEffect(() => {
    const currentProf = professionsList.find(
      (p) => p.profession.toLowerCase() === profession.toLowerCase()
    );
    if (currentProf && currentProf.specializations.length > 0) {
      const validSelected = selectedSpecializations.filter((s) =>
        currentProf.specializations.includes(s)
      );
      if (validSelected.length === 0) {
        setSelectedSpecializations([currentProf.specializations[0]]);
      } else {
        setSelectedSpecializations(validSelected);
      }
    }
  }, [profession, professionsList]);

  if (!providerActivationVisible) return null;

  const currentProfessionObj = professionsList.find(
    (p) => p.profession.toLowerCase() === profession.toLowerCase()
  ) || {
    profession,
    specializations: [
      'Pipe Installation',
      'Pipe Repair',
      'Drainage Repair',
      'Leak Detection',
    ],
  };

  const toggleSpecialization = (spec: string) => {
    if (selectedSpecializations.includes(spec)) {
      if (selectedSpecializations.length > 1) {
        setSelectedSpecializations(selectedSpecializations.filter((s) => s !== spec));
      }
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec]);
    }
  };

  const handleNext = async () => {
    setErrorMessage(null);

    // Step 2 validation
    if (step === 2 && selectedSpecializations.length === 0) {
      setErrorMessage('Please select at least one specialization.');
      return;
    }

    // Step 3 validation: Profile, Location, Experience & Bio (Submit application)
    if (step === 3) {
      if (!location.trim()) {
        setErrorMessage('Please enter the working location or district where you are found.');
        return;
      }
      const expNum = parseInt(experienceYears, 10);
      if (isNaN(expNum) || expNum < 0) {
        setErrorMessage('Please enter a valid number of years of experience.');
        return;
      }
      if (!bio.trim()) {
        setErrorMessage('Please provide a brief professional bio.');
        return;
      }

      if (authStatus === 'guest') {
        closeProviderActivation();
        openAuthModal(() => {
          // Can re-open if needed
        });
        return;
      }

      setSubmitting(true);
      const res = await becomeProvider({
        profession,
        specializations: selectedSpecializations,
        description: bio.trim(),
        experienceYears: parseInt(experienceYears, 10) || 0,
        location: location.trim(),
      });

      setSubmitting(false);

      if (res.success) {
        if (avatarUrl !== user.avatar) {
          updateUserProfile({ avatar: avatarUrl });
        }
        setStep(4);
      } else {
        setErrorMessage(res.message);
      }
      return;
    }

    if (step === 4) {
      closeProviderActivation();
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1 && step < 4) {
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
              {step > 1 && step < 4 && (
                <Pressable onPress={handleBack} style={styles.iconBtn}>
                  <Ionicons name="arrow-back" size={18} color={Palette.dark} />
                </Pressable>
              )}
              <View>
                <ThemedText style={styles.headerTitle}>Become a Service Seller</ThemedText>
                <ThemedText style={styles.headerSub}>
                  {step === 4 ? 'Activation Complete' : `Step ${step} of 3 • ${ACTIVATION_STEPS[step - 1].title}`}
                </ThemedText>
              </View>
            </View>

            <Pressable onPress={closeProviderActivation} style={styles.iconBtn}>
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          {/* Stepper Track */}
          {step < 4 && (
            <View style={styles.stepperTrack}>
              {ACTIVATION_STEPS.slice(0, 3).map((s, idx) => {
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
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={Palette.errorRed} />
                <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
              </View>
            ) : null}

            {step === 4 ? (
              <View style={styles.submittedContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="time" size={44} color={Palette.accent} />
                </View>
                <ThemedText type="headlineLg" style={styles.submittedTitle}>
                  Application Submitted!
                </ThemedText>
                <View style={styles.statusBadge}>
                  <ThemedText style={styles.statusBadgeText}>Status: Verification Pending ⏳</ThemedText>
                </View>
                <ThemedText style={styles.submittedText}>
                  Your application as a <ThemedText style={{ fontWeight: '700' }}>{profession}</ThemedText> has been received by our platform administrators. You will be notified once your credentials are verified.
                </ThemedText>

                <Pressable onPress={handleNext} style={styles.goToDashboardBtn}>
                  <ThemedText style={styles.goToDashboardBtnText}>
                    Back to Profile
                  </ThemedText>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
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
                      {professionsList.map((item) => {
                        const isSelected = profession.toLowerCase() === item.profession.toLowerCase();
                        const iconName = PROFESSION_ICONS[item.profession] || 'construct-outline';
                        return (
                          <Pressable
                            key={item.profession}
                            onPress={() => setProfession(item.profession)}
                            style={[
                              styles.choiceCard,
                              isSelected && styles.choiceCardSelected,
                            ]}>
                            <Ionicons
                              name={iconName}
                              size={20}
                              color={isSelected ? Palette.primary : Palette.dark}
                            />
                            <ThemedText
                              style={[
                                styles.choiceCardText,
                                isSelected && styles.choiceCardTextSelected,
                              ]}>
                              {item.profession}
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
                      Your Specializations
                    </ThemedText>
                    <ThemedText style={styles.stepSub}>
                      Select one or more specializations under {profession}.
                    </ThemedText>

                    <View style={styles.specializationsContainer}>
                      {currentProfessionObj.specializations.map((spec) => {
                        const isSelected = selectedSpecializations.includes(spec);
                        return (
                          <Pressable
                            key={spec}
                            onPress={() => toggleSpecialization(spec)}
                            style={[
                              styles.specChip,
                              isSelected && styles.specChipSelected,
                            ]}>
                            <Ionicons
                              name={isSelected ? 'checkbox' : 'square-outline'}
                              size={18}
                              color={isSelected ? Palette.primary : Palette.secondaryText}
                            />
                            <ThemedText
                              style={[
                                styles.specChipText,
                                isSelected && styles.specChipTextSelected,
                              ]}>
                              {spec}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* STEP 3: PROFILE PICTURE, LOCATION & PROFESSIONAL BIO */}
                {step === 3 && (
                  <View style={styles.stepForm}>
                    <ThemedText type="headlineMd" style={styles.stepTitle}>
                      Profile & Location
                    </ThemedText>
                    <ThemedText style={styles.stepSub}>
                      Set your artisan profile photo, base location, and craftsmanship details.
                    </ThemedText>

                    {/* Profile Picture Selector */}
                    <ThemedText style={styles.fieldLabel}>Profile Picture</ThemedText>
                    <View style={styles.avatarPickerSection}>
                      <View style={styles.avatarPreviewWrap}>
                        {avatarUrl ? (
                          <Image source={{ uri: avatarUrl }} style={styles.avatarPreviewImage} />
                        ) : (
                          <View style={styles.avatarEmptyPlaceholder}>
                            <Ionicons name="person" size={38} color={Palette.secondaryText} />
                          </View>
                        )}
                        {avatarUrl ? (
                          <Pressable
                            onPress={() => setAvatarUrl('')}
                            style={styles.avatarRemoveBtn}
                            accessibilityLabel="Remove profile picture">
                            <Ionicons name="close" size={14} color="#FFFFFF" />
                          </Pressable>
                        ) : null}
                      </View>

                      <View style={styles.avatarActionWrap}>
                        <ThemedText style={styles.avatarHelpText}>
                          {avatarUrl
                            ? 'Custom photo selected. You can tap below to clear it or switch photo.'
                            : 'No photo selected. The skeleton profile icon will be displayed.'}
                        </ThemedText>

                        {/* Preset options */}
                        <View style={styles.suggestedAvatarsRow}>
                          {/* Option to explicitly choose no photo */}
                          <Pressable
                            onPress={() => setAvatarUrl('')}
                            style={[
                              styles.suggestedAvatarThumb,
                              !avatarUrl && styles.suggestedAvatarThumbActive,
                              {
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Palette.surfaceContainerLow,
                              },
                            ]}
                            accessibilityLabel="No photo - default profile skeleton">
                            <Ionicons
                              name="person"
                              size={20}
                              color={!avatarUrl ? Palette.primary : Palette.secondaryText}
                            />
                          </Pressable>

                          {SUGGESTED_AVATARS.map((url, idx) => (
                            <Pressable
                              key={idx}
                              onPress={() => setAvatarUrl(url)}
                              style={[
                                styles.suggestedAvatarThumb,
                                avatarUrl === url && styles.suggestedAvatarThumbActive,
                              ]}>
                              <Image source={{ uri: url }} style={styles.suggestedThumbImage} />
                            </Pressable>
                          ))}
                        </View>

                        {/* Add image from phone gallery */}
                        <Pressable
                          onPress={pickImage}
                          style={styles.addImageBtn}
                          accessibilityRole="button"
                          accessibilityLabel="Add an image from your device">
                          <Ionicons name="images-outline" size={15} color={Palette.primary} />
                          <ThemedText style={styles.addImageBtnText}>Add an image</ThemedText>
                        </Pressable>
                      </View>
                    </View>

                    {/* Working Location & Coverage Area */}
                    <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                      Working Location & Coverage Area *
                    </ThemedText>
                    <ThemedText style={styles.fieldSub}>
                      Enter the location where you are based to receive client requests.
                    </ThemedText>
                    <View style={styles.locationInputContainer}>
                      <Ionicons
                        name="location"
                        size={20}
                        color={Palette.primary}
                        style={styles.locationIcon}
                      />
                      <TextInput
                        style={styles.locationTextInput}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="e.g. Central District (25km coverage)"
                        placeholderTextColor={Palette.secondaryText}
                      />
                    </View>

                    {/* Quick location option: Use Current Location */}
                    <View style={styles.locationActionWrap}>
                      <Pressable
                        onPress={() => setLocation('Current Location (20km radius)')}
                        style={styles.detectLocationBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Use current location">
                        <Ionicons
                          name="navigate-circle"
                          size={16}
                          color={Palette.primary}
                        />
                        <ThemedText style={styles.detectLocationText}>
                          Use my current location
                        </ThemedText>
                      </Pressable>
                    </View>

                    <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                      Years of Experience *
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      value={experienceYears}
                      onChangeText={setExperienceYears}
                      keyboardType="numeric"
                      placeholder="5"
                      placeholderTextColor={Palette.secondaryText}
                    />

                    <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                      Professional Bio / Description *
                    </ThemedText>
                    <TextInput
                      style={styles.textArea}
                      value={bio}
                      onChangeText={setBio}
                      multiline
                      numberOfLines={4}
                      placeholder="Describe your background, craftsmanship, and commitment to quality..."
                      placeholderTextColor={Palette.secondaryText}
                    />

                    <View style={styles.securityNote}>
                      <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color={Palette.primary}
                      />
                      <ThemedText style={styles.securityNoteText}>
                        Customers will send work requests per-task / by quote. Your application will be submitted for review.
                      </ThemedText>
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {/* Footer Button */}
          {step < 4 && (
            <View style={styles.footer}>
              <Pressable
                onPress={handleNext}
                disabled={submitting}
                style={[styles.primaryActionBtn, submitting && { opacity: 0.7 }]}>
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.primaryActionBtnText}>
                    {step === 3 ? 'Submit Application' : 'Continue →'}
                  </ThemedText>
                )}
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
  fieldSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginBottom: Spacing.xs,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.sm,
  },
  locationIcon: {
    marginRight: Spacing.xs,
  },
  locationTextInput: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: Palette.mainText,
  },
  locationActionWrap: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
    alignItems: 'flex-start',
  },
  detectLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  detectLocationText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  // Avatar Picker Styles
  avatarPickerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    marginBottom: Spacing.xs,
  },
  avatarPreviewWrap: {
    position: 'relative',
    width: 68,
    height: 68,
  },
  avatarPreviewImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: Palette.primary,
  },
  avatarEmptyPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRemoveBtn: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.errorRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Palette.surface,
  },
  avatarActionWrap: {
    flex: 1,
    gap: 8,
  },
  avatarHelpText: {
    fontSize: 12,
    color: Palette.secondaryText,
    lineHeight: 16,
  },
  suggestedAvatarsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  suggestedAvatarThumb: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    overflow: 'hidden',
  },
  suggestedAvatarThumbActive: {
    borderColor: Palette.primary,
    borderWidth: 2.5,
  },
  suggestedThumbImage: {
    width: '100%',
    height: '100%',
  },
  addImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addImageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.errorContainer,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: 13,
    color: Palette.errorRed,
    flex: 1,
  },
  specializationsContainer: {
    gap: Spacing.sm,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
  },
  specChipSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainerLow,
  },
  specChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Palette.mainText,
  },
  specChipTextSelected: {
    color: Palette.primary,
    fontWeight: '700',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Palette.surfaceContainerLow,
    padding: Spacing.md,
    borderRadius: BorderRadius.default,
    marginTop: Spacing.lg,
  },
  securityNoteText: {
    fontSize: 12,
    color: Palette.primary,
    flex: 1,
    lineHeight: 18,
  },
  statusBadge: {
    backgroundColor: Palette.goldLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.gold,
    marginBottom: Spacing.xs,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.goldDark,
  },
});
