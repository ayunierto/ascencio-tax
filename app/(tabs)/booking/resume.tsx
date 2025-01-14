import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Button from '@/presentation/theme/components/ui/Button';
import { useBookingStore } from '@/presentation/services/store/useBookingStore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import SimpleCard from '@/presentation/theme/components/ui/SimpleCard';

const ResumeScreen = () => {
  const { selectedService, staffName, startDateAndTime, bookNow } =
    useBookingStore();

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const appointment = await bookNow();
    console.log(appointment);
    setLoading(false);
    if (appointment.id) {
      Toast.show({
        type: 'success',
        text1: 'Appointment booked',
        text2: 'Your appointment has been booked successfully',
      });
      router.replace('/(tabs)/my-bookings');
    }
  };
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
          loading={loading}
          disabled={loading}
          onPress={() => handleConfirm()}
        >
          Confirm Appointment
        </Button>
      </View>
    </ScrollView>
  );
};

export default ResumeScreen;
