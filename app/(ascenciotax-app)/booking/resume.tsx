import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Button from '@/presentation/theme/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '@/presentation/services/store/useBookingStore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { useQuery } from '@tanstack/react-query';

const ResumeScreen = () => {
  const { selectedService, staffName, startDateAndTime, bookNow } =
    useBookingStore();

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const appointment = await bookNow();
    setLoading(false);
    if (appointment.id) {
      Toast.show({
        type: 'success',
        text1: 'Appointment booked',
        text2: 'Your appointment has been booked successfully',
      });
      router.replace('/');
    }
  };
  return (
    <ScrollView>
      <View style={{ padding: 20, gap: 20 }}>
        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 14,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Ionicons
            size={40}
            color={theme.background}
            name="file-tray-stacked-outline"
          />
          <View style={{ width: '80%' }}>
            <Text style={{ fontSize: 16 }}>Service</Text>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {selectedService?.name}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 14,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Ionicons
            size={40}
            color={theme.background}
            name="calendar-outline"
          />
          <View>
            <Text style={{ fontSize: 16 }}>Service</Text>
            <Text>{new Date(startDateAndTime!).toLocaleDateString()}</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 14,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Ionicons size={40} color={theme.background} name="map-outline" />
          <View style={{ width: '80%' }}>
            <Text style={{ fontSize: 16 }}>Address</Text>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {selectedService?.address}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 14,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Ionicons size={40} color={theme.background} name="person-outline" />
          <View>
            <Text style={{ fontSize: 16 }}>Staff</Text>
            <Text>{staffName}</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 14,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Ionicons size={40} color={theme.background} name="time-outline" />
          <View>
            <Text style={{ fontSize: 16 }}>Time</Text>
            <Text>
              {new Date(startDateAndTime!).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
    gap: 20,
  },
  details: {
    fontWeight: '700',
    fontSize: 20,
  },
  resumeCard: {
    padding: 20,
    gap: 20,
    flexDirection: 'column',
  },
});

export default ResumeScreen;
