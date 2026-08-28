import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  Palette,
  Spacing,
  BorderRadius,
  BottomTabInset,
  MaxContentWidth,
  Shadows,
} from '@/constants/theme';
import { useApp } from '@/context/AppContext';

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
    openRequestDetails,
  } = useApp();

  const isGuest = authStatus === 'guest';
  const isProviderRole = user.isProvider && activeRole === 'provider';

  const newRequests = serviceRequests.filter((r) => r.status === 'Sent');
  const activeJobs = serviceRequests.filter((r) => r.status === 'Accepted' || r.status === 'In Progress');
  const completedJobs = serviceRequests.filter((r) => r.status === 'Completed');

  if (isGuest) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <ThemedText type="headlineLg" style={styles.headerTitle}>Account</ThemedText>
          </View>

          <View style={styles.guestContainer}>
            <View style={styles.guestIconCircle}>
              <Ionicons name="person-outline" size={44} color={Palette.primary} />
            </View>
            <ThemedText type="headlineMd" style={styles.guestTitle}>
              Sign in to ArtisanLink
            </ThemedText>
            <ThemedText style={styles.guestSub}>
              Access your service requests, saved professionals, chat messages, or become a service seller.
            </ThemedText>

            <Pressable onPress={() => openAuthModal()} style={styles.signInPrimaryBtn}>
              <ThemedText style={styles.signInPrimaryBtnText}>Sign In / Create Account</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="headlineLg" style={styles.headerTitle}>
              {isProviderRole ? 'Provider Dashboard' : 'Customer Profile'}
            </ThemedText>
            <ThemedText style={styles.headerSub}>
              {isProviderRole ? 'Manage your business & incoming jobs' : 'Manage account & requests'}
            </ThemedText>
          </View>

          {/* Dual Role Switcher Button */}
          {user.isProvider && (
            <Pressable onPress={toggleActiveRole} style={styles.roleSwitchBtn}>
              <Ionicons
                name={isProviderRole ? 'person-outline' : 'construct-outline'}
                size={14}
                color={Palette.primary}
              />
              <ThemedText style={styles.roleSwitchBtnText}>
                {isProviderRole ? 'Customer View' : 'Provider View'}
              </ThemedText>
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* PROVIDER DASHBOARD VIEW */}
          {isProviderRole ? (
            <View style={styles.dashboardSection}>
              {/* Dashboard Greeting */}
              <ThemedText type="headlineMd" style={styles.greetingHeader}>
                Good morning, {user.name.split(' ')[0]} 👋
              </ThemedText>

              {/* Statistics Cards Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statLabel}>New Requests</ThemedText>
                  <ThemedText style={styles.statValue}>{newRequests.length}</ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statLabel}>Active Jobs</ThemedText>
                  <ThemedText style={styles.statValue}>{activeJobs.length}</ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statLabel}>Completed Jobs</ThemedText>
                  <ThemedText style={styles.statValue}>{completedJobs.length + 28}</ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statLabel}>Rating</ThemedText>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color={Palette.gold} />
                    <ThemedText style={styles.statValue}>4.8</ThemedText>
                  </View>
                </View>
              </View>

              {/* New Service Requests Section */}
              <View style={styles.sectionHeader}>
                <ThemedText type="headlineMd" style={styles.sectionTitle}>
                  New Service Requests
                </ThemedText>
              </View>

              {newRequests.length === 0 ? (
                <View style={styles.emptyRequestsCard}>
                  <Ionicons name="checkmark-done-circle-outline" size={32} color={Palette.success} />
                  <ThemedText style={styles.emptyRequestsText}>
                    You have no new pending requests right now.
                  </ThemedText>
                </View>
              ) : (
                newRequests.map((req) => (
                  <View key={req.id} style={styles.providerReqCard}>
                    <View style={styles.reqTop}>
                      <View style={styles.reqCategoryBadge}>
                        <ThemedText style={styles.reqCategoryText}>{req.serviceCategory}</ThemedText>
                      </View>
                      <ThemedText style={styles.reqDate}>{req.date}</ThemedText>
                    </View>
                    <ThemedText style={styles.reqTitle}>{req.serviceName}</ThemedText>
                    <ThemedText style={styles.reqDesc}>{req.problemDescription}</ThemedText>

                    <View style={styles.reqLocationRow}>
                      <Ionicons name="location-outline" size={14} color={Palette.secondaryText} />
                      <ThemedText style={styles.reqLocationText}>{req.location}</ThemedText>
                    </View>

                    <View style={styles.reqActions}>
                      <Pressable style={styles.rejectBtn}>
                        <ThemedText style={styles.rejectBtnText}>Decline</ThemedText>
                      </Pressable>
                      <Pressable style={styles.acceptBtn}>
                        <ThemedText style={styles.acceptBtnText}>Accept Request</ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}

              {/* Upcoming Jobs */}
              <View style={[styles.sectionHeader, { marginTop: Spacing.md }]}>
                <ThemedText type="headlineMd" style={styles.sectionTitle}>
                  Upcoming Jobs
                </ThemedText>
              </View>

              {activeJobs.map((job) => (
                <Pressable
                  key={job.id}
                  onPress={() => openRequestDetails(job)}
                  style={styles.upcomingJobCard}>
                  <View style={styles.jobRow}>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.jobTitle}>{job.serviceName}</ThemedText>
                      <ThemedText style={styles.jobSub}>{job.date} ({job.time})</ThemedText>
                    </View>
                    <View style={styles.jobStatusPill}>
                      <ThemedText style={styles.jobStatusText}>{job.status}</ThemedText>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            /* CUSTOMER PROFILE VIEW */
            <View style={styles.customerSection}>
              {/* User Profile Header Card */}
              <View style={styles.userCard}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>{user.name}</ThemedText>
                  <ThemedText style={styles.userPhone}>{user.phone}</ThemedText>
                  <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                </View>
                <Pressable style={styles.editProfileBtn}>
                  <ThemedText style={styles.editProfileText}>Edit</ThemedText>
                </Pressable>
              </View>

              {/* BECOME A PROVIDER PROMINENT BUTTON/CARD */}
              {!user.isProvider && (
                <Pressable onPress={openProviderActivation} style={styles.becomeSellerCard}>
                  <View style={styles.sellerCardIconCircle}>
                    <Ionicons name="construct" size={24} color={Palette.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.becomeSellerTitle}>
                      Become a Provider
                    </ThemedText>
                    <ThemedText style={styles.becomeSellerSub}>
                      Offer your services on ArtisanLink
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Palette.dark} />
                </Pressable>
              )}

              {/* Account Menu Items */}
              <View style={styles.menuSection}>
                <Pressable onPress={() => router.push('/bookings')} style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="clipboard-outline" size={20} color={Palette.primary} />
                    <ThemedText style={styles.menuItemText}>My Service Requests</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="star-outline" size={20} color={Palette.primary} />
                    <ThemedText style={styles.menuItemText}>My Reviews</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="bookmark-outline" size={20} color={Palette.primary} />
                    <ThemedText style={styles.menuItemText}>Saved Providers</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="notifications-outline" size={20} color={Palette.primary} />
                    <ThemedText style={styles.menuItemText}>Notifications</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="settings-outline" size={20} color={Palette.primary} />
                    <ThemedText style={styles.menuItemText}>Settings</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="help-circle-outline" size={20} color={Palette.primary} />
                    <ThemedText style={styles.menuItemText}>Help & FAQ</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Palette.secondaryText} />
                </Pressable>

                <Pressable onPress={logout} style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: Palette.outline }]}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="log-out-outline" size={20} color={Palette.errorRed} />
                    <ThemedText style={[styles.menuItemText, { color: Palette.errorRed }]}>
                      Log Out
                    </ThemedText>
                  </View>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
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
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  headerTitle: {
    color: Palette.dark,
  },
  headerSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.surfaceContainerLow,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  roleSwitchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: BottomTabInset + Spacing.xl,
    gap: Spacing.md,
  },
  guestContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 1.5,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  guestIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  guestTitle: {
    color: Palette.dark,
    textAlign: 'center',
  },
  guestSub: {
    fontSize: 14,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  signInPrimaryBtn: {
    backgroundColor: Palette.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.default,
    marginTop: Spacing.md,
  },
  signInPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.dark,
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
  editProfileBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.sm,
    backgroundColor: Palette.surfaceContainerLow,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
  },
  becomeSellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1.5,
    borderColor: Palette.accent,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  sellerCardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  becomeSellerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.dark,
  },
  becomeSellerSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceContainerLow,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.dark,
  },
  dashboardSection: {
    gap: Spacing.md,
  },
  customerSection: {
    gap: Spacing.md,
  },
  greetingHeader: {
    color: Palette.dark,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: '48%',
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: 4,
    ...Shadows.subtle,
  },
  statLabel: {
    fontSize: 12,
    color: Palette.secondaryText,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.dark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionHeader: {
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    color: Palette.dark,
  },
  emptyRequestsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Palette.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  emptyRequestsText: {
    fontSize: 13,
    color: Palette.secondaryText,
    flex: 1,
  },
  providerReqCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.subtle,
  },
  reqTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reqCategoryBadge: {
    backgroundColor: Palette.surfaceContainerLow,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
  },
  reqCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  reqDate: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
  },
  reqDesc: {
    fontSize: 13,
    color: Palette.secondaryText,
    lineHeight: 18,
  },
  reqLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  reqLocationText: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  reqActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.dark,
  },
  acceptBtn: {
    flex: 1.5,
    paddingVertical: 8,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  upcomingJobCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.dark,
  },
  jobSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  jobStatusPill: {
    backgroundColor: Palette.surfaceContainerLow,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  jobStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
});
