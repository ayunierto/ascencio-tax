import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import SimpleCard from '@/presentation/theme/components/ui/SimpleCard/SimpleCard';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '@/presentation/theme/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import Divider from '@/presentation/theme/components/ui/Divider';
import { theme } from '@/presentation/theme/components/ui/Theme';
import FloatingButtonGroup from '@/presentation/theme/components/ui/FloatingButtonGroup/FloatingButtonGroup';
import Loader from '@/presentation/theme/components/Loader';
import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '@/core/accounting/actions/get-expenses';
import { ExpensesResponse } from '@/core/accounting/interfaces/expenses-response';

const Receipts = () => {
  const [total, setTotal] = useState(0);
  const { data, isPending, isError, error, isSuccess, isRefetching } = useQuery(
    {
      queryKey: ['expenses'],
      queryFn: getExpenses,
      staleTime: 1000 * 60 * 60, // 1 hora
    }
  );

  useEffect(() => {
    if (isSuccess || isRefetching) {
      let totalExpenses = 0;
      data.forEach((expense: ExpensesResponse) => {
        totalExpenses += +expense.total;
      });
      setTotal(totalExpenses);
    }
  }, [isSuccess, isRefetching]);

  /**
   * Transform ISO date string to localized date string
   * @param date ISO date string
   * @returns Localized date string
   */
  const dateToLocaleDateTimeString = (date: string): string | undefined => {
    return DateTime.fromJSDate(new Date(date)).toLocaleString({
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          {isError && <Text>{error.message}</Text>}
          {data &&
            data.map((expense: ExpensesResponse) => (
              <SimpleCard
                key={expense.id}
                title={`${expense.merchant}`}
                icon="receipt-outline"
                subtitle={`${dateToLocaleDateTimeString(
                  expense.date
                )} - Total $${expense.total}`}
              />
            ))}

          <View style={{ gap: 4 }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              {/* <Ionicons
                name="add-circle-outline"
                color={theme.mutedForeground}
              />
              <Text style={{ color: theme.mutedForeground }}>99.99</Text>
              <Divider direction="vertical" /> */}
              <Ionicons
                name="remove-circle-outline"
                color={theme.mutedForeground}
              />
              <Text style={{ color: theme.mutedForeground }}>{total}</Text>
            </View>
            <Divider style={{ width: '60%', marginHorizontal: 'auto' }} />
            <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>
              {data.length} Receipt(s)
            </Text>
          </View>
        </View>
      </ScrollView>

      <FloatingButtonGroup />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
});

export default Receipts;
