import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import {
  Palette,
  Spacing,
  BorderRadius,
  MaxContentWidth,
} from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import LanguageModal from "./LanguageModal";
import CountryFlag from "./CountryFlag";

interface AppHeaderProps {
  title?: string;
  eyebrow?: string;
  onNotificationPress?: () => void;
  hasNotificationDot?: boolean;
}

export default function AppHeader({
  title,
  eyebrow = "MARKETPLACE",
  onNotificationPress,
  hasNotificationDot,
}: AppHeaderProps) {
  const router = useRouter();
  const { authStatus, openAuthModal, language } = useApp();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const isGuest = authStatus === "guest";
  const showDot =
    hasNotificationDot !== undefined ? hasNotificationDot : !isGuest;

  const handleAccountIconClick = () => {
    if (isGuest) {
      openAuthModal(() => {
        router.push("/profile");
      });
    } else {
      router.push("/profile");
    }
  };

  const handleNotificationClick = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else if (isGuest) {
      openAuthModal();
    } else {
      router.push("/bookings");
    }
  };

  return (
    <>
      <View style={styles.topAppBar}>
        {/* Left Section: Leading Brand Badge & Title Hierarchy (or Home Logo) */}
        {title ? (
          <View style={styles.appBarLeft}>
            <View style={styles.brandIconBadge}>
              <Ionicons name="construct" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.titleHierarchy}>
              <ThemedText style={styles.eyebrowTag}>{eyebrow}</ThemedText>
              <ThemedText style={styles.screenTitle}>{title}</ThemedText>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => router.push("/")}
            style={styles.brandRow}
            accessibilityLabel="ArtisanLink Home"
            accessibilityRole="link"
          >
            <View style={styles.brandIconBadge}>
              <Ionicons name="construct" size={18} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.brandName}>
              <ThemedText style={{ color: Palette.dark, fontWeight: "800" }}>
                Artisan
              </ThemedText>
              <ThemedText style={{ color: Palette.primary, fontWeight: "800" }}>
                Link
              </ThemedText>
            </ThemedText>
          </Pressable>
        )}

        {/* Right Section: Trailing Action Icons (Language, Notifications, Profile) */}
        <View style={styles.appBarRight}>
          {/* Language Selector Button */}
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

          {/* Notification Bell with alert dot indicator */}
          <Pressable
            onPress={handleNotificationClick}
            style={styles.actionIconBtn}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={20} color="#334155" />
            {showDot && <View style={styles.notifDot} />}
          </Pressable>

          {/* User Profile Avatar / Account Shortcut (Matching Home page icon) */}
          <Pressable
            onPress={handleAccountIconClick}
            style={styles.actionIconBtn}
            accessibilityLabel="Account profile"
            accessibilityRole="button"
          >
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={Palette.dark}
            />
          </Pressable>
        </View>
      </View>

      {/* Language Selection Modal */}
      <LanguageModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // 1. TOP APP BAR / HEADER BAR (docked full-width, clean divider)
  topAppBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  appBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // Marketplace Brand Icon: w-9 h-9 rounded-xl in Deep Navy with crossed tools
  brandIconBadge: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  titleHierarchy: {
    justifyContent: "center",
    gap: 0,
    flexShrink: 1,
  },
  // Eyebrow Tag: text-xs font-semibold tracking-wider text-slate-500
  eyebrowTag: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 11,
    color: "#64748B",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  // Screen Title: text-xl font-bold text-slate-900 / #12304A
  screenTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: "#12304A",
    letterSpacing: 0,
  },
  brandName: {
    fontSize: 20,
    letterSpacing: -0.3,
  },
  appBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  langBtn: {
    height: 36,
    paddingHorizontal: 9,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLow,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  langFlagEmoji: {
    fontSize: 14,
  },
  langCodeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.dark,
    letterSpacing: 0.3,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  notifDot: {
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
});
