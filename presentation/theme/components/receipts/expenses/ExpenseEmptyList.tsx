import { View, Text } from 'react-native';
import React from 'react';
import { theme } from '../../ui/Theme';
import { ThemedText } from '../../ui/ThemedText';

const ExpenseEmptyList = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <ThemedText style={{ fontSize: 16 }}>No expenses found.</ThemedText>
      <Text style={{ color: theme.muted, fontSize: 14 }}>
        Add a new expense to get started
      </Text>
    </View>
  );
};

export default ExpenseEmptyList;
