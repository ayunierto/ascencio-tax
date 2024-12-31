import React from 'react';
import { View, Text, Image } from 'react-native';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import Toast from 'react-native-toast-message';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/core/services/actions';
import Loader from '@/presentation/theme/components/Loader';
import { ServiceResponse } from '@/core/services/interfaces/services.response';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/presentation/theme/components/ui/Button';
import { useBookingStore } from '@/presentation/services/store/useBookingStore';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

const HomeScreen = () => {
  const { logout } = useAuthStore();
  const { selectService } = useBookingStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  const handleLogout = () => {
    logout();
    Toast.show({
      type: 'success',
      text1: 'Logout',
      text2: 'Goodbye',
    });
  };

  if (isPending) {
    return <Loader />;
  }

  const minutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour(s) and ${remainingMinutes} minute(s)`;
  };

  const handleSelectService = (service: ServiceResponse) => {
    selectService(service);
    // router.push('/(ascenciotax-app)/booking');
    return;
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Image
          source={require('../../../assets/images/logo.webp')}
          style={{
            width: '100%',
            resizeMode: 'contain',
          }}
        />
        {isError && <Text>{error.message}</Text>}

        {data &&
          data.map((service: ServiceResponse) => (
            <View
              key={service.id}
              style={{
                borderRadius: theme.radius,
                overflow: 'hidden',
                backgroundColor: theme.card,
                marginBottom: 20,
              }}
            >
              <Image
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'cover',
                }}
                source={{ uri: service.images[0].url }}
              />
              <View style={{ padding: 10 }}>
                <Text
                  style={{
                    color: theme.cardForeground,
                    fontSize: 18,
                  }}
                >
                  {service.name}
                </Text>
                <Text
                  style={{
                    color: theme.cardForeground,
                    paddingVertical: 10,
                  }}
                >
                  {minutesToHoursAndMinutes(service.duration)}
                </Text>
                {service.isAvailableOnline && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      backgroundColor: theme.accent,
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: theme.radius,
                      marginBottom: 10,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Ionicons name="videocam-outline" size={22} />
                    <Text>Available Online</Text>
                  </View>
                )}
                <View style={{ alignSelf: 'flex-end' }}>
                  <Button
                    style={{
                      backgroundColor: theme.background,
                      alignSelf: 'flex-start',
                      paddingVertical: 6,
                      paddingHorizontal: 20,
                      borderRadius: theme.radius,
                    }}
                    textStyle={{ color: 'white' }}
                    onPress={() => handleSelectService(service)}
                  >
                    BookNow
                  </Button>
                </View>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
