import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { PrimaryButton } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';
import { supabase } from '../../lib/supabase';

export const VetOnboardingScreen: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Form State
  const [qualification, setQualification] = useState('');
  const [license, setLicense] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to set your practice location.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      setCoords({ lat: latitude, lng: longitude });

      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (place) {
        setLocationName(`${place.city || place.region}, ${place.country}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch your location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!qualification || !coords) {
      Alert.alert('Missing Info', 'Please provide your qualification and set your location.');
      return;
    }

    setLoading(true);
    try {
      if (!user) return;

      // 1. Update Profile with location
      await authService.updateProfile(user.id, {
        location: locationName,
        latitude: coords.lat,
        longitude: coords.lng
      });

      // 2. Create or Update Veterinarian record
      const { error: vetError } = await supabase
        .from('veterinarians')
        .upsert({
          profile_id: user.id,
          qualification,
          license_number: license,
          specializations: specializations.split(',').map(s => s.trim()),
          verification_status: 'verified',
          available_now: true,
          rating_average: 5.0,
          total_reviews: 0
        }, { onConflict: 'profile_id' });

      if (vetError) throw vetError;

      await refreshProfile();
      // AppNavigator will automatically switch to Dashboard because profile is now complete
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {profile?.full_name?.split(' ')[0]}!</Text>
          <Text style={styles.subtitle}>Let's set up your practice so farmers can find you.</Text>
        </View>

        <View style={styles.steps}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
        </View>

        {step === 1 ? (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Professional Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Qualification (e.g. BVSc, MVSc)</Text>
              <TextInput
                style={styles.input}
                value={qualification}
                onChangeText={setQualification}
                placeholder="Enter your highest degree"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>License Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={license}
                onChangeText={setLicense}
                placeholder="e.g. VET-12345"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specializations (comma separated)</Text>
              <TextInput
                style={styles.input}
                value={specializations}
                onChangeText={setSpecializations}
                placeholder="e.g. Cattle, Poultry, Surgery"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <PrimaryButton title="Next: Set Location" onPress={() => setStep(2)} />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Practice Location</Text>
            <Text style={styles.infoText}>Farmers will see your practice on the map and find you based on proximity.</Text>
            
            <TouchableOpacity 
              style={[styles.locationBtn, coords && styles.locationBtnActive]} 
              onPress={getCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <>
                  <Ionicons name="location" size={24} color={coords ? colors.textOnPrimary : colors.primary} />
                  <Text style={[styles.locationBtnText, coords && styles.locationBtnTextActive]}>
                    {coords ? 'Location Captured!' : 'Use My Current Location'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {locationName ? (
              <View style={styles.addressCard}>
                <Ionicons name="map-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.addressText}>{locationName}</Text>
              </View>
            ) : null}

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <PrimaryButton title="Complete Setup" onPress={handleComplete} loading={loading} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.xxl },
  header: { gap: spacing.xs, marginTop: spacing.md },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, color: colors.textSecondary },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 0, marginVertical: spacing.md },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.border },
  stepDotActive: { backgroundColor: colors.primary },
  stepLine: { width: 40, height: 2, backgroundColor: colors.border },
  form: { gap: spacing.xl },
  sectionTitle: { ...typography.h3, color: colors.text },
  inputGroup: { gap: spacing.sm },
  label: { ...typography.label },
  input: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...typography.body },
  infoText: { ...typography.bodySm, color: colors.textSecondary, marginBottom: spacing.sm },
  locationBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl, borderRadius: borderRadius.lg, borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed' },
  locationBtnActive: { backgroundColor: colors.primary, borderStyle: 'solid' },
  locationBtnText: { ...typography.button, color: colors.primary },
  locationBtnTextActive: { color: colors.textOnPrimary },
  addressCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, padding: spacing.lg, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.borderLight },
  addressText: { ...typography.bodySm, color: colors.textSecondary },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, marginTop: spacing.xl },
  backBtn: { padding: spacing.md },
  backBtnText: { ...typography.bodyMedium, color: colors.textSecondary },
});
