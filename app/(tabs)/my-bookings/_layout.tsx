import React, { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { theme } from '@/components/ui/theme';
import Loader from '@/components/Loader';

const MyBookingsLayout = (): JSX.Element => {
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
