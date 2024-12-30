import { View, ActivityIndicator, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { Redirect, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

const AscencioTaxAppLayout = () => {
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, [status]);

  if (status === 'checking') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  console.warn(status);

  if (status === 'unauthenticated') {
    // Guardar ruta dle usuario en el storage para volver despues del login
    return <Redirect href="/auth/signin" />;
  }

  return (
    // <Stack>
    //   <Stack.Screen name="(home)/index" options={{ title: 'Services' }} />
    // </Stack>
    <View>
      <Text>Hola</Text>
    </View>
  );
};

export default AscencioTaxAppLayout;
