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
import { Palette, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { POPULAR_SERVICES, PROFESSIONALS, ServiceCategory, Professional } from '@/data/mockData';

const STEPS = [
  { id: 1, title: 'Service' },
  { id: 2, title: 'Problem' },
  { id: 3, title: 'Location' },
  { id: 4, title: 'Schedule' },
  { id: 5, title: 'Professional' },
  { id: 6, title: 'Review' },
];

const SAMPLE_PHOTO = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80';

export const BookingModal: React.FC = () => {
  const {
    createRequestVisible,
    closeCreateRequest,
    preselectedService,
    preselectedPro,
    authStatus,
    openAuthModal,
    submitServiceRequest,
    openRequestSubmitted,
    openProfessionalProfile,
  } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Service
  const [selectedService, setSelectedService] = useState<ServiceCategory>(POPULAR_SERVICES[0]);

  // Step 2: Problem
  const [problemDescription, setProblemDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Step 3: Location
  const [location, setLocation] = useState('142 Elm Street, Apt 4B, Downtown');

  // Step 4: Schedule
  const [date, setDate] = useState('Today, 26 Aug');
  const [time, setTime] = useState('14:00 - 16:00');
  const [isFlexible, setIsFlexible] = useState(false);

  // Step 5: Professional
  const [selectedPro, setSelectedPro] = useState<Professional>(PROFESSIONALS[0]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (createRequestVisible) {
      setStep(1);
      setSubmitError(null);
      if (preselectedService) {
        setSelectedService(preselectedService);
      }
      if (preselectedPro) {
        setSelectedPro(preselectedPro);
      } else {
        const matching = PROFESSIONALS.find(
          (p) => p.category.toLowerCase() === (preselectedService?.id || 'plumbing').toLowerCase()
        );
        if (matching) setSelectedPro(matching);
      }
    }
  }, [createRequestVisible, preselectedService, preselectedPro]);

  if (!createRequestVisible) return null;

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Step 6: Review -> Submit
      handleSubmitRequest();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitRequest = () => {
    if (authStatus === 'guest') {
      // Prompt auth first, keeping request state intact
      openAuthModal(() => {
        executeFinalSubmit();
      });
      return;
    }
    executeFinalSubmit();
  };

  const executeFinalSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const createdReq = await submitServiceRequest({
        serviceCategory: selectedService.name,
        serviceName: `${selectedService.name} Diagnostic & Repair`,
        problemDescription: problemDescription || `Request for ${selectedService.name} service.`,
        photos,
        location,
        date,
        time,
        isFlexible,
        professional: selectedPro,
        estimatedCost: selectedPro.hourlyRate * 1.5,
      });

      closeCreateRequest();
      openRequestSubmitted(createdReq);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit service request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPhoto = async () => {
    if (photos.length >= 3) return;
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPhotos((prev) => (prev.length < 3 ? [...prev, SAMPLE_PHOTO] : prev));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setPhotos((prev) => (prev.length < 3 ? [...prev, result.assets[0].uri] : prev));
      }
    } catch (e) {
      setPhotos((prev) => (prev.length < 3 ? [...prev, SAMPLE_PHOTO] : prev));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <Modal visible={createRequestVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {step > 1 && (
                <Pressable onPress={handleBack} style={styles.iconBtn}>
                  <Ionicons name="arrow-back" size={18} color={Palette.dark} />
                </Pressable>
              )}
              <View>
                <ThemedText style={styles.headerTitle}>Create Service Request</ThemedText>
                <ThemedText style={styles.headerSub}>
                  Step {step} of 6 • {STEPS[step - 1].title}
                </ThemedText>
              </View>
            </View>

            <Pressable onPress={closeCreateRequest} style={styles.iconBtn}>
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          {/* Stepper Progress Line */}
          <View style={styles.stepperTrack}>
            {STEPS.map((s, idx) => {
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

          {/* Form Content */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* STEP 1: SERVICE SELECTION */}
            {step === 1 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  What service do you need?
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Choose the trade category matching your project.
                </ThemedText>

                <View style={styles.servicesGrid}>
                  {POPULAR_SERVICES.map((srv) => {
                    const isSelected = srv.id === selectedService.id;
                    return (
                      <Pressable
                        key={srv.id}
                        onPress={() => {
                          setSelectedService(srv);
                          const matching = PROFESSIONALS.find(
                            (p) => p.category.toLowerCase() === srv.id.toLowerCase()
                          );
                          if (matching) setSelectedPro(matching);
                        }}
                        style={[
                          styles.serviceCardItem,
                          isSelected && styles.serviceCardItemSelected,
                        ]}>
                        <Image source={{ uri: srv.image }} style={styles.serviceItemImg} />
                        <View style={styles.serviceItemInfo}>
                          <ThemedText
                            style={[
                              styles.serviceItemName,
                              isSelected && styles.serviceItemNameSelected,
                            ]}>
                            {srv.name}
                          </ThemedText>
                          <ThemedText style={styles.serviceItemCount}>
                            {srv.count} pros available
                          </ThemedText>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={Palette.primary}
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* STEP 2: PROBLEM DESCRIPTION */}
            {step === 2 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  Tell us about your problem
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Describe the issue clearly to receive accurate estimates.
                </ThemedText>

                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your problem or project..."
                  placeholderTextColor={Palette.secondaryText}
                  multiline
                  numberOfLines={5}
                  value={problemDescription}
                  onChangeText={setProblemDescription}
                />

                <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>
                  Optional: Add Photos
                </ThemedText>
                <View style={styles.photosRow}>
                  {photos.map((uri, idx) => (
                    <View key={idx} style={styles.photoThumbWrap}>
                      <Image source={{ uri }} style={styles.photoThumb} />
                      <Pressable
                        onPress={() => handleRemovePhoto(idx)}
                        style={styles.removePhotoBtn}>
                        <Ionicons name="close" size={12} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  ))}

                  {photos.length < 3 && (
                    <Pressable onPress={handleAddPhoto} style={styles.addPhotoCard}>
                      <Ionicons name="camera-outline" size={24} color={Palette.primary} />
                      <ThemedText style={styles.addPhotoLabel}>Add Photos</ThemedText>
                    </Pressable>
                  )}
                </View>
              </View>
            )}

            {/* STEP 3: LOCATION */}
            {step === 3 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  Where do you need the service?
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Enter the address where the professional should arrive.
                </ThemedText>

                <View style={styles.inputWrapWithIcon}>
                  <Ionicons name="location-outline" size={20} color={Palette.primary} />
                  <TextInput
                    style={styles.textInputFlex}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Enter your location"
                    placeholderTextColor={Palette.secondaryText}
                  />
                </View>

                <Pressable
                  onPress={() => setLocation('142 Elm Street, Apt 4B, Downtown')}
                  style={styles.useMyLocationBtn}>
                  <Ionicons name="navigate-outline" size={18} color={Palette.primary} />
                  <ThemedText style={styles.useMyLocationText}>Use My Location</ThemedText>
                </Pressable>
              </View>
            )}

            {/* STEP 4: SCHEDULE */}
            {step === 4 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  When do you need the service?
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Select your preferred date and arrival window.
                </ThemedText>

                <ThemedText style={styles.fieldLabel}>Date</ThemedText>
                <View style={styles.dateSelectorRow}>
                  {['Today, 26 Aug', 'Tomorrow, 27 Aug', 'Thu, 28 Aug'].map((d) => (
                    <Pressable
                      key={d}
                      onPress={() => setDate(d)}
                      style={[styles.choiceChip, date === d && styles.choiceChipSelected]}>
                      <ThemedText
                        style={[
                          styles.choiceChipText,
                          date === d && styles.choiceChipTextSelected,
                        ]}>
                        {d}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Time</ThemedText>
                <View style={styles.timeSelectorRow}>
                  {['08:00 - 12:00', '14:00 - 16:00', '16:00 - 19:00'].map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setTime(t)}
                      style={[styles.choiceChip, time === t && styles.choiceChipSelected]}>
                      <ThemedText
                        style={[
                          styles.choiceChipText,
                          time === t && styles.choiceChipTextSelected,
                        ]}>
                        {t}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  onPress={() => setIsFlexible(!isFlexible)}
                  style={[styles.flexibleOption, isFlexible && styles.flexibleOptionSelected]}>
                  <Ionicons
                    name={isFlexible ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={isFlexible ? Palette.primary : Palette.secondaryText}
                  />
                  <ThemedText style={styles.flexibleText}>I'm flexible with scheduling</ThemedText>
                </Pressable>
              </View>
            )}

            {/* STEP 5: CHOOSE PROFESSIONAL */}
            {step === 5 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  Choose a professional
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Recommended providers based on service, rating & verification.
                </ThemedText>

                <View style={styles.proList}>
                  {PROFESSIONALS.map((pro) => {
                    const isSelected = pro.id === selectedPro.id;
                    return (
                      <View
                        key={pro.id}
                        style={[
                          styles.proPickCard,
                          isSelected && styles.proPickCardSelected,
                        ]}>
                        <View style={styles.proPickTop}>
                          <Image source={{ uri: pro.avatar }} style={styles.proAvatar} />
                          <View style={styles.proPickInfo}>
                            <View style={styles.proNameRow}>
                              <ThemedText style={styles.proName}>{pro.name}</ThemedText>
                              {pro.verified && (
                                <Ionicons
                                  name="checkmark-circle"
                                  size={16}
                                  color={Palette.success}
                                />
                              )}
                            </View>
                            <ThemedText style={styles.proProfession}>{pro.profession}</ThemedText>
                            <View style={styles.proMetaRow}>
                              <Ionicons name="star" size={13} color={Palette.gold} />
                              <ThemedText style={styles.proRating}>
                                {pro.rating} ({pro.reviewCount} reviews)
                              </ThemedText>
                              <ThemedText style={styles.metaDot}>•</ThemedText>
                              <ThemedText style={styles.proDistance}>{pro.distance}</ThemedText>
                            </View>
                          </View>
                        </View>

                        <View style={styles.proPickActions}>
                          <Pressable
                            onPress={() => openProfessionalProfile(pro)}
                            style={styles.viewProProfileBtn}>
                            <ThemedText style={styles.viewProProfileText}>View Profile</ThemedText>
                          </Pressable>

                          <Pressable
                            onPress={() => setSelectedPro(pro)}
                            style={[
                              styles.selectProBtn,
                              isSelected && styles.selectProBtnSelected,
                            ]}>
                            <ThemedText
                              style={[
                                styles.selectProBtnText,
                                isSelected && styles.selectProBtnTextSelected,
                              ]}>
                              {isSelected ? 'Selected ✓' : 'Select'}
                            </ThemedText>
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* STEP 6: REVIEW */}
            {step === 6 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  Review your request
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Please confirm your service details before submitting.
                </ThemedText>

                {submitError && (
                  <View style={styles.submitErrorBanner}>
                    <Ionicons name="alert-circle" size={18} color={Palette.errorRed} />
                    <ThemedText style={styles.submitErrorText}>{submitError}</ThemedText>
                  </View>
                )}

                <View style={styles.reviewSummaryCard}>
                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Service</ThemedText>
                    <ThemedText style={styles.reviewValue}>{selectedService.name}</ThemedText>
                  </View>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Problem</ThemedText>
                    <ThemedText style={styles.reviewValue} numberOfLines={2}>
                      {problemDescription || 'Standard Diagnostic & Inspection'}
                    </ThemedText>
                  </View>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Location</ThemedText>
                    <ThemedText style={styles.reviewValue} numberOfLines={1}>{location}</ThemedText>
                  </View>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Date & Time</ThemedText>
                    <ThemedText style={styles.reviewValue}>{date} ({time})</ThemedText>
                  </View>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Professional</ThemedText>
                    <View style={styles.proReviewTag}>
                      <ThemedText style={styles.reviewValue}>{selectedPro.name}</ThemedText>
                      <Ionicons name="checkmark-circle" size={14} color={Palette.success} />
                    </View>
                  </View>
                </View>

                {/* Craftsmanship Guarantee */}
                <View style={styles.guaranteeBox}>
                  <Ionicons name="shield-checkmark" size={18} color={Palette.success} />
                  <ThemedText style={styles.guaranteeText}>
                    Backed by ArtisanLink 100% Satisfaction Guarantee.
                  </ThemedText>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Action Button */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleNext}
              style={[styles.primaryActionBtn, submitting && styles.primaryActionBtnDisabled]}
              disabled={submitting}
              accessibilityRole="button">
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.primaryActionBtnText}>
                  {step === 6 ? 'Submit Request' : 'Continue →'}
                </ThemedText>
              )}
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
  stepContent: {
    paddingBottom: Spacing.xl,
  },
  stepTitle: {
    color: Palette.dark,
  },
  stepSubtitle: {
    fontSize: 14,
    color: Palette.secondaryText,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  servicesGrid: {
    gap: Spacing.sm,
  },
  serviceCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    gap: Spacing.md,
  },
  serviceCardItemSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainerLow,
  },
  serviceItemImg: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.sm,
  },
  serviceItemInfo: {
    flex: 1,
  },
  serviceItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
  },
  serviceItemNameSelected: {
    color: Palette.primary,
  },
  serviceItemCount: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
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
    minHeight: 110,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
    marginBottom: Spacing.xs,
  },
  photosRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  photoThumbWrap: {
    width: 74,
    height: 74,
    borderRadius: BorderRadius.default,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoCard: {
    width: 74,
    height: 74,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceContainerLow,
    gap: 2,
  },
  addPhotoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.primary,
  },
  inputWrapWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  textInputFlex: {
    flex: 1,
    fontSize: 14,
    color: Palette.mainText,
  },
  useMyLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: BorderRadius.full,
  },
  useMyLocationText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  timeSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  choiceChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
  },
  choiceChipSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primary,
  },
  choiceChipText: {
    fontSize: 13,
    color: Palette.dark,
    fontWeight: '600',
  },
  choiceChipTextSelected: {
    color: '#FFFFFF',
  },
  flexibleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  flexibleOptionSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainerLow,
  },
  flexibleText: {
    fontSize: 14,
    color: Palette.dark,
    fontWeight: '500',
  },
  proList: {
    gap: Spacing.md,
  },
  proPickCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  proPickCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainerLow,
  },
  proPickTop: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  proPickInfo: {
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
  },
  proMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  proRating: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
  },
  metaDot: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  proDistance: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  proPickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  viewProProfileBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
  },
  selectProBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectProBtnSelected: {
    backgroundColor: Palette.primary,
  },
  selectProBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  selectProBtnTextSelected: {
    color: '#FFFFFF',
  },
  reviewSummaryCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    fontSize: 13,
    color: Palette.secondaryText,
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
    maxWidth: '65%',
  },
  proReviewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: Palette.outline,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#F0FDF4',
    padding: Spacing.md,
    borderRadius: BorderRadius.default,
    marginTop: Spacing.lg,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
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
  primaryActionBtnDisabled: {
    opacity: 0.7,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    padding: Spacing.sm,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.errorRed,
    marginBottom: Spacing.md,
  },
  submitErrorText: {
    fontSize: 12,
    color: Palette.errorRed,
    fontWeight: '600',
    flex: 1,
  },
});
