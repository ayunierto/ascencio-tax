import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const _layout = () => {
  return (
    <Drawer
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.background,
        },
        drawerStyle: {
          backgroundColor: theme.background,
        },
        drawerType: 'slide',
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        name="receipts/index"
        options={{
          drawerIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
              size={size}
              color={color}
            />
          ),
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
        }}
      />

      <Drawer.Screen
        name="receipts/expense"
        options={{
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'receipt' : 'receipt-outline'}
              size={size}
            />
          ),
          drawerLabel: 'Expenses',
          title: 'Expenses',
          // headerLeft: () => <Ionicons name="home" color={'white'} />,
        }}
      />
    </Drawer>
  );
};

export default _layout;
