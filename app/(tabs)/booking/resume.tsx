import { BookingProgressStepper } from '@/components/booking/BookingProgressStepper';
import { BookingSuccessModal } from '@/components/booking/BookingSuccessModal';
import { Card } from '@/components/ui';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { CardContent } from '@/components/ui/Card/CardContent';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { bookAppointment } from '@/core/appointments/actions';
import { Appointment } from '@/core/appointments/interfaces';
import { AppointmentRequest } from '@/core/appointments/interfaces/appointment-request.interface';
import { EmptyContent } from '@/core/components';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { useBookingStore } from '@/core/services/store/useBookingStore';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const ResumeScreen = () => {
  const { service, staff, start, end, timeZone, comments } = useBookingStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: mutate, isPending } = useMutation<
    Appointment,
    AxiosError<ServerException>,
    AppointmentRequest
  >({
    mutationFn: bookAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['pendingAppts'] });
    },
    onError: async () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again later.',
      });
    },
  });

  if (!service || !staff || !start || !timeZone || !end) {
    return (
      <EmptyContent
        title="Incomplete booking information"
        subtitle="Please go back and complete your booking details."
      />
    );
  }

  const handleConfirm = async () => {
    await mutate(
      {
        serviceId: service.id,
        staffId: staff.id,
        start,
        end,
        timeZone,
        comments: comments || '',
      },
      {
        onSuccess(appointment) {
          setBookedAppointment(appointment);
          setShowSuccessModal(true);
        },
        onError(error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response?.data.message || error.message,
          });
        },
      }
    );
  };

  const handleEdit = (section: string) => {
    if (section === 'service' || section === 'staff' || section === 'time') {
      router.push('/booking');
    } else if (section === 'details') {
      router.push('/booking/details');
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Calculate duration in minutes
  const duration = DateTime.fromISO(end).diff(DateTime.fromISO(start), 'minutes').minutes;

  return (
    <>
      <ScrollView style={{ backgroundColor: theme.background }}>
        <View style={{ padding: 10, gap: 20 }}>
          {/* Progress Stepper */}
          <BookingProgressStepper currentStep={3} />

          {/* Header */}
          <View style={{ marginBottom: 10 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              Review Your Appointment
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: theme.mutedForeground, lineHeight: 20 }}>
              Please review all details before confirming your appointment
            </ThemedText>
          </View>

          {/* Service Card with Image */}
          <Card>
            <CardContent>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="receipt-outline" size={20} color={theme.primary} />
                    <ThemedText style={{ fontSize: 12, color: theme.mutedForeground, fontWeight: '600' }}>
                      SERVICE
                    </ThemedText>
                  </View>
                  <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>{service.name}</ThemedText>
                  {service.description && (
                    <ThemedText style={{ fontSize: 13, color: theme.mutedForeground, lineHeight: 18 }}>
                      {service.description}
                    </ThemedText>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Ionicons name="time-outline" size={16} color={theme.mutedForeground} />
                    <ThemedText style={{ fontSize: 13, color: theme.mutedForeground }}>
                      {duration} minutes
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleEdit('service')}>
                  <Ionicons name="pencil-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>

          {/* Staff Card */}
          <Card>
            <CardContent>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="person-outline" size={20} color={theme.primary} />
                    <ThemedText style={{ fontSize: 12, color: theme.mutedForeground, fontWeight: '600' }}>
                      STAFF MEMBER
                    </ThemedText>
                  </View>
                  <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                    {staff.firstName} {staff.lastName}
                  </ThemedText>
                </View>
                <TouchableOpacity onPress={() => handleEdit('staff')}>
                  <Ionicons name="pencil-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>

          {/* Date & Time Card */}
          <Card>
            <CardContent>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                    <ThemedText style={{ fontSize: 12, color: theme.mutedForeground, fontWeight: '600' }}>
                      DATE & TIME
                    </ThemedText>
                  </View>
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="calendar" size={16} color={theme.mutedForeground} />
                      <ThemedText style={{ fontSize: 15, fontWeight: '500' }}>
                        {DateTime.fromISO(start).toLocaleString(DateTime.DATE_HUGE)}
                      </ThemedText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="time" size={16} color={theme.mutedForeground} />
                      <ThemedText style={{ fontSize: 15, fontWeight: '500' }}>
                        {DateTime.fromISO(start).toFormat('h:mm a')} - {DateTime.fromISO(end).toFormat('h:mm a')}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleEdit('time')}>
                  <Ionicons name="pencil-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>

          {/* Location Card (if service has address) */}
          {service.address && (
            <Card>
              <CardContent>
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="location-outline" size={20} color={theme.primary} />
                    <ThemedText style={{ fontSize: 12, color: theme.mutedForeground, fontWeight: '600' }}>
                      LOCATION
                    </ThemedText>
                  </View>
                  <ThemedText style={{ fontSize: 15, lineHeight: 20 }}>{service.address}</ThemedText>
                </View>
              </CardContent>
            </Card>
          )}

          {/* Comments Card */}
          <Card>
            <CardContent>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
                    <ThemedText style={{ fontSize: 12, color: theme.mutedForeground, fontWeight: '600' }}>
                      COMMENTS
                    </ThemedText>
                  </View>
                  <ThemedText style={{ fontSize: 15, lineHeight: 20, color: comments ? theme.foreground : theme.mutedForeground }}>
                    {comments || 'No additional comments provided'}
                  </ThemedText>
                </View>
                <TouchableOpacity onPress={() => handleEdit('details')}>
                  <Ionicons name="pencil-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <View
            style={{
              backgroundColor: theme.primary + '15',
              padding: 16,
              borderRadius: theme.radius,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <Ionicons name="information-circle" size={24} color={theme.primary} />
            <View style={{ flex: 1, gap: 6 }}>
              <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>Cancellation Policy</ThemedText>
              <ThemedText style={{ fontSize: 13, lineHeight: 18, color: theme.mutedForeground }}>
                Please cancel at least 24 hours in advance. Late cancellations may incur a fee.
              </ThemedText>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <Button variant="outline" onPress={handleBack} disabled={isPending} style={{ flex: 1 }}>
              <ButtonIcon name="arrow-back-outline" />
              <ButtonText>Back</ButtonText>
            </Button>
            <Button disabled={isPending} onPress={handleConfirm} style={{ flex: 2 }}>
              <ButtonIcon name="checkmark-done-outline" />
              <ButtonText>{isPending ? 'Confirming...' : 'Confirm Appointment'}</ButtonText>
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      {bookedAppointment && (
        <BookingSuccessModal
          visible={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            router.replace('/(tabs)/my-bookings/bookings');
          }}
          onViewAppointments={() => {
            setShowSuccessModal(false);
            router.replace('/(tabs)/my-bookings/bookings');
          }}
          appointment={bookedAppointment}
        />
      )}
    </>
  );
};

export default ResumeScreen;
