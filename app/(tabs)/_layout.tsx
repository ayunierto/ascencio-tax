import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import Toast from 'react-native-toast-message';
import Loader from '@/presentation/theme/components/Loader';

export default function TabLayout() {
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    checkStatus().then((res) => {
      if (res.code === 500) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
        });
      }
    });
  }, []);

  if (status === 'checking') {
    return <Loader />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          paddingTop: 4,
          height: 65,
        },
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'My Sites',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-bookings/index"
        options={{
          href: status === 'authenticated' ? '/(tabs)/my-bookings' : null,
          title: 'My Bookings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? 'person-circle' : 'person-circle-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/auth"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
