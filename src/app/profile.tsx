import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Palette,
  Spacing,
  BorderRadius,
  BottomTabInset,
  MaxContentWidth,
  Shadows,
} from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { ProviderService, ProfessionTaxonomyItem } from "@/services/provider.service";
import { getDefaultCoverForProfession, PROFESSION_DEFAULT_COVERS } from "@/constants/professionAssets";
import LanguageModal from "@/components/LanguageModal";
import CountryFlag from "@/components/CountryFlag";
import UserAvatar from "@/components/UserAvatar";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    authStatus,
    activeRole,
    toggleActiveRole,
    openAuthModal,
    logout,
    openProviderActivation,
    serviceRequests,
    providerRequests,
    providerJobs,
    acceptProviderRequest,
    rejectProviderRequest,
    openRequestDetails,
    language,
    setLanguage,
    updateProvider,
    updatePersonalProfile,
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEditProviderModal, setShowEditProviderModal] = useState(false);
  const [showEditPersonalModal, setShowEditPersonalModal] = useState(false);
  const [editPersonalName, setEditPersonalName] = useState("");
  const [editPersonalPhone, setEditPersonalPhone] = useState("");
  const [editPersonalAvatar, setEditPersonalAvatar] = useState("");
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalError, setPersonalError] = useState<string | null>(null);

  const [professionsList, setProfessionsList] = useState<import("@/services/provider.service").ProfessionTaxonomyItem[]>([]);
  const [editProfession, setEditProfession] = useState("");
  const [editSpecializations, setEditSpecializations] = useState<string[]>([]);
  const [editLocation, setEditLocation] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editExperienceYears, setEditExperienceYears] = useState("5");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [activeInfoModal, setActiveInfoModal] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  const openEditPersonalModal = () => {
    setEditPersonalName(user.name || "");
    setEditPersonalPhone(user.phone || "");
    setEditPersonalAvatar(user.avatar || "");
    setPersonalError(null);
    setShowEditPersonalModal(true);
  };

  const pickPersonalImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPersonalError(isFrench ? "Permission d'accès aux photos requise." : "Photo library permission is required.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setEditPersonalAvatar(result.assets[0].uri);
        setPersonalError(null);
      }
    } catch (e) {
      console.warn("Image picker error:", e);
    }
  };

  const handleSavePersonalProfile = async () => {
    if (!editPersonalName.trim()) {
      setPersonalError(isFrench ? "Le nom complet est requis" : "Full name is required");
      return;
    }
    setPersonalSaving(true);
    setPersonalError(null);
    try {
      const res = await updatePersonalProfile({
        fullName: editPersonalName.trim(),
        phoneNumber: editPersonalPhone.trim(),
        avatar: editPersonalAvatar,
      });
      if (res.success) {
        setShowEditPersonalModal(false);
      } else {
        setPersonalError(res.message);
      }
    } catch (err: any) {
      setPersonalError(err.message || "Failed to update profile");
    } finally {
      setPersonalSaving(false);
    }
  };

  const isGuest = authStatus === "guest";
  const isFrench = language === "fr";
  const isProviderRole = user.isProvider && activeRole === "provider";

  // In Provider mode, show provider requests & jobs from backend; fallback to serviceRequests if empty
  const relevantRequests = isProviderRole && providerRequests.length > 0 ? providerRequests : serviceRequests;
  const newRequests = relevantRequests.filter((r) => r.status === "Sent");
  const activeJobs = isProviderRole && providerJobs.length > 0
    ? providerJobs.filter((j: any) => j.status === 'accepted' || j.status === 'in_progress')
    : serviceRequests.filter((r) => r.status === "Accepted" || r.status === "In Progress");
  const completedJobs = isProviderRole && providerJobs.length > 0
    ? providerJobs.filter((j: any) => j.status === 'completed')
    : serviceRequests.filter((r) => r.status === "Completed");

  const handleHelpCenter = () => {
    setActiveInfoModal({
      title: isFrench ? "Centre d’aide & FAQ" : "Help Center & FAQ",
      content: isFrench
        ? "1. Comment réserver un artisan ?\nParcourez les services ou l'onglet Explorer, sélectionnez un professionnel certifié et cliquez sur 'Demander un service'.\n\n2. Comment fonctionne le paiement ?\nLes devis sont transparents. Le paiement s'effectue directement ou de manière sécurisée une fois le travail validé.\n\n3. Quelle est la garantie ArtisanLink ?\nTous nos artisans sont rigoureusement vérifiés (qualifications, assurances et références clients)."
        : '1. How do I book a professional?\nBrowse services or the Explore tab, choose a verified artisan, and tap "Request Service".\n\n2. How do payments work?\nQuotes are clear and transparent. Payment is handled directly or securely once the job is approved.\n\n3. What is the ArtisanLink Guarantee?\nAll artisans undergo credential checks, background verification, and verified customer review assessments.',
    });
  };

  const handleContactSupport = () => {
    setActiveInfoModal({
      title: isFrench ? "Contacter le Support" : "Contact Support",
      content: isFrench
        ? "Notre équipe d'assistance est à votre écoute 7j/7.\n\n📧 Email : support@artisanlink.com\n📞 Téléphone : +1 (800) 278-4726\n💬 Chat d'aide : disponible de 08h à 20h\n\nTemps de réponse habituel : moins de 15 minutes."
        : "Our customer support team is available 7 days a week.\n\n📧 Email: support@artisanlink.com\n📞 Phone: +1 (800) 278-4726\n💬 Live Chat: Mon-Sun 8:00 AM - 8:00 PM\n\nTypical response time: under 15 minutes.",
    });
  };

  const handleAboutArtisanLink = () => {
    setActiveInfoModal({
      title: "ArtisanLink",
      content: isFrench
        ? "ArtisanLink est la plateforme de référence connectant propriétaires et professionnels du bâtiment et des services artisanaux.\n\nNotre mission : rendre les travaux du quotidien simples, sûrs et transparents en valorisant les artisans locaux qualifiés."
        : "ArtisanLink is the premier marketplace connecting homeowners with certified local craftspeople, tradespeople, and artisans.\n\nOur mission is to make home maintenance and specialized craft services transparent, reliable, and effortless.",
    });
  };

  const handleTermsAndPrivacy = (type: "terms" | "privacy") => {
    setActiveInfoModal({
      title:
        type === "terms"
          ? isFrench
            ? "Conditions Générales"
            : "Terms of Service"
          : isFrench
            ? "Politique de Confidentialité"
            : "Privacy Policy",
      content: isFrench
        ? "En utilisant ArtisanLink, vous bénéficiez de garanties de protection des données conformes aux normes de sécurité les plus strictes. Vos coordonnées ne sont partagées avec les artisans que lors de la confirmation d’une intervention."
        : "By using ArtisanLink, your data is protected under modern encryption standards. Contact and location information is only shared with confirmed artisans upon booking.",
    });
  };

  useEffect(() => {
    ProviderService.getProfessions().then((res) => {
      if (res.data && res.data.length > 0) {
        setProfessionsList(res.data);
      }
    });
  }, []);

  const openEditProviderModal = () => {
    const prof = user.providerProfile?.profession || professionsList[0]?.profession || "Plumber";
    setEditProfession(prof);
    setEditSpecializations(user.providerProfile?.specializations || []);
    setEditLocation(user.providerProfile?.location || "");
    setEditCoverImage(user.providerProfile?.coverImage || getDefaultCoverForProfession(prof));
    setEditBio(user.providerProfile?.description || "");
    setEditExperienceYears(String(user.providerProfile?.experienceYears || 5));
    setEditError(null);
    setShowEditProviderModal(true);
  };

  const handleProfessionChange = (newProf: string) => {
    setEditProfession(newProf);
    setEditCoverImage(getDefaultCoverForProfession(newProf));
    const item = professionsList.find((p) => p.profession.toLowerCase() === newProf.toLowerCase());
    if (item && item.specializations.length > 0) {
      setEditSpecializations([item.specializations[0]]);
    } else {
      setEditSpecializations([]);
    }
  };

  const toggleEditSpecialization = (spec: string) => {
    if (editSpecializations.includes(spec)) {
      if (editSpecializations.length > 1) {
        setEditSpecializations(editSpecializations.filter((s) => s !== spec));
      }
    } else {
      setEditSpecializations([...editSpecializations, spec]);
    }
  };

  const handleSaveProviderProfile = async () => {
    if (!editLocation.trim()) {
      setEditError(
        isFrench
          ? "Veuillez renseigner votre localisation (zone d'intervention)."
          : "Please enter your service location."
      );
      return;
    }
    if (!editProfession.trim()) {
      setEditError(
        isFrench
          ? "Veuillez sélectionner un corps de métier."
          : "Please select a profession."
      );
      return;
    }
    if (editSpecializations.length === 0) {
      setEditError(
        isFrench
          ? "Veuillez sélectionner au moins une spécialisation."
          : "Please select at least one specialization."
      );
      return;
    }

    setEditSaving(true);
    setEditError(null);
    try {
      const res = await updateProvider({
        profession: editProfession,
        specializations: editSpecializations,
        location: editLocation.trim(),
        description: editBio.trim(),
        experienceYears: Number(editExperienceYears) || 1,
        coverImage: editCoverImage.trim() || getDefaultCoverForProfession(editProfession),
      });

      if (res.success) {
        setShowEditProviderModal(false);
        Alert.alert(
          isFrench ? "Profil mis à jour" : "Profile Updated",
          isFrench
            ? "Votre profil prestataire a été mis à jour avec succès."
            : "Your provider profile has been successfully updated."
        );
      } else {
        setEditError(res.message);
      }
    } catch (err: any) {
      setEditError(err.message || "Failed to update profile");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeftWrap}>
            <View style={styles.brandIconBadge}>
              <Ionicons
                name={isProviderRole ? "construct" : "person"}
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.titleHierarchy}>
              <ThemedText style={styles.eyebrowTag}>
                {isProviderRole ? "PRO DASHBOARD" : "ACCOUNT & SETTINGS"}
              </ThemedText>
              <ThemedText style={styles.screenTitle}>
                {isFrench ? "Compte & Paramètres" : "Account & Settings"}
              </ThemedText>
            </View>
          </View>

          {/* Right Action: Language Selector Button */}
          <Pressable
            onPress={() => setShowLanguageModal(true)}
            style={styles.langBtn}
            accessibilityLabel="Change language"
            accessibilityRole="button"
          >
            <CountryFlag country={language} size={18} />
            <ThemedText style={styles.langCodeText}>
              {language === "fr" ? "FR" : "EN"}
            </ThemedText>
            <Ionicons
              name="chevron-down"
              size={11}
              color={Palette.secondaryText}
            />
          </Pressable>
        </View>

        {/* Dual Role Segmented Tab Bar (when user is a provider) */}
        {!isGuest && user.isProvider && (
          <View style={styles.segmentedTabWrapper}>
            <View style={styles.segmentedTabContainer}>
              <Pressable
                onPress={() => activeRole !== "customer" && toggleActiveRole()}
                style={[
                  styles.segmentTabBtn,
                  !isProviderRole && styles.segmentTabBtnActive,
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: !isProviderRole }}
              >
                <Ionicons
                  name="person"
                  size={15}
                  color={!isProviderRole ? Palette.primary : Palette.secondaryText}
                />
                <ThemedText
                  style={[
                    styles.segmentTabLabel,
                    !isProviderRole && styles.segmentTabLabelActive,
                  ]}
                >
                  {isFrench ? "Vue Client" : "Customer View"}
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => activeRole !== "provider" && toggleActiveRole()}
                style={[
                  styles.segmentTabBtn,
                  isProviderRole && styles.segmentTabBtnActive,
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: isProviderRole }}
              >
                <Ionicons
                  name="construct"
                  size={15}
                  color={isProviderRole ? Palette.primary : Palette.secondaryText}
                />
                <ThemedText
                  style={[
                    styles.segmentTabLabel,
                    isProviderRole && styles.segmentTabLabelActive,
                  ]}
                >
                  {isFrench ? "Vue Prestataire" : "Provider View"}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. GUEST USER HEADER / SIGN-IN CALLOUT */}
          {isGuest ? (
            <View style={styles.guestCard}>
              <View style={styles.guestAvatarWrap}>
                <Ionicons
                  name="person-circle-outline"
                  size={54}
                  color={Palette.primary}
                />
              </View>
              <View style={styles.guestInfo}>
                <ThemedText type="headlineMd" style={styles.guestTitle}>
                  {isFrench
                    ? "Bienvenue sur ArtisanLink"
                    : "Welcome to ArtisanLink"}
                </ThemedText>
                <ThemedText style={styles.guestSub}>
                  {isFrench
                    ? "Connectez-vous pour suivre vos demandes et échanger avec les artisans."
                    : "Sign in or register to book services, message artisans, and manage orders."}
                </ThemedText>
              </View>
              <Pressable
                onPress={() => openAuthModal()}
                style={styles.signInPrimaryBtn}
              >
                <ThemedText style={styles.signInPrimaryBtnText}>
                  {isFrench
                    ? "Se connecter / Créer un compte"
                    : "Sign In / Create Account"}
                </ThemedText>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : isProviderRole ? (
            /* 2. PROVIDER DASHBOARD VIEW */
            <View style={styles.dashboardSection}>
              <View style={styles.providerGreetingRow}>
                <ThemedText type="headlineMd" style={styles.greetingHeader}>
                  {isFrench ? "Bonjour" : "Good morning"},{" "}
                  {user.name.split(" ")[0]} 👋
                </ThemedText>
                <Pressable
                  onPress={openEditProviderModal}
                  style={styles.editProfilePillBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Edit Provider Profile"
                >
                  <Ionicons name="create-outline" size={14} color={Palette.primary} />
                  <ThemedText style={styles.editProfilePillText}>
                    {isFrench ? "Modifier mon profil" : "Edit Profile"}
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.statsGrid}>
                {/* 1. New Requests */}
                <View style={styles.statCard}>
                  <View style={styles.statCardHeader}>
                    <View style={[styles.statIconBadge, { backgroundColor: '#EFF6FF' }]}>
                      <Ionicons name="mail-unread" size={17} color={Palette.primary} />
                    </View>
                    <View style={[styles.statMicroBadge, { backgroundColor: '#EFF6FF' }]}>
                      <ThemedText style={[styles.statMicroBadgeText, { color: Palette.primary }]}>
                        {newRequests.length > 0 ? "ACTION" : "INBOX"}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.statNumber}>{newRequests.length}</ThemedText>
                  <ThemedText style={styles.statTitle}>
                    {isFrench ? "Nouvelles demandes" : "New Requests"}
                  </ThemedText>
                </View>

                {/* 2. Active Jobs */}
                <View style={styles.statCard}>
                  <View style={styles.statCardHeader}>
                    <View style={[styles.statIconBadge, { backgroundColor: '#FFF7ED' }]}>
                      <Ionicons name="construct" size={17} color={Palette.accent} />
                    </View>
                    <View style={[styles.statMicroBadge, { backgroundColor: '#FFEDD5' }]}>
                      <ThemedText style={[styles.statMicroBadgeText, { color: '#C2410C' }]}>
                        ACTIVE
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.statNumber}>{activeJobs.length}</ThemedText>
                  <ThemedText style={styles.statTitle}>
                    {isFrench ? "Missions en cours" : "Active Jobs"}
                  </ThemedText>
                </View>

                {/* 3. Completed Jobs */}
                <View style={styles.statCard}>
                  <View style={styles.statCardHeader}>
                    <View style={[styles.statIconBadge, { backgroundColor: '#ECFDF5' }]}>
                      <Ionicons name="checkmark-done-circle" size={18} color="#059669" />
                    </View>
                    <View style={[styles.statMicroBadge, { backgroundColor: '#D1FAE5' }]}>
                      <ThemedText style={[styles.statMicroBadgeText, { color: '#047857' }]}>
                        VERIFIED
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.statNumber}>{completedJobs.length + 28}</ThemedText>
                  <ThemedText style={styles.statTitle}>
                    {isFrench ? "Terminées" : "Completed"}
                  </ThemedText>
                </View>

                {/* 4. Rating */}
                <View style={styles.statCard}>
                  <View style={styles.statCardHeader}>
                    <View style={[styles.statIconBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Ionicons name="star" size={17} color="#D97706" />
                    </View>
                    <View style={[styles.statMicroBadge, { backgroundColor: '#FEF3C7' }]}>
                      <ThemedText style={[styles.statMicroBadgeText, { color: '#B45309' }]}>
                        TOP RATED
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.ratingNumberRow}>
                    <ThemedText style={styles.statNumber}>4.8</ThemedText>
                    <Ionicons name="star" size={17} color={Palette.gold} style={{ marginLeft: 3 }} />
                  </View>
                  <ThemedText style={styles.statTitle}>
                    {isFrench ? "Note globale" : "Rating"}
                  </ThemedText>
                </View>
              </View>

              {/* Incoming requests preview */}
              <View style={[styles.sectionHeader, { marginTop: Spacing.sm }]}>
                <ThemedText type="headlineMd" style={styles.sectionTitle}>
                  {isFrench
                    ? "Demandes de service récentes"
                    : "Recent Service Requests"}
                </ThemedText>
              </View>

              {newRequests.length === 0 ? (
                <View style={styles.emptyRequestsCard}>
                  <Ionicons
                    name="checkmark-done-circle-outline"
                    size={28}
                    color={Palette.success}
                  />
                  <ThemedText style={styles.emptyRequestsText}>
                    {isFrench
                      ? "Toutes les demandes sont traitées."
                      : "All pending requests handled."}
                  </ThemedText>
                </View>
              ) : (
                newRequests.slice(0, 3).map((req) => (
                  <View key={req.id} style={styles.providerReqCard}>
                    <View style={styles.reqTop}>
                      <View style={styles.reqCategoryBadge}>
                        <ThemedText style={styles.reqCategoryText}>
                          {req.serviceCategory}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.reqDate}>{req.date}</ThemedText>
                    </View>
                    <ThemedText style={styles.reqTitle}>
                      {req.serviceName}
                    </ThemedText>
                    <ThemedText style={styles.reqDesc} numberOfLines={2}>
                      {req.problemDescription}
                    </ThemedText>

                    {/* Action buttons */}
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                      <Pressable
                        onPress={() => {
                          Alert.alert(
                            isFrench ? "Accepter la demande" : "Accept Request",
                            isFrench ? "Voulez-vous accepter cette demande et créer la mission ?" : "Do you want to accept this request and start the job?",
                            [
                              { text: isFrench ? "Annuler" : "Cancel", style: "cancel" },
                              {
                                text: isFrench ? "Accepter" : "Accept",
                                onPress: async () => {
                                  const res = await acceptProviderRequest(req.id);
                                  Alert.alert(res.success ? "Success" : "Notice", res.message);
                                },
                              },
                            ]
                          );
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: Palette.primary,
                          paddingVertical: 9,
                          borderRadius: 8,
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          gap: 6,
                        }}>
                        <Ionicons name="checkmark-circle" size={15} color="#FFFFFF" />
                        <ThemedText style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                          {isFrench ? "Accepter" : "Accept"}
                        </ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          Alert.alert(
                            isFrench ? "Refuser la demande" : "Decline Request",
                            isFrench ? "Êtes-vous sûr de vouloir refuser cette demande ?" : "Are you sure you want to decline this request?",
                            [
                              { text: isFrench ? "Annuler" : "Cancel", style: "cancel" },
                              {
                                text: isFrench ? "Refuser" : "Decline",
                                style: "destructive",
                                onPress: async () => {
                                  const res = await rejectProviderRequest(req.id);
                                  Alert.alert(res.success ? "Success" : "Notice", res.message);
                                },
                              },
                            ]
                          );
                        }}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 9,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: Palette.outline,
                          backgroundColor: Palette.surface,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ThemedText style={{ color: Palette.secondaryText, fontSize: 13, fontWeight: '600' }}>
                          {isFrench ? "Refuser" : "Decline"}
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            /* 3. AUTHENTICATED CUSTOMER PROFILE CARD */
            <View style={styles.userCard}>
              <View style={styles.userAvatarContainer}>
                <UserAvatar uri={user.avatar} size={64} iconSize={30} />
                <Pressable
                  onPress={openEditPersonalModal}
                  style={styles.avatarEditBadge}
                  accessibilityRole="button"
                  accessibilityLabel="Edit profile photo">
                  <Ionicons name="camera" size={12} color="#FFFFFF" />
                </Pressable>
              </View>

              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <ThemedText style={styles.userName} numberOfLines={1}>
                    {user.name ? user.name.trim().split(/\s+/).slice(0, 2).join(' ') : 'User'}
                  </ThemedText>
                  <Pressable
                    onPress={openEditPersonalModal}
                    style={styles.editPersonalIconBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Edit profile details">
                    <Ionicons name="create-outline" size={16} color={Palette.primary} />
                  </Pressable>
                </View>

                {/* Info Chips / Badges with icons */}
                <View style={styles.userMetaBadgesWrap}>
                  {user.phone ? (
                    <View style={styles.userMetaChip}>
                      <Ionicons name="call-outline" size={13} color={Palette.primary} />
                      <ThemedText style={styles.userMetaText} numberOfLines={1}>
                        {user.phone}
                      </ThemedText>
                    </View>
                  ) : null}

                  {user.email ? (
                    <View style={styles.userMetaChip}>
                      <Ionicons name="mail-outline" size={13} color={Palette.primary} />
                      <ThemedText style={styles.userMetaText} numberOfLines={1}>
                        {user.email}
                      </ThemedText>
                    </View>
                  ) : null}

                  {user.providerProfile?.location ? (
                    <View style={styles.userMetaChip}>
                      <Ionicons name="location-outline" size={13} color={Palette.primary} />
                      <ThemedText style={styles.userMetaText} numberOfLines={1}>
                        {user.providerProfile.location}
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          )}

          {/* 4. SURFACE 2: PROVIDER STATUS CARD (COOL BLUE STYLE) */}
          {user.isProvider && !isGuest ? (
            <View style={styles.providerBlueCard}>
              <View style={styles.providerBlueTopRow}>
                {/* Brand Badge in Artisan Blue */}
                <View style={styles.providerBlueIconCircle}>
                  <Ionicons
                    name="construct"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.providerBlueMainInfo}>
                  <View style={styles.providerTitleStatusRow}>
                    <ThemedText style={styles.providerTradeTitle}>
                      {user.providerProfile?.profession || 'Plumber'}
                    </ThemedText>

                    {/* Status badge pill in theme blue/soft amber */}
                    <View
                      style={[
                        styles.statusPillChip,
                        user.providerProfile?.verificationStatus === 'approved'
                          ? styles.statusPillChipApproved
                          : styles.statusPillChipPending,
                      ]}
                    >
                      <View
                        style={[
                          styles.statusPillDotIndicator,
                          user.providerProfile?.verificationStatus === 'approved'
                            ? styles.statusDotApproved
                            : styles.statusDotPending,
                        ]}
                      />
                      <ThemedText
                        style={[
                          styles.statusPillChipText,
                          user.providerProfile?.verificationStatus === 'approved'
                            ? styles.statusTextApproved
                            : styles.statusTextPending,
                        ]}
                      >
                        {user.providerProfile?.verificationStatus === 'approved'
                          ? isFrench
                            ? 'Vérifié'
                            : 'Verified'
                          : isFrench
                          ? 'Vérification en attente'
                          : 'Verification Pending'}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.providerBlueDescription}>
                    {user.providerProfile?.verificationStatus === 'approved'
                      ? isFrench
                        ? 'Votre profil artisan est validé pour recevoir des missions.'
                        : 'Your pro profile is active and ready for client jobs.'
                      : isFrench
                        ? 'Examen administrateur en cours. Vous recevrez une alerte sous peu.'
                        : 'Administrator review in progress. You will be alerted once active.'}
                  </ThemedText>
                </View>

                {/* Edit Button */}
                <Pressable
                  onPress={openEditProviderModal}
                  style={styles.providerBlueEditBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Edit Profile"
                >
                  <Ionicons name="create-outline" size={18} color={Palette.primary} />
                </Pressable>
              </View>

              {/* Detail meta row with blue theme styling */}
              <View style={styles.providerBlueMetaBar}>
                <View style={styles.metaChip}>
                  <Ionicons name="location-outline" size={13} color={Palette.primary} />
                  <ThemedText style={styles.metaChipText}>
                    {user.providerProfile?.location || 'Central District'}
                  </ThemedText>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaChip}>
                  <Ionicons name="ribbon-outline" size={13} color={Palette.primary} />
                  <ThemedText style={styles.metaChipText}>
                    {user.providerProfile?.experienceYears || 5} {isFrench ? 'ans d’expérience' : 'years experience'}
                  </ThemedText>
                </View>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => {
                if (isGuest) {
                  openAuthModal(() => openProviderActivation(), 'signup');
                } else {
                  openProviderActivation();
                }
              }}
              style={styles.becomeSellerCard}
              accessibilityRole="button"
              accessibilityLabel={
                isFrench
                  ? "Devenir vendeur de services"
                  : "Become a Service Seller"
              }
            >
              <View style={styles.sellerCardIconCircle}>
                <Ionicons name="storefront-outline" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.becomeSellerTitle}>
                  {isFrench
                    ? "Devenir vendeur de services"
                    : "Become a Service Seller"}
                </ThemedText>
                <ThemedText style={styles.becomeSellerSub}>
                  {isFrench
                    ? "Proposez vos compétences à la communauté"
                    : "Offer your skills to the community"}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Palette.primary}
              />
            </Pressable>
          )}

          {/* 5. USER ACTIVITY SHORTCUTS (Only when logged in) */}
          {!isGuest && (
            <View style={styles.menuSection}>
              <View style={styles.menuSectionHeader}>
                <ThemedText style={styles.menuSectionTitle}>
                  {isFrench ? "Mes Activités" : "My Activity"}
                </ThemedText>
              </View>

              <Pressable
                onPress={() => router.push("/bookings")}
                style={styles.menuItem}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons
                    name="clipboard-outline"
                    size={20}
                    color={Palette.primary}
                  />
                  <ThemedText style={styles.menuItemText}>
                    {isFrench
                      ? "Mes demandes de service"
                      : "My Service Requests"}
                  </ThemedText>
                </View>
                {serviceRequests.length > 0 && (
                  <View style={styles.countPill}>
                    <ThemedText style={styles.countPillText}>
                      {serviceRequests.length}
                    </ThemedText>
                  </View>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Palette.secondaryText}
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  Alert.alert(
                    isFrench ? "Mes Avis" : "My Reviews",
                    isFrench
                      ? "Vous avez 4 avis vérifiés déposés."
                      : "You have 4 verified reviews submitted.",
                  )
                }
                style={styles.menuItem}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons
                    name="star-outline"
                    size={20}
                    color={Palette.primary}
                  />
                  <ThemedText style={styles.menuItemText}>
                    {isFrench
                      ? "Mes avis & évaluations"
                      : "My Reviews & Ratings"}
                  </ThemedText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Palette.secondaryText}
                />
              </Pressable>
            </View>
          )}

          {/* 6. SETTINGS SECTION */}
          <View style={styles.menuSection}>
            <View style={styles.menuSectionHeader}>
              <ThemedText style={styles.menuSectionTitle}>
                {isFrench ? "Paramètres" : "Settings"}
              </ThemedText>
            </View>

            {/* Language Preference */}
            <Pressable
              onPress={() => setShowLanguageModal(true)}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <CountryFlag country={language} size={20} />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? "Langue de l’application" : "App Language"}
                </ThemedText>
              </View>
              <View style={styles.menuItemRightValue}>
                <ThemedText style={styles.valueText}>
                  {language === "fr" ? "Français" : "English"}
                </ThemedText>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Palette.secondaryText}
                />
              </View>
            </Pressable>

            {/* Push Notifications Toggle */}
            <Pressable
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={Palette.primary}
                />
                <ThemedText style={styles.menuItemText}>
                  {isFrench
                    ? "Notifications d’intervention"
                    : "Service Notifications"}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.toggleBadge,
                  notificationsEnabled && styles.toggleBadgeActive,
                ]}
              >
                <ThemedText
                  style={[
                    styles.toggleBadgeText,
                    notificationsEnabled && styles.toggleBadgeTextActive,
                  ]}
                >
                  {notificationsEnabled
                    ? isFrench
                      ? "Activé"
                      : "Enabled"
                    : isFrench
                      ? "Désactivé"
                      : "Disabled"}
                </ThemedText>
              </View>
            </Pressable>

            {/* Theme / Appearance */}
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color={Palette.primary}
                />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? "Thème visuel" : "Appearance"}
                </ThemedText>
              </View>
              <ThemedText style={styles.valueText}>
                {isFrench ? "Système / Clair" : "Light / System"}
              </ThemedText>
            </View>
          </View>

          {/* 7. HELP & SUPPORT SECTION */}
          <View style={styles.menuSection}>
            <View style={styles.menuSectionHeader}>
              <ThemedText style={styles.menuSectionTitle}>
                {isFrench ? "Aide & Assistance" : "Help & Support"}
              </ThemedText>
            </View>

            <Pressable onPress={handleHelpCenter} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={Palette.primary}
                />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? "Centre d’aide & FAQ" : "Help Center & FAQ"}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Palette.secondaryText}
              />
            </Pressable>

            <Pressable onPress={handleContactSupport} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="headset-outline"
                  size={20}
                  color={Palette.primary}
                />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? "Contacter le support client" : "Contact Support"}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Palette.secondaryText}
              />
            </Pressable>
          </View>

          {/* 8. ABOUT SECTION */}
          <View style={styles.menuSection}>
            <View style={styles.menuSectionHeader}>
              <ThemedText style={styles.menuSectionTitle}>
                {isFrench ? "À Propos" : "About"}
              </ThemedText>
            </View>

            <Pressable onPress={handleAboutArtisanLink} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={Palette.primary}
                />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? "À propos d’ArtisanLink" : "About ArtisanLink"}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Palette.secondaryText}
              />
            </Pressable>

            <Pressable
              onPress={() => handleTermsAndPrivacy("terms")}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={Palette.primary}
                />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? "Conditions d’utilisation" : "Terms of Service"}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Palette.secondaryText}
              />
            </Pressable>

            <Pressable
              onPress={() => handleTermsAndPrivacy("privacy")}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={Palette.primary}
                />
                <ThemedText style={styles.menuItemText}>
                  {isFrench ? "Politique de confidentialité" : "Privacy Policy"}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Palette.secondaryText}
              />
            </Pressable>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={20}
                  color={Palette.secondaryText}
                />
                <ThemedText
                  style={[
                    styles.menuItemText,
                    { color: Palette.secondaryText },
                  ]}
                >
                  {isFrench ? "Version de l’application" : "App Version"}
                </ThemedText>
              </View>
              <ThemedText style={styles.valueText}>
                v1.0.0 (Build 42)
              </ThemedText>
            </View>
          </View>

          {/* 9. DANGER ZONE (GitHub-style Account Deletion for Customer and Provider) */}
          {!isGuest && (
            <View style={styles.dangerZoneCard}>
              <View style={styles.dangerZoneHeader}>
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color={Palette.errorRed}
                />
                <ThemedText style={styles.dangerZoneTitle}>
                  {isFrench ? "Zone de Danger" : "Danger Zone"}
                </ThemedText>
              </View>

              <View style={styles.dangerZoneContentRow}>
                <View style={styles.dangerZoneTextWrap}>
                  <ThemedText style={styles.dangerItemHeading}>
                    {isFrench
                      ? isProviderRole
                        ? "Supprimer le compte artisan"
                        : "Supprimer le compte client"
                      : isProviderRole
                        ? "Delete provider account"
                        : "Delete customer account"}
                  </ThemedText>
                  <ThemedText style={styles.dangerItemSub}>
                    {isFrench
                      ? "Une fois supprimé, toutes vos réservations, avis et données d’intervention seront définitivement effacés."
                      : "Once you delete your account, all active requests, profile history, and verification records are gone forever."}
                  </ThemedText>
                </View>

                <Pressable
                  onPress={() => {
                    setDeleteConfirmInput("");
                    setShowDeleteModal(true);
                  }}
                  style={styles.dangerDeleteBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Delete Account"
                >
                  <ThemedText style={styles.dangerDeleteBtnText}>
                    {isFrench ? "Supprimer" : "Delete account"}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          )}

          {/* 10. LOGOUT (Only when authenticated) */}
          {!isGuest && (
            <Pressable onPress={logout} style={styles.logoutBtn}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={Palette.errorRed}
              />
              <ThemedText style={styles.logoutBtnText}>
                {isFrench ? "Se déconnecter" : "Log Out"}
              </ThemedText>
            </Pressable>
          )}
        </ScrollView>

        {/* Language Modal */}
        <LanguageModal
          visible={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
        />

        {/* Info Modal for Help/About */}
        <Modal
          visible={!!activeInfoModal}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveInfoModal(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setActiveInfoModal(null)}
          >
            <Pressable
              style={styles.modalSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalSheetTitle}>
                  {activeInfoModal?.title}
                </ThemedText>
                <Pressable onPress={() => setActiveInfoModal(null)} hitSlop={8}>
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>
              <ScrollView style={{ maxHeight: 350 }}>
                <ThemedText style={styles.modalSheetContent}>
                  {activeInfoModal?.content}
                </ThemedText>
              </ScrollView>
              <Pressable
                onPress={() => setActiveInfoModal(null)}
                style={styles.modalDoneBtn}
              >
                <ThemedText style={styles.modalDoneBtnText}>
                  {isFrench ? "Fermer" : "Close"}
                </ThemedText>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {/* GitHub-style Delete Account Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowDeleteModal(false)}
          >
            <Pressable
              style={styles.githubDeleteModalCard}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View style={styles.githubDeleteHeader}>
                <View style={styles.githubDeleteHeaderTitleRow}>
                  <Ionicons name="warning" size={20} color={Palette.errorRed} />
                  <ThemedText style={styles.githubDeleteTitle}>
                    {isFrench
                      ? "Êtes-vous absolument sûr ?"
                      : "Are you absolutely sure?"}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => setShowDeleteModal(false)}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>

              {/* Body Warning Callout */}
              <View style={styles.githubWarningCallout}>
                <ThemedText style={styles.githubWarningCalloutText}>
                  {isFrench
                    ? "Attention : Cette action est irréversible. Toutes vos données, avis, factures et profil seront supprimés de manière permanente."
                    : "Unexpected bad things will happen if you don’t read this!\n\nThis will permanently delete your account, bookings, service history, and remove all associated data."}
                </ThemedText>
              </View>

              {/* Confirmation Requirement */}
              <View style={styles.githubConfirmPromptWrap}>
                <ThemedText style={styles.githubConfirmPrompt}>
                  {isFrench
                    ? 'Veuillez saisir votre nom ou "DELETE" pour confirmer :'
                    : 'Please type "DELETE" to confirm:'}
                </ThemedText>
                <TextInput
                  style={styles.githubConfirmInput}
                  value={deleteConfirmInput}
                  onChangeText={setDeleteConfirmInput}
                  placeholder="DELETE"
                  placeholderTextColor={Palette.secondaryText}
                  autoCapitalize="characters"
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.githubDeleteActionRow}>
                <Pressable
                  onPress={() => {
                    if (
                      deleteConfirmInput.trim().toUpperCase() === "DELETE" ||
                      deleteConfirmInput.trim() === user.name
                    ) {
                      setShowDeleteModal(false);
                      setDeleteConfirmInput("");
                      logout();
                      Alert.alert(
                        isFrench ? "Compte supprimé" : "Account Deleted",
                        isFrench
                          ? "Votre compte et toutes vos données ont été définitivement supprimés."
                          : "Your account and all associated data have been permanently deleted.",
                      );
                    } else {
                      Alert.alert(
                        isFrench
                          ? "Confirmation requise"
                          : "Confirmation Required",
                        isFrench
                          ? 'Veuillez saisir "DELETE" pour confirmer la suppression.'
                          : 'Please type "DELETE" to confirm deletion.',
                      );
                    }
                  }}
                  style={[
                    styles.githubConfirmDeleteBtn,
                    deleteConfirmInput.trim().toUpperCase() !== "DELETE" &&
                      deleteConfirmInput.trim() !== user.name &&
                      styles.githubConfirmDeleteBtnDisabled,
                  ]}
                >
                  <ThemedText style={styles.githubConfirmDeleteBtnText}>
                    {isFrench
                      ? "Je comprends les conséquences, supprimer mon compte"
                      : "I understand the consequences, delete my account"}
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmInput("");
                  }}
                  style={styles.githubCancelDeleteBtn}
                >
                  <ThemedText style={styles.githubCancelDeleteBtnText}>
                    {isFrench ? "Annuler" : "Cancel"}
                  </ThemedText>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Edit Provider Profile Modal */}
        <Modal
          visible={showEditProviderModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEditProviderModal(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowEditProviderModal(false)}
          >
            <Pressable
              style={styles.editModalSheet}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="construct" size={20} color={Palette.primary} />
                  <ThemedText style={styles.modalSheetTitle}>
                    {isFrench
                      ? "Modifier le profil prestataire"
                      : "Edit Provider Profile"}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => setShowEditProviderModal(false)}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>

              <ScrollView
                style={{ maxHeight: 480 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.lg }}
              >
                {/* Error Banner if any */}
                {editError && (
                  <View style={styles.editErrorBanner}>
                    <Ionicons name="alert-circle" size={18} color={Palette.errorRed} />
                    <ThemedText style={styles.editErrorText}>
                      {editError}
                    </ThemedText>
                  </View>
                )}

                {/* 1. LOCATION (MANDATORY) */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelRow}>
                    <ThemedText style={styles.inputLabel}>
                      {isFrench ? "Zone d'intervention / Localisation" : "Service Location / City"}
                    </ThemedText>
                    <ThemedText style={styles.mandatoryBadge}>*</ThemedText>
                  </View>
                  <ThemedText style={styles.inputHelp}>
                    {isFrench
                      ? "Ex: Paris 15e, Lyon, Dakar, Yaoundé, etc."
                      : "e.g. Central District, Brooklyn (25km coverage)"}
                  </ThemedText>
                  <View style={styles.inputWrap}>
                    <Ionicons name="location-outline" size={18} color={Palette.secondaryText} />
                    <TextInput
                      style={styles.textInput}
                      placeholder={isFrench ? "Entrez votre localisation..." : "Enter your service location..."}
                      placeholderTextColor={Palette.secondaryText}
                      value={editLocation}
                      onChangeText={setEditLocation}
                    />
                  </View>
                </View>

                {/* 2. PROFESSION (MANDATORY) */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelRow}>
                    <ThemedText style={styles.inputLabel}>
                      {isFrench ? "Corps de métier (Profession)" : "Profession / Trade"}
                    </ThemedText>
                    <ThemedText style={styles.mandatoryBadge}>*</ThemedText>
                  </View>
                  <ThemedText style={styles.inputHelp}>
                    {isFrench
                      ? "Sélectionnez votre activité principale"
                      : "Select your primary craft or trade"}
                  </ThemedText>

                  <View style={styles.professionsGrid}>
                    {professionsList.map((item) => {
                      const isSelected =
                        editProfession.toLowerCase() === item.profession.toLowerCase();
                      return (
                        <Pressable
                          key={item.profession}
                          onPress={() => handleProfessionChange(item.profession)}
                          style={[
                            styles.professionChip,
                            isSelected && styles.professionChipSelected,
                          ]}
                        >
                          <Ionicons
                            name={
                              item.profession.toLowerCase().includes("plumb")
                                ? "water"
                                : item.profession.toLowerCase().includes("electr")
                                ? "flash"
                                : item.profession.toLowerCase().includes("paint")
                                ? "color-palette"
                                : "construct"
                            }
                            size={14}
                            color={isSelected ? "#FFFFFF" : Palette.primary}
                          />
                          <ThemedText
                            style={[
                              styles.professionChipText,
                              isSelected && styles.professionChipTextSelected,
                            ]}
                          >
                            {item.profession}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* 3. SPECIALIZATIONS (MANDATORY) */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelRow}>
                    <ThemedText style={styles.inputLabel}>
                      {isFrench ? "Spécialisations (Expertises)" : "Specializations"}
                    </ThemedText>
                    <ThemedText style={styles.mandatoryBadge}>*</ThemedText>
                  </View>
                  <ThemedText style={styles.inputHelp}>
                    {isFrench
                      ? "Choisissez au moins une compétence liée à votre métier"
                      : "Choose at least one skill relevant to your trade"}
                  </ThemedText>

                  <View style={styles.specChipsWrap}>
                    {(
                      professionsList.find(
                        (p) => p.profession.toLowerCase() === editProfession.toLowerCase()
                      )?.specializations || []
                    ).map((spec) => {
                      const isSelected = editSpecializations.includes(spec);
                      return (
                        <Pressable
                          key={spec}
                          onPress={() => toggleEditSpecialization(spec)}
                          style={[
                            styles.specChip,
                            isSelected && styles.specChipSelected,
                          ]}
                        >
                          <Ionicons
                            name={isSelected ? "checkmark-circle" : "add-circle-outline"}
                            size={14}
                            color={isSelected ? "#FFFFFF" : Palette.secondaryText}
                          />
                          <ThemedText
                            style={[
                              styles.specChipText,
                              isSelected && styles.specChipTextSelected,
                            ]}
                          >
                            {spec}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* 4. YEARS OF EXPERIENCE */}
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    {isFrench ? "Années d'expérience" : "Years of Experience"}
                  </ThemedText>
                  <View style={styles.inputWrap}>
                    <Ionicons name="time-outline" size={18} color={Palette.secondaryText} />
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="e.g. 5"
                      placeholderTextColor={Palette.secondaryText}
                      value={editExperienceYears}
                      onChangeText={setEditExperienceYears}
                    />
                  </View>
                </View>

                {/* 5. COVER IMAGE (PROFESSION DEFAULT OR CUSTOM) */}
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    {isFrench ? "Photo de couverture du profil" : "Profile Cover Image"}
                  </ThemedText>
                  <ThemedText style={styles.inputHelp}>
                    {isFrench
                      ? "Attribuée automatiquement selon votre métier, personnalisable ci-dessous"
                      : "Automatically assigned by profession, customizable below"}
                  </ThemedText>
                  {editCoverImage ? (
                    <View style={styles.coverPreviewWrap}>
                      <Image source={{ uri: editCoverImage }} style={styles.coverPreviewImg} resizeMode="cover" />
                      <Pressable
                        onPress={() => setEditCoverImage(getDefaultCoverForProfession(editProfession))}
                        style={styles.coverResetBtn}
                      >
                        <Ionicons name="refresh" size={13} color="#FFFFFF" />
                        <ThemedText style={styles.coverResetText}>
                          {isFrench ? "Réinitialiser" : "Reset Default"}
                        </ThemedText>
                      </Pressable>
                    </View>
                  ) : null}

                  {/* Preset quick picks */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 4 }}>
                    {Object.entries(PROFESSION_DEFAULT_COVERS).slice(0, 6).map(([key, url]) => (
                      <Pressable
                        key={key}
                        onPress={() => setEditCoverImage(url)}
                        style={[
                          styles.presetCoverThumb,
                          editCoverImage === url && styles.presetCoverThumbActive,
                        ]}
                      >
                        <Image source={{ uri: url }} style={styles.presetCoverThumbImg} />
                        <ThemedText style={styles.presetCoverThumbLabel}>{key}</ThemedText>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* 6. BIO / DESCRIPTION */}
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    {isFrench ? "Description / Bio professionnelle" : "Professional Bio / Description"}
                  </ThemedText>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={3}
                    placeholder={
                      isFrench
                        ? "Présentez vos services, votre rigueur et vos garanties..."
                        : "Describe your workmanship, experience, and service guarantees..."
                    }
                    placeholderTextColor={Palette.secondaryText}
                    value={editBio}
                    onChangeText={setEditBio}
                  />
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.editModalActions}>
                <Pressable
                  onPress={() => setShowEditProviderModal(false)}
                  style={styles.editCancelBtn}
                  disabled={editSaving}
                >
                  <ThemedText style={styles.editCancelBtnText}>
                    {isFrench ? "Annuler" : "Cancel"}
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={handleSaveProviderProfile}
                  style={[
                    styles.editSaveBtn,
                    (!editLocation.trim() || !editProfession.trim() || editSpecializations.length === 0 || editSaving) &&
                      styles.editSaveBtnDisabled,
                  ]}
                  disabled={editSaving}
                >
                  {editSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      <ThemedText style={styles.editSaveBtnText}>
                        {isFrench ? "Enregistrer" : "Save Changes"}
                      </ThemedText>
                    </>
                  )}
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Personal Profile Edit Modal */}
        <Modal
          visible={showEditPersonalModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditPersonalModal(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowEditPersonalModal(false)}
          >
            <Pressable style={styles.personalModalContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="person-circle-outline" size={22} color={Palette.primary} />
                  <ThemedText style={styles.modalSheetTitle}>
                    {isFrench ? "Modifier mon profil" : "Edit Personal Profile"}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => setShowEditPersonalModal(false)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>

              {personalError && (
                <View style={styles.editErrorBanner}>
                  <Ionicons name="alert-circle" size={16} color={Palette.errorRed} />
                  <ThemedText style={styles.editErrorText}>{personalError}</ThemedText>
                </View>
              )}

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.personalModalScroll}
              >
                {/* Photo Picker */}
                <View style={styles.personalAvatarSection}>
                  <View style={styles.personalAvatarWrap}>
                    <UserAvatar uri={editPersonalAvatar} size={76} iconSize={36} />
                  </View>
                  <Pressable
                    onPress={pickPersonalImage}
                    style={styles.personalPickPhotoBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Change profile photo"
                  >
                    <Ionicons name="camera-outline" size={16} color={Palette.primary} />
                    <ThemedText style={styles.personalPickPhotoText}>
                      {isFrench ? "Changer la photo" : "Change Photo"}
                    </ThemedText>
                  </Pressable>
                </View>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    {isFrench ? "Nom complet *" : "Full Name *"}
                  </ThemedText>
                  <View style={styles.inputWrap}>
                    <Ionicons name="person-outline" size={18} color={Palette.primary} />
                    <TextInput
                      style={styles.textInput}
                      value={editPersonalName}
                      onChangeText={setEditPersonalName}
                      placeholder={isFrench ? "Ex: Alice Mengue" : "e.g. Alice Mengue"}
                      placeholderTextColor={Palette.secondaryText}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Phone Number */}
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    {isFrench ? "Numéro de téléphone" : "Phone Number"}
                  </ThemedText>
                  <View style={styles.inputWrap}>
                    <Ionicons name="call-outline" size={18} color={Palette.primary} />
                    <TextInput
                      style={styles.textInput}
                      value={editPersonalPhone}
                      onChangeText={setEditPersonalPhone}
                      keyboardType="phone-pad"
                      placeholder={isFrench ? "Ex: +237 690 12 34 56" : "e.g. +237 690 12 34 56"}
                      placeholderTextColor={Palette.secondaryText}
                    />
                  </View>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.editModalActions}>
                <Pressable
                  onPress={() => setShowEditPersonalModal(false)}
                  style={styles.editCancelBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                >
                  <ThemedText style={styles.editCancelBtnText}>
                    {isFrench ? "Annuler" : "Cancel"}
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={handleSavePersonalProfile}
                  style={[styles.editSaveBtn, personalSaving && styles.editSaveBtnDisabled]}
                  disabled={personalSaving}
                  accessibilityRole="button"
                  accessibilityLabel="Save profile"
                >
                  {personalSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      <ThemedText style={styles.editSaveBtnText}>
                        {isFrench ? "Enregistrer" : "Save Changes"}
                      </ThemedText>
                    </>
                  )}
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Language Selection Modal */}
        <LanguageModal
          visible={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  headerLeftWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm + 2,
  },
  brandIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  titleHierarchy: {
    gap: 1,
  },
  eyebrowTag: {
    fontSize: 10,
    fontWeight: "800",
    color: Palette.primary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Palette.dark,
    letterSpacing: -0.3,
  },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Palette.surfaceContainerLow,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  langCodeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Palette.dark,
  },
  // Cool Segmented Tab Bar
  segmentedTabWrapper: {
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: Palette.background,
  },
  segmentedTabContainer: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: BorderRadius.full,
    padding: 3,
    gap: 3,
  },
  segmentTabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  segmentTabBtnActive: {
    backgroundColor: Palette.surface,
    ...Shadows.subtle,
  },
  segmentTabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.secondaryText,
  },
  segmentTabLabelActive: {
    fontWeight: "800",
    color: Palette.dark,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: BottomTabInset + Spacing.xl + 20,
    gap: Spacing.md,
  },
  guestCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.card,
  },
  guestAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  guestInfo: {
    alignItems: "center",
    gap: 4,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Palette.dark,
    textAlign: "center",
  },
  guestSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 280,
  },
  signInPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Palette.primary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    marginTop: 6,
  },
  signInPrimaryBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.md,
    ...Shadows.card,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userAvatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarContainer: {
    position: "relative",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: Palette.dark,
    flex: 1,
  },
  editPersonalIconBtn: {
    padding: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  userMetaBadgesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  userMetaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.surfaceContainer,
  },
  userMetaText: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontWeight: "600",
  },
  userPhone: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  dashboardSection: {
    gap: Spacing.sm,
  },
  greetingHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: Palette.dark,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  statCard: {
    width: "48.2%",
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    ...Shadows.card,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  statIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  statMicroBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statMicroBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: Palette.dark,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Palette.secondaryText,
    marginTop: 2,
  },
  ratingNumberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Palette.dark,
  },
  emptyRequestsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Palette.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  emptyRequestsText: {
    fontSize: 13,
    color: Palette.secondaryText,
  },
  providerReqCard: {
    backgroundColor: Palette.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: 4,
  },
  reqTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reqCategoryBadge: {
    backgroundColor: Palette.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  reqCategoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: Palette.primary,
  },
  reqDate: {
    fontSize: 11,
    color: Palette.secondaryText,
  },
  reqTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.dark,
    marginTop: 2,
  },
  reqDesc: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  providerBlueCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  providerBlueTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  providerBlueIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  providerBlueMainInfo: {
    flex: 1,
    gap: 4,
  },
  providerTitleStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  providerTradeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Palette.dark,
    letterSpacing: -0.2,
  },
  statusPillChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  statusPillChipPending: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  statusPillChipApproved: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  statusPillDotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotPending: {
    backgroundColor: Palette.primary,
  },
  statusDotApproved: {
    backgroundColor: "#059669",
  },
  statusPillChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextPending: {
    color: Palette.primary,
  },
  statusTextApproved: {
    color: "#047857",
  },
  providerBlueDescription: {
    fontSize: 12,
    color: Palette.secondaryText,
    lineHeight: 17,
    marginTop: 1,
  },
  providerBlueEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  providerBlueMetaBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "#EFF6FF",
    gap: Spacing.sm,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaChipText: {
    fontSize: 12,
    color: Palette.secondaryText,
    fontWeight: "500",
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: Palette.outline,
  },
  statusFooterEditLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginLeft: "auto",
  },
  statusFooterEditText: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.primary,
  },
  becomeSellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.accentLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  sellerCardIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  becomeSellerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Palette.dark,
  },
  becomeSellerSub: {
    fontSize: 12,
    fontWeight: "500",
    color: Palette.secondaryText,
    marginTop: 2,
    lineHeight: 16,
  },
  menuSection: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    overflow: "hidden",
    ...Shadows.subtle,
  },
  menuSectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: Palette.secondaryText,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.dark,
  },
  menuItemRightValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  valueText: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.secondaryText,
  },
  countPill: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
  countPillText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  toggleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
  },
  toggleBadgeActive: {
    backgroundColor: Palette.successLight,
  },
  toggleBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Palette.secondaryText,
  },
  toggleBadgeTextActive: {
    color: Palette.success,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Palette.surface,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    marginTop: Spacing.xs,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.errorRed,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalSheet: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Palette.dark,
  },
  modalSheetContent: {
    fontSize: 13,
    color: Palette.mainText,
    lineHeight: 20,
  },
  modalDoneBtn: {
    backgroundColor: Palette.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  modalDoneBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  langChoiceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    backgroundColor: Palette.surfaceContainerLow,
    gap: Spacing.md,
  },
  langChoiceCardActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainer,
  },
  langEmoji: {
    fontSize: 24,
  },
  langName: {
    fontSize: 15,
    fontWeight: "700",
    color: Palette.dark,
  },
  langSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },

  // 9. DANGER ZONE (GitHub-style Account Deletion)
  dangerZoneCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.3)", // subtle red border like GitHub danger zone
    overflow: "hidden",
  },
  dangerZoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(220, 38, 38, 0.2)",
  },
  dangerZoneTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Palette.errorRed,
    letterSpacing: 0.2,
  },
  dangerZoneContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  dangerZoneTextWrap: {
    flex: 1,
    gap: 3,
  },
  dangerItemHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.dark,
  },
  dangerItemSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    lineHeight: 16,
  },
  dangerDeleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.errorRed,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerDeleteBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: Palette.errorRed,
  },

  // GitHub-style Delete Confirmation Modal
  githubDeleteModalCard: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.4)",
    ...Shadows.card,
  },
  githubDeleteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  githubDeleteHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  githubDeleteTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Palette.dark,
  },
  githubWarningCallout: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: Palette.errorRed,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  githubWarningCalloutText: {
    fontSize: 13,
    color: "#991B1B",
    lineHeight: 18,
    fontWeight: "500",
  },
  githubConfirmPromptWrap: {
    gap: 6,
  },
  githubConfirmPrompt: {
    fontSize: 13,
    fontWeight: "700",
    color: Palette.dark,
  },
  githubConfirmInput: {
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: Palette.dark,
    fontWeight: "700",
  },
  githubDeleteActionRow: {
    gap: Spacing.sm,
    marginTop: 4,
  },
  githubConfirmDeleteBtn: {
    backgroundColor: Palette.errorRed,
    paddingVertical: 12,
    borderRadius: BorderRadius.default,
    alignItems: "center",
    justifyContent: "center",
  },
  githubConfirmDeleteBtnDisabled: {
    backgroundColor: "#FCA5A5",
  },
  githubConfirmDeleteBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  githubCancelDeleteBtn: {
    paddingVertical: 10,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  githubCancelDeleteBtnText: {
    color: Palette.dark,
    fontSize: 13,
    fontWeight: "700",
  },
  providerGreetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editProfilePillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Palette.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  editProfilePillText: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.primary,
  },
  providerCardEditBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Palette.outline,
    marginLeft: 6,
  },
  editModalSheet: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: "85%",
    ...Shadows.hover,
  },
  editErrorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Palette.errorContainer,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.errorRed,
  },
  editErrorText: {
    fontSize: 12,
    fontWeight: "600",
    color: Palette.errorRed,
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Palette.dark,
  },
  mandatoryBadge: {
    fontSize: 14,
    fontWeight: "800",
    color: Palette.errorRed,
  },
  inputHelp: {
    fontSize: 11,
    color: Palette.secondaryText,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.dark,
  },
  textArea: {
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: 14,
    color: Palette.dark,
    minHeight: 80,
    textAlignVertical: "top",
  },
  professionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  professionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  professionChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  professionChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: Palette.dark,
  },
  professionChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  specChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  specChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  specChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  specChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: Palette.dark,
  },
  specChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  editModalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  editCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.outline,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  editCancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.dark,
  },
  editSaveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.primary,
  },
  editSaveBtnDisabled: {
    opacity: 0.5,
  },
  editSaveBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  coverPreviewWrap: {
    width: "100%",
    height: 100,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Palette.outline,
    marginTop: 4,
  },
  coverPreviewImg: {
    width: "100%",
    height: "100%",
  },
  coverResetBtn: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  coverResetText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  presetCoverThumb: {
    width: 72,
    height: 54,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Palette.outline,
    position: "relative",
  },
  presetCoverThumbActive: {
    borderColor: Palette.primary,
  },
  presetCoverThumbImg: {
    width: "100%",
    height: "100%",
  },
  presetCoverThumbLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "capitalize",
  },
  personalModalContent: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: "100%",
    maxWidth: 440,
    maxHeight: "85%",
    ...Shadows.hover,
  },
  personalModalScroll: {
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  personalAvatarSection: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  personalAvatarWrap: {
    position: "relative",
    padding: 3,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: Palette.primary,
  },
  personalPickPhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  personalPickPhotoText: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.primary,
  },
});
