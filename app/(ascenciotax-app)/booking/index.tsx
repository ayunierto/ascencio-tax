import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import Button from '@/presentation/theme/components/ui/Button';
import Chip from '@/presentation/theme/components/ui/Chip';
import { useBookingStore } from '@/presentation/services/store/useBookingStore';
import Select from '@/presentation/theme/components/ui/Select';
import { Calendar } from 'react-native-calendars';
import { router } from 'expo-router';
import { config } from '@/core/config';
import { Ionicons } from '@expo/vector-icons';
import Alert from '@/presentation/theme/components/ui/Alert';

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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes empieza desde 0 (enero es 0)
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedStaff, setSelectedStaff] = useState<Option | null>(null);
  const [availableSlots, setAvailableSlots] = useState<
    { start: string; end: string }[]
  >([]);

  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
  }>();
  const [slotsToDisplay, setSlotsToDisplay] = useState<
    {
      start: string;
      end: string;
    }[]
  >();
  const { selectedService } = useBookingStore();

  const staff: Option[] = selectedService!.staff.map(
    ({ name, lastName, id }) => ({
      label: `${name} ${lastName}`,
      value: id,
    })
  );

  const API_URL = 'https://ascenciotaxinc-a2594d75dc54.herokuapp.com/api';

  // Fetch availability
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedStaff) {
        return;
      }
      try {
        const response = await fetch(
          `${API_URL}/availability?staffMemberId=${selectedStaff.value}&date=${selectedDate}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableSlots(data);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setAvailableSlots([]); // Manejar el error mostrando que no hay disponibilidad
      }
    };

    fetchAvailability();
  }, [API_URL, selectedDate, selectedStaff]);

  // Generate all day slots
  useEffect(() => {
    const generateAllDaySlots = () => {
      const allDaySlots = [];

      for (const slot of availableSlots) {
        const startTime = new Date(slot.start);
        const endTime = new Date(slot.end);
        let currentTime = new Date(startTime);

        while (currentTime < endTime) {
          allDaySlots.push({
            start: currentTime.toISOString(),
            end: new Date(currentTime.getTime() + 60 * 60 * 1000).toISOString(), // Intervalo de 1 hora
          });
          currentTime.setTime(currentTime.getTime() + 60 * 60 * 1000);
        }
      }
      return allDaySlots;
    };

    setSlotsToDisplay(generateAllDaySlots());
  }, [availableSlots]);

  const { saveDetails } = useBookingStore();
  function handleBookNow() {
    if (selectedSlot) {
      saveDetails(
        selectedStaff!.value,
        selectedStaff!.label,
        selectedSlot.start,
        selectedSlot.end
      );
      router.push('/(ascenciotax-app)/booking/resume');
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex flex-col gap-5 p-5">
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
                    console.log(day);
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
              <Text className="text-white text-2xl text-center mb-4 ">
                Available times
              </Text>
              <View className="flex flex-row flex-wrap justify-between p-2">
                {!selectedStaff ? (
                  <Alert type="info">
                    Select a staff member to show the available schedules.
                  </Alert>
                ) : availableSlots.length === 0 ? (
                  <Alert type="info">
                    There are no appointments available for this day.
                  </Alert>
                ) : (
                  slotsToDisplay &&
                  slotsToDisplay.map((slot) => {
                    const startTime = new Date(slot.start).toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    );
                    return (
                      <Chip
                        text={startTime}
                        key={slot.start}
                        icon="alarm-outline"
                        onPress={() => setSelectedSlot(slot)}
                        className="w-2/5 m-2"
                      />
                    );
                  })
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
