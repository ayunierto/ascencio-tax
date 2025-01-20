import { theme } from '@/presentation/theme/components/ui/Theme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'ios_from_right',
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
      }}
      initialRouteName="sign-in"
    >
      <Stack.Screen
        name="forgot-password"
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="new-password"
        options={{
          title: 'New password',
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="verify-code-reset-password"
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: '',
        }}
      />
    </Stack>
  );
}
