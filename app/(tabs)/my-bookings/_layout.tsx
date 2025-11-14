import { theme } from '@/components/ui/theme';
import { Stack } from 'expo-router';
import React from 'react';

export default function MyBookingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: 'center',
        headerTintColor: theme.foreground,
        title: 'Bookings',
        headerShadowVisible: false,
      }}
    />
  );
}
