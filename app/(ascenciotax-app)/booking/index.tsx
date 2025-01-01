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
        <View
          style={{
            padding: 20,
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <ThemedText style={{ fontSize: 30, paddingTop: 10 }}>
            Select your preferences
          </ThemedText>
          <ThemedText>
            Check out our availability and book the date and time that works for
            you.
          </ThemedText>

          <Select
            options={staff}
            onSelect={(item) => setSelectedStaff(item)}
            placeholder="Select Staff Member..."
          />

          <View style={{ borderRadius: 20, overflow: 'hidden' }}>
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

          <View
            style={{
              flexDirection: 'row', // Alinea los elementos horizontalmente
              flexWrap: 'wrap', // Permite que los elementos pasen a la siguiente línea
              justifyContent: 'space-between', // Distribuye el espacio entre los elementos (opcional)
              padding: 10, // Espacio alrededor del contenedor (opcional)
            }}
          >
            {!selectedStaff ? (
              <Text
                style={{
                  width: '100%',
                  color: 'white',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  backgroundColor: 'orange',
                  opacity: 0.8,
                  gap: 10,
                }}
              >
                Select a staff member to show the available schedules
              </Text>
            ) : availableSlots.length === 0 ? (
              <Text
                style={{
                  width: '100%',
                  color: 'white',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  backgroundColor: 'orange',
                  opacity: 0.8,
                  gap: 10,
                }}
              >
                There are no appointments available for this day
              </Text>
            ) : (
              slotsToDisplay &&
              slotsToDisplay.map((slot) => {
                const startTime = new Date(slot.start).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                // const endTime = new Date(slot.end).toLocaleTimeString([], {
                //   hour: '2-digit',
                //   minute: '2-digit',
                // });
                return (
                  <Chip
                    text={startTime}
                    key={slot.start}
                    icon="alarm-outline"
                    onPress={() => setSelectedSlot(slot)}
                    style={{
                      width: '45%',
                      backgroundColor: 'white',
                      marginVertical: 5,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;
