import { View, Text, SafeAreaView, ScrollView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '@/presentation/theme/components/ui/Button';
import Chip from '@/presentation/theme/components/ui/Chip';
import { useBookingStore } from '@/presentation/services/store/useBookingStore';
import Select from '@/presentation/theme/components/ui/Select';
import { Calendar } from 'react-native-calendars';
import { router } from 'expo-router';
import Alert from '@/presentation/theme/components/ui/Alert';
import Loader from '@/presentation/theme/components/Loader';

interface Option {
  label: string;
  value: string;
}

interface Day {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
}

const BookingScreen = () => {
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // month begins from 0 (January is 0)
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedStaff, setSelectedStaff] = useState<Option | null>(null);
  const [availableSlots, setAvailableSlots] = useState<
    {
      start: string;
      end: string;
    }[]
  >([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
  }>();

  const { selectedService } = useBookingStore();

  const staff: Option[] = selectedService!.staff.map(
    ({ name, lastName, id }) => ({
      label: `${name} ${lastName}`,
      value: id,
    })
  );

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  useEffect(() => {
    if (selectedStaff) {
      const fetchAvailability = async () => {
        setAvailableSlots([]);

        setLoading(true);
        try {
          const response = await fetch(
            `${API_URL}/availability?staff=${selectedStaff.value}&date=${selectedDate}`
          );
          const data = await response.json();
          setAvailableSlots(data);

          if (data.length === 0) {
            setSelectedSlot(undefined);
          }
        } catch (error) {
          console.error('Error fetching availability:', error);
          setAvailableSlots([]);
          setSelectedSlot(undefined);
        } finally {
          setLoading(false);
        }
      };
      fetchAvailability();
    } else {
      setAvailableSlots([]);
      setSelectedSlot(undefined);
    }
  }, [selectedDate, selectedStaff]);

  const { saveDetails } = useBookingStore();
  function handleBookNow() {
    if (selectedSlot && selectedStaff) {
      saveDetails(
        selectedStaff.value,
        selectedStaff.label,
        selectedSlot.start,
        selectedSlot.end
      );
      router.push('/booking/resume');
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          // className="flex flex-col gap-5 p-5"
          style={{
            padding: 20,
            gap: 20,
            // marginTop: Platform.OS === 'android' ? 20 : 0,
          }}
        >
          <Text className="color-white text-3xl">Select your preferences</Text>
          <Text className="color-white">
            Check out our availability and book the date and time that works for
            you.
          </Text>

          <View className="sm:flex sm:flex-row">
            <View className="flex gap-5 flex-col sm:w-1/2">
              <Select
                options={staff}
                onSelect={(item) => setSelectedStaff(item)}
                placeholder="Select Staff Member..."
              />

              <View className="rounded-xl overflow-hidden">
                <Calendar
                  minDate={getCurrentDate()}
                  theme={{
                    selectedDayBackgroundColor: '#2596be',
                  }}
                  onDayPress={(day: Day) => {
                    setSelectedDate(day.dateString);
                  }}
                  markedDates={{
                    [selectedDate]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedDotColor: 'orange',
                    },
                  }}
                />
              </View>
            </View>

            <View className="sm:w-1/2 p-5">
              <View className="flex flex-row flex-wrap justify-between p-2">
                {loading ? (
                  <Loader />
                ) : !selectedStaff ? (
                  <Alert>
                    Select a staff member to see the schedules available.
                  </Alert>
                ) : availableSlots.length === 0 ? (
                  <Alert>
                    There are no appointments available for this day.
                  </Alert>
                ) : (
                  availableSlots.map((slot) => (
                    <Chip
                      text={new Date(slot.start).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      key={slot.start}
                      icon={'alarm-outline'}
                      onPress={() => setSelectedSlot(slot)}
                      style={
                        selectedSlot?.start === slot.start && {
                          backgroundColor: '#3b82f6',
                        }
                      }
                      color={
                        selectedSlot?.start === slot.start ? 'white' : 'black'
                      }
                      className={`w-2/5 m-2`}
                    />
                  ))
                )}
              </View>
              <View>
                {selectedSlot && (
                  <Button onPress={() => handleBookNow()}>
                    Schedule an appointment at{' '}
                    {new Date(selectedSlot.start).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Button>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;
