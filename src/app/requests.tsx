import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Modal,
  Alert,
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
import { ServiceRequest, PROFESSIONALS } from "@/data/mockData";
import AppHeader from "@/components/AppHeader";

export default function RequestsScreen() {
  const router = useRouter();
  const {
    serviceRequests,
    openRequestDetails,
    openCreateRequest,
    openChat,
    startChatWithPro,
    authStatus,
    openAuthModal,
    openProfessionalProfile,
    language,
  } = useApp();

  const isGuest = authStatus === "guest";
  const isFrench = language === "fr";

  // 2. Request Lifecycle Segmentation (Segmented Tabs)
  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "cancelled"
  >("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "category" | "status">("date");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [trackingModalRequest, setTrackingModalRequest] =
    useState<ServiceRequest | null>(null);

  // Counts for each tab
  const activeCount = serviceRequests.filter(
    (r) =>
      r.status === "Sent" ||
      r.status === "Accepted" ||
      r.status === "In Progress",
  ).length;
  const completedCount = serviceRequests.filter(
    (r) => r.status === "Completed",
  ).length;
  const cancelledCount = serviceRequests.filter(
    (r) => r.status === "Cancelled",
  ).length;

  // Filtered requests based on activeTab, search, and sorting
  const filteredRequests = useMemo(() => {
    let list = serviceRequests.filter((r) => {
      if (activeTab === "active") {
        return (
          r.status === "Sent" ||
          r.status === "Accepted" ||
          r.status === "In Progress"
        );
      }
      if (activeTab === "completed") {
        return r.status === "Completed";
      }
      if (activeTab === "cancelled") {
        return r.status === "Cancelled";
      }
      return true;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.serviceName.toLowerCase().includes(q) ||
          r.serviceCategory.toLowerCase().includes(q) ||
          r.professionalName.toLowerCase().includes(q) ||
          (r.categoryTag && r.categoryTag.toLowerCase().includes(q)),
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === "category") {
        return a.serviceCategory.localeCompare(b.serviceCategory);
      }
      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0; // default date order preserved
    });
  }, [serviceRequests, activeTab, searchQuery, sortBy]);

  const handleChat = (req: ServiceRequest) => {
    if (isGuest) {
      openAuthModal();
      return;
    }
    const targetPro = PROFESSIONALS.find((p) => p.id === req.professionalId);
    if (targetPro) {
      startChatWithPro(targetPro);
    } else {
      openChat("chat-1");
    }
  };

  const handleBookAgain = (req: ServiceRequest) => {
    const targetPro = PROFESSIONALS.find((p) => p.id === req.professionalId);
    openCreateRequest(undefined, targetPro);
  };

  const handleReschedule = (req: ServiceRequest) => {
    Alert.alert(
      "Reschedule Appointment",
      `Would you like to propose a new time slot with ${req.professionalName} for "${req.serviceName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Choose New Time",
          onPress: () => {
            Alert.alert("Success", "Reschedule request sent to professional.");
          },
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Unified App Header matching Marketplace Message Tab design */}
        <AppHeader
          title={isFrench ? "Demandes" : "Requests"}
          eyebrow="MARKETPLACE"
        />

        {/* Global Search Bar & Trailing Filter Trigger (Only for authenticated users) */}
        {!isGuest && (
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={Palette.primary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search service requests..."
                placeholderTextColor={Palette.secondaryText}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} hitSlop={6}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={Palette.secondaryText}
                  />
                </Pressable>
              )}
            </View>

            {/* Trailing Filter Trigger with Sliders Icon & Active Dot */}
            <Pressable
              onPress={() => setShowFilterModal(true)}
              style={[
                styles.filterTriggerBtn,
                sortBy !== "date" && styles.filterTriggerBtnActive,
              ]}
              accessibilityLabel="Filter options"
            >
              <Ionicons
                name="options-outline"
                size={20}
                color={sortBy !== "date" ? Palette.primary : Palette.dark}
              />
              <View style={styles.activeFilterDot} />
            </Pressable>
          </View>
        )}

        {/* =========================================================================
            2. REQUEST LIFECYCLE SEGMENTATION (SEGMENTED TABS)
        ========================================================================= */}
        {!isGuest && (
          <View style={styles.segmentedBar}>
            {/* Active Tab */}
            <Pressable
              onPress={() => setActiveTab("active")}
              style={[
                styles.segmentPill,
                activeTab === "active" && styles.segmentPillActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.segmentLabel,
                  activeTab === "active" && styles.segmentLabelActive,
                ]}
              >
                Active
              </ThemedText>
              <View
                style={[
                  styles.segmentBadge,
                  activeTab === "active" && styles.segmentBadgeActive,
                ]}
              >
                <ThemedText
                  style={[
                    styles.segmentBadgeText,
                    activeTab === "active" && styles.segmentBadgeTextActive,
                  ]}
                >
                  {activeCount}
                </ThemedText>
              </View>
            </Pressable>

            {/* Completed Tab */}
            <Pressable
              onPress={() => setActiveTab("completed")}
              style={[
                styles.segmentPill,
                activeTab === "completed" && styles.segmentPillActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.segmentLabel,
                  activeTab === "completed" && styles.segmentLabelActive,
                ]}
              >
                Completed
              </ThemedText>
              <View
                style={[
                  styles.segmentBadge,
                  activeTab === "completed" && styles.segmentBadgeActive,
                ]}
              >
                <ThemedText
                  style={[
                    styles.segmentBadgeText,
                    activeTab === "completed" && styles.segmentBadgeTextActive,
                  ]}
                >
                  {completedCount}
                </ThemedText>
              </View>
            </Pressable>

            {/* Cancelled Tab */}
            <Pressable
              onPress={() => setActiveTab("cancelled")}
              style={[
                styles.segmentPill,
                activeTab === "cancelled" && styles.segmentPillActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.segmentLabel,
                  activeTab === "cancelled" && styles.segmentLabelActive,
                ]}
              >
                Cancelled
              </ThemedText>
              {cancelledCount > 0 && (
                <View
                  style={[
                    styles.segmentBadge,
                    activeTab === "cancelled" && styles.segmentBadgeActive,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.segmentBadgeText,
                      activeTab === "cancelled" &&
                        styles.segmentBadgeTextActive,
                    ]}
                  >
                    {cancelledCount}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          </View>
        )}

        {/* =========================================================================
            SCROLLABLE CONTENT
        ========================================================================= */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isGuest ? (
            /* DEDICATED SIGN-IN / CREATE ACCOUNT PROMPT FOR GUEST IN REQUESTS TAB */
            <View style={styles.guestCard}>
              <View style={styles.guestIconCircle}>
                <Ionicons
                  name="clipboard-outline"
                  size={40}
                  color={Palette.primary}
                />
              </View>

              <ThemedText type="headlineMd" style={styles.guestTitle}>
                {isFrench
                  ? "Suivez vos demandes de service"
                  : "Track your Service Requests"}
              </ThemedText>

              <ThemedText style={styles.guestSub}>
                {isFrench
                  ? "Connectez-vous ou créez un compte gratuit pour publier des demandes, suivre l’arrivée de vos artisans en direct sur GPS et gérer vos factures en toute sécurité."
                  : "Sign in or create a free account to request verified artisans, track live GPS dispatches in real-time, and manage all your home repairs safely."}
              </ThemedText>

              {/* Feature Value Props */}
              <View style={styles.featureList}>
                <View style={styles.featureRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Palette.success}
                  />
                  <ThemedText style={styles.featureText}>
                    {isFrench
                      ? "Suivi GPS de l’artisan en route en temps réel"
                      : "Live GPS dispatch & real-time ETA tracking"}
                  </ThemedText>
                </View>

                <View style={styles.featureRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Palette.success}
                  />
                  <ThemedText style={styles.featureText}>
                    {isFrench
                      ? "Historique complet des devis, factures et diagnostics"
                      : "Complete archive of quotes, invoices & job specs"}
                  </ThemedText>
                </View>

                <View style={styles.featureRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Palette.success}
                  />
                  <ThemedText style={styles.featureText}>
                    {isFrench
                      ? "Garantie ArtisanLink & paiement bloqué sécurisé"
                      : "ArtisanLink Guarantee & escrow-protected payment"}
                  </ThemedText>
                </View>
              </View>

              {/* Sign In / Create Account Button */}
              <Pressable
                onPress={() => openAuthModal()}
                style={styles.signInPrimaryBtn}
              >
                <ThemedText style={styles.signInPrimaryBtnText}>
                  {isFrench
                    ? "Se connecter / Créer un compte"
                    : "Sign In / Create Account"}
                </ThemedText>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            <>
              {/* =========================================================================
                  3. REAL-TIME STATUS & LIVE DISPATCH BANNER
              ========================================================================= */}
              {activeTab === "active" && (
                <Pressable
                  onPress={() => {
                    const activeReq =
                      serviceRequests.find((r) => r.id === "REQ-4821") ||
                      serviceRequests[0];
                    setTrackingModalRequest(activeReq);
                  }}
                  style={styles.dispatchAlertStrip}
                >
                  <View style={styles.dispatchGpsWrap}>
                    <Ionicons name="navigate" size={18} color="#FFFFFF" />
                  </View>

                  <View style={styles.dispatchTextWrap}>
                    <View style={styles.dispatchHeaderRow}>
                      <View style={styles.livePulsingDot} />
                      <ThemedText style={styles.dispatchTag}>
                        LIVE DISPATCH EN ROUTE
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.dispatchBodyText}>
                      Jean is on his way! Estimated arrival in 18 minutes for
                      Kitchen Sink repair.
                    </ThemedText>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Palette.primary}
                  />
                </Pressable>
              )}

              {/* =========================================================================
              4. ONGOING REQUEST CARDS ARCHITECTURE (ACTIVE TAB)
          ========================================================================= */}
              {activeTab === "active" && (
                <View style={styles.activeSection}>
                  {filteredRequests.map((req) => {
                    const isScheduled =
                      req.statusLabel === "Scheduled" ||
                      req.status === "In Progress";
                    const isPending =
                      req.statusLabel === "Pending Confirmation" ||
                      req.status === "Accepted";

                    return (
                      <View key={req.id} style={styles.requestCard}>
                        {/* Top Tag & Status Chip */}
                        <View style={styles.cardHeaderRow}>
                          <View style={styles.categoryTagPill}>
                            <ThemedText style={styles.categoryTagText}>
                              {req.categoryTag ||
                                req.serviceCategory.toUpperCase()}
                            </ThemedText>
                          </View>

                          <View
                            style={[
                              styles.statusChip,
                              isScheduled && styles.statusChipScheduled,
                              isPending && styles.statusChipPending,
                            ]}
                          >
                            <View
                              style={[
                                styles.statusDot,
                                isScheduled && styles.statusDotScheduled,
                                isPending && styles.statusDotPending,
                              ]}
                            />
                            <ThemedText
                              style={[
                                styles.statusChipText,
                                isScheduled && styles.statusChipTextScheduled,
                                isPending && styles.statusChipTextPending,
                              ]}
                            >
                              {req.statusLabel || req.status}
                            </ThemedText>
                          </View>
                        </View>

                        {/* Job Title */}
                        <ThemedText style={styles.jobTitle}>
                          {req.serviceName}
                        </ThemedText>

                        {/* Meta Information Box: Two-column summary pill */}
                        <View style={styles.metaInfoBox}>
                          <View style={styles.metaCol}>
                            <View style={styles.metaIconLabel}>
                              <Ionicons
                                name="time-outline"
                                size={14}
                                color={Palette.secondaryText}
                              />
                              <ThemedText style={styles.metaLabel}>
                                SCHEDULED TIME
                              </ThemedText>
                            </View>
                            <ThemedText style={styles.metaValue}>
                              {req.date}
                            </ThemedText>
                          </View>

                          <View style={styles.metaDivider} />

                          <View style={styles.metaCol}>
                            <View style={styles.metaIconLabel}>
                              <Ionicons
                                name="pricetag-outline"
                                size={14}
                                color={Palette.secondaryText}
                              />
                              <ThemedText style={styles.metaLabel}>
                                ESTIMATED PRICE
                              </ThemedText>
                            </View>
                            <ThemedText style={styles.metaPriceValue}>
                              {req.estimateRange || `$${req.estimatedCost}`}
                            </ThemedText>
                          </View>
                        </View>

                        {/* Assigned Artisan Row */}
                        <View style={styles.artisanRow}>
                          <Image
                            source={{ uri: req.professionalAvatar }}
                            style={styles.artisanAvatar}
                          />

                          <View style={styles.artisanInfo}>
                            <View style={styles.artisanNameRow}>
                              <ThemedText style={styles.artisanName}>
                                {req.professionalName}
                              </ThemedText>
                              <Ionicons
                                name="checkmark-circle"
                                size={15}
                                color={Palette.success}
                              />
                            </View>

                            <ThemedText style={styles.artisanTrade}>
                              {req.professionalProfession}
                            </ThemedText>

                            <View style={styles.artisanRatingRow}>
                              <Ionicons
                                name="star"
                                size={13}
                                color={Palette.gold}
                              />
                              <ThemedText style={styles.artisanRatingText}>
                                {req.rating || 4.8} rating
                              </ThemedText>
                            </View>
                          </View>
                        </View>

                        {/* Action Controls */}
                        <View style={styles.cardActionsRow}>
                          {/* Chat button with unread indicator dot */}
                          <Pressable
                            onPress={() => handleChat(req)}
                            style={styles.chatActionBtn}
                            accessibilityLabel="Chat with artisan"
                          >
                            <Ionicons
                              name="chatbubble-ellipses-outline"
                              size={17}
                              color={Palette.dark}
                            />
                            {req.unreadMessages && (
                              <View style={styles.chatUnreadDot} />
                            )}
                            <ThemedText style={styles.chatActionText}>
                              Chat
                            </ThemedText>
                          </Pressable>

                          {/* Primary Action Button */}
                          {isScheduled ? (
                            <Pressable
                              onPress={() => setTrackingModalRequest(req)}
                              style={styles.primaryTrackBtn}
                            >
                              <ThemedText style={styles.primaryTrackText}>
                                Track / Details
                              </ThemedText>
                              <Ionicons
                                name="arrow-forward"
                                size={15}
                                color="#FFFFFF"
                              />
                            </Pressable>
                          ) : (
                            <View style={styles.pendingActionGroup}>
                              <Pressable
                                onPress={() => handleReschedule(req)}
                                style={styles.rescheduleBtn}
                              >
                                <ThemedText style={styles.rescheduleBtnText}>
                                  Reschedule
                                </ThemedText>
                              </Pressable>
                              <Pressable
                                onPress={() => openRequestDetails(req)}
                                style={styles.primaryDetailsBtn}
                              >
                                <ThemedText style={styles.primaryDetailsText}>
                                  View Details
                                </ThemedText>
                              </Pressable>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* =========================================================================
              5. COMPLETED JOBS & RE-BOOKING FLOW (COMPLETED TAB OR ARCHIVE)
          ========================================================================= */}
              {activeTab === "completed" && (
                <View style={styles.completedSection}>
                  {/* Section Header with Checkmark Badge & View All */}
                  <View style={styles.completedHeaderRow}>
                    <View style={styles.completedHeaderLeft}>
                      <View style={styles.completedHeaderBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={Palette.success}
                        />
                      </View>
                      <ThemedText style={styles.completedSectionTitle}>
                        Completed History
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.completedCountText}>
                      {completedCount} jobs total
                    </ThemedText>
                  </View>

                  {filteredRequests.map((req) => (
                    <View key={req.id} style={styles.completedJobCard}>
                      <View style={styles.completedCardTop}>
                        <Image
                          source={{ uri: req.professionalAvatar }}
                          style={styles.completedAvatar}
                        />

                        <View style={styles.completedInfo}>
                          <ThemedText style={styles.completedJobTitle}>
                            {req.serviceName}
                          </ThemedText>
                          <ThemedText style={styles.completedProName}>
                            by {req.professionalName} ·{" "}
                            {req.professionalProfession}
                          </ThemedText>
                          <View style={styles.completedMetaRow}>
                            <ThemedText style={styles.completedDateText}>
                              {req.completedDate || req.date}
                            </ThemedText>
                            <ThemedText style={styles.metaDot}>·</ThemedText>
                            <View style={styles.completedRatingRow}>
                              <Ionicons
                                name="star"
                                size={13}
                                color={Palette.gold}
                              />
                              <ThemedText style={styles.completedRatingText}>
                                {req.rating || 5.0} stars
                              </ThemedText>
                            </View>
                          </View>
                        </View>

                        <ThemedText style={styles.completedCostText}>
                          ${req.estimatedCost}
                        </ThemedText>
                      </View>

                      {/* Re-booking Affordance: One-tap Book Again button with refresh icon */}
                      <View style={styles.completedActionsRow}>
                        <Pressable
                          onPress={() => openRequestDetails(req)}
                          style={styles.viewSummaryBtn}
                        >
                          <ThemedText style={styles.viewSummaryText}>
                            Receipt & Review
                          </ThemedText>
                        </Pressable>

                        <Pressable
                          onPress={() => handleBookAgain(req)}
                          style={styles.bookAgainBtn}
                        >
                          <Ionicons
                            name="reload-outline"
                            size={15}
                            color="#FFFFFF"
                          />
                          <ThemedText style={styles.bookAgainBtnText}>
                            Book Again
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* =========================================================================
              CANCELLED REQUESTS TAB
          ========================================================================= */}
              {activeTab === "cancelled" && (
                <View style={styles.cancelledSection}>
                  {filteredRequests.length === 0 ? (
                    <View style={styles.emptyCard}>
                      <Ionicons
                        name="close-circle-outline"
                        size={44}
                        color={Palette.secondaryText}
                      />
                      <ThemedText style={styles.emptyTitle}>
                        No cancelled requests
                      </ThemedText>
                    </View>
                  ) : (
                    filteredRequests.map((req) => (
                      <View key={req.id} style={styles.cancelledCard}>
                        <View style={styles.cancelledTop}>
                          <ThemedText style={styles.cancelledCategoryTag}>
                            {req.categoryTag || req.serviceCategory}
                          </ThemedText>
                          <View style={styles.cancelledBadge}>
                            <ThemedText style={styles.cancelledBadgeText}>
                              Revoked
                            </ThemedText>
                          </View>
                        </View>
                        <ThemedText style={styles.cancelledTitle}>
                          {req.serviceName}
                        </ThemedText>
                        <ThemedText style={styles.cancelledDesc}>
                          {req.problemDescription}
                        </ThemedText>
                        <ThemedText style={styles.cancelledFooter}>
                          Assigned to: {req.professionalName} · {req.date}
                        </ThemedText>
                      </View>
                    ))
                  )}
                </View>
              )}

              {/* =========================================================================
              6. ARTISAN SUPPORT & GUARANTEE CARD
          ========================================================================= */}
              <View style={styles.supportCard}>
                <View style={styles.supportIconCircle}>
                  <Ionicons
                    name="headset-outline"
                    size={24}
                    color={Palette.primary}
                  />
                </View>

                <View style={styles.supportTextWrap}>
                  <ThemedText style={styles.supportTitle}>
                    Need Help with a Booking?
                  </ThemedText>
                  <ThemedText style={styles.supportSub}>
                    24/7 Artisan Support Guarantee · Dispute protection &
                    verified work
                  </ThemedText>
                </View>

                <Pressable
                  onPress={() => setShowSupportModal(true)}
                  style={styles.supportContactBtn}
                >
                  <ThemedText style={styles.supportContactText}>
                    Contact Us
                  </ThemedText>
                  <Ionicons
                    name="arrow-forward"
                    size={13}
                    color={Palette.primary}
                  />
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>

        {/* =========================================================================
            MODALS: FILTER, LIVE TRACKING & SUPPORT
        ========================================================================= */}
        {/* Quick Filter Modal */}
        <Modal
          visible={showFilterModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowFilterModal(false)}
          >
            <Pressable
              style={styles.modalSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalSheetTitle}>
                  Sort & Filter Requests
                </ThemedText>
                <Pressable
                  onPress={() => setShowFilterModal(false)}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>

              <ThemedText style={styles.filterSectionLabel}>
                SORT ORDER
              </ThemedText>
              <View style={styles.sortOptions}>
                {(["date", "category", "status"] as const).map((opt) => {
                  const isSelected = sortBy === opt;
                  const label =
                    opt === "date"
                      ? "Date (Latest first)"
                      : opt === "category"
                        ? "Trade / Category"
                        : "Operational Status";
                  return (
                    <Pressable
                      key={opt}
                      onPress={() => {
                        setSortBy(opt);
                        setShowFilterModal(false);
                      }}
                      style={[
                        styles.sortCard,
                        isSelected && styles.sortCardActive,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.sortText,
                          isSelected && styles.sortTextActive,
                        ]}
                      >
                        {label}
                      </ThemedText>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={Palette.primary}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Live GPS Dispatch & Tracking Modal */}
        <Modal
          visible={!!trackingModalRequest}
          transparent
          animationType="slide"
          onRequestClose={() => setTrackingModalRequest(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setTrackingModalRequest(null)}
          >
            <Pressable
              style={styles.trackingSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <View style={styles.trackingTitleRow}>
                  <View style={styles.livePulsingDot} />
                  <ThemedText style={styles.modalSheetTitle}>
                    Live Dispatch Tracking
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => setTrackingModalRequest(null)}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>

              <View style={styles.trackingStatusBox}>
                <Ionicons
                  name="navigate-circle"
                  size={32}
                  color={Palette.primary}
                />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.trackingStatusHeading}>
                    En Route · 18 min away
                  </ThemedText>
                  <ThemedText style={styles.trackingStatusSub}>
                    {trackingModalRequest?.professionalName} has packed parts
                    and is driving to your location.
                  </ThemedText>
                </View>
              </View>

              <View style={styles.trackingSteps}>
                <View style={styles.trackingStepRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Palette.success}
                  />
                  <ThemedText style={styles.trackingStepText}>
                    11:15 AM · Service Request Accepted
                  </ThemedText>
                </View>
                <View style={styles.trackingStepRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Palette.success}
                  />
                  <ThemedText style={styles.trackingStepText}>
                    02:05 PM · Parts & Diagnostics Prepared
                  </ThemedText>
                </View>
                <View style={styles.trackingStepRow}>
                  <Ionicons
                    name="radio-button-on"
                    size={18}
                    color={Palette.primary}
                  />
                  <ThemedText style={styles.trackingStepTextActive}>
                    02:12 PM · Van dispatched en route
                  </ThemedText>
                </View>
              </View>

              <View style={styles.trackingActions}>
                <Pressable
                  onPress={() => {
                    const req = trackingModalRequest;
                    setTrackingModalRequest(null);
                    if (req) handleChat(req);
                  }}
                  style={styles.trackingChatBtn}
                >
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={18}
                    color="#FFFFFF"
                  />
                  <ThemedText style={styles.trackingChatBtnText}>
                    Message Jean
                  </ThemedText>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* 24/7 Support Modal */}
        <Modal
          visible={showSupportModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSupportModal(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowSupportModal(false)}
          >
            <Pressable
              style={styles.modalSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalSheetTitle}>
                  24/7 Artisan Support
                </ThemedText>
                <Pressable
                  onPress={() => setShowSupportModal(false)}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={20} color={Palette.dark} />
                </Pressable>
              </View>

              <ThemedText style={styles.supportModalBody}>
                Our dedicated support agents protect every booking under the
                ArtisanLink Guarantee:
                {"\n\n"}• Workmanship warranty coverage
                {"\n"}• Price lock protection against hidden charges
                {"\n"}• Instant dispute mediation and resolution
                {"\n\n"}📞 Call Priority Support: +1 (800) 278-4726
                {"\n"}📧 Email: support@artisanlink.com
              </ThemedText>

              <Pressable
                onPress={() => setShowSupportModal(false)}
                style={styles.modalDoneBtn}
              >
                <ThemedText style={styles.modalDoneBtnText}>Close</ThemedText>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
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
  /* 1. App Header */
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: Palette.surface,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIconBadge: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  hierarchyWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  hierarchyParent: {
    fontSize: 14,
    color: Palette.secondaryText,
    fontWeight: "600",
  },
  hierarchySlash: {
    fontSize: 14,
    color: Palette.secondaryText,
  },
  hierarchyCurrent: {
    fontSize: 15,
    color: Palette.dark,
    fontWeight: "800",
  },
  utilityActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  utilityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  alertDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.accent,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  /* Search & Filter Trigger */
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Palette.mainText,
    paddingVertical: 0,
  },
  filterTriggerBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Palette.outline,
    position: "relative",
  },
  filterTriggerBtnActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainer,
  },
  activeFilterDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.primary,
  },
  /* 2. Segmented Tabs */
  segmentedBar: {
    flexDirection: "row",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  segmentPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
    gap: 6,
  },
  segmentPillActive: {
    backgroundColor: Palette.primary, // #1769AA solid Artisan Blue
    ...Shadows.subtle,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.secondaryText,
  },
  segmentLabelActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  segmentBadge: {
    backgroundColor: Palette.outline,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  segmentBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  segmentBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: Palette.secondaryText,
  },
  segmentBadgeTextActive: {
    color: "#FFFFFF",
  },
  /* Scroll & Content */
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
  /* 3. Live Dispatch Banner */
  dispatchAlertStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    gap: Spacing.md,
  },
  dispatchGpsWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  dispatchTextWrap: {
    flex: 1,
    gap: 2,
  },
  dispatchHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  livePulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.success,
  },
  dispatchTag: {
    fontSize: 11,
    fontWeight: "800",
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  dispatchBodyText: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.dark,
    lineHeight: 18,
  },
  /* 4. Ongoing Request Cards */
  activeSection: {
    gap: Spacing.md,
  },
  requestCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.md,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryTagPill: {
    backgroundColor: Palette.surfaceContainerLow,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: Palette.dark,
    letterSpacing: 0.4,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusChipScheduled: {
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.primary,
  },
  statusChipPending: {
    backgroundColor: Palette.accentLight,
    borderWidth: 1,
    borderColor: Palette.accent,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotScheduled: {
    backgroundColor: Palette.primary,
  },
  statusDotPending: {
    backgroundColor: Palette.accent,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusChipTextScheduled: {
    color: Palette.primary,
  },
  statusChipTextPending: {
    color: Palette.accentDark,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Palette.dark,
    letterSpacing: -0.3,
  },
  /* Meta Information Box (2-column pill) */
  metaInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  metaCol: {
    flex: 1,
    gap: 3,
  },
  metaDivider: {
    width: 1,
    height: 36,
    backgroundColor: Palette.outline,
    marginHorizontal: Spacing.md,
  },
  metaIconLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Palette.secondaryText,
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "800",
    color: Palette.dark,
  },
  metaPriceValue: {
    fontSize: 14,
    fontWeight: "800",
    color: Palette.primary,
  },
  /* Assigned Artisan */
  artisanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  artisanAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.surfaceContainerLow,
  },
  artisanInfo: {
    flex: 1,
    gap: 2,
  },
  artisanNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  artisanName: {
    fontSize: 14,
    fontWeight: "800",
    color: Palette.dark,
  },
  artisanTrade: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  artisanRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  artisanRatingText: {
    fontSize: 11,
    fontWeight: "700",
    color: Palette.dark,
  },
  /* Card Actions */
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
    flexWrap: "wrap",
  },
  chatActionBtn: {
    flex: 1,
    minWidth: 88,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
    position: "relative",
  },
  chatUnreadDot: {
    position: "absolute",
    top: 9,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.accent,
  },
  chatActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: Palette.dark,
  },
  primaryTrackBtn: {
    flex: 1,
    minWidth: 160,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.primary,
  },
  primaryTrackText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  pendingActionGroup: {
    flex: 1,
    minWidth: 220,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  rescheduleBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  rescheduleBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.dark,
  },
  primaryDetailsBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.primary,
  },
  primaryDetailsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  /* 5. Completed Section */
  completedSection: {
    gap: Spacing.sm,
  },
  completedHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  completedHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  completedHeaderBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.successLight,
    alignItems: "center",
    justifyContent: "center",
  },
  completedSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Palette.dark,
  },
  completedCountText: {
    fontSize: 12,
    color: Palette.secondaryText,
    fontWeight: "600",
  },
  completedJobCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.sm,
  },
  completedCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  completedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.surfaceContainerLow,
  },
  completedInfo: {
    flex: 1,
    gap: 2,
  },
  completedJobTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Palette.dark,
  },
  completedProName: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  completedMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  completedDateText: {
    fontSize: 11,
    color: Palette.secondaryText,
  },
  metaDot: {
    fontSize: 11,
    color: Palette.secondaryText,
  },
  completedRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  completedRatingText: {
    fontSize: 11,
    fontWeight: "700",
    color: Palette.dark,
  },
  completedCostText: {
    fontSize: 15,
    fontWeight: "800",
    color: Palette.primary,
  },
  completedActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  viewSummaryBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  viewSummaryText: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.dark,
  },
  bookAgainBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.primary,
  },
  bookAgainBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  /* Cancelled Section */
  cancelledSection: {
    gap: Spacing.sm,
  },
  cancelledCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: 4,
  },
  cancelledTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelledCategoryTag: {
    fontSize: 11,
    fontWeight: "800",
    color: Palette.secondaryText,
  },
  cancelledBadge: {
    backgroundColor: Palette.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  cancelledBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Palette.errorRed,
  },
  cancelledTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Palette.dark,
    marginTop: 2,
  },
  cancelledDesc: {
    fontSize: 12,
    color: Palette.secondaryText,
    lineHeight: 17,
  },
  cancelledFooter: {
    fontSize: 11,
    color: Palette.secondaryText,
    marginTop: 4,
  },
  /* 6. Support Card */
  supportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  supportIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  supportTextWrap: {
    flex: 1,
    gap: 2,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Palette.dark,
  },
  supportSub: {
    fontSize: 11,
    color: Palette.secondaryText,
    lineHeight: 15,
  },
  supportContactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  supportContactText: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.primary,
  },
  /* Modals */
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
  trackingSheet: {
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
  trackingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Palette.dark,
  },
  filterSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Palette.secondaryText,
    letterSpacing: 0.5,
  },
  sortOptions: {
    gap: Spacing.xs,
  },
  sortCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: Palette.outline,
  },
  sortCardActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainer,
  },
  sortText: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.dark,
  },
  sortTextActive: {
    fontWeight: "800",
    color: Palette.primary,
  },
  trackingStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  trackingStatusHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: Palette.dark,
  },
  trackingStatusSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
    lineHeight: 16,
  },
  trackingSteps: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  trackingStepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  trackingStepText: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  trackingStepTextActive: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.primary,
  },
  trackingActions: {
    marginTop: Spacing.xs,
  },
  trackingChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Palette.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  trackingChatBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  supportModalBody: {
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
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Palette.secondaryText,
  },
  guestCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Palette.outline,
    marginTop: Spacing.sm,
  },
  guestIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Palette.dark,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  guestSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: Spacing.lg,
  },
  featureList: {
    width: "100%",
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: 13,
    color: Palette.dark,
    fontWeight: "600",
    flex: 1,
  },
  signInPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Palette.primary,
    width: "100%",
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
  },
  signInPrimaryBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
