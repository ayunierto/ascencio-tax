import React from 'react';
import { View } from 'react-native';

import { Log } from '@/core/logs/interfaces';
import { ThemedText } from '@/presentation/theme/components/ui/ThemedText';
import { theme } from '@/presentation/theme/components/ui/Theme';

interface ActivityItemProps {
  activity: Log;
}
export const ActivityItem = ({ activity }: ActivityItemProps) => {
  return (
    <View>
      <ThemedText>{activity.description}</ThemedText>

      <ThemedText style={{ color: theme.muted, fontSize: 12 }}>
        {new Date(activity.date).toLocaleString()}
      </ThemedText>
    </View>
  );
};
