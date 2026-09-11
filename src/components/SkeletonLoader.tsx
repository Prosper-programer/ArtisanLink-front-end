import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue } from 'react-native';
import { Palette, BorderRadius, Spacing } from '@/constants/theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = BorderRadius.sm,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const SkeletonArtisanCard: React.FC = () => (
  <View style={styles.artisanCard}>
    <View style={styles.artisanRow}>
      <Skeleton width={68} height={68} borderRadius={34} />
      <View style={{ flex: 1, gap: 8 }}>
        <Skeleton width="70%" height={16} />
        <Skeleton width="45%" height={12} />
        <Skeleton width="30%" height={10} />
      </View>
    </View>
    <View style={styles.cardFooter}>
      <Skeleton width="30%" height={24} borderRadius={BorderRadius.full} />
      <Skeleton width="25%" height={24} borderRadius={BorderRadius.full} />
      <Skeleton width="35%" height={24} borderRadius={BorderRadius.full} />
    </View>
  </View>
);

export const SkeletonServiceCard: React.FC = () => (
  <View style={styles.serviceCard}>
    <Skeleton width="100%" height={110} borderRadius={BorderRadius.lg} />
    <View style={{ padding: Spacing.sm, gap: 6 }}>
      <Skeleton width="65%" height={14} />
      <Skeleton width="90%" height={10} />
      <Skeleton width="40%" height={10} />
    </View>
  </View>
);

export const SkeletonRequestCard: React.FC = () => (
  <View style={styles.requestCard}>
    <View style={styles.requestHeader}>
      <Skeleton width="35%" height={18} borderRadius={BorderRadius.sm} />
      <Skeleton width="25%" height={14} />
    </View>
    <Skeleton width="80%" height={16} style={{ marginVertical: 4 }} />
    <Skeleton width="100%" height={12} />
    <Skeleton width="60%" height={12} />
    <View style={styles.requestFooter}>
      <Skeleton width={32} height={32} borderRadius={16} />
      <Skeleton width="40%" height={12} />
    </View>
  </View>
);

export const SkeletonMessageRow: React.FC = () => (
  <View style={styles.messageRow}>
    <Skeleton width={52} height={52} borderRadius={26} />
    <View style={{ flex: 1, gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Skeleton width="45%" height={14} />
        <Skeleton width="20%" height={10} />
      </View>
      <Skeleton width="80%" height={12} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#E2E8F0',
  },
  artisanCard: {
    backgroundColor: Palette.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.outline,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  serviceCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  requestCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.outline,
    marginBottom: Spacing.md,
    gap: 6,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  requestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.outline,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.outline,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
});