import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { forgotPasswordSchema } from '@/core/auth/schemas/forgotPasswordSchema';
import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

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
    const response = await resetPassword(username);
    if (response.email) {
      router.push('/auth/forgotPassword/verifyCodeResetPassword');
      return;
    }
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: response.message,
    });
  };

  return (
    <View className="flex gap-5">
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

      <Button
        disabled={isLoading}
        loading={isLoading}
        onPress={handleSubmit(handleResetPassword)}
      >
        Reset Password
      </Button>
    </View>
  );
};

export default ForgotPassword;
