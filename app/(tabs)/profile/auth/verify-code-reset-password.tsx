import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { z } from 'zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Alert from '@/presentation/theme/components/ui/Alert';
import Header from '../../../../presentation/theme/components/auth/Header';
import { verifyUserSchema } from '@/core/auth/schemas/verifyUserSchema';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const VerifyCodeResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
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
      setIsLoading(false);

      if (response.token) {
        router.push('/(tabs)/profile/auth/new-password');
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
    setIsLoadingResend(true);
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
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingResend(false);
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          gap: 20,
          marginTop: 20,
          padding: 20,
          maxWidth: 320,
          marginHorizontal: 'auto',
        }}
      >
        <Header
          title={'Enter security code'}
          subtitle={
            'Please check your email for a message with your code. Your code is 6 numbers long.'
          }
        />

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
          disabled={isLoadingResend}
          loading={isLoadingResend}
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
    </ScrollView>
  );
};

export default VerifyCodeResetPassword;
