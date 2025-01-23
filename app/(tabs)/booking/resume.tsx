import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Button from '@/presentation/theme/components/ui/Button';
import { useBookingStore } from '@/presentation/services/store/useBookingStore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import SimpleCard from '@/presentation/theme/components/ui/SimpleCard/SimpleCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const ResumeScreen = () => {
  const { selectedService, staffName, startDateAndTime, bookNow } =
    useBookingStore();

  const queryClient = useQueryClient();
  const {
    mutateAsync: mutate,
    data,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const data = await bookNow();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingAppts'] });
    },
  });

  const handleConfirm = async () => {
    await mutate()
      .then((data) => {
        if (data.id) {
          Toast.show({
            type: 'success',
            text1: 'Appointment booked',
            text2: 'Your appointment has been booked successfully',
          });
          router.replace('/(tabs)/my-bookings/bookings');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong',
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // TODO: Accept terms and conditions of the appointment where you will explain about your cancellation

  return (
    <ScrollView>
      <View style={{ padding: 20, gap: 20 }}>
        <SimpleCard
          title="Service"
          subtitle={selectedService?.name}
          icon="receipt-outline"
        />

        <SimpleCard
          title="Address"
          subtitle={selectedService?.address}
          icon="map-outline"
        />

        <SimpleCard title="Staff" subtitle={staffName} icon="person-outline" />

        <SimpleCard
          title="Date"
          subtitle={new Date(startDateAndTime!).toLocaleDateString()}
          icon="calendar-outline"
        />

        <SimpleCard
          title="Time"
          subtitle={new Date(startDateAndTime!).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          icon="time-outline"
        />

        <Button
          loading={isPending}
          disabled={isPending}
          onPress={() => handleConfirm()}
        >
          Confirm Appointment
        </Button>
      </View>
    </ScrollView>
  );
};

export default ResumeScreen;
