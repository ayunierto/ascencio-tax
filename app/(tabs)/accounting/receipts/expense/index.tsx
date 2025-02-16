import React from 'react';
import { View, Text } from 'react-native';

import FloatingButtonGroup from '@/presentation/theme/components/receipts/FloatingButtonGroup';
import Loader from '@/presentation/theme/components/Loader';
import { useExpenses } from '@/core/accounting/expenses/hooks/useExpenses';
import ExpensesList from '@/presentation/theme/components/receipts/expenses/ExpensesList';
import EmptyList from '@/presentation/theme/components/EmptyList';

const ExpensesScreen = () => {
  const { expensesQuery, loadNextPage } = useExpenses();

  if (expensesQuery.isLoading) {
    return <Loader />;
  }

  if (expensesQuery.data?.pages[0].length === 0) {
    return (
      <>
        <EmptyList title="No expenses found." />

        <FloatingButtonGroup />
      </>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ExpensesList
        expenses={expensesQuery.data?.pages.flatMap((page) => page) ?? []}
        loadNextPage={loadNextPage}
      />
      <FloatingButtonGroup />
    </View>
  );
};

export default ExpensesScreen;
