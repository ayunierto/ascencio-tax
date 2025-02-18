import React from 'react';

import { StyleSheet, TextProps } from 'react-native';

import { theme } from '@/presentation/theme/components/ui/Theme';
import { ThemedText } from '@/presentation/theme/components/ui/ThemedText';

export const MetricsListValue = ({ children, style }: TextProps) => {
  return (
    <ThemedText style={[styles.metricValue, style]}>{children}</ThemedText>
  );
};

const styles = StyleSheet.create({
  metricValue: {
    fontWeight: 'bold',
    color: theme.foreground,
  },
});
