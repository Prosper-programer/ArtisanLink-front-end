import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import * as ExpoLocation from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { POPULAR_SERVICES, PROFESSIONALS, ServiceCategory, Professional } from '@/data/mockData';
import { FriendlyStepper, StepItem } from './FriendlyStepper';
import { API_BASE_URL } from '@/constants/api';
import { isProviderMatchingTrade, isSameUserAsPro } from '@/constants/professionMatcher';

const STEPS: StepItem[] = [
  { id: 1, title: 'Trade & Problem' },
  { id: 2, title: 'Location & Time' },
  { id: 3, title: 'Artisan & Confirm' },
];

const SAMPLE_PHOTO =
  'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80';

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
    professionals,
    language,
    user,
    activeRole,
  } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Category & Service
  const [selectedService, setSelectedService] = useState<ServiceCategory>(POPULAR_SERVICES[0]);

  // Step 2: Problem Details & Photos
  const [problemDescription, setProblemDescription] = useState('');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Emergency'>('Standard');
  const [photos, setPhotos] = useState<string[]>([]);

  // Step 3: Location (Geoapify) & Schedule
  const [location, setLocation] = useState('Bastos, Yaoundé, Cameroon');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isGeocodingCurrent, setIsGeocodingCurrent] = useState(false);

  const [date, setDate] = useState('Today, 26 Aug');
  const [time, setTime] = useState('14:00 - 16:00');
  const [isFlexible, setIsFlexible] = useState(false);

  // Step 3: Choose Professional & Confirm
  const proList = professionals && professionals.length > 0 ? professionals : PROFESSIONALS;

  // Filter professionals strictly matching the chosen profession/category
  // AND exclude the logged in user themselves (especially in provider mode)
  const filteredProfessionals = useMemo(() => {
    return proList.filter((pro) => {
      // Cannot choose yourself as a provider to perform a task
      if (isSameUserAsPro(user, pro)) {
        return false;
      }
      return isProviderMatchingTrade(pro, selectedService.id || selectedService.name);
    });
  }, [proList, selectedService, user, activeRole]);

  const [selectedPro, setSelectedPro] = useState<Professional | null>(
    filteredProfessionals.length > 0 ? filteredProfessionals[0] : null
  );

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
      if (preselectedPro && !isSameUserAsPro(user, preselectedPro)) {
        setSelectedPro(preselectedPro);
      } else if (filteredProfessionals.length > 0) {
        setSelectedPro(filteredProfessionals[0]);
      } else {
        setSelectedPro(null);
      }
    }
  }, [createRequestVisible, preselectedService, preselectedPro]);

  // Update selectedPro when filtered list changes if current selection is not in list
  useEffect(() => {
    if (filteredProfessionals.length > 0) {
      if (!selectedPro || !filteredProfessionals.some((p) => p.id === selectedPro?.id)) {
        setSelectedPro(filteredProfessionals[0]);
      }
    } else {
      setSelectedPro(null);
    }
  }, [filteredProfessionals]);

  if (!createRequestVisible) return null;

  // Geoapify autocomplete search
  const handleLocationChange = async (text: string) => {
    setLocation(text);
    if (!text || text.trim().length < 2) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearchingLocation(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/location/autocomplete?text=${encodeURIComponent(text.trim())}&country=cm&limit=4`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLocationSuggestions(data.data);
      } else {
        setLocationSuggestions([]);
      }
    } catch {
      setLocationSuggestions([]);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Reverse geocoding via real device GPS + Geoapify API
  const handleUseMyLocation = async () => {
    setIsGeocodingCurrent(true);
    try {
      let lat: number | null = null;
      let lon: number | null = null;

      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
        // Browser Geolocation for Web
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } else {
        // Native GPS via Expo Location
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Location Permission Denied',
            'Please allow location permission in your device settings so we can detect your exact location.'
          );
          setIsGeocodingCurrent(false);
          return;
        }

        const locationResult = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });
        lat = locationResult.coords.latitude;
        lon = locationResult.coords.longitude;
      }

      if (lat != null && lon != null) {
        const res = await fetch(`${API_BASE_URL}/location/reverse?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (data.success && data.data?.formatted) {
          setLocation(data.data.formatted);
          setLocationSuggestions([]);
        } else if (data.data?.address_line1) {
          setLocation(data.data.address_line1);
          setLocationSuggestions([]);
        } else {
          setLocation(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
        }
      }
    } catch (err: any) {
      console.warn('Real GPS fetch error:', err);
      Alert.alert(
        'Location Detection',
        'Could not obtain your GPS coordinates. Please ensure location is enabled, or search your address manually.'
      );
    } finally {
      setIsGeocodingCurrent(false);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
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

    if (!selectedPro) {
      setSubmitError(
        language === 'fr'
          ? `Aucun artisan ${selectedService.name} n'est sélectionné.`
          : `No ${selectedService.name} artisan selected.`
      );
      setSubmitting(false);
      return;
    }

    if (isSameUserAsPro(user, selectedPro)) {
      setSubmitError(
        language === 'fr'
          ? 'Vous ne pouvez pas vous choisir vous-même comme prestataire.'
          : 'You cannot select yourself as the service provider.'
      );
      setSubmitting(false);
      return;
    }

    try {
      const createdReq = await submitServiceRequest({
        serviceCategory: selectedService.name,
        serviceName: `${selectedService.name} Diagnostic & Repair`,
        problemDescription: problemDescription || `Request for ${selectedService.name} (${urgency} priority).`,
        photos,
        location,
        date,
        time,
        isFlexible,
        professional: selectedPro,
        estimatedCost: 0,
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
    } catch {
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
          {/* Header */}
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
                  Step {step} of 3 • {STEPS[step - 1]?.title}
                </ThemedText>
              </View>
            </View>

            <Pressable onPress={closeCreateRequest} style={styles.iconBtn}>
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          {/* Friendly Stepper */}
          <FriendlyStepper
            steps={STEPS}
            currentStep={step}
            friendlySubtitle={
              step === 1
                ? 'Step 1 of 3 • Choose trade & describe your problem 🛠️'
                : step === 2
                ? 'Step 2 of 3 • Pinpoint address (Geoapify GPS) & timing 📍'
                : `Step 3 of 3 • Pick a verified ${selectedService.name} & confirm 🤝`
            }
          />

          {/* Scrollable Form Content */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* SCREEN 1: TRADE CATEGORY & PROBLEM DETAILS */}
            {step === 1 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  What service do you need?
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Select your trade category and describe the issue so the artisan arrives prepared.
                </ThemedText>

                <ThemedText style={styles.fieldLabel}>Select Trade Category *</ThemedText>
                <View style={styles.servicesGrid}>
                  {POPULAR_SERVICES.map((srv) => {
                    const isSelected = srv.id === selectedService.id;
                    return (
                      <Pressable
                        key={srv.id}
                        onPress={() => {
                          setSelectedService(srv);
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

                {/* Problem Description */}
                <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>
                  Problem Description *
                </ThemedText>
                <TextInput
                  style={styles.textArea}
                  placeholder="e.g. The kitchen sink pipe has a severe leakage since yesterday morning..."
                  placeholderTextColor={Palette.secondaryText}
                  multiline
                  numberOfLines={4}
                  value={problemDescription}
                  onChangeText={setProblemDescription}
                />

                {/* Urgency Selector */}
                <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                  Urgency Level
                </ThemedText>
                <View style={styles.urgencyRow}>
                  {(['Standard', 'Urgent', 'Emergency'] as const).map((lvl) => (
                    <Pressable
                      key={lvl}
                      onPress={() => setUrgency(lvl)}
                      style={[
                        styles.urgencyChip,
                        urgency === lvl && styles.urgencyChipSelected,
                        urgency === lvl && lvl === 'Emergency' && styles.urgencyChipEmergency,
                      ]}>
                      <Ionicons
                        name={
                          lvl === 'Emergency'
                            ? 'flash'
                            : lvl === 'Urgent'
                            ? 'alarm-outline'
                            : 'checkmark-circle-outline'
                        }
                        size={15}
                        color={
                          urgency === lvl
                            ? '#FFFFFF'
                            : lvl === 'Emergency'
                            ? Palette.errorRed
                            : Palette.dark
                        }
                      />
                      <ThemedText
                        style={[
                          styles.urgencyChipText,
                          urgency === lvl && styles.urgencyChipTextSelected,
                        ]}>
                        {lvl}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                {/* Photos */}
                <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>
                  Attach Photos (Up to 3)
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
                      <ThemedText style={styles.addPhotoLabel}>Add Photo</ThemedText>
                    </Pressable>
                  )}
                </View>
              </View>
            )}

            {/* SCREEN 2: LOCATION & SCHEDULE */}
            {step === 2 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  Location & Schedule
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Where and when should the service provider arrive?
                </ThemedText>

                {/* Location Input with Geoapify */}
                <ThemedText style={styles.fieldLabel}>Service Address (Geoapify Search) *</ThemedText>
                <View style={styles.inputWrapWithIcon}>
                  <Ionicons name="location" size={20} color={Palette.primary} />
                  <TextInput
                    style={styles.textInputFlex}
                    value={location}
                    onChangeText={handleLocationChange}
                    placeholder="Enter city, neighborhood or street..."
                    placeholderTextColor={Palette.secondaryText}
                  />
                  {isSearchingLocation && (
                    <ActivityIndicator size="small" color={Palette.primary} />
                  )}
                </View>

                {/* Geoapify Suggestions Dropdown */}
                {locationSuggestions.length > 0 && (
                  <View style={styles.suggestionsBox}>
                    {locationSuggestions.map((sug, idx) => (
                      <Pressable
                        key={idx}
                        onPress={() => {
                          setLocation(sug.formatted);
                          setLocationSuggestions([]);
                        }}
                        style={styles.suggestionItem}>
                        <Ionicons name="pin-outline" size={16} color={Palette.primary} />
                        <ThemedText style={styles.suggestionText} numberOfLines={1}>
                          {sug.formatted}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                )}

                {/* Use My GPS Location Button */}
                <Pressable
                  onPress={handleUseMyLocation}
                  disabled={isGeocodingCurrent}
                  style={styles.useMyLocationBtn}>
                  {isGeocodingCurrent ? (
                    <ActivityIndicator size="small" color={Palette.primary} />
                  ) : (
                    <>
                      <Ionicons name="navigate-outline" size={18} color={Palette.primary} />
                      <ThemedText style={styles.useMyLocationText}>
                        Use My Current Location (GPS Pin)
                      </ThemedText>
                    </>
                  )}
                </Pressable>

                {/* Date Selection */}
                <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>
                  Preferred Date
                </ThemedText>
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

                {/* Time Selection */}
                <ThemedText style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                  Arrival Window
                </ThemedText>
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

                {/* Flexible Scheduling Option */}
                <Pressable
                  onPress={() => setIsFlexible(!isFlexible)}
                  style={[styles.flexibleOption, isFlexible && styles.flexibleOptionSelected]}>
                  <Ionicons
                    name={isFlexible ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={isFlexible ? Palette.primary : Palette.secondaryText}
                  />
                  <ThemedText style={styles.flexibleText}>
                    I'm flexible with date & time if artisan is busy
                  </ThemedText>
                </Pressable>
              </View>
            )}

            {/* SCREEN 3: CHOOSE PROFESSIONAL (FILTERED) & CONFIRM */}
            {step === 3 && (
              <View style={styles.stepContent}>
                <ThemedText type="headlineMd" style={styles.stepTitle}>
                  Select Verified {selectedService.name}
                </ThemedText>
                <ThemedText style={styles.stepSubtitle}>
                  Only licensed artisans specializing in {selectedService.name} are shown below.
                </ThemedText>

                {submitError && (
                  <View style={styles.submitErrorBanner}>
                    <Ionicons name="alert-circle" size={18} color={Palette.errorRed} />
                    <ThemedText style={styles.submitErrorText}>{submitError}</ThemedText>
                  </View>
                )}

                {/* Filtered Provider Cards */}
                {filteredProfessionals.length === 0 ? (
                  <View style={styles.noProsBox}>
                    <Ionicons name="alert-circle-outline" size={36} color={Palette.secondaryText} />
                    <ThemedText style={styles.noProsTitle}>
                      {language === 'fr' ? 'Aucun artisan disponible' : 'No Artisans Available'}
                    </ThemedText>
                    <ThemedText style={styles.noProsSub}>
                      {language === 'fr'
                        ? `Aucun artisan ${selectedService.name} n'est disponible pour le moment.`
                        : `No verified ${selectedService.name} artisans are available right now.`}
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.proList}>
                    {filteredProfessionals.map((pro) => {
                      const isSelected = pro.id === selectedPro?.id;
                      return (
                        <Pressable
                          key={pro.id}
                          onPress={() => setSelectedPro(pro)}
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
                                <ThemedText style={styles.proDistance}>{pro.distance || 'Near you'}</ThemedText>
                              </View>
                            </View>
                            <View style={styles.radioIndicator}>
                              <Ionicons
                                name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                                size={22}
                                color={isSelected ? Palette.primary : Palette.secondaryText}
                              />
                            </View>
                          </View>

                          <View style={styles.proPickActions}>
                            <Pressable
                              onPress={() => openProfessionalProfile(pro)}
                              style={styles.viewProProfileBtn}>
                              <ThemedText style={styles.viewProProfileText}>View Credentials</ThemedText>
                            </Pressable>

                            <View style={styles.rateBadge}>
                              <Ionicons name="receipt-outline" size={13} color={Palette.primary} />
                              <ThemedText style={styles.rateBadgeText}>
                                {language === 'fr' ? 'Sur Devis' : 'Direct Quote'}
                              </ThemedText>
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                )}

                {/* Final Order Review Summary Card */}
                <View style={styles.reviewSummaryCard}>
                  <ThemedText style={styles.summaryCardTitle}>Booking Summary</ThemedText>

                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Category</ThemedText>
                    <ThemedText style={styles.reviewValue}>{selectedService.name}</ThemedText>
                  </View>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Location</ThemedText>
                    <ThemedText style={styles.reviewValue} numberOfLines={1}>
                      {location}
                    </ThemedText>
                  </View>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Schedule</ThemedText>
                    <ThemedText style={styles.reviewValue}>
                      {date} • {time}
                    </ThemedText>
                  </View>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewRow}>
                    <ThemedText style={styles.reviewLabel}>Selected Pro</ThemedText>
                    <View style={styles.proReviewTag}>
                      <ThemedText style={styles.reviewValue}>
                        {selectedPro?.name || (language === 'fr' ? 'Aucun artisan' : 'None Selected')}
                      </ThemedText>
                      {selectedPro && (
                        <Ionicons name="checkmark-circle" size={14} color={Palette.success} />
                      )}
                    </View>
                  </View>

                  <View style={styles.reviewDivider} />

                  <View style={styles.reviewRow}>
                    <ThemedText style={[styles.reviewLabel, { fontWeight: '700' }]}>
                      {language === 'fr' ? 'Tarification' : 'Pricing Mode'}
                    </ThemedText>
                    <ThemedText style={[styles.reviewValue, { color: Palette.primary, fontWeight: '800' }]}>
                      {language === 'fr' ? 'Sur Devis (Par Tâche)' : 'Direct Quote (Per Task)'}
                    </ThemedText>
                  </View>
                </View>

                {/* Craftsmanship Guarantee */}
                <View style={styles.guaranteeBox}>
                  <Ionicons name="shield-checkmark" size={18} color={Palette.success} />
                  <ThemedText style={styles.guaranteeText}>
                    Backed by ArtisanLink 100% Satisfaction Guarantee. Payment only after job approval.
                  </ThemedText>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleNext}
              style={[
                styles.primaryActionBtn,
                (submitting || (step === 3 && !selectedPro)) && styles.primaryActionBtnDisabled,
              ]}
              disabled={submitting || (step === 3 && !selectedPro)}
              accessibilityRole="button">
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.primaryActionBtnText}>
                  {step === 3
                    ? selectedPro
                      ? 'Confirm & Submit Request ✓'
                      : language === 'fr'
                      ? 'Sélectionnez un artisan'
                      : 'Select an Artisan to Continue'
                    : 'Continue →'}
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
    maxHeight: '94%',
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
    marginTop: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  stepContent: {
    paddingBottom: Spacing.xl,
  },
  stepTitle: {
    color: Palette.dark,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.dark,
    marginBottom: 6,
  },
  servicesGrid: {
    gap: Spacing.sm,
  },
  serviceCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    gap: Spacing.md,
  },
  serviceCardItemSelected: {
    borderColor: Palette.primary,
    backgroundColor: 'rgba(23, 105, 170, 0.05)',
  },
  serviceItemImg: {
    width: 48,
    height: 48,
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
    borderWidth: 1.5,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    padding: Spacing.md,
    fontSize: 14,
    color: Palette.mainText,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  urgencyChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    backgroundColor: Palette.surface,
  },
  urgencyChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  urgencyChipEmergency: {
    backgroundColor: Palette.errorRed,
    borderColor: Palette.errorRed,
  },
  urgencyChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
  },
  urgencyChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  photosRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  photoThumbWrap: {
    width: 80,
    height: 80,
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoCard: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surface,
  },
  addPhotoLabel: {
    fontSize: 10,
    color: Palette.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  inputWrapWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  textInputFlex: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: Palette.mainText,
  },
  suggestionsBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    marginTop: 4,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionText: {
    fontSize: 13,
    color: Palette.dark,
    flex: 1,
  },
  useMyLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  useMyLocationText: {
    fontSize: 13,
    color: Palette.primary,
    fontWeight: '600',
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  choiceChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.outline,
  },
  choiceChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  choiceChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
    textAlign: 'center',
  },
  choiceChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  flexibleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  flexibleOptionSelected: {
    borderColor: Palette.primary,
    backgroundColor: 'rgba(23, 105, 170, 0.05)',
  },
  flexibleText: {
    fontSize: 13,
    color: Palette.dark,
  },
  proList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  proPickCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    padding: Spacing.md,
  },
  proPickCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: 'rgba(23, 105, 170, 0.04)',
  },
  proPickTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacing.md,
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
    color: Palette.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  proMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  proRating: {
    fontSize: 12,
    color: Palette.dark,
    fontWeight: '600',
  },
  metaDot: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  proDistance: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  radioIndicator: {
    marginLeft: Spacing.sm,
  },
  proPickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  viewProProfileBtn: {
    paddingVertical: 4,
  },
  viewProProfileText: {
    fontSize: 12,
    color: Palette.primary,
    fontWeight: '600',
  },
  rateBadge: {
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  rateBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  noProsBox: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    marginVertical: Spacing.md,
    gap: Spacing.xs,
  },
  noProsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.dark,
    marginTop: Spacing.xs,
  },
  noProsSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    maxWidth: 280,
  },
  reviewSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    ...Shadows.subtle,
  },
  summaryCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
    marginBottom: Spacing.sm,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  reviewLabel: {
    fontSize: 13,
    color: Palette.secondaryText,
  },
  reviewValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.dark,
    maxWidth: '65%',
    textAlign: 'right',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  proReviewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(46, 125, 50, 0.08)',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.default,
    marginTop: Spacing.md,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 12,
    color: Palette.dark,
    lineHeight: 16,
  },
  submitErrorBanner: {
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
  submitErrorText: {
    color: Palette.errorRed,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  primaryActionBtn: {
    height: 50,
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.default,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionBtnDisabled: {
    opacity: 0.6,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
