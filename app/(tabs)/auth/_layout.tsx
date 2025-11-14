import { theme } from '@/components/ui';
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
        headerShown: false,
      }}
      initialRouteName="sign-in"
    >
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          title: '',
        }}
      />

      <Stack.Screen
        name="sign-in"
        options={{
          title: '',
        }}
      />

      <Stack.Screen
        name="sign-up"
        options={{
          title: '',
        }}
      />

      <Stack.Screen
        name="verify-email"
        options={{
          title: '',
          headerShown: true,
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="reset-password"
        options={{
          title: '',
          headerShown: true,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
