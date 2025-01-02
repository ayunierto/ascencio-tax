import React from 'react';
import { View, Text, Image, SafeAreaView } from 'react-native';
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
import Chip from '@/presentation/theme/components/ui/Chip';

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
    router.push('/(ascenciotax-app)/booking');
    return;
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-5">
          <Image
            source={require('../../../assets/images/logo.webp')}
            style={{
              width: '100%',
              resizeMode: 'contain',
            }}
          />
          {isError && <Text>{error.message}</Text>}

          <View className="flex-row flex flex-wrap gap-4 justify-evenly">
            {data &&
              data.map((service: ServiceResponse) => (
                <View
                  className="w-full sm:w-5/12 mb-5 bg-white rounded-3xl overflow-hidden "
                  key={service.id}
                >
                  <Image
                    className="w-full h-48"
                    source={{ uri: service.images[0].url }}
                  />
                  <View className="p-4 gap-2">
                    <Text className="text-xl">{service.name}</Text>
                    <Text>{minutesToHoursAndMinutes(service.duration)}</Text>
                    {service.isAvailableOnline && (
                      <Chip text="Available Online" icon="videocam-outline" />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
