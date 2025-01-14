import React from 'react';
import { View, Text, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/core/services/actions';
import Loader from '@/presentation/theme/components/Loader';
import { ServiceResponse } from '@/core/services/interfaces/services.response';
import { theme } from '@/presentation/theme/components/ui/Theme';
import Button from '@/presentation/theme/components/ui/Button';
import { useBookingStore } from '@/presentation/services/store/useBookingStore';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import Toast from 'react-native-toast-message';

const Services = () => {
  const { selectService } = useBookingStore();
  const { token } = useAuthStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  if (isPending) {
    return <Loader />;
  }

  const handleSelectService = (service: ServiceResponse) => {
    selectService(service);
    if (!token) {
      router.push('/(tabs)/profile/profile');
      Toast.show({
        type: 'info',
        text1: 'Info',
        text2: 'You must be authenticated to book a service',
      });
      return;
    }
    router.push('/(tabs)/booking/booking');
    return;
  };

  return (
    <ScrollView>
      <View style={{ padding: 20, flex: 1 }}>
        {isError && <Text>{error.message}</Text>}
        <View style={{ flexDirection: 'column', gap: 20 }}>
          {data &&
            data.map((service: ServiceResponse) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
                key={service.id}
              >
                <Image
                  style={{ width: 60, height: 60, borderRadius: theme.radius }}
                  source={{ uri: service.images[0].url }}
                />
                <View
                  style={{
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    numberOfLines={2}
                    lineBreakMode="tail"
                    style={{
                      fontSize: 16,
                      color: theme.foreground,
                      width: 200,
                    }}
                  >
                    {service.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: theme.muted }}>1 hour</Text>
                    <Ionicons
                      size={18}
                      color={theme.primary}
                      name={
                        service.isAvailableOnline
                          ? 'videocam-outline'
                          : 'videocam-off-outline'
                      }
                    />
                  </View>
                </View>
                <View style={{}}>
                  <Button
                    onPress={() => handleSelectService(service)}
                    size="small"
                  >
                    Book
                  </Button>
                </View>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Services;
