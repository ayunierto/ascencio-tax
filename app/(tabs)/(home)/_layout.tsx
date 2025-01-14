import React from 'react';
import Logo from '@/presentation/theme/components/Logo';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Logo />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.mutedForeground,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            paddingTop: 0,
            height: 35,
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
    </SafeAreaView>
  );
}
