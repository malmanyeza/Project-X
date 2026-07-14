import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, FarmerStackParamList, VetStackParamList } from '../types';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { AuthNavigator } from './AuthNavigator';
import { FarmerTabNavigator } from './FarmerTabNavigator';
import { VetTabNavigator } from './VetTabNavigator';

// Farmer Details
import { AssessmentResultScreen } from '../screens/farmer/AssessmentResultScreen';
import { SavedAssessmentsScreen } from '../screens/farmer/SavedAssessmentsScreen';
import { AssistantScreen } from '../screens/farmer/AssistantScreen';
import { VetProfileScreen } from '../screens/farmer/VetProfileScreen';
import { ChatScreen } from '../screens/farmer/ChatScreen';
import { AddAnimalScreen } from '../screens/farmer/AddAnimalScreen';
import { NotificationsScreen } from '../screens/farmer/NotificationsScreen';

// Vet Details
import { FarmerRequestsScreen } from '../screens/vet/FarmerRequestsScreen';
import { ReviewsScreen } from '../screens/vet/ReviewsScreen';
import { SharedReportsScreen } from '../screens/vet/SharedReportsScreen';
import { SharedReportDetailScreen } from '../screens/vet/SharedReportDetailScreen';
import { VetOnboardingScreen } from '../screens/vet/VetOnboardingScreen';
import { LegalScreen } from '../screens/LegalScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const FarmerStack = createNativeStackNavigator<FarmerStackParamList>();
const VetStack = createNativeStackNavigator<VetStackParamList>();

import { useAuth } from '../context/AuthContext';

const FarmerNavigator = () => (
  <FarmerStack.Navigator screenOptions={{ headerShown: false }}>
    <FarmerStack.Screen name="FarmerHome" component={FarmerTabNavigator} />
    <FarmerStack.Screen name="AssistantChat" component={AssistantScreen} />
    <FarmerStack.Screen name="AssessmentResult" component={AssessmentResultScreen} />
    <FarmerStack.Screen name="SavedAssessments" component={SavedAssessmentsScreen} />
    <FarmerStack.Screen name="VetProfileView" component={VetProfileScreen} />
    <FarmerStack.Screen name="ChatWithVet" component={ChatScreen} />
    <FarmerStack.Screen name="AddAnimal" component={AddAnimalScreen} />
    <FarmerStack.Screen name="Notifications" component={NotificationsScreen} />
  </FarmerStack.Navigator>
);

const VetNavigator = ({ isComplete }: { isComplete: boolean }) => (
  <VetStack.Navigator screenOptions={{ headerShown: false }}>
    {isComplete ? (
      <>
        <VetStack.Screen name="VetDashboard" component={VetTabNavigator} />
        <VetStack.Screen name="FarmerRequests" component={FarmerRequestsScreen} />
        <VetStack.Screen name="SharedReports" component={SharedReportsScreen} />
        <VetStack.Screen name="SharedReportDetail" component={SharedReportDetailScreen} />
        <VetStack.Screen name="VetReviews" component={ReviewsScreen} />
        <VetStack.Screen name="ChatWithFarmer" component={ChatScreen} />
      </>
    ) : (
      <VetStack.Screen name="VetOnboarding" component={VetOnboardingScreen} />
    )}
  </VetStack.Navigator>
);

export const AppNavigator: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowSplash(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const maxTimer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(maxTimer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  const isVet = profile?.role === 'vet';
  const isAuthenticated = !!user;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          isVet ? (
            <RootStack.Screen name="VetTabs">
              {() => <VetNavigator isComplete={!!profile?.is_vet_complete} />}
            </RootStack.Screen>
          ) : (
            <RootStack.Screen name="FarmerTabs" component={FarmerNavigator} />
          )
        ) : (
          <>
            <RootStack.Screen name="FarmerTabs" component={FarmerNavigator} />
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          </>
        )}
        <RootStack.Screen name="Legal" component={LegalScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
