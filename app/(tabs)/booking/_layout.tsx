import React, { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';

export default function BookingLayout() {
  const { status, checkStatus } = useAuthStore();

  // Checking auth status
  useEffect(() => {
    checkStatus();
  }, [status]);

  if (status === 'checking') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    return <Redirect href={'/auth/sign-in'} />;
  }

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
