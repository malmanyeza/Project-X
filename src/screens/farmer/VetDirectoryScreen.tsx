import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TouchableWithoutFeedback, Keyboard, Modal, ActivityIndicator,
  Alert, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { FilterChips, VetCard, EmptyState } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { vetService } from '../../services/vets';

const filters = ['All', 'Available Now', 'Cattle', 'Goats', 'Poultry', 'Highest Rated'];

interface PinnedLocation {
  latitude: number;
  longitude: number;
  label: string;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export const VetDirectoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const handleVetPress = (item: any) => {
    navigation.navigate('VetProfileView', { vetId: item.id, vet: item });
  };

  const [mapVisible, setMapVisible] = useState(false);
  const [locating, setLocating] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState<PinnedLocation | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: -17.8292, longitude: 31.0522,
    latitudeDelta: 0.5, longitudeDelta: 0.5,
  });
  const [draftPin, setDraftPin] = useState<{ latitude: number; longitude: number } | null>(null);

  const [vets, setVets] = useState<any[]>([]);
  const [loadingVets, setLoadingVets] = useState(true);

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      setLoadingVets(true);
      const data = await vetService.getVets();
      setVets(data);
    } catch (error) {
      console.error('Error fetching vets:', error);
      Alert.alert('Error', 'Failed to load veterinarians.');
    } finally {
      setLoadingVets(false);
    }
  };

  const filtered = vets
    .map(v => {
      let distance;
      if (pinnedLocation && v.profile?.latitude && v.profile?.longitude) {
        distance = getDistance(
          pinnedLocation.latitude,
          pinnedLocation.longitude,
          v.profile.latitude,
          v.profile.longitude
        );
      }
      return { ...v, distance };
    })
    .filter((v) => {
      if (filter === 'Available Now' && !v.available_now) return false;
      if (filter === 'Cattle' && !v.specializations?.some((s: string) => s.toLowerCase().includes('cattle') || s.toLowerCase().includes('large'))) return false;
      if (filter === 'Poultry' && !v.specializations?.some((s: string) => s.toLowerCase().includes('poultry'))) return false;
      if (search && !v.profile?.full_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      if (a.distance !== undefined) return -1;
      if (b.distance !== undefined) return 1;
      return 0;
    });

  const openMap = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = loc.coords;
        setMapRegion({ latitude, longitude, latitudeDelta: 0.3, longitudeDelta: 0.3 });
        setDraftPin({ latitude, longitude });
      }
    } catch {
      // just open map at default region if location fails
    } finally {
      setLocating(false);
      setDraftPin(prev => prev ?? null);
      setMapVisible(true);
    }
  };

  const confirmPin = async () => {
    if (!draftPin) return;
    const [place] = await Location.reverseGeocodeAsync(draftPin).catch(() => [null]);
    const label = place
      ? [place.city, place.region, place.country].filter(Boolean).join(', ')
      : `${draftPin.latitude.toFixed(4)}, ${draftPin.longitude.toFixed(4)}`;
    setPinnedLocation({ ...draftPin, label });
    setMapVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Find a Veterinarian</Text>
          <Text style={styles.subtitle}>
            {pinnedLocation ? `Near ${pinnedLocation.label}` : 'Browse verified local vets'}
          </Text>
        </View>

        {/* Search bar with embedded map pin button */}
        <View style={styles.filterArea}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name or location..."
              placeholderTextColor={colors.textTertiary}
            />
            {search.length > 0 && (
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textTertiary}
                onPress={() => setSearch('')}
              />
            )}
            <View style={styles.searchDivider} />
            <TouchableOpacity onPress={openMap} disabled={locating} activeOpacity={0.75} style={styles.pinButton}>
              {locating ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name="location"
                  size={24}
                  color={pinnedLocation ? colors.primary : colors.textTertiary}
                />
              )}
              {pinnedLocation && <View style={styles.activeDot} />}
            </TouchableOpacity>
          </View>
          <FilterChips filters={filters} selected={filter} onSelect={setFilter} />
        </View>

        {/* Vet list */}
        {loadingVets ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Finding veterinarians nearby...</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            renderItem={({ item }) => (
              <VetCard
                vet={item}
                onPress={() => handleVetPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
            ListEmptyComponent={
              <EmptyState
                icon="people-outline"
                title="No Veterinarians Found"
                message="No veterinarians matching your search were found in your area yet."
              />
            }
          />
        )}

        {/* Map Modal */}
        <Modal visible={mapVisible} animationType="slide" statusBarTranslucent>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
              onRegionChangeComplete={setMapRegion}
              onPress={(e) => setDraftPin(e.nativeEvent.coordinate)}
            >
              {draftPin && (
                <Marker
                  coordinate={draftPin}
                  draggable
                  onDragEnd={(e) => setDraftPin(e.nativeEvent.coordinate)}
                  pinColor={colors.primary}
                />
              )}
            </MapView>

            {/* Map top bar */}
            <SafeAreaView style={styles.mapHeader} edges={['top']}>
              <TouchableOpacity style={styles.mapClose} onPress={() => setMapVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.mapTitle}>Pin Your Location</Text>
              <View style={{ width: 38 }} />
            </SafeAreaView>

            {/* Hint */}
            <View style={styles.mapHint}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.mapHintText}>Tap the map or drag the pin to set your location</Text>
            </View>

            {/* Confirm */}
            <View style={styles.mapFooter}>
              <TouchableOpacity
                style={[styles.confirmButton, !draftPin && styles.confirmButtonDisabled]}
                onPress={confirmPin}
                disabled={!draftPin}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.confirmButtonText}>Use This Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...typography.bodySm, color: colors.textSecondary, marginTop: spacing.md },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },

  // Search bar with pin
  filterArea: { paddingHorizontal: spacing.xl, gap: spacing.sm, marginTop: spacing.md },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  searchInput: {
    flex: 1, ...typography.body, color: colors.text, padding: 0,
  },
  searchDivider: {
    width: 1, height: 22, backgroundColor: colors.border, marginHorizontal: spacing.xs,
  },
  pinButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  activeDot: {
    position: 'absolute', top: -2, right: -2,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 1.5, borderColor: '#fff',
  },

  list: { padding: spacing.xl },

  // Map modal
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  mapHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  mapClose: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', ...shadows.sm,
  },
  mapTitle: { ...typography.h4 },
  mapHint: {
    position: 'absolute', top: 100, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  mapHintText: { ...typography.caption, color: colors.textSecondary, fontSize: 12 },
  mapFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255,255,255,0.97)', padding: spacing.xl,
    paddingBottom: 34, borderTopWidth: 1, borderTopColor: colors.borderLight,
  },
  confirmButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.primary,
    borderRadius: borderRadius.lg, paddingVertical: spacing.md + 2,
  },
  confirmButtonDisabled: { opacity: 0.45 },
  confirmButtonText: { ...typography.bodyMedium, color: '#fff', fontWeight: '700' },
});
