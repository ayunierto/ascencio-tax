import React from "react";

import { Redirect, router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BookingProgressStepper } from "@/components/booking/BookingProgressStepper";
import { theme } from "@/components/ui/theme";
import Header from "@/core/auth/components/Header";
import AvailabilityForm from "@/core/booking/components/AvailabilityForm";
import { EmptyContent } from "@/core/components";
import { useServices } from "@/core/services/hooks/useServices";
import { useBookingStore } from "@/core/services/store/useBookingStore";
import Toast from "react-native-toast-message";

const BookingScreen = () => {
  const insets = useSafeAreaInsets();
  const { data: serviceData } = useServices();

  const { service } = useBookingStore();
  if (!service) {
    return <Redirect href={"/(tabs)/(home)"} />;
  }

  if (!serviceData) {
    return (
      <EmptyContent title="Services not found" subtitle="An unexpected error has occurred. Please try again later." />
    );
  }

  if (!service.staff || service.staff.length === 0) {
    return (
      <EmptyContent
        title="Staff not found"
        subtitle="An unexpected error has occurred. The service has no assigned staff. Please contact the administrator."
        icon="alert-circle-outline"
      />
    );
  }

  const handleBooking = (): void => {
    Toast.show({
      type: "success",
      text1: "Selection saved",
      text2: "Please add any additional details",
    });
    router.push("/booking/details");
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.background }}>
      <ScrollView>
        <View
          style={{
            padding: 10,
            gap: 20,
          }}
        >
          {/* Progress Stepper */}
          <BookingProgressStepper currentStep={1} />

          <Header
            title="Select your preferences"
            subtitle="Check out our availability and book the date and time that works for
            you."
          />

          <AvailabilityForm
            services={serviceData?.services}
            selectedService={service}
            serviceStaff={service.staff}
            onSubmit={handleBooking}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingScreen;
