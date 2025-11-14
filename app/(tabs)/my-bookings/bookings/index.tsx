import { DateTime } from 'luxon';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

import Loader from '@/components/Loader';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { CardContent } from '@/components/ui/Card/CardContent';
import { SimpleCardHeaderSubTitle } from '@/components/ui/Card/SimpleCardHeaderSubTitle';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { getUserAppointments } from '@/core/appointments/actions/get-user-appointments.action';
import { Appointment } from '@/core/appointments/interfaces/appointmentResponse';
import { EmptyContent } from '@/core/components';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

const MyBookings = () => {
  const {
    data: pendingAppointments,
    isLoading,
    isError,
    error,
  } = useQuery<Appointment[], AxiosError<ServerException>>({
    queryKey: ['pendingAppts'],
    queryFn: async () => {
      const data = await getUserAppointments('pending');
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 mins
  });

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={
          error.response?.data.message || error.message || 'An error occurred'
        }
      />
    );
  }
  if (isLoading) {
    return <Loader />;
  }

  if (!pendingAppointments || pendingAppointments.length === 0) {
    return (
      <EmptyContent
        title="No appointments found."
        subtitle="Add a new appointment to get started"
      />
    );
  }

  // TODO: Add button to cancel appointment

  return (
    <ScrollView>
      <View
        style={{
          padding: 20,
          gap: 10,
        }}
      >
        {pendingAppointments.map((appt: Appointment) => (
          <TouchableOpacity key={appt.id}>
            <Card>
              <CardContent>
                <SimpleCardHeader>
                  <Ionicons
                    name="calendar-outline"
                    color={theme.foreground}
                    size={24}
                  />
                  <View>
                    <SimpleCardHeaderTitle>
                      {appt.service.name}
                    </SimpleCardHeaderTitle>
                    <SimpleCardHeaderSubTitle>
                      {DateTime.fromISO(appt.start).toLocaleString({
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </SimpleCardHeaderSubTitle>
                  </View>
                </SimpleCardHeader>
                <View>
                  <ThemedText>{`Staff: ${appt.staff.firstName} ${appt.staff.lastName}`}</ThemedText>
                  <ThemedText>
                    Meeting link:{' '}
                    <Text
                      style={{
                        color: theme.primary,
                        textDecorationLine: 'underline',
                      }}
                      onPress={() => Linking.openURL(appt.zoomMeetingLink)}
                    >
                      {appt.zoomMeetingLink}
                    </Text>
                  </ThemedText>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default MyBookings;
