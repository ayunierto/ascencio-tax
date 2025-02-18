import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { Log } from '@/core/logs/interfaces';
import {
  Card,
  SimpleCardHeader,
  SimpleCardHeaderTitle,
} from '@/presentation/theme/components/ui';
import { ActivityList } from './ActivityList';
import { theme } from '@/presentation/theme/components/ui/Theme';

interface RecentActivityProps {
  activities: Log[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card>
      <SimpleCardHeader>
        <Ionicons name={'flash-outline'} size={20} color={theme.foreground} />
        <SimpleCardHeaderTitle>Recent Activity</SimpleCardHeaderTitle>
      </SimpleCardHeader>
      <ActivityList activities={activities} />
    </Card>
  );
};
