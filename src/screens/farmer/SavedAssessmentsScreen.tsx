import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing } from '../../constants/theme';
import { SearchInput, FilterChips, AssessmentCard, EmptyState, PrimaryButton } from '../../components';
import { Assessment } from '../../types';

const mockAssessments: Assessment[] = [
  {
    id: '1', farmer_id: '', animal_id: '1', raw_farmer_input: '',
    structured_symptoms: null, ai_summary: 'Signs of respiratory infection observed. Reduced appetite and labored breathing noted.',
    likely_condition: 'Upper Respiratory Infection', certainty_level: 'Moderate',
    possible_causes: [], suggested_next_steps: [], prevention_tips: [],
    urgency_level: 'medium', disclaimer: '', created_at: '2026-03-10T10:00:00Z',
    animal: { id: '1', farmer_id: '', tag_number: 'C-001', species: 'Cattle', breed: 'Brahman', age: '3 years', sex: 'female', notes: null, created_at: '' },
  },
  {
    id: '2', farmer_id: '', animal_id: '2', raw_farmer_input: '',
    structured_symptoms: null, ai_summary: 'Possible parasitic infection. Diarrhea and weight loss are key indicators.',
    likely_condition: 'Internal Parasites', certainty_level: 'High',
    possible_causes: [], suggested_next_steps: [], prevention_tips: [],
    urgency_level: 'high', disclaimer: '', created_at: '2026-03-08T14:00:00Z',
    animal: { id: '2', farmer_id: '', tag_number: 'G-005', species: 'Goats', breed: null, age: '1 year', sex: 'male', notes: null, created_at: '' },
    shared: true,
  },
];

const filters = ['All', 'Low', 'Medium', 'High', 'Critical'];

import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export const SavedAssessmentsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, loading: authLoading } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawCount, setRawCount] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Re-fetch every time screen comes into focus (after saving, navigating back, etc.)
  useFocusEffect(
    useCallback(() => {
      if (user) fetchAssessments();
    }, [user])
  );

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setAssessments([]);
        return;
      }

      // Fetch all assessments for this farmer
      const { data, error } = await supabase
        .from('assessments')
        .select(`
          *,
          animal:animals(*)
        `)
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Raw DB records:', data?.length, data?.map((a:any) => ({ id: a.id, condition: a.likely_condition, is_saved: a.is_saved })));
      setRawCount(data?.length ?? 0);

      // Normalize JSON fields (Supabase can return them as strings)
      const normalized = (data || []).map((a: any) => ({
        ...a,
        possible_causes: typeof a.possible_causes === 'string' ? (() => { try { return JSON.parse(a.possible_causes); } catch { return []; } })() : (a.possible_causes ?? []),
        suggested_next_steps: typeof a.suggested_next_steps === 'string' ? (() => { try { return JSON.parse(a.suggested_next_steps); } catch { return []; } })() : (a.suggested_next_steps ?? []),
        prevention_tips: typeof a.prevention_tips === 'string' ? (() => { try { return JSON.parse(a.prevention_tips); } catch { return []; } })() : (a.prevention_tips ?? []),
      }));

      setAssessments(normalized);
    } catch (err) {
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = assessments.filter((a) => {
    if (filter !== 'All' && a.urgency_level !== filter.toLowerCase()) return false;
    if (search && !(
      a.likely_condition?.toLowerCase().includes(search.toLowerCase()) ||
      a.animal?.tag_number?.toLowerCase().includes(search.toLowerCase())
    )) return false;
    return true;
  });

  if (authLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Saved Assessments</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Saved Assessments</Text>
          </View>
        </View>
        <EmptyState
          icon="document-text-outline"
          title="Sign In Required"
          message="Please sign in to save and view your livestock assessments."
          action={<PrimaryButton title="Sign In" onPress={() => navigation.navigate('Auth')} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Saved Assessments</Text>
          <Text style={styles.subtitle}>{assessments.length} assessments</Text>
        </View>
      </View>

      <View style={styles.filterArea}>
        <SearchInput value={search} onChangeText={setSearch} placeholder="Search assessments..." />
        <FilterChips filters={filters} selected={filter} onSelect={setFilter} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={({ item }) => (
            <AssessmentCard
              assessment={item}
              onPress={() => navigation.navigate('AssessmentResult', { assessmentId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="No Assessments Found"
              message="Start your first preliminary assessment to see results here."
              action={<PrimaryButton title="Start Assessment" onPress={() => navigation.navigate('AssistantChat')} />}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.sm },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  filterArea: { paddingHorizontal: spacing.xl, gap: spacing.sm, marginTop: spacing.md },
  list: { padding: spacing.xl },
});
