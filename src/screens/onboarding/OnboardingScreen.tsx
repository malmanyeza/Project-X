import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { PrimaryButton } from '../../components';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    iconType: 'MaterialCommunityIcons' as const,
    icon: 'cow' as const,
    title: 'AI-Powered Health Support',
    description: 'Get preliminary assessments for your livestock by simply describing symptoms in your own words.',
    color: colors.primary,
  },
  {
    id: '2',
    iconType: 'Ionicons' as const,
    icon: 'chatbubbles' as const,
    title: 'Natural Symptom Reporting',
    description: 'Talk to our AI assistant like you would to a friend. No complicated forms — just describe what you see.',
    color: colors.secondary,
  },
  {
    id: '3',
    iconType: 'Ionicons' as const,
    icon: 'people' as const,
    title: 'Connect With Local Vets',
    description: 'Find verified veterinarians in your area. Share AI assessments and chat directly for expert advice.',
    color: colors.accent,
  },
  {
    id: '4',
    iconType: 'Ionicons' as const,
    icon: 'save' as const,
    title: 'Save & Track Health',
    description: 'Keep records of all assessments and animal health history. Share reports when you need professional help.',
    color: colors.success,
  },
];

export const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Auth');
    }
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconCircle, { backgroundColor: item.color + '18' }]}>
        {item.iconType === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons name={item.icon as any} size={64} color={item.color} />
        ) : (
          <Ionicons name={item.icon as any} size={64} color={item.color} />
        )}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace('Auth')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, currentIndex === i && styles.dotActive]}
            />
          ))}
        </View>

        <PrimaryButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={goNext}
          style={{ width: '100%' }}
        />

        {currentIndex === slides.length - 1 && (
          <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'SignIn' })}>
            <Text style={styles.signInText}>
              Already have an account? <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.xl,
    zIndex: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  skipText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 26,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 50,
    gap: spacing.xl,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  signInText: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  signInLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
