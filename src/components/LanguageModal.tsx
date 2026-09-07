import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Palette, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import CountryFlag from './CountryFlag';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageModal({ visible, onClose }: LanguageModalProps) {
  const { language, setLanguage } = useApp();
  const isFrench = language === 'fr';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleWrap}>
              <ThemedText style={styles.modalTitle}>
                {isFrench ? 'Choisir la langue' : 'Select Language'}
              </ThemedText>
              <ThemedText style={styles.modalSub}>
                {isFrench
                  ? "Choisissez votre langue d'affichage"
                  : 'Choose your display language'}
              </ThemedText>
            </View>
            <Pressable
              onPress={onClose}
              style={styles.modalCloseBtn}
              hitSlop={8}
              accessibilityLabel="Close">
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          <View style={styles.modalOptionsContainer}>
            {/* English Option */}
            <Pressable
              onPress={() => {
                setLanguage('en');
                onClose();
              }}
              style={[
                styles.modalLangCard,
                language === 'en' && styles.modalLangCardSelected,
              ]}>
              <View style={styles.modalFlagWrap}>
                <CountryFlag country="en" size={26} />
              </View>
              <View style={styles.modalLangTextWrap}>
                <ThemedText
                  style={[
                    styles.modalLangName,
                    language === 'en' && styles.modalLangNameSelected,
                  ]}>
                  English
                </ThemedText>
                <ThemedText style={styles.modalLangSub}>
                  Default (English)
                </ThemedText>
              </View>
              <View
                style={[
                  styles.modalRadio,
                  language === 'en' && styles.modalRadioSelected,
                ]}>
                {language === 'en' && <View style={styles.modalRadioInner} />}
              </View>
            </Pressable>

            {/* French Option */}
            <Pressable
              onPress={() => {
                setLanguage('fr');
                onClose();
              }}
              style={[
                styles.modalLangCard,
                language === 'fr' && styles.modalLangCardSelected,
              ]}>
              <View style={styles.modalFlagWrap}>
                <CountryFlag country="fr" size={26} />
              </View>
              <View style={styles.modalLangTextWrap}>
                <ThemedText
                  style={[
                    styles.modalLangName,
                    language === 'fr' && styles.modalLangNameSelected,
                  ]}>
                  Français
                </ThemedText>
                <ThemedText style={styles.modalLangSub}>
                  Langue française
                </ThemedText>
              </View>
              <View
                style={[
                  styles.modalRadio,
                  language === 'fr' && styles.modalRadioSelected,
                ]}>
                {language === 'fr' && <View style={styles.modalRadioInner} />}
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  modalTitleWrap: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.dark,
  },
  modalSub: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surfaceContainerLow,
  },
  modalOptionsContainer: {
    gap: Spacing.sm,
  },
  modalLangCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: Spacing.md,
  },
  modalLangCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: '#F0F7FF',
  },
  modalFlagWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  modalFlagEmoji: {
    fontSize: 20,
  },
  modalLangTextWrap: {
    flex: 1,
  },
  modalLangName: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.dark,
  },
  modalLangNameSelected: {
    color: Palette.primary,
    fontWeight: '700',
  },
  modalLangSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 1,
  },
  modalRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Palette.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRadioSelected: {
    borderColor: Palette.primary,
  },
  modalRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.primary,
  },
});
