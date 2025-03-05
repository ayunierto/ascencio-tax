import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';

const AccountingLayout = () => {
  const { status, checkStatus } = useAuthStore();

  // Checking auth status
  useEffect(() => {
    checkStatus();
    console.log(`Accounting layout executed: ${status}`);
  }, [status]);

  if (status === 'checking') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    return <Redirect href={'/auth/sign-in'} />;
  }

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
        }}
      />

      <Drawer.Screen
        name="subscriptions"
        options={{
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'bag-add' : 'bag-add-outline'}
              size={size}
            />
          ),
          drawerLabel: 'Subscriptions',
          title: 'Subscriptions',
        }}
      />
    </Drawer>
  );
};

export default AccountingLayout;
