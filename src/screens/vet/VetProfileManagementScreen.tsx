import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { Avatar, Card } from '../../components';
import { useAuth } from '../../context/AuthContext';
import * as Location from 'expo-location';
import { authService } from '../../services/auth';

export const VetProfileManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { profile, signOut, refreshProfile } = useAuth();
  const [updating, setUpdating] = React.useState(false);

  const updateLocation = async () => {
    try {
      setUpdating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to set your practice location.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get a readable address
      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const locationName = place 
        ? `${place.city || place.region}, ${place.country}`
        : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      if (profile?.id) {
        await authService.updateProfile(profile.id, {
          latitude,
          longitude,
          location: locationName
        });
        await refreshProfile();
        Alert.alert('Success', `Location updated to ${locationName}`);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Error', 'Failed to update location. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  const MenuItem = ({ icon, label, value, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <Ionicons name={icon} size={22} color={colors.textSecondary} />
      <View style={styles.menuInfo}><Text style={styles.menuLabel}>{label}</Text>{value && <Text style={styles.menuValue}>{value}</Text>}</View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileHeader}>
          <Avatar size={80} url={profile?.avatar_url} />
          <Text style={styles.name}>{profile?.full_name || 'Doctor'}</Text>
          <Text style={styles.email}>{profile?.email || 'vet@example.com'}</Text>
        </View>

        <Card style={styles.menuCard}>
          <MenuItem icon="person-outline" label="Full Name" value={profile?.full_name || 'Not set'} onPress={() => {}} />
          <MenuItem icon="school-outline" label="Qualification" value="BVSc, MVSc" onPress={() => {}} />
          <MenuItem icon="document-text-outline" label="License Number" value="VET-2019-1234" onPress={() => {}} />
          <MenuItem 
            icon="location-outline" 
            label="Practice Location" 
            value={updating ? 'Updating...' : profile?.location || 'Not set'} 
            onPress={updateLocation} 
          />
        </Card>

        <Card style={styles.menuCard}>
          <MenuItem icon="paw-outline" label="Specializations" value="Large Animals, Cattle" onPress={() => {}} />
          <MenuItem icon="cash-outline" label="Consultation Fee" value="$50" onPress={() => {}} />
          <MenuItem icon="chatbubble-outline" label="Consultation Methods" value="Chat, Phone, In-person" onPress={() => {}} />
          <MenuItem icon="create-outline" label="Bio" value="Tap to edit" onPress={() => {}} />
        </Card>

        <Card style={styles.menuCard}>
          <MenuItem icon="star-outline" label="My Reviews" value="4.8 ★ (24 reviews)" onPress={() => navigation.navigate('VetReviews')} />
        </Card>

        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            Alert.alert('Sign Out', 'Are you sure?', [
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
              }
            ])
          }}>
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
            <Text style={[styles.menuLabel, { color: colors.error, flex: 1 }]}>Sign Out</Text>
          </TouchableOpacity>
        </Card>
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
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.successLight, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.pill },
  badgeText: { ...typography.captionMedium, color: colors.primary },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  menuInfo: { flex: 1 },
  menuLabel: { ...typography.bodyMedium },
  menuValue: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
});
