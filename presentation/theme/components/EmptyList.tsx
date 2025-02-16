import { View, Text } from 'react-native';
import React from 'react';
import { theme } from './ui/Theme';
import { ThemedText } from './ui/ThemedText';

interface EmptyListProps {
  title: string;
  subtitle?: string;
}

const EmptyList = ({ title, subtitle = '' }: EmptyListProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <ThemedText style={{ fontSize: 16 }}>{title}</ThemedText>
      <Text style={{ color: theme.muted, fontSize: 14 }}>{subtitle}</Text>
    </View>
  );
};

export default EmptyList;
