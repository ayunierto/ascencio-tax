import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import Toast from "react-native-toast-message";

import { AppointmentCard } from "@/components/bookings/AppointmentCard";
import { AppointmentListSkeleton } from "@/components/bookings/AppointmentCardSkeleton";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/Button";
import { theme } from "@/components/ui/theme";
import { cancelAppointment } from "@/core/appointments/actions/cancel-appointment.action";
import { getUserAppointments } from "@/core/appointments/actions/get-user-appointments.action";
import { Appointment } from "@/core/appointments/interfaces/appointmentResponse";
import { EmptyContent } from "@/core/components";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const MyBookings = () => {
  const queryClient = useQueryClient();

  const {
    data: pendingAppointments,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Appointment[], AxiosError<ServerException>>({
    queryKey: ["pendingAppts"],
    queryFn: async () => {
      const data = await getUserAppointments("pending");
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 min
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingAppts"] });
      queryClient.invalidateQueries({ queryKey: ["PastAppts"] });
      Toast.show({
        type: "success",
        text1: "Appointment Cancelled",
        text2: "Your appointment has been cancelled successfully.",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to cancel appointment",
      });
    },
  });

  const handleCancelAppointment = async (
    appointmentId: string,
    reason?: string
  ) => {
    await cancelMutation.mutateAsync({ id: appointmentId, reason });
  };

  const handleBookNew = () => {
    router.push("/(tabs)/(home)");
  };

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={
          error.response?.data.message || error.message || "An error occurred"
        }
        icon="alert-circle-outline"
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return <AppointmentListSkeleton />;
  }

  if (!pendingAppointments || pendingAppointments.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          padding: 10,
          justifyContent: "center",
        }}
      >
        <EmptyContent
          title="No Scheduled Appointments"
          subtitle="You don't have any upcoming appointments. Book your next service now!"
          icon="calendar-outline"
        />
        <Button onPress={handleBookNew} style={{ marginTop: 20 }}>
          <ButtonIcon name="add-circle-outline" />
          <ButtonText>Book New Appointment</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={pendingAppointments}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onCancel={handleCancelAppointment}
          />
        )}
        contentContainerStyle={{
          padding: 10,
        }}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      />
    </View>
  );
};

export default MyBookings;
