import React from 'react';

import { theme } from '@/components/ui';
import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Booking',
        }}
      />
      <Stack.Screen
        name="resume"
        options={{
          title: 'Resume',
        }}
      />
    </Stack>
  );
}
