import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
        }}
      />

      {/* <Drawer.Screen
        name="receipts/expense/scan-expense"
        options={{
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'add' : 'add-outline'}
              size={size}
            />
          ),
          drawerLabel: 'Scan Expense',
          title: 'Scan Expense',
        }}
        redirect={false}
      /> */}

      {/* <Drawer.Screen
        name="receipts/expense/[id]"
        options={{
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'add' : 'add-outline'}
              size={size}
            />
          ),
          drawerLabel: 'Expense',
          title: 'Expense',
        }}
      /> */}
    </Drawer>
  );
};

export default _layout;
