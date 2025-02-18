import React from 'react';

import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  Card,
  SimpleCardHeader,
  SimpleCardHeaderTitle,
} from '@/presentation/theme/components/ui';
import { theme } from '@/presentation/theme/components/ui/Theme';
import Button from '@/presentation/theme/components/ui/Button';

interface QuickActionsProps {
  actions: {
    label: string;
    onPress: () => void;
  }[];
}

export const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <Card>
      <SimpleCardHeader>
        <Ionicons name={'flash-outline'} size={20} color={theme.foreground} />
        <SimpleCardHeaderTitle>Quick Actions</SimpleCardHeaderTitle>
      </SimpleCardHeader>
      <View style={{ gap: 10 }}>
        {actions.map((action, index) => (
          <Button key={index} onPress={action.onPress}>
            {action.label}
          </Button>
        ))}
      </View>
    </Card>
  );
};
