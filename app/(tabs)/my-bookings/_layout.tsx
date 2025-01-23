import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { theme } from '@/presentation/theme/components/ui/Theme';

const MyBookingsLayout = () => {
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
};

export default MyBookingsLayout;
