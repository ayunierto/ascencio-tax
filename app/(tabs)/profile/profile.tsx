import { View, Text } from 'react-native';
import React from 'react';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import Signin from './auth/sign-in';
import Button from '@/presentation/theme/components/ui/Button';

const Profile = () => {
  const { token, logout } = useAuthStore();

  if (!token) {
    return <Signin />; // Use replace to avoid stacking profile on top of sign-in
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text
          style={{ fontSize: 24, color: theme.foreground, textAlign: 'center' }}
        >
          Profile
        </Text>
        <Button variant="destructive" onPress={() => logout()}>
          Logout
        </Button>
      </View>
    </View>
  );
};

export default Profile;
