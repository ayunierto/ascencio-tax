import React from 'react';

import { useExpenseCard } from '@/core/accounting/expenses/hooks/useExpenseCard';
import { TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Expense } from '@/core/accounting/expenses/interfaces';
import SimpleCard from '../../ui/SimpleCard/SimpleCard';

interface ExpenseCardProps {
  expense: Expense;
}

const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const { dateToLocaleDateTimeString } = useExpenseCard();

  return (
    <TouchableOpacity
      onPress={() =>
        router.replace(`/accounting/receipts/expense/${expense.id}`)
      }
    >
      <SimpleCard
        key={expense.id}
        title={`${expense.merchant}`}
        icon="receipt-outline"
        subtitle={`${dateToLocaleDateTimeString(expense.date)} - Total $ ${
          expense.total
        }`}
        style={{ marginBottom: 10 }}
      />
    </TouchableOpacity>
  );
};

export default ExpenseCard;
