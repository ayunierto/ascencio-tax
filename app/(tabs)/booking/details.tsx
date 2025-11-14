import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { BookingProgressStepper } from '@/components/booking/BookingProgressStepper';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { EmptyContent } from '@/core/components';
import { useBookingStore } from '@/core/services/store/useBookingStore';
import Toast from 'react-native-toast-message';

const detailsSchema = z.object({
  comments: z.string().max(500, 'Comments must be less than 500 characters').optional(),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

const BookingDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const { service, staff, start, end, updateState, comments } = useBookingStore();

  const { control, handleSubmit, watch } = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      comments: comments || '',
    },
  });

  const commentValue = watch('comments');

  if (!service || !staff || !start || !end) {
    return (
      <EmptyContent
        title="Missing booking information"
        subtitle="Please go back and complete the previous steps"
        icon="alert-circle-outline"
      />
    );
  }

  const onSubmit = (data: DetailsFormData) => {
    updateState({ comments: data.comments });
    Toast.show({
      type: 'success',
      text1: 'Details saved',
      text2: 'Please review your appointment',
    });
    router.push('/booking/resume');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}
    >
      <ScrollView>
        <View style={{ padding: 10, gap: 20 }}>
          {/* Progress Stepper */}
          <BookingProgressStepper currentStep={2} />

          {/* Header */}
          <View style={{ marginBottom: 10 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              Add Details
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: theme.mutedForeground, lineHeight: 20 }}>
              Add any additional information or special requests for your appointment
            </ThemedText>
          </View>

          {/* Comments Field */}
          <View>
            <ThemedText style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
              Comments or Special Requests (Optional)
            </ThemedText>
            <Controller
              control={control}
              name="comments"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: theme.radius,
                      padding: 12,
                      fontSize: 15,
                      color: theme.foreground,
                      backgroundColor: theme.card,
                      minHeight: 120,
                      textAlignVertical: 'top',
                    }}
                    placeholder="E.g., Documents I need to bring, topics to discuss, accessibility needs..."
                    placeholderTextColor={theme.mutedForeground}
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={5}
                    maxLength={500}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <ThemedText style={{ fontSize: 12, color: theme.mutedForeground }}>
                      This information will be shared with your service provider
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: theme.mutedForeground }}>
                      {commentValue?.length || 0}/500
                    </ThemedText>
                  </View>
                </>
              )}
            />
          </View>

          {/* Suggested Topics */}
          <View>
            <ThemedText style={{ fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
              Quick Suggestions
            </ThemedText>
            <View style={{ gap: 8 }}>
              {[
                'Need to discuss tax documents',
                'First time consultation',
                'Follow-up from previous meeting',
                'Urgent matter',
              ].map((suggestion) => (
                <Controller
                  key={suggestion}
                  control={control}
                  name="comments"
                  render={({ field: { onChange, value } }) => (
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => onChange(value ? `${value}\n${suggestion}` : suggestion)}
                    >
                      <ButtonText>{suggestion}</ButtonText>
                    </Button>
                  )}
                />
              ))}
            </View>
          </View>

          {/* Service Info Reminder */}
          <View
            style={{
              backgroundColor: theme.primary + '15',
              padding: 16,
              borderRadius: theme.radius,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <ButtonIcon name="information-circle-outline" />
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 13, lineHeight: 18 }}>
                <ThemedText style={{ fontWeight: '600' }}>Service: </ThemedText>
                {service.name}
              </ThemedText>
              <ThemedText style={{ fontSize: 13, lineHeight: 18, marginTop: 4 }}>
                <ThemedText style={{ fontWeight: '600' }}>Staff: </ThemedText>
                {staff.firstName} {staff.lastName}
              </ThemedText>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button variant="outline" onPress={handleBack} style={{ flex: 1 }}>
              <ButtonIcon name="arrow-back-outline" />
              <ButtonText>Back</ButtonText>
            </Button>
            <Button onPress={handleSubmit(onSubmit)} style={{ flex: 1 }}>
              <ButtonText>Continue</ButtonText>
              <ButtonIcon name="arrow-forward-outline" />
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookingDetailsScreen;
