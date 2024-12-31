import { View, Text } from 'react-native';
import React from 'react';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    Toast.show({
      type: 'success',
      text1: 'Logout',
      text2: 'Goodbye',
    });
  };

  return (
    <View>
      <Text>HomeScreen</Text>
      <ThemedText onPress={handleLogout}>Logout</ThemedText>
    </View>
  );
};

export default HomeScreen;
