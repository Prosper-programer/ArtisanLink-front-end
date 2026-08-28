import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
import { ServiceRequest } from '@/data/mockData';

export default function BookingsScreen() {
  const {
    serviceRequests,
    openRequestDetails,
    openCreateRequest,
    authStatus,
    openAuthModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  const isGuest = authStatus === 'guest';

  const filteredRequests = serviceRequests.filter((r) => {
    if (activeTab === 'active') {
      return r.status === 'Sent' || r.status === 'Accepted' || r.status === 'In Progress';
    }
    if (activeTab === 'completed') {
      return r.status === 'Completed';
    }
    if (activeTab === 'cancelled') {
      return r.status === 'Cancelled';
    }
    return true;
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="headlineLg" style={styles.headerTitle}>
            My Requests
          </ThemedText>

          <Pressable onPress={() => openCreateRequest()} style={styles.newReqBtn}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <ThemedText style={styles.newReqBtnText}>New Request</ThemedText>
          </Pressable>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabsBar}>
          {(['active', 'completed', 'cancelled'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            const count = serviceRequests.filter((r) => {
              if (tab === 'active') {
                return r.status === 'Sent' || r.status === 'Accepted' || r.status === 'In Progress';
              }
              return r.status === (tab === 'completed' ? 'Completed' : 'Cancelled');
            }).length;

            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabItem, isSelected && styles.tabItemActive]}>
                <ThemedText
                  style={[styles.tabItemText, isSelected && styles.tabItemTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* Requests Stream */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {isGuest ? (
            <View style={styles.guestPrompt}>
              <Ionicons name="shield-outline" size={48} color={Palette.primary} />
              <ThemedText style={styles.guestPromptTitle}>Sign in to view your requests</ThemedText>
              <ThemedText style={styles.guestPromptSub}>
                Track your active service requests and communicate directly with assigned professionals.
              </ThemedText>
              <Pressable onPress={() => openAuthModal()} style={styles.signInBtn}>
                <ThemedText style={styles.signInBtnText}>Sign In / Create Account</ThemedText>
              </Pressable>
            </View>
          ) : filteredRequests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={48} color={Palette.secondaryText} />
              <ThemedText style={styles.emptyTitle}>No {activeTab} requests</ThemedText>
              <ThemedText style={styles.emptySub}>
                You currently have no service requests in this tab.
              </ThemedText>
              <Pressable onPress={() => openCreateRequest()} style={styles.createNowBtn}>
                <ThemedText style={styles.createNowText}>Request a Service Now</ThemedText>
              </Pressable>
            </View>
          ) : (
            filteredRequests.map((req) => (
              <Pressable
                key={req.id}
                onPress={() => openRequestDetails(req)}
                style={styles.requestCard}>
                {/* Header row */}
                <View style={styles.cardHeader}>
                  <View style={styles.categoryBadge}>
                    <ThemedText style={styles.categoryText}>{req.serviceCategory}</ThemedText>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      req.status === 'Completed' && styles.statusCompleted,
                      req.status === 'In Progress' && styles.statusInProgress,
                    ]}>
                    <ThemedText
                      style={[
                        styles.statusPillText,
                        req.status === 'Completed' && styles.statusCompletedText,
                      ]}>
                      {req.status}
                    </ThemedText>
                  </View>
                </View>

                {/* Service & Pro details */}
                <View style={styles.cardBody}>
                  <Image source={{ uri: req.professionalAvatar }} style={styles.proAvatar} />
                  <View style={styles.cardBodyInfo}>
                    <ThemedText style={styles.serviceName}>{req.serviceName}</ThemedText>
                    <ThemedText style={styles.proNameText}>
                      Assigned: {req.professionalName} • {req.professionalProfession}
                    </ThemedText>
                    <View style={styles.scheduleRow}>
                      <Ionicons name="time-outline" size={13} color={Palette.secondaryText} />
                      <ThemedText style={styles.scheduleText}>
                        {req.date} ({req.time})
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {/* Footer action */}
                <View style={styles.cardFooter}>
                  <ThemedText style={styles.refId}>#{req.id}</ThemedText>
                  <View style={styles.detailsBtn}>
                    <ThemedText style={styles.detailsBtnText}>View Details →</ThemedText>
                  </View>
                </View>
              </Pressable>
            ))
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
  },
  headerTitle: {
    color: Palette.dark,
  },
  newReqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.default,
  },
  newReqBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabsBar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.outline,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Palette.primary,
  },
  tabItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.secondaryText,
  },
  tabItemTextActive: {
    color: Palette.primary,
    fontWeight: '700',
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
  guestPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  guestPromptTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.dark,
  },
  guestPromptSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
  },
  signInBtn: {
    backgroundColor: Palette.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.default,
    marginTop: Spacing.sm,
  },
  signInBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.dark,
  },
  emptySub: {
    fontSize: 13,
    color: Palette.secondaryText,
  },
  createNowBtn: {
    backgroundColor: Palette.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.default,
    marginTop: Spacing.sm,
  },
  createNowText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  requestCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: Palette.surfaceContainerLow,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  statusPill: {
    backgroundColor: Palette.surfaceContainer,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  statusCompleted: {
    backgroundColor: Palette.successLight,
  },
  statusInProgress: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.dark,
  },
  statusCompletedText: {
    color: Palette.success,
  },
  cardBody: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  proAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  cardBodyInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
  },
  proNameText: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  scheduleText: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  refId: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontWeight: '600',
  },
  detailsBtn: {
    paddingVertical: 2,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
});
