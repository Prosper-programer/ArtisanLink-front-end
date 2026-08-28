import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'headlineXl'
    | 'headlineLg'
    | 'headlineMd'
    | 'bodyLg'
    | 'bodyMd'
    | 'labelMd'
    | 'labelSm'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
  weight?: 'normal' | '500' | '600' | '700' | 'bold';
  color?: string;
};

export function ThemedText({
  style,
  type = 'default',
  themeColor,
  weight,
  color,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  const textColor = color ?? (themeColor ? theme[themeColor] : theme.text);

  return (
    <Text
      style={[
        { color: textColor, fontFamily: Fonts.sans },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'headlineXl' && styles.headlineXl,
        type === 'headlineLg' && styles.headlineLg,
        type === 'headlineMd' && styles.headlineMd,
        type === 'bodyLg' && styles.bodyLg,
        type === 'bodyMd' && styles.bodyMd,
        type === 'labelMd' && styles.labelMd,
        type === 'labelSm' && styles.labelSm,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  headlineXl: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headlineLg: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headlineMd: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  bodyLg: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  labelMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelSm: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
  },
  link: {
    lineHeight: 24,
    fontSize: 14,
    color: Palette.primary,
  },
  linkPrimary: {
    lineHeight: 24,
    fontSize: 14,
    color: Palette.primary,
    fontWeight: '600',
  },
  code: {
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
});
