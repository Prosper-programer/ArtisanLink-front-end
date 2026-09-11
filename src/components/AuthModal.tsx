import React, { useState, useEffect } from 'react';
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
  const { authModalVisible, closeAuthModal, login, register, authInitialMode } = useApp();
  const [isSignUp, setIsSignUp] = useState(authInitialMode === 'signup');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (authModalVisible) {
      setIsSignUp(authInitialMode === 'signup');
      setFieldErrors({});
      setGeneralError(null);
    }
  }, [authModalVisible, authInitialMode]);

  if (!authModalVisible) return null;

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setFieldErrors({});
    setGeneralError(null);
  };

  const handleAuthSubmit = async () => {
    const errors: Record<string, string> = {};
    setGeneralError(null);

    if (isSignUp) {
      if (!fullName.trim()) {
        errors.fullName = 'Full name is required';
      }
      if (!phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required';
      } else if (phoneNumber.trim().length < 8) {
        errors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!email.includes('@') || !email.includes('.')) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!confirmPassword) {
        errors.confirmPassword = 'Confirmation password is required';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
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
          setGeneralError(res.message);
        }
      } else {
        const res = await login({
          email: email.trim(),
          password,
        });

        if (!res.success) {
          setGeneralError(res.message);
        }
      }
    } catch (err: any) {
      setGeneralError(err.message || 'An unexpected error occurred');
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

            {/* Server Error Message Banner (only if server returned error like wrong password) */}
            {generalError && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <ThemedText style={styles.errorText}>{generalError}</ThemedText>
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
                    <ThemedText style={styles.inputLabel}>Full Name *</ThemedText>
                    <View style={[styles.inputBox, fieldErrors.fullName && styles.inputBoxError]}>
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={fieldErrors.fullName ? Palette.errorRed : Palette.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInputInner}
                        value={fullName}
                        onChangeText={(text) => {
                          setFullName(text);
                          if (fieldErrors.fullName) {
                            setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                          }
                        }}
                        placeholder="e.g. Alice Mengue"
                        placeholderTextColor={Palette.secondaryText}
                        autoCapitalize="words"
                        editable={!loading}
                      />
                    </View>
                    {fieldErrors.fullName ? (
                      <View style={styles.fieldErrorRow}>
                        <Ionicons name="alert-circle" size={13} color={Palette.errorRed} />
                        <ThemedText style={styles.fieldErrorText}>{fieldErrors.fullName}</ThemedText>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.inputWrap}>
                    <ThemedText style={styles.inputLabel}>Phone Number *</ThemedText>
                    <View style={[styles.inputBox, fieldErrors.phoneNumber && styles.inputBoxError]}>
                      <Ionicons
                        name="call-outline"
                        size={18}
                        color={fieldErrors.phoneNumber ? Palette.errorRed : Palette.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInputInner}
                        value={phoneNumber}
                        onChangeText={(text) => {
                          setPhoneNumber(text);
                          if (fieldErrors.phoneNumber) {
                            setFieldErrors((prev) => ({ ...prev, phoneNumber: '' }));
                          }
                        }}
                        keyboardType="phone-pad"
                        placeholder="e.g. 237690123456"
                        placeholderTextColor={Palette.secondaryText}
                        editable={!loading}
                      />
                    </View>
                    {fieldErrors.phoneNumber ? (
                      <View style={styles.fieldErrorRow}>
                        <Ionicons name="alert-circle" size={13} color={Palette.errorRed} />
                        <ThemedText style={styles.fieldErrorText}>{fieldErrors.phoneNumber}</ThemedText>
                      </View>
                    ) : null}
                  </View>
                </>
              )}

              <View style={styles.inputWrap}>
                <ThemedText style={styles.inputLabel}>Email Address *</ThemedText>
                <View style={[styles.inputBox, fieldErrors.email && styles.inputBoxError]}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={fieldErrors.email ? Palette.errorRed : Palette.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInputInner}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="name@example.com"
                    placeholderTextColor={Palette.secondaryText}
                    editable={!loading}
                  />
                </View>
                {fieldErrors.email ? (
                  <View style={styles.fieldErrorRow}>
                    <Ionicons name="alert-circle" size={13} color={Palette.errorRed} />
                    <ThemedText style={styles.fieldErrorText}>{fieldErrors.email}</ThemedText>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputWrap}>
                <ThemedText style={styles.inputLabel}>Password *</ThemedText>
                <View style={[styles.inputBox, fieldErrors.password && styles.inputBoxError]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={fieldErrors.password ? Palette.errorRed : Palette.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInputInner}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: '' }));
                      }
                    }}
                    secureTextEntry
                    placeholder="At least 6 characters"
                    placeholderTextColor={Palette.secondaryText}
                    editable={!loading}
                  />
                </View>
                {fieldErrors.password ? (
                  <View style={styles.fieldErrorRow}>
                    <Ionicons name="alert-circle" size={13} color={Palette.errorRed} />
                    <ThemedText style={styles.fieldErrorText}>{fieldErrors.password}</ThemedText>
                  </View>
                ) : null}
              </View>

              {isSignUp && (
                <View style={styles.inputWrap}>
                  <ThemedText style={styles.inputLabel}>Confirm Password *</ThemedText>
                  <View style={[styles.inputBox, fieldErrors.confirmPassword && styles.inputBoxError]}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color={fieldErrors.confirmPassword ? Palette.errorRed : Palette.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInputInner}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (fieldErrors.confirmPassword) {
                          setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }
                      }}
                      secureTextEntry
                      placeholder="Re-enter your password"
                      placeholderTextColor={Palette.secondaryText}
                      editable={!loading}
                    />
                  </View>
                  {fieldErrors.confirmPassword ? (
                    <View style={styles.fieldErrorRow}>
                      <Ionicons name="alert-circle" size={13} color={Palette.errorRed} />
                      <ThemedText style={styles.fieldErrorText}>{fieldErrors.confirmPassword}</ThemedText>
                    </View>
                  ) : null}
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
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.outline,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.sm,
  },
  inputBoxError: {
    borderColor: Palette.errorRed,
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: Spacing.xs,
  },
  textInputInner: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: Palette.mainText,
  },
  fieldErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  fieldErrorText: {
    fontSize: 11,
    color: Palette.errorRed,
    fontWeight: '600',
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
