import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { VetTabParamList } from '../types';
import { colors, typography } from '../constants/theme';
import { VetDashboardScreen } from '../screens/vet/DashboardScreen';
import { FarmerRequestsScreen } from '../screens/vet/FarmerRequestsScreen';
import { VetChatListScreen } from '../screens/vet/VetChatListScreen';
import { VetProfileManagementScreen } from '../screens/vet/VetProfileManagementScreen';

const Tab = createBottomTabNavigator<VetTabParamList>();

export const VetTabNavigator: React.FC = () => {
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
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (focused) {
            switch (route.name) {
              case 'Dashboard': iconName = 'grid'; break;
              case 'Requests': iconName = 'mail'; break;
              case 'Chats': iconName = 'chatbubbles'; break;
              case 'VetProfile': iconName = 'person'; break;
            }
          } else {
            switch (route.name) {
              case 'Dashboard': iconName = 'grid-outline'; break;
              case 'Requests': iconName = 'mail-outline'; break;
              case 'Chats': iconName = 'chatbubbles-outline'; break;
              case 'VetProfile': iconName = 'person-outline'; break;
            }
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={VetDashboardScreen} />
      <Tab.Screen name="Requests" component={FarmerRequestsScreen} />
      <Tab.Screen name="Chats" component={VetChatListScreen} />
      <Tab.Screen name="VetProfile" component={VetProfileManagementScreen} />
    </Tab.Navigator>
  );
};
