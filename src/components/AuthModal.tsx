import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalVisible, closeAuthModal, login } = useApp();
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('Jean Dupont');
  const [email, setEmail] = useState('jean.dupont@artisanlink.com');
  const [password, setPassword] = useState('••••••••');

  if (!authModalVisible) return null;

  const handleAuthSubmit = () => {
    login();
  };

  return (
    <Modal visible={authModalVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <Pressable onPress={closeAuthModal} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Palette.dark} />
            </Pressable>
          </View>

          {/* Main Title & Prompt */}
          <ThemedText type="headlineMd" style={styles.promptTitle}>
            Create an account to request a service
          </ThemedText>
          <ThemedText style={styles.promptSubtitle}>
            Join ArtisanLink to connect with verified local professionals with guaranteed satisfaction.
          </ThemedText>

          {/* Benefits Checklist */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
              <ThemedText style={styles.benefitText}>Submit service requests</ThemedText>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
              <ThemedText style={styles.benefitText}>Real-time live request tracking</ThemedText>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
              <ThemedText style={styles.benefitText}>Direct chat with local professionals</ThemedText>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
              <ThemedText style={styles.benefitText}>Manage your profile & saved pros</ThemedText>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={18} color={Palette.success} />
              <ThemedText style={styles.benefitText}>Receive instant arrival notifications</ThemedText>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {isSignUp && (
              <View style={styles.inputWrap}>
                <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Jean Dupont"
                  placeholderTextColor={Palette.secondaryText}
                />
              </View>
            )}

            <View style={styles.inputWrap}>
              <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="name@example.com"
                placeholderTextColor={Palette.secondaryText}
              />
            </View>

            <View style={styles.inputWrap}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={Palette.secondaryText}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonActions}>
            <Pressable onPress={handleAuthSubmit} style={styles.primaryAuthBtn}>
              <ThemedText style={styles.primaryAuthBtnText}>
                {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
              </ThemedText>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>

            <Pressable
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.toggleAuthBtn}>
              <ThemedText style={styles.toggleAuthText}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create Account"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 48, 74, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Palette.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptTitle: {
    color: Palette.dark,
    marginTop: Spacing.xs,
  },
  promptSubtitle: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 4,
    lineHeight: 18,
  },
  benefitsCard: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Palette.outline,
    padding: Spacing.md,
    gap: Spacing.xs + 2,
    marginVertical: Spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: 13,
    color: Palette.dark,
    fontWeight: '500',
  },
  formContainer: {
    gap: Spacing.sm,
  },
  inputWrap: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.dark,
  },
  textInput: {
    height: 46,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    color: Palette.mainText,
  },
  buttonActions: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryAuthBtn: {
    height: 50,
    borderRadius: BorderRadius.default,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryAuthBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toggleAuthBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  toggleAuthText: {
    fontSize: 13,
    color: Palette.primary,
    fontWeight: '600',
  },
});
