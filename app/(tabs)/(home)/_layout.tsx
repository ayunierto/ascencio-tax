import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/components/ui';
import { Tabs } from 'expo-router';

export default function TabLayout() {
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
            paddingTop: 8,
            height: 45,
            elevation: 0,
            shadowOpacity: 0,
          },
          animation: 'shift',
          tabBarPosition: 'top',
          tabBarIconStyle: { height: 0 },
          tabBarIcon: undefined,
          tabBarLabelStyle: {
            fontSize: 13,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Services',
          }}
        />
        <Tabs.Screen
          name="blog"
          options={{
            title: 'Blog',
          }}
        />
      </Tabs>
    </View>
  );
}
