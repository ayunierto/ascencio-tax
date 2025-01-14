import { theme } from '@/presentation/theme/components/ui/Theme';
import { Stack } from 'expo-router';
import { TextStyle } from 'react-native';

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
      }}
    >
      <Stack.Screen
        name="booking"
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
