import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import ExpenseCard from './ExpenseCard';
import { useQueryClient } from '@tanstack/react-query';
import { Expense } from '@/core/accounting/expenses/interfaces';
import { ThemedText } from '../../ui/ThemedText';
import ExpenseEmptyList from './ExpenseEmptyList';

interface ExpenseListProps {
  expenses: Expense[];
  loadNextPage: () => void;
}

const ExpensesList = ({ expenses, loadNextPage }: ExpenseListProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    queryClient.invalidateQueries({
      queryKey: ['expenses', 'infinite'],
    });
    setIsRefreshing(false);
  };

  return (
    <FlatList
      style={{ paddingHorizontal: 20, paddingTop: 20 }}
      data={expenses}
      numColumns={1}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ExpenseCard expense={item} />}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onPullToRefresh} />
      }
      ListEmptyComponent={<ExpenseEmptyList />}
    />
  );
};

export default ExpensesList;
