import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useColorScheme, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from '@/context/AppContext';
import AppTabs from '@/components/app-tabs';
import { SplashScreen } from '@/components/SplashScreen';
import { LanguageScreen } from '@/components/LanguageScreen';
import { OnboardingModal } from '@/components/OnboardingModal';
import { ServiceDetailsModal } from '@/components/ServiceDetailsModal';
import { AuthModal } from '@/components/AuthModal';
import { BookingModal } from '@/components/BookingModal';
import { RequestSubmittedModal } from '@/components/RequestSubmittedModal';
import { RequestDetailsModal } from '@/components/RequestDetailsModal';
import { ArtisanProfileModal } from '@/components/ArtisanProfileModal';
import { BecomeSellerModal } from '@/components/BecomeSellerModal';
import { ChatModal } from '@/components/ChatModal';
import { Palette } from '@/constants/theme';

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const colorScheme = useColorScheme();
  const { appPhase } = useApp();

  useEffect(() => {
    ExpoSplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style={appPhase === 'SPLASH' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Main Navigation Slot */}
      <Slot />

      {/* Bottom Tabs Navigation */}
      {appPhase === 'APP' && <AppTabs />}

      {/* Linear Flow Overlays */}
      {appPhase === 'SPLASH' && <SplashScreen />}
      {appPhase === 'LANGUAGE' && <LanguageScreen />}
      {appPhase === 'ONBOARDING' && <OnboardingModal />}

      {/* Global Modals */}
      <ServiceDetailsModal />
      <AuthModal />
      <BookingModal />
      <RequestSubmittedModal />
      <RequestDetailsModal />
      <ArtisanProfileModal />
      <BecomeSellerModal />
      <ChatModal />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
});
