import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/components/ui/theme';

export default function MyBookingsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.mutedForeground,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            paddingTop: 15,
            height: 55,
            elevation: 0,
            shadowOpacity: 0,
          },
          animation: 'shift',
          tabBarPosition: 'top',
          tabBarLabelPosition: 'beside-icon',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Scheduled',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="event-available" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="past"
          options={{
            title: 'Past',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="event-busy" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
