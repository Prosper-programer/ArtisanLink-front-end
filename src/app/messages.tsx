import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Alert,
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
import AppHeader from '@/components/AppHeader';

export default function MessagesScreen() {
  const router = useRouter();
  const { chats, openChat, authStatus, openAuthModal, language } = useApp();

  const isGuest = authStatus === 'guest';
  const isFrench = language === 'fr';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState(false);

  const filteredChats = useMemo(() => {
    let list = chats;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.professionalName.toLowerCase().includes(q) ||
          c.professionalProfession.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }
    if (filterActive) {
      // Filter unread or online
      list = list.filter((c) => c.unreadCount > 0 || c.online);
    }
    return list;
  }, [chats, searchQuery, filterActive]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Unified App Header matching Marketplace Message Tab design */}
        <AppHeader title={isFrench ? 'Messages' : 'Messages'} eyebrow="MARKETPLACE" />

        {/* 4. Integrated Search & Filter Extension (Sub-Header) */}
        {!isGuest && (
          <View style={styles.subHeaderSearchSection}>
            {/* Pill-shaped search input */}
            <View style={styles.searchBarWrap}>
              <Ionicons name="search" size={18} color={Palette.secondaryText} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search conversations or artis..."
                placeholderTextColor={Palette.secondaryText}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                  <Ionicons name="close-circle" size={18} color={Palette.secondaryText} />
                </Pressable>
              )}
            </View>

            {/* Filter Action Button */}
            <Pressable
              onPress={() => setFilterActive(!filterActive)}
              style={[styles.filterActionBtn, filterActive && styles.filterActionBtnActive]}
              accessibilityLabel="Filters"
              accessibilityRole="button">
              <Ionicons
                name="options-outline"
                size={20}
                color={filterActive ? Palette.primary : Palette.dark}
              />
              {filterActive && <View style={styles.filterActiveDot} />}
            </Pressable>
          </View>
        )}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {isGuest ? (
            /* Dedicated Sign-in / Create Account Prompt */
            <View style={styles.guestCard}>
              <View style={styles.guestIconCircle}>
                <Ionicons name="chatbubbles" size={40} color={Palette.primary} />
              </View>

              <ThemedText type="headlineMd" style={styles.guestTitle}>
                {isFrench ? 'Connectez-vous pour échanger' : 'Sign in to use Messaging'}
              </ThemedText>

              <ThemedText style={styles.guestSub}>
                {isFrench
                  ? 'Créez un compte gratuit ou connectez-vous pour chatter directement avec vos artisans, envoyer des photos de travaux et recevoir des devis personnalisés.'
                  : 'Create a free account or sign in to chat directly with verified local artisans, send repair photos, and receive instant estimates.'}
              </ThemedText>

              {/* Value proposition badges */}
              <View style={styles.featureList}>
                <View style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
                  <ThemedText style={styles.featureText}>
                    {isFrench
                      ? 'Discussions directes avec les artisans'
                      : 'Direct 1-on-1 chat with verified artisans'}
                  </ThemedText>
                </View>

                <View style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
                  <ThemedText style={styles.featureText}>
                    {isFrench
                      ? 'Partage de photos et diagnostics de panne'
                      : 'Send photos of issues & repair diagnostics'}
                  </ThemedText>
                </View>

                <View style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
                  <ThemedText style={styles.featureText}>
                    {isFrench
                      ? 'Mises à jour d’arrivée et devis transparents'
                      : 'Real-time arrival updates & transparent estimates'}
                  </ThemedText>
                </View>
              </View>

              {/* Sign In / Create Account Button */}
              <Pressable onPress={() => openAuthModal()} style={styles.signInPrimaryBtn}>
                <ThemedText style={styles.signInPrimaryBtnText}>
                  {isFrench ? 'Se connecter / Créer un compte' : 'Sign In / Create Account'}
                </ThemedText>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : filteredChats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbox-ellipses-outline" size={48} color={Palette.secondaryText} />
              <ThemedText style={styles.emptyTitle}>
                {isFrench ? 'Aucun message trouvé' : 'No messages found'}
              </ThemedText>
              <ThemedText style={styles.emptySub}>
                {isFrench
                  ? 'Essayez de modifier vos critères de recherche ou réinitialisez le filtre.'
                  : 'Try changing your search keywords or clear the active filter.'}
              </ThemedText>
            </View>
          ) : (
            filteredChats.map((chat) => (
              <Pressable
                key={chat.id}
                onPress={() => openChat(chat.id)}
                style={styles.chatCard}>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: chat.professionalAvatar }} style={styles.avatar} />
                  {chat.online && <View style={styles.onlineDot} />}
                </View>

                <View style={styles.chatInfo}>
                  <View style={styles.chatHeaderRow}>
                    <ThemedText style={styles.proName}>{chat.professionalName}</ThemedText>
                    <ThemedText style={styles.timeText}>{chat.lastMessageTime}</ThemedText>
                  </View>
                  <ThemedText style={styles.proProfession}>{chat.professionalProfession}</ThemedText>
                  <ThemedText style={styles.lastMsgText} numberOfLines={1}>
                    {chat.lastMessage}
                  </ThemedText>
                </View>

                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <ThemedText style={styles.unreadBadgeText}>{chat.unreadCount}</ThemedText>
                  </View>
                )}
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
  // 1. TOP APP BAR / HEADER BAR (h-14 / h-16, docked full-width at top-0, border-b border-outline-variant)
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF', // Crisp, clean surface (bg-white / bg-surface)
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // #E2E8F0 divider line
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  // Marketplace Brand Icon: w-9 h-9 rounded-xl in Deep Navy / Artisan Blue (#12304A / #1769AA) with crossed tools
  brandIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Palette.dark, // #12304A
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHierarchy: {
    justifyContent: 'center',
  },
  // Eyebrow Tag: text-xs font-semibold tracking-wider text-slate-500
  eyebrowTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B', // text-slate-500
    letterSpacing: 1.1,
  },
  // Screen Title: text-xl font-bold text-slate-900 / #12304A
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#12304A',
    letterSpacing: -0.4,
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.accent,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  // Circular avatar button: w-9 h-9 rounded-full bg-primary / #1769AA text-white
  avatarShortcutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primary, // #1769AA
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 4. INTEGRATED SEARCH & FILTER EXTENSION (SUB-HEADER)
  subHeaderSearchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  // Full-width pill-shaped search input (bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5)
  searchBarWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Palette.dark,
    paddingVertical: 0,
  },
  // Filter Action Button (Filters)
  filterActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterActionBtnActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.surfaceContainerLow,
  },
  filterActiveDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.primary,
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
    paddingBottom: BottomTabInset + Spacing.xl + 20,
    gap: Spacing.md,
  },
  guestCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.outline,
    marginTop: Spacing.sm,
    ...Shadows.card,
  },
  guestIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.dark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  guestSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: Spacing.lg,
  },
  featureList: {
    width: '100%',
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: 13,
    color: Palette.dark,
    fontWeight: '600',
    flex: 1,
  },
  signInPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  signInPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.dark,
  },
  emptySub: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    maxWidth: 300,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Palette.success,
    borderWidth: 2,
    borderColor: Palette.surface,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.dark,
  },
  timeText: {
    fontSize: 11,
    color: Palette.secondaryText,
  },
  proProfession: {
    fontSize: 12,
    color: Palette.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  lastMsgText: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 3,
  },
  unreadBadge: {
    backgroundColor: Palette.accent,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
