import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FarmerTabParamList } from '../types';
import { colors, typography } from '../constants/theme';
import { FarmerHomeScreen } from '../screens/farmer/HomeScreen';
import { AssistantScreen } from '../screens/farmer/AssistantScreen';
import { VetDirectoryScreen } from '../screens/farmer/VetDirectoryScreen';

import { FarmerChatListScreen } from '../screens/farmer/FarmerChatListScreen';
import { ProfileScreen } from '../screens/farmer/ProfileScreen';

const Tab = createBottomTabNavigator<FarmerTabParamList>();

export const FarmerTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          ...typography.captionMedium,
          fontSize: 12,
        },
        tabBarStyle: {
          height: 80,
          paddingBottom: 25,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (focused) {
            switch (route.name) {
              case 'Home': iconName = 'home'; break;
              case 'Chats': iconName = 'chatbubbles'; break;
              case 'Vets': iconName = 'people'; break;
              case 'Profile': iconName = 'person'; break;
            }
          } else {
            switch (route.name) {
              case 'Home': iconName = 'home-outline'; break;
              case 'Chats': iconName = 'chatbubbles-outline'; break;
              case 'Vets': iconName = 'people-outline'; break;
              case 'Profile': iconName = 'person-outline'; break;
            }
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={FarmerHomeScreen} />
      <Tab.Screen name="Chats" component={FarmerChatListScreen} />
      <Tab.Screen name="Vets" component={VetDirectoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
