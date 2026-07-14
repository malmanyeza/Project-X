import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { PrimaryButton } from '../../components';
import { authService } from '../../services/auth';
import { UserRole } from '../../types';

export const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await authService.signUp(email.trim(), password, fullName.trim(), role, phone.trim());
      // Navigation will be handled automatically by AppNavigator listening to onAuthStateChange
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const RoleOption = ({ value, icon, label }: { value: UserRole; icon: any; label: string }) => (
    <TouchableOpacity
      style={[styles.roleCard, role === value && styles.roleCardActive]}
      onPress={() => setRole(value)}
      activeOpacity={0.7}
    >
      <View style={[styles.roleIcon, role === value && styles.roleIconActive]}>
        <Ionicons name={icon} size={28} color={role === value ? colors.textOnPrimary : colors.primary} />
      </View>
      <Text style={[styles.roleLabel, role === value && styles.roleLabelActive]}>{label}</Text>
      {role === value && (
        <View style={styles.checkMark}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 0 }} />
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Project X to care for your livestock</Text>
        </View>

        <View style={styles.roleSection}>
          <Text style={styles.label}>I am a</Text>
          <View style={styles.roleRow}>
            <RoleOption value="farmer" icon="leaf" label="Farmer" />
            <RoleOption value="vet" icon="medkit" label="Veterinarian" />
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="words"
              />
            </View>
          </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color={colors.textTertiary} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <PrimaryButton title="Create Account" onPress={handleSignUp} loading={loading} />
        </View>

        <TouchableOpacity style={styles.signInLink} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 20, paddingBottom: 40 },
  topBar: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, ...shadows.sm },
  header: { marginBottom: spacing.xxl },
  title: { ...typography.h1, marginBottom: spacing.sm },
  subtitle: { ...typography.bodySm, color: colors.textSecondary },
  roleSection: { marginBottom: spacing.xxl, gap: spacing.md },
  roleRow: { flexDirection: 'row', gap: spacing.md },
  roleCard: {
    flex: 1, alignItems: 'center', padding: spacing.lg, borderRadius: borderRadius.lg,
    borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, gap: spacing.sm,
  },
  roleCardActive: { borderColor: colors.primary, backgroundColor: colors.successLight },
  roleIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.successLight, alignItems: 'center', justifyContent: 'center',
  },
  roleIconActive: { backgroundColor: colors.primary },
  roleLabel: { ...typography.bodyMedium, color: colors.textSecondary },
  roleLabelActive: { color: colors.primary, fontWeight: '700' },
  checkMark: { position: 'absolute', top: 8, right: 8 },
  form: { gap: spacing.lg },
  inputGroup: { gap: spacing.sm },
  label: { ...typography.label },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    gap: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadows.sm,
  },
  input: { flex: 1, ...typography.body, color: colors.text, padding: 0 },
  signInLink: { marginTop: spacing.xxxl, alignItems: 'center' },
  signInText: { ...typography.bodySm, color: colors.textSecondary },
  signInBold: { color: colors.primary, fontWeight: '600' },
});
