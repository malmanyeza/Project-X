import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { Card, EmptyState, Avatar } from '../../components';

const mockReviews = [
  { id: '1', farmer: 'John Farmer', rating: 5, comment: 'Very knowledgeable and helpful. My cow recovered quickly thanks to Dr. Moyo.', date: '2026-03-08' },
  { id: '2', farmer: 'Mary Chikwanha', rating: 4, comment: 'Good advice but response was a bit slow. Overall satisfied.', date: '2026-03-05' },
  { id: '3', farmer: 'Peter Nyika', rating: 5, comment: 'Excellent vet! Very patient and thorough with explanations.', date: '2026-02-28' },
];

export const ReviewsScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <SafeAreaView style={styles.container} edges={['top']}>
    <View style={styles.header}>
      <Text style={styles.title}>My Reviews</Text>
      <View style={styles.ratingOverview}>
        <Ionicons name="star" size={22} color={colors.accent} />
        <Text style={styles.ratingNum}>4.8</Text>
        <Text style={styles.ratingCount}>({mockReviews.length} reviews)</Text>
      </View>
    </View>
    <FlatList
      data={mockReviews}
      renderItem={({ item }) => (
        <Card style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Avatar size={36} />
            <View style={styles.reviewInfo}><Text style={styles.reviewName}>{item.farmer}</Text><Text style={styles.reviewDate}>{item.date}</Text></View>
            <View style={styles.stars}>{Array.from({ length: item.rating }).map((_, i) => <Ionicons key={i} name="star" size={14} color={colors.accent} />)}</View>
          </View>
          <Text style={styles.reviewComment}>{item.comment}</Text>
        </Card>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ListEmptyComponent={<EmptyState icon="star-outline" title="No Reviews Yet" message="Reviews from farmers will appear here." />}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.md },
  title: { ...typography.h1 },
  ratingOverview: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ratingNum: { ...typography.h2 },
  ratingCount: { ...typography.bodySm, color: colors.textSecondary },
  list: { padding: spacing.xl },
  reviewCard: { padding: spacing.lg, gap: spacing.md },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  reviewInfo: { flex: 1 },
  reviewName: { ...typography.bodyMedium, fontSize: 14 },
  reviewDate: { ...typography.caption, color: colors.textTertiary },
  stars: { flexDirection: 'row', gap: 1 },
  reviewComment: { ...typography.bodySm, color: colors.textSecondary, lineHeight: 20 },
});
