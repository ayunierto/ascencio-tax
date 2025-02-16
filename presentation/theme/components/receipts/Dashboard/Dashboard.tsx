import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { getExpenses } from '@/core/accounting/expenses/actions';
import { Expense } from '@/core/accounting/expenses/interfaces';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import Loader from '../../Loader';
import { getLogs } from '@/core/logs/actions';
import { Log } from '@/core/logs/interfaces';

const ReceiptsDashboard = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Log[]>([]);

  const expenseQuery = useQuery({
    queryKey: ['totalExpenses'],
    queryFn: () => getExpenses(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const logsQuery = useQuery({
    queryKey: ['logs'],
    queryFn: () => getLogs(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useFocusEffect(
    useCallback(() => {
      // ComponentDidMount logic (if any) can go here
      console.log('Dashboard focused');
      logsQuery.refetch(); // Refetch logs when the component is focused

      return () => {
        // ComponentWillUnmount logic
        console.log('Dashboard unfocused');
        // Additional cleanup can be done here, e.g., clearing image cache
      };
    }, [])
  );

  useEffect(() => {
    if (logsQuery.data) {
      setRecentActivity(logsQuery.data);
    }
  }, [logsQuery.data]);

  useEffect(() => {
    if (expenseQuery.data) {
      const total = expenseQuery.data.reduce(
        (acc: number, receipt: Expense) => acc + +receipt.total,
        0
      );
      setTotalExpenses(total);
    }
  }, [expenseQuery.data]);

  if (expenseQuery.isLoading) return <Loader />;

  if (!expenseQuery.data) {
    setTotalExpenses(0);
    return;
  }

  const keyMetrics = [
    // { label: 'Total Income', value: '$12,000' },
    { label: 'Total Expenses', value: `$${totalExpenses}` },
    // { label: 'Net Profit', value: '$4,000' },
  ];

  const quickActions = [
    {
      label: 'Add Expense',
      onPress: () => router.push('/(tabs)/accounting/receipts/expense/0'),
    },
    // { label: 'Add Income', onPress: () => console.log('Add Income') },
    // { label: 'View Reports', onPress: () => console.log('View Reports') },
  ];

  // const recentActivity = [
  //   { description: 'Expense added: Office Supplies', date: '2024-07-15' },
  //   { description: 'Income received: Client Payment', date: '2024-07-14' },
  //   { description: 'Report generated: Monthly Summary', date: '2024-07-13' },
  // ];

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Dashboard</Text> */}

      {/* Key Metrics Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name={'key-outline'}
            size={20}
            color={theme.foreground}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Key Metrics</Text>
        </View>
        {keyMetrics.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name={'flash-outline'}
            size={20}
            color={theme.foreground}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <Text style={styles.actionButtonText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name={'time-outline'}
            size={20}
            color={theme.foreground}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        {recentActivity.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Text style={styles.activityDescription}>
              {activity.description}
            </Text>
            <Text style={styles.activityDate}>
              {new Date(activity.date).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.foreground,
  },
  section: {
    marginBottom: 20,
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
  actionButton: {
    backgroundColor: theme.primary,
    padding: 10,
    borderRadius: theme.radius,
    marginBottom: 5,
  },
  actionButtonText: {
    color: theme.foreground,
    textAlign: 'center',
  },
  activityItem: {
    marginBottom: 5,
  },
  activityDescription: {
    color: theme.foreground,
  },
  activityDate: {
    color: theme.muted,
    fontSize: 12,
  },
});

export default ReceiptsDashboard;
