import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/presentation/theme/components/ui/Theme';

const MyProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: 'center',
        headerTintColor: theme.foreground,
        title: 'Profile',
        headerShadowVisible: false,
      }}
    />
  );
};

export default MyProfileLayout;
