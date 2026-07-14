import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { PrimaryButton } from '../../components';
import { authService } from '../../services/auth';

export const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.sentContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-open" size={44} color={colors.primary} />
          </View>
          <Text style={styles.sentTitle}>Check Your Email</Text>
          <Text style={styles.sentText}>
            We've sent a password reset link to {email}. Please check your inbox.
          </Text>
          <PrimaryButton title="Back to Sign In" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="key" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={colors.textTertiary} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <PrimaryButton title="Send Reset Link" onPress={handleReset} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 80, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: spacing.xxxl },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.successLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { ...typography.h1, marginBottom: spacing.sm },
  subtitle: { ...typography.bodySm, color: colors.textSecondary, textAlign: 'center', maxWidth: 300 },
  form: { gap: spacing.lg },
  inputGroup: { gap: spacing.sm },
  label: { ...typography.label },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    gap: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadows.sm,
  },
  input: { flex: 1, ...typography.body, color: colors.text, padding: 0 },
  sentContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xxl, gap: spacing.lg,
  },
  sentTitle: { ...typography.h2 },
  sentText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
