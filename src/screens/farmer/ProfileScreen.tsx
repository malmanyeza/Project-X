import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { Avatar, Card } from '../../components';

import { useAuth } from '../../context/AuthContext';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await signOut();
              // Explicitly transition to Auth screen to complete the logout flow visually
              navigation.navigate('Auth');
            } catch (err) {
              console.error('Error during signOut navigation:', err);
            }
          } 
        },
      ]
    );
  };

  const MenuItem = ({ icon, label, onPress, danger }: { icon: any; label: string; onPress: () => void; danger?: boolean }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <Ionicons name={icon} size={22} color={danger ? colors.error : colors.textSecondary} />
      <Text style={[styles.menuLabel, danger && { color: colors.error }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {!user ? (
          <View style={styles.guestHeader}>
            <View style={styles.guestIconWrap}>
              <Ionicons name="person" size={40} color={colors.textTertiary} />
            </View>
            <Text style={styles.guestTitle}>Browse as Guest</Text>
            <Text style={styles.guestSub}>Sign in to save assessments, book vets, and manage your livestock.</Text>
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={styles.signInText}>Sign In / Create Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileHeader}>
            <Avatar size={80} />
            <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="leaf" size={14} color={colors.primary} />
              <Text style={styles.roleText}>{profile?.role === 'vet' ? 'Veterinarian' : 'Farmer'}</Text>
            </View>
          </View>
        )}

        {user && (
          <Card style={styles.menuCard}>
            <MenuItem icon="person-outline" label="Edit Profile" onPress={() => {}} />
            <MenuItem icon="call-outline" label="Phone Number" onPress={() => {}} />
          </Card>
        )}

        <Card style={styles.menuCard}>
          <MenuItem icon="language-outline" label="Language" onPress={() => {}} />
        </Card>

        <Card style={styles.menuCard}>
          <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
          <MenuItem 
            icon="document-text-outline" 
            label="Privacy Policy" 
            onPress={() => navigation.navigate('Legal', { type: 'privacy' })} 
          />
          <MenuItem 
            icon="reader-outline" 
            label="Terms of Service" 
            onPress={() => navigation.navigate('Legal', { type: 'terms' })} 
          />
          <MenuItem icon="information-circle-outline" label="About Project X" onPress={() => {}} />
        </Card>

        {user && (
          <Card style={styles.menuCard}>
            <MenuItem icon="log-out-outline" label="Sign Out" onPress={handleSignOut} danger />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  profileHeader: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  name: { ...typography.h2, marginTop: spacing.md },
  email: { ...typography.bodySm, color: colors.textSecondary },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.successLight, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.pill },
  roleText: { ...typography.captionMedium, color: colors.primary },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  menuLabel: { ...typography.bodyMedium, flex: 1 },
  guestHeader: { alignItems: 'center', paddingVertical: spacing.xxl * 1.5, gap: spacing.md, paddingHorizontal: spacing.xl },
  guestIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.sm, marginBottom: spacing.md },
  guestTitle: { ...typography.h2, color: colors.text },
  guestSub: { ...typography.bodySm, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  signInButton: { marginTop: spacing.lg, backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg, width: '100%', alignItems: 'center' },
  signInText: { ...typography.bodyMedium, color: '#FFF' },
});
