import { View, ActivityIndicator, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import Toast from 'react-native-toast-message';
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import Loader from '@/presentation/theme/components/Loader';
import { theme } from '@/presentation/theme/components/ui/Theme';

const CheckAuthenticationLayout = () => {
  const { status, checkStatus, logout } = useAuthStore();

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
          text1: 'Log in success',
          text2: `Welcome ${res.data.name} `,
        });
      }
    });
  }, []);

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
        // headerShown: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="(home)/index"
        options={{
          title: '',
          headerRight: () => (
            <Ionicons
              name="log-out-outline"
              size={24}
              color="white"
              onPress={logout}
            />
          ),
        }}
      />
      <Stack.Screen
        name="booking/index"
        options={{
          title: 'Booking',
        }}
      />
      <Stack.Screen
        name="booking/resume"
        options={{
          title: 'Booking Details',
        }}
      />
    </Stack>
  );
};

export default CheckAuthenticationLayout;
