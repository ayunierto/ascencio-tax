import React from 'react';
import { Stack } from 'expo-router/stack';
import { theme } from '@/presentation/theme/components/ui/Theme';

const ExpenseLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'List of expenses',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Expense',
        }}
      />
    </Stack>
  );
};

export default ExpenseLayout;
