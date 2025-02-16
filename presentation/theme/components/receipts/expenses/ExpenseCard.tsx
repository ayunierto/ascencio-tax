import React from 'react';

import { useExpenseCard } from '@/core/accounting/expenses/hooks/useExpenseCard';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Expense } from '@/core/accounting/expenses/interfaces';
import SimpleCard from '../../ui/SimpleCard/SimpleCard';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../ui/Theme';

interface ExpenseCardProps {
  expense: Expense;
}

const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const { dateToLocaleDateTimeString } = useExpenseCard();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/accounting/receipts/expense/${expense.id}`)}
    >
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name={'receipt-outline'}
            size={20}
            color={theme.foreground}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>{expense.merchant}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Date</Text>
          <Text style={styles.metricValue}>{`${dateToLocaleDateTimeString(
            expense.date
          )}`}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total</Text>
          <Text style={styles.metricValue}>${expense.total}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: theme.card,
    borderRadius: theme.radius,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.foreground,
  },
  sectionIcon: {
    marginRight: 8,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metricLabel: {
    color: theme.foreground,
  },
  metricValue: {
    fontWeight: 'bold',
    color: theme.foreground,
  },
});

export default ExpenseCard;
