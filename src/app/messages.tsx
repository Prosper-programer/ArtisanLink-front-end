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

export default function MessagesScreen() {
  const { chats, openChat, authStatus, openAuthModal } = useApp();

  const isGuest = authStatus === 'guest';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="headlineLg" style={styles.headerTitle}>
            Messages
          </ThemedText>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {isGuest ? (
            <View style={styles.guestPrompt}>
              <Ionicons name="chatbubbles-outline" size={48} color={Palette.primary} />
              <ThemedText style={styles.guestPromptTitle}>Sign in to view your messages</ThemedText>
              <ThemedText style={styles.guestPromptSub}>
                Communicate directly with local professionals regarding your project details and schedules.
              </ThemedText>
              <Pressable onPress={() => openAuthModal()} style={styles.signInBtn}>
                <ThemedText style={styles.signInBtnText}>Sign In / Create Account</ThemedText>
              </Pressable>
            </View>
          ) : chats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbox-ellipses-outline" size={48} color={Palette.secondaryText} />
              <ThemedText style={styles.emptyTitle}>No messages yet</ThemedText>
              <ThemedText style={styles.emptySub}>
                When you request a service or reach out to a professional, your chat history will appear here.
              </ThemedText>
            </View>
          ) : (
            chats.map((chat) => (
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
  header: {
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
    gap: Spacing.sm,
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
    textAlign: 'center',
  },
  chatCard: {
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
