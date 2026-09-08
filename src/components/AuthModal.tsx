import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Palette, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalVisible, closeAuthModal, login, register } = useApp();
  const [isSignUp, setIsSignUp] = useState(false); // Default to Sign In
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!authModalVisible) return null;

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage(null);
  };

  const handleAuthSubmit = async () => {
    setErrorMessage(null);

    // Basic Validation
    if (!email.trim() || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    if (isSignUp) {
      if (!fullName.trim() || !phoneNumber.trim() || !confirmPassword) {
        setErrorMessage('All registration fields are required');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const res = await register({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        });

        if (!res.success) {
          setErrorMessage(res.message);
        }
      } else {
        const res = await login({
          email: email.trim(),
          password,
        });

        if (!res.success) {
          setErrorMessage(res.message);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={authModalVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Main Title & Prompt */}
            <ThemedText type="headlineMd" style={styles.promptTitle}>
              {isSignUp ? 'Create your ArtisanLink account' : 'Welcome back to ArtisanLink'}
            </ThemedText>
            <ThemedText style={styles.promptSubtitle}>
              {isSignUp
                ? 'Join ArtisanLink to connect with verified local professionals with guaranteed satisfaction.'
                : 'Sign in to access your service requests, chats, and favorite professionals.'}
            </ThemedText>

            {/* Error Message Banner */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
              </View>
            )}

            {/* Benefits Checklist (only for sign up) */}
            {isSignUp && (
              <View style={styles.benefitsCard}>
                <View style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                  <ThemedText style={styles.benefitText}>Submit verified service requests</ThemedText>
                </View>
                <View style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                  <ThemedText style={styles.benefitText}>Direct chat with local artisans</ThemedText>
                </View>
                <View style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                  <ThemedText style={styles.benefitText}>Real-time job tracking & reviews</ThemedText>
                </View>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {isSignUp && (
                <>
                  <View style={styles.inputWrap}>
                    <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
                    <TextInput
                      style={styles.textInput}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="e.g. Alice Mengue"
                      placeholderTextColor={Palette.secondaryText}
                      autoCapitalize="words"
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputWrap}>
                    <ThemedText style={styles.inputLabel}>Phone Number</ThemedText>
                    <TextInput
                      style={styles.textInput}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      placeholder="e.g. 237690123456"
                      placeholderTextColor={Palette.secondaryText}
                      editable={!loading}
                    />
                  </View>
                </>
              )}

              <View style={styles.inputWrap}>
                <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="name@example.com"
                  placeholderTextColor={Palette.secondaryText}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrap}>
                <ThemedText style={styles.inputLabel}>Password</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="At least 6 characters"
                  placeholderTextColor={Palette.secondaryText}
                  editable={!loading}
                />
              </View>

              {isSignUp && (
                <View style={styles.inputWrap}>
                  <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="Re-enter your password"
                    placeholderTextColor={Palette.secondaryText}
                    editable={!loading}
                  />
                </View>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonActions}>
              <Pressable
                onPress={handleAuthSubmit}
                disabled={loading}
                style={[styles.primaryAuthBtn, loading && styles.btnDisabled]}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <ThemedText style={styles.primaryAuthBtnText}>
                      {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
                    </ThemedText>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={handleToggleMode}
                disabled={loading}
                style={styles.toggleAuthBtn}>
                <ThemedText style={styles.toggleAuthText}>
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Create Account"}
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
  scrollContent: {
    paddingBottom: Spacing.lg,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  errorText: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
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
    marginTop: Spacing.sm,
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
  btnDisabled: {
    opacity: 0.7,
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
