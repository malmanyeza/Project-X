import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../constants/theme';

interface AvatarProps {
  uri?: string | null;
  url?: string | null;
  size?: number;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, url, size = 44, iconName = 'person' }) => {
  const imageSource = uri || url;
  if (imageSource) {
    return (
      <Image
        source={{ uri: imageSource }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Ionicons name={iconName} size={size * 0.45} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
