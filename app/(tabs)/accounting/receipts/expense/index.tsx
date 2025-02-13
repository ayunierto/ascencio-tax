import React from 'react';
import { View, Text } from 'react-native';

import FloatingButtonGroup from '@/presentation/theme/components/receipts/FloatingButtonGroup';
import Loader from '@/presentation/theme/components/Loader';
import { useExpenses } from '@/core/accounting/expenses/hooks/useExpenses';
import ExpensesList from '@/presentation/theme/components/receipts/expenses/ExpensesList';
import ExpenseEmptyList from '@/presentation/theme/components/receipts/expenses/ExpenseEmptyList';

const Receipts = () => {
  const { expensesQuery, loadNextPage } = useExpenses();

  if (expensesQuery.isLoading) {
    return <Loader />;
  }

  if (expensesQuery.data?.pages[0].length === 0) {
    return (
      <>
        <ExpenseEmptyList />

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

export default Receipts;
