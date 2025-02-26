import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import Header from '../../../../core/auth/components/Header';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// export const forgotPasswordSchema = z.object({
//   username: z.string(),
//   // .nonempty('You must write your email or password.'),
// });
export const forgotPasswordSchema = z.object({
  username: z.string(),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      username: '',
    },
  });

  const handleResetPassword = async ({
    username,
  }: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    const response = await resetPassword(username);
    setIsLoading(false);
    if (response.email) {
      router.push('/(tabs)/profile/auth/verify-code-reset-password');
      return;
    }
    Toast.show({
      type: 'error',
      text1: 'Error',
    });
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          gap: 20,
          padding: 20,
          width: '100%',
          maxWidth: 320,
          marginHorizontal: 'auto',
        }}
      >
        <Header
          title="Find your account"
          subtitle="Please enter your email or mobile number to search for your account."
        />

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Email or phone number"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />

        {errors.username && (
          <Text className="-mt-4 text-yellow-400">
            {errors.username?.message}
          </Text>
        )}

        <Button
          disabled={isLoading}
          loading={isLoading}
          onPress={handleSubmit(handleResetPassword)}
        >
          Reset Password
        </Button>
        <Button
          variant="outlined"
          onPress={() => router.replace('/(tabs)/profile/auth/sign-in')}
        >
          Back
        </Button>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
