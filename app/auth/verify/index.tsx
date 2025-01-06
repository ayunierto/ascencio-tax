import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { z } from 'zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Alert from '@/presentation/theme/components/ui/Alert';
import Header from '../components/Header';
import { verifyUserSchema } from '@/core/auth/schemas/verifyUserSchema';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const verifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, verifyCode } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof verifyUserSchema>>({
    resolver: zodResolver(verifyUserSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const handleVerify = async ({
    verificationCode,
  }: z.infer<typeof verifyUserSchema>) => {
    if (user) {
      setIsLoading(true);
      const response = await verifyCode(user!.email, verificationCode);
      console.warn(response);
      setIsLoading(false);

      if (response.token) {
        router.replace('/(ascenciotax-app)/(home)');
      }

      if (response.statusCode === 401) {
        setError('verificationCode', {
          type: 'manual',
          message:
            response.message +
            '. Please check your message or talk to an administrator',
        });
        return;
      }
    }
    return;
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user?.email,
          verificationPlatform: 'email',
        }),
      }).then((data) => data.json());
      Toast.show({
        type: 'success',
        text1: 'Code sent',
        text2: 'Please check your email',
      });
      console.warn({ response });
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex justify-center gap-5">
      <Header title={'Verify'} subtitle={'Please verify your account'} />

      <Alert type="info">
        We have sent a verification code to your email. Please enter the code
        sent to verify your account.
      </Alert>
      <Controller
        control={control}
        name="verificationCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Verification code"
            keyboardType="numeric"
          />
        )}
      />
      {errors.verificationCode && (
        <Text className="-mt-4 text-yellow-500 mb-5">
          {errors.verificationCode?.message as string}
        </Text>
      )}
      <Button
        // disabled={isLoading}
        // loading={isLoading}
        onPress={handleResendCode}
      >
        Resend code
      </Button>
      <Button
        disabled={isLoading}
        loading={isLoading}
        onPress={handleSubmit(handleVerify)}
      >
        Verify
      </Button>
    </View>
  );
};

export default verifyCode;
