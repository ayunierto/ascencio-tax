import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { AppointmentCard } from '@/components/bookings/AppointmentCard';
import { AppointmentListSkeleton } from '@/components/bookings/AppointmentCardSkeleton';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { theme } from '@/components/ui/theme';
import { getUserAppointments } from '@/core/appointments/actions/get-user-appointments.action';
import { Appointment } from '@/core/appointments/interfaces/appointmentResponse';
import { EmptyContent } from '@/core/components';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const PastBookings = () => {
  const {
    data: historicalBookings,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Appointment[], AxiosError<ServerException>>({
    queryKey: ['PastAppts'],
    queryFn: async () => {
      const data = await getUserAppointments('past');
      return data;
    },
    staleTime: 1000 * 60, // 1 min
  });

  const handleBookNew = () => {
    router.push('/(tabs)/(home)');
  };

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={
          error.response?.data.message || error.message || 'An error occurred'
        }
        icon="alert-circle-outline"
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return <AppointmentListSkeleton />;
  }

  if (!historicalBookings || historicalBookings.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          padding: 20,
          justifyContent: 'center',
        }}
      >
        <EmptyContent
          title="No Past Appointments"
          subtitle="You don't have any completed appointments yet. Book your first service!"
          icon="time-outline"
        />
        <Button onPress={handleBookNew} style={{ marginTop: 20 }}>
          <ButtonIcon name="add-circle-outline" />
          <ButtonText>Book New Appointment</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={historicalBookings}
        renderItem={({ item }) => (
          <AppointmentCard appointment={item} isPast />
        )}
        contentContainerStyle={{
          padding: 10,
        }}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      />
    </View>
  );
};

export default PastBookings;
