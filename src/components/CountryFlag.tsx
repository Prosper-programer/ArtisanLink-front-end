import React, { useState } from 'react';
import { View, StyleSheet, Image, StyleProp, ViewStyle } from 'react-native';

interface CountryFlagProps {
  country: 'fr' | 'en' | 'gb';
  size?: number; // width, e.g. 22
  style?: StyleProp<ViewStyle>;
}

export default function CountryFlag({ country, size = 22, style }: CountryFlagProps) {
  const isFrench = country === 'fr';
  const height = Math.round((size * 3) / 4); // 4:3 standard flag ratio
  const [imageError, setImageError] = useState(false);

  const flagUri = isFrench
    ? 'https://flagcdn.com/w80/fr.png'
    : 'https://flagcdn.com/w80/gb.png';

  return (
    <View
      style={[
        styles.flagContainer,
        { width: size, height, borderRadius: Math.max(2, Math.round(size / 8)) },
        style,
      ]}>
      {/* 1. Styled Vector Fallback (always rendered immediately so no flash) */}
      {isFrench ? (
        <View style={styles.frenchVectorWrap}>
          <View style={[styles.frenchStripe, { backgroundColor: '#002654' }]} />
          <View style={[styles.frenchStripe, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.frenchStripe, { backgroundColor: '#CE1126' }]} />
        </View>
      ) : (
        <View style={styles.ukVectorWrap}>
          {/* Blue field */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#012169' }]} />
          {/* White diagonals */}
          <View style={[styles.ukDiagonal1, styles.ukWhiteDiagonal]} />
          <View style={[styles.ukDiagonal2, styles.ukWhiteDiagonal]} />
          {/* Red diagonals */}
          <View style={[styles.ukDiagonal1, styles.ukRedDiagonal]} />
          <View style={[styles.ukDiagonal2, styles.ukRedDiagonal]} />
          {/* White cross */}
          <View style={styles.ukWhiteCrossVertical} />
          <View style={styles.ukWhiteCrossHorizontal} />
          {/* Red cross */}
          <View style={styles.ukRedCrossVertical} />
          <View style={styles.ukRedCrossHorizontal} />
        </View>
      )}

      {/* 2. Official High-Res FlagCDN Overlay */}
      {!imageError && (
        <Image
          source={{ uri: flagUri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flagContainer: {
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 0.8,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  frenchVectorWrap: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  frenchStripe: {
    flex: 1,
    height: '100%',
  },
  ukVectorWrap: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  ukDiagonal1: {
    position: 'absolute',
    width: '150%',
    height: 3,
    top: '40%',
    left: '-25%',
    transform: [{ rotate: '30deg' }],
  },
  ukDiagonal2: {
    position: 'absolute',
    width: '150%',
    height: 3,
    top: '40%',
    left: '-25%',
    transform: [{ rotate: '-30deg' }],
  },
  ukWhiteDiagonal: {
    backgroundColor: '#FFFFFF',
    height: 4,
  },
  ukRedDiagonal: {
    backgroundColor: '#C8102E',
    height: 2,
  },
  ukWhiteCrossVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '37%',
    width: '26%',
    backgroundColor: '#FFFFFF',
  },
  ukWhiteCrossHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '35%',
    height: '30%',
    backgroundColor: '#FFFFFF',
  },
  ukRedCrossVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '42%',
    width: '16%',
    backgroundColor: '#C8102E',
  },
  ukRedCrossHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    height: '20%',
    backgroundColor: '#C8102E',
  },
});
