import { View, Text } from 'react-native';
import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyBookingsLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text
          style={{
            color: theme.foreground,
            fontSize: 30,
            textAlign: 'center',
            paddingTop: 20,
          }}
        >
          My Bookings
        </Text>
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
      </SafeAreaView>
    </View>
  );
};

export default MyBookingsLayout;
