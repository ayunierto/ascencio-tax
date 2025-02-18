import React from 'react';
import { Stack } from 'expo-router/stack';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

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
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: 'Expense',
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: 'New',

          headerLeft: ({ tintColor }) => {
            return (
              <TouchableOpacity
                onPress={() => router.replace('/accounting/receipts/expense')}
              >
                <Ionicons
                  name="arrow-back-outline"
                  color={tintColor}
                  size={24}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Stack>
  );
};

export default ExpenseLayout;
