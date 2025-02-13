import { View, Text } from 'react-native';
import React from 'react';
import { theme } from '@/presentation/theme/components/ui/Theme';

const ReceiptsDashboard = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: theme.foreground }}>Receipts Dashboard</Text>
    </View>
  );
};

export default ReceiptsDashboard;
