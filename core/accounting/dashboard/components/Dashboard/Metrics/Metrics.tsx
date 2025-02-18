import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import {
  Card,
  SimpleCardHeader,
  SimpleCardHeaderTitle,
} from '@/presentation/theme/components/ui';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { ThemedText } from '@/presentation/theme/components/ui/ThemedText';
import { MetricsList } from './MetricsList';
import { MetricsListValue } from './MetricsListValue';

interface MetricsProps {
  metrics: { label: string; value: string }[];
}

export const Metrics = ({ metrics }: MetricsProps) => {
  return (
    <Card>
      <SimpleCardHeader>
        <Ionicons name={'key-outline'} size={20} color={theme.foreground} />
        <SimpleCardHeaderTitle>Key Metrics</SimpleCardHeaderTitle>
      </SimpleCardHeader>
      {metrics.map((metric, index) => (
        <MetricsList key={index}>
          <ThemedText>{metric.label}</ThemedText>
          <MetricsListValue>{metric.value}</MetricsListValue>
        </MetricsList>
      ))}
    </Card>
  );
};
