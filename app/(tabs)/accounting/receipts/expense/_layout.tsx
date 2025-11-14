import { theme } from '@/components/ui';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function ExpenseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'List of expenses',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: 'Add expense',
        }}
      />
    </Stack>
  );
}
