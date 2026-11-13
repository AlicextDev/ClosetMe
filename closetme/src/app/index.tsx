import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { colors } from '../theme';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(app)/(tabs)/wardrobe" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}