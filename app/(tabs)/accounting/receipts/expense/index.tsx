import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';

import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { Fab } from '@/core/accounting/components';
import ExpensesList from '@/core/accounting/expenses/components/ExpensesList';
import { useExpenses } from '@/core/accounting/expenses/hooks/useExpenses';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const ExpensesScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    // This sets the title for the parent Stack (the Drawer)
    const drawer = navigation.getParent() as DrawerNavigationProp<any>;
    if (drawer) {
      drawer.setOptions({
        title: 'Expenses',
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => drawer.openDrawer()}
              style={{ marginRight: 15 }}
            >
              <MaterialCommunityIcons
                name="menu"
                size={24}
                color={theme.foreground}
              />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => null,
      });
    }
  }, [navigation]);

  const { expensesQuery, loadNextPage } = useExpenses();

  if (expensesQuery.isLoading) {
    return <Loader message="Loading expenses..." />;
  }

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <ExpensesList
        expenses={expensesQuery.data?.pages.flatMap((page) => page) ?? []}
        loadNextPage={loadNextPage}
      />

      <Fab
        actions={[
          {
            icon: <Ionicons name="receipt-outline" size={20} color="white" />,
            onPress: () => {
              router.push('/(tabs)/accounting/receipts/expense/new');
            },
          },
          {
            icon: <Ionicons name="camera-outline" size={20} color="white" />,
            onPress: () => {
              router.push({
                pathname: '/scan-receipts',
                params: { id: 'scan-receipt' },
              });
            },
          },
        ]}
      />
    </View>
  );
};

export default ExpensesScreen;
