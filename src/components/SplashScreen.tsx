import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 1600,
}) => {
  const { setAppPhase, isAppReady } = useApp();

  const logoScale = useState(new Animated.Value(0.85))[0];
  const logoOpacity = useState(new Animated.Value(0))[0];
  const textOpacity = useState(new Animated.Value(0))[0];
  const progressWidth = useState(new Animated.Value(0))[0];
  const screenFadeOut = useState(new Animated.Value(1))[0];
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // 1. Logo entrance
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Text entrance
    setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 250);

    // 3. Smooth progress line
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  // 4. Smooth transition only when both min entrance animation & all assets are ready
  useEffect(() => {
    if (minTimeElapsed && isAppReady) {
      Animated.timing(screenFadeOut, {
        toValue: 0,
        duration: 350,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) {
          onFinish();
        } else {
          setAppPhase('LANGUAGE');
        }
      });
    }
  }, [minTimeElapsed, isAppReady]);

  const progressInterpolated = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeOut }]}>
      {/* Background ambient lighting */}
      <View style={styles.ambientTopGlow} />

      <View style={styles.centerBox}>
        {/* Logo Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}>
          <View style={styles.logoBadge}>
            <Ionicons name="construct" size={44} color="#FFFFFF" />
            <View style={styles.accentDot} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <ThemedText style={styles.brandTitle}>
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '800' }}>Artisan</ThemedText>
            <ThemedText style={{ color: '#38BDF8', fontWeight: '800' }}>Link</ThemedText>
          </ThemedText>
          <ThemedText style={styles.brandTagline}>Connect. Hire. Build.</ThemedText>
        </Animated.View>
      </View>

      {/* Subtle Bottom Startup Loader */}
      <View style={styles.loaderContainer}>
        <View style={styles.loaderTrack}>
          <Animated.View
            style={[
              styles.loaderFill,
              { width: progressInterpolated },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#12304A', // Exact background requirement
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  ambientTopGlow: {
    position: 'absolute',
    top: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(23, 105, 170, 0.12)',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  accentDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F28C28', // Exact accent requirement
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: Spacing.xl * 1.5,
    width: 140,
    alignItems: 'center',
  },
  loaderTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    backgroundColor: '#F28C28',
    borderRadius: 2,
  },
});
