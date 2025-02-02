import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { Ionicons } from '@expo/vector-icons';

const _layout = () => {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        drawerStyle: {
          backgroundColor: theme.background,
        },
        drawerType: 'slide',
        drawerIcon: (props) => <Ionicons name="accessibility" />,
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        name="receipts/index"
        options={{
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'home' : 'home-outline'}
              size={size}
            />
          ),
          drawerLabel: 'Receipts',
          title: 'Receipts',
        }}
      />

      <Drawer.Screen
        name="receipts/add_expense"
        options={{
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'add' : 'add-outline'}
              size={size}
            />
          ),
          drawerLabel: 'Add Expense',
          title: 'Add Expense',
        }}
      />
    </Drawer>
  );
};

export default _layout;
