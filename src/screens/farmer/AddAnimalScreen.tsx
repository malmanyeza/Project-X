import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { PrimaryButton } from '../../components';
import { ANIMAL_SPECIES } from '../../constants';

export const AddAnimalScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [species, setSpecies] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'unknown'>('unknown');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!species) { Alert.alert('Required', 'Please select a species.'); return; }
    Alert.alert('Saved', 'Animal record saved successfully.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const InputField = ({ label, value, onChangeText, placeholder, ...rest }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textTertiary} {...rest} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{route?.params?.animalId ? 'Edit Animal' : 'Add Animal'}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Species *</Text>
        <View style={styles.speciesGrid}>
          {ANIMAL_SPECIES.slice(0, 6).map((s) => (
            <TouchableOpacity key={s} style={[styles.speciesChip, species === s && styles.speciesActive]} onPress={() => setSpecies(s)}>
              <Text style={[styles.speciesText, species === s && styles.speciesTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <InputField label="Tag / ID Number" value={tagNumber} onChangeText={setTagNumber} placeholder="e.g. C-001" />
        <InputField label="Breed" value={breed} onChangeText={setBreed} placeholder="e.g. Brahman" />
        <InputField label="Age" value={age} onChangeText={setAge} placeholder="e.g. 3 years" />
        <Text style={styles.label}>Sex</Text>
        <View style={styles.sexRow}>
          {(['male', 'female', 'unknown'] as const).map((s) => (
            <TouchableOpacity key={s} style={[styles.sexChip, sex === s && styles.sexActive]} onPress={() => setSex(s)}>
              <Text style={[styles.sexChipText, sex === s && styles.sexChipTextActive]}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <InputField label="Notes" value={notes} onChangeText={setNotes} placeholder="Any additional notes..." multiline numberOfLines={3} />
        <PrimaryButton title="Save Animal" onPress={handleSave} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { ...typography.h4 },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  sectionTitle: { ...typography.label, marginBottom: spacing.xs },
  speciesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  speciesChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.pill, backgroundColor: colors.chipBackground, borderWidth: 1, borderColor: colors.border },
  speciesActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  speciesText: { ...typography.buttonSm, color: colors.textSecondary },
  speciesTextActive: { color: colors.textOnPrimary },
  inputGroup: { gap: spacing.xs },
  label: { ...typography.label },
  input: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...typography.body, color: colors.text, borderWidth: 1, borderColor: colors.border },
  sexRow: { flexDirection: 'row', gap: spacing.sm },
  sexChip: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.chipBackground, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  sexActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sexChipText: { ...typography.buttonSm, color: colors.textSecondary },
  sexChipTextActive: { color: colors.textOnPrimary },
});
