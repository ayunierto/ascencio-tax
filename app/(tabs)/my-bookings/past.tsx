import { View, Text, Linking } from 'react-native';
import React from 'react';
import { theme } from '@/presentation/theme/components/ui/Theme';
import Loader from '@/presentation/theme/components/Loader';
import { getUserAppointments } from '@/core/appointments/actions/getUserAppointments';
import { useQuery } from '@tanstack/react-query';
import SimpleCard from '@/presentation/theme/components/ui/SimpleCard/SimpleCard';
import { AppointmentResponse } from '../../../core/appointments/interfaces/appointmentResponse';
import { ScrollView } from 'react-native-gesture-handler';
import { DateTime } from 'luxon';

const PastBookings = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['PastAppts'],
    queryFn: async () => {
      const data = await getUserAppointments('past');
      return data;
    },
    staleTime: 1000 * 60, // 1 min
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <ScrollView>
      <View
        style={{
          padding: 20,
          gap: 20,
        }}
      >
        {data && data.length > 0 ? (
          data.map((appt: AppointmentResponse) => (
            <SimpleCard
              key={appt.id}
              title={appt.service.name}
              icon="calendar-outline"
              subtitle={DateTime.fromISO(appt.startDateAndTime).toLocaleString({
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
              // text={`Staff: ${appt.staff.name} ${appt.staff.lastName}`}
            >
              <Text
                style={{ color: theme.foreground }}
              >{`Staff: ${appt.staff.name} ${appt.staff.lastName}`}</Text>
              <Text style={{ color: theme.foreground }}>
                Meeting:{' '}
                <Text
                  style={{
                    color: theme.primary,
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => Linking.openURL(appt.zoomMeetingLink)}
                >
                  {appt.zoomMeetingLink}
                </Text>
              </Text>
            </SimpleCard>
          ))
        ) : (
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: theme.foreground,
              }}
            >
              No appointments found
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PastBookings;
