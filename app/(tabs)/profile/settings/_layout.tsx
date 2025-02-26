import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';

const MyProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: 'center',
        headerTintColor: theme.foreground,
        title: '',
        headerShadowVisible: false,
      }}
    />
  );
};

export default MyProfileLayout;
