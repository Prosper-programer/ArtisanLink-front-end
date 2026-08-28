import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, MaxContentWidth, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function AppTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { authStatus, user, activeRole, serviceRequests, chats } = useApp();

  const isGuest = authStatus === 'guest';
  const isProviderRole = user.isProvider && activeRole === 'provider';

  const activeRequestsCount = serviceRequests.filter(
    (r) => r.status === 'Sent' || r.status === 'Accepted' || r.status === 'In Progress'
  ).length;

  const unreadChatsCount = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Dynamic tab definitions based on role
  const tabs = isProviderRole
    ? [
        { name: 'Dashboard', route: '/', icon: 'grid-outline', iconActive: 'grid' },
        { name: 'Requests', route: '/bookings', icon: 'clipboard-outline', iconActive: 'clipboard', badge: activeRequestsCount || undefined },
        { name: 'Jobs', route: '/explore', icon: 'briefcase-outline', iconActive: 'briefcase' },
        { name: 'Messages', route: '/messages', icon: 'chatbubbles-outline', iconActive: 'chatbubbles', badge: unreadChatsCount || undefined },
        { name: 'Profile', route: '/profile', icon: 'person-outline', iconActive: 'person' },
      ]
    : isGuest
    ? [
        { name: 'Home', route: '/', icon: 'home-outline', iconActive: 'home' },
        { name: 'Services', route: '/explore', icon: 'apps-outline', iconActive: 'apps' },
        { name: 'Explore', route: '/explore', icon: 'search-outline', iconActive: 'search' },
        { name: 'Account', route: '/profile', icon: 'person-circle-outline', iconActive: 'person-circle' },
      ]
    : [
        { name: 'Home', route: '/', icon: 'home-outline', iconActive: 'home' },
        { name: 'Services', route: '/explore', icon: 'apps-outline', iconActive: 'apps' },
        { name: 'My Requests', route: '/bookings', icon: 'calendar-outline', iconActive: 'calendar', badge: activeRequestsCount || undefined },
        { name: 'Messages', route: '/messages', icon: 'chatbubbles-outline', iconActive: 'chatbubbles', badge: unreadChatsCount || undefined },
        { name: 'Profile', route: '/profile', icon: 'person-outline', iconActive: 'person' },
      ];

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isFocused =
            tab.route === '/'
              ? pathname === '/' || pathname === '/index' || pathname === ''
              : pathname.startsWith(tab.route);

          return (
            <Pressable
              key={tab.name}
              onPress={() => router.push(tab.route as any)}
              style={({ pressed }) => [
                styles.tabBtn,
                isFocused && styles.tabBtnPoppedOut,
                pressed && styles.tabBtnPressed,
              ]}>
              {/* Icon Wrap */}
              <View style={[styles.iconWrap, isFocused && styles.iconWrapPoppedOut]}>
                <Ionicons
                  name={(isFocused ? tab.iconActive : tab.icon) as any}
                  size={isFocused ? 22 : 20}
                  color={isFocused ? '#FFFFFF' : Palette.dark}
                />

                {/* Counter Badge */}
                {tab.badge !== undefined && (
                  <View style={[styles.badge, isFocused && styles.badgePoppedOut]}>
                    <ThemedText style={styles.badgeText}>{tab.badge}</ThemedText>
                  </View>
                )}
              </View>

              {/* Tab Label */}
              <ThemedText
                style={[
                  styles.tabLabel,
                  isFocused && styles.tabLabelPoppedOut,
                ]}>
                {tab.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? Spacing.lg : Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 18 : 12,
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    paddingHorizontal: Spacing.xs,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: Palette.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
    gap: 2,
  },
  // Popped-out raised effect for active tab
  tabBtnPoppedOut: {
    transform: [{ translateY: -14 }],
  },
  tabBtnPressed: {
    opacity: 0.8,
  },
  iconWrap: {
    width: 38,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Solid Blue background when popped out
  iconWrapPoppedOut: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.primary, // #1769AA
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -4,
    backgroundColor: Palette.accent,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgePoppedOut: {
    top: -2,
    right: -2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.secondaryText,
  },
  // White label when active tab is popped out
  tabLabelPoppedOut: {
    color: Palette.primary,
    fontWeight: '800',
    fontSize: 11,
    marginTop: 2,
  },
});
