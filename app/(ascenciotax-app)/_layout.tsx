import { View, ActivityIndicator, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import Toast from 'react-native-toast-message';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import Loader from '@/presentation/theme/components/Loader';

const CheckAuthenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    checkStatus().then((res) => {
      if (res.code === 500) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
        });
      }
      if (res.code === 200) {
        Toast.show({
          type: 'success',
          text1: 'Log in',
          text2: `Welcome ${res.data.name} `,
        });
      }
    });
  }, [status]);

  if (status === 'checking') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    // Guardar ruta dle usuario en el storage para volver despues del login
    return <Redirect href="/auth/signin" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(home)/index"
        options={{
          title: 'Services',
          headerLeft: () => <Ionicons name="log-out" />,
        }}
      />
    </Stack>
  );
};

export default CheckAuthenticationLayout;
